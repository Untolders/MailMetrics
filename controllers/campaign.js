const Email = require("../models/email.js");
const Subscriber = require("../models/subscriber.js");
const Campaign = require("../models/campaign.js");
const count = require("../utils/helper.js");
const SenderEmail = require("../models/senderEmail.js");
const { createUserTransporter } = require('../utils/mail.js');
const { decryptToken } = require("../utils/hash.js");

// ================== Campaign List ==================
module.exports.index = async (req, res, next) => {
    try {
        const user = req.user;
        const allCampaigns = await Campaign.find({ owner: user._id }).populate('emailId');
        res.render("campaigns/campaign.ejs", { allCampaigns });
    } catch (err) {
        console.error("Error fetching campaigns:", err);
        next(err);
    }
};

// ================== Render Send Email ==================
module.exports.renderSendEmail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const allSubscribers = await Subscriber.find({ owner: req.user._id });
        const email = await Email.findById(id);
        const allSenderEmail = await SenderEmail.find({ owner: req.user._id });

        if (!email) {
            req.flash("error", "Email not Exist!");
            return res.redirect("/MailMetrics");
        }

        res.render("campaigns/sendEmail.ejs", { email, allSubscribers, allSenderEmail });
    } catch (err) {
        console.error("Error rendering send email page:", err);
        next(err);
    }
};

// ================== Send Email ==================
module.exports.sendEmail = async (req, res, next) => {
    try {
        const { id } = req.params;

        let campaign = await Campaign.findOne({ emailId: id });
        if (!campaign) {
            campaign = new Campaign({
                emailId: id,
                data: { views: [], clicks: [] },
                owner: req.user._id,
            });
        }

        campaign.sendAt = campaign.sendAt || [];
        campaign.sendAt.push(new Date());

        const draftEmail = await Email.findById(id);
        if (!draftEmail) {
            req.flash("error", "Email not found!");
            return res.redirect("/MailMetrics");
        }

        let receiversID = req.body.receiver;
        if (!Array.isArray(receiversID)) receiversID = [receiversID];

        const receivers = [];
        for (let receiverID of receiversID) {
            const receiver = await Subscriber.findById(receiverID);
            if (receiver) receivers.push(receiver);
        }

        if (!receivers.length) {
            req.flash("error", "Subscriber not found!");
            return res.redirect("/MailMetrics");
        }

        const senderEmail = await SenderEmail.findById(req.body.senderEmail);
        if (!senderEmail) {
            req.flash("error", "Sender email not found!");
            return res.redirect("/MailMetrics");
        }

        const email = senderEmail.email;
        const password = decryptToken({ iv: senderEmail.salt, encryptedData: senderEmail.appPassword });
        const userTransporter = createUserTransporter(email, password);

        const myServerDomain = `${process.env.DOMAIN}/MailMetrics/campaigns`;

        // Function to transform links & add tracker
        const transformLinks = (emailBody, receiverId, myServerDomain, emailID, encode = true) => {
            const linkRegex = /<a\s+href="([^"]+)"\s*(.*?)>(.*?)<\/a>/g;
            let transformedBody = emailBody.replace(linkRegex, (match, p1, p2, p3) => {
                const originalLink = encode ? encodeURIComponent(p1) : p1;
                const newLink = `${myServerDomain}/${emailID}/${receiverId}?token=${originalLink}`;
                return `<a href="${newLink}" ${p2}>${p3}</a>`;
            });
            transformedBody += `<img alt="logo" src='${process.env.DOMAIN}/MailMetrics/campaigns/open/${campaign._id}/${receiverId}/tracker.png' style="display:none"/>`;
            return transformedBody;
        };

        // Helper to send email using async/await
        const sendMailAsync = (transporter, mailOptions) => {
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) reject(err);
                    else resolve(info);
                });
            });
        };

        for (let receiver of receivers) {
            const unencodedEmailBody = transformLinks(draftEmail.body, receiver._id, myServerDomain, id, false);
            const mailOptions = {
                from: `"${draftEmail.sender}" <${email}>`,
                to: receiver.email,
                subject: draftEmail.subject,
                html: unencodedEmailBody
            };
            try {
                await sendMailAsync(userTransporter, mailOptions);
                console.log(`Email sent to ${receiver.email}`);
            } catch (err) {
                console.error("Error sending email:", err);
            }

            campaign.receiver = campaign.receiver || [];
            campaign.receiver.push(receiver._id);
        }

        campaign.senderEmail = senderEmail;
        await campaign.save();

        req.flash("success", "Email sent successfully!");
        res.redirect("/MailMetrics/campaigns");

    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Error sending email");
        res.redirect("/MailMetrics");
    }
};

// ================== Campaign Analysis ==================
module.exports.analyse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id).populate('receiver data.views data.clicks');
        if (!campaign) {
            req.flash("error", "Campaign not found!");
            return res.redirect("/MailMetrics");
        }

        const subscriberIds = campaign.receiver.map(r => r._id);
        res.render("campaigns/analyse.ejs", { campaign, count, subscriberIds });
    } catch (err) {
        console.error("Error in analyse:", err);
        next(err);
    }
};

// ================== Click Tracker ==================
module.exports.click = async (req, res) => {
    try {
        const { emailId, subscriberId } = req.params;
        const link = req.query.token;
        const campaign = await Campaign.findOne({ emailId });
        const subscriber = await Subscriber.findById(subscriberId);

        if (!link || !campaign || !subscriber) return res.status(400).send("Bad Request");

        campaign.data = campaign.data || { views: [], clicks: [] };
        campaign.data.clicks.push({ subscriber: subscriberId, time: new Date() });
        await campaign.save();

        res.redirect(link);
    } catch (err) {
        console.error("Error in click tracker:", err);
        res.status(500).send("Server Error");
    }
};

// ================== Open Tracker ==================
module.exports.open = async (req, res) => {
    const { campaignId, subscriberId } = req.params;

    const buf = Buffer.from([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
        0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
        0x02, 0x44, 0x01, 0x00, 0x3b
    ]);

    res.set('Content-Type', 'image/png');
    res.end(buf, 'binary');

    try {
        const campaign = await Campaign.findById(campaignId);
        const subscriber = await Subscriber.findById(subscriberId);
        if (!campaign || !subscriber) return;

        campaign.data = campaign.data || { views: [], clicks: [] };
        campaign.data.views.push({ subscriber: subscriberId, time: new Date() });
        await campaign.save();
    } catch (err) {
        console.error("Error in open tracker:", err);
    }
};
