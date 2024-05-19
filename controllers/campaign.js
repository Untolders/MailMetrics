const Email =require("../models/email.js");

const Subscriber =require("../models/subscriber.js");

const {mailTransport} = require("../utils/mail.js");
const Campaign = require("../models/campaign.js");
const { campaignSchema }=require("../schema.js");
const count = require("../utils/helper.js");




module.exports.index = async (req, res, next) => {
    try {
        // Retrieve all campaigns with populated email data
        const user = req.user;
        let allCampaigns = await Campaign.find({owner:user._id}).populate('emailId');
        
        // Render the view with the populated data
        res.render("campaigns/campaign.ejs", { allCampaigns });
    } catch (err) {
        // Handle errors
        console.error("Error fetching campaigns:", err);
        next(err);
    }
};



//get send email
module.exports.renderSendEmail = async (req,res,next)=>{
   
    let {id} =req.params;
    let allSubscribers = await Subscriber.find({});
    const email = await Email.findById(id);
    if(!email){
      req.flash("error","Not Exist!");
      res.redirect("/MailMetrics");
    }
  
    res.render("campaigns/sendEmail.ejs",{email, allSubscribers});
  };
  
  module.exports.sendEmail = async (req, res, next) => {
    console.log("send email");
    let { id } = req.params;

    try {
        // Check if a campaign with the given emailId exists
        let campaign = await Campaign.findOne({ emailId: id });

        // If no campaign found, create a new one
        if (!campaign) {
            campaign = new Campaign({
                emailId: id,
                data: {
                    views: [],
                    clicks: []
                },
               owner:req.user._id
            });
        }

        campaign.sendAt.push(new Date());

        // Retrieve the draft email
        const draftEmail = await Email.findById(id);
        if (!draftEmail) {
            req.flash("error", "Email not found!");
            return res.redirect("/MailMetrics");
        }

        // Find the subscribers by ID
        const receiversID = req.body.subscribers;
        const receivers = [];

        for (let receiverID of receiversID) {
            const receiver = await Subscriber.findById(receiverID);
            receivers.push(receiver);
        }

        if (!receivers) {
            req.flash("error", "Subscriber not found!");
            return res.redirect("/MailMetrics");
        }

        const emailBody = draftEmail.body;
        const myServerDomain = `${process.env.DOMAIN}/MailMetrics/campaigns`;

        // Define the function to transform links
        function transformLinks(emailBody, receiverId, myServerDomain, emailID, encode = true) {
            // Create a regular expression to find all <a> tags with href attributes
            const linkRegex = /<a\s+href="([^"]+)"\s*(.*?)>(.*?)<\/a>/g;

            // Replace each match with the new format
            let transformedBody = emailBody.replace(linkRegex, (match, p1, p2, p3) => {
                const originalLink = encode ? encodeURIComponent(p1) : p1;
                const newLink = `${myServerDomain}/${emailID}/${receiverId}?token=${originalLink}`;
                return `<a href="${newLink}" ${p2}>${p3}</a>`;
            });
            transformedBody = transformedBody + `<img alt="sorry" src='${process.env.DOMAIN.toString()}/MailMetrics/campaigns/open/${campaign._id.toString()}/${receiverId.toString()}/tracker.png' class="CToWUd" data-bit="iit"></img>`;
            return transformedBody;
        }

        // Send the email
        for (let receiver of receivers) {
            const unencodedEmailBody = transformLinks(emailBody, receiver._id, myServerDomain, id, false);
            var mailOptions = {
                from: draftEmail.sender,
                to: receiver.email,
                subject: draftEmail.subject,
                html: unencodedEmailBody
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    req.flash("error", "");
                }
            });
        }
        req.flash("success", "Email sent successfully!");
    
        for (let receiver of receivers) {
            campaign.receiver.push(receiver._id);
            await campaign.save();
        }

        res.redirect("/MailMetrics");
    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Error sending email");
        return res.redirect("/MailMetrics");
    }
};




module.exports.analyse = async (req, res, next) => {
    let { id } = req.params;
    const campaign = await Campaign.findById(id).populate('receiver data.views data.clicks');
    let subscriberIds=[];

    for(let r of campaign.receiver){
        
        subscriberIds.push(r._id);
    }

    if (!campaign) {
        req.flash("error", "Campaign not found!");
        return res.redirect("/MailMetrics");
    }

    
    res.render("campaigns/analyse.ejs",{campaign,count:count, subscriberIds});
};


function generateLabels() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(1, '0') + ':00'); // Generate labels for each hour
    return labels;
}

function generateData(campaign) {
    
    if (!campaign || campaign.length === 0) {
        return Array(25).fill(0); // If no data, return an array of zeros for 25 hours
    }

  
    const timestamps = campaign.map(type => {
        // Log to check if the mapping function is executed
        try {
          
            return new Date(type.time).getHours();
        } catch (error) {
            console.error("Error processing click:", error);
            return null; // Or handle the error in a way appropriate for your application
        }
    });
    
    


 
    const data = Array(25).fill(0); // Initialize array for 25 hours
    timestamps.forEach(hour => {
        data[hour]++;
    });

    return data;
}


module.exports.analyseByDate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { token } = req.query;
        
        
        const campaign = await Campaign.findById(id).populate('receiver data.views.subscriber data.clicks.subscriber');
        
        if (!campaign) {
            req.flash("error", "Campaign not found!");
            return res.redirect("/MailMetrics");
        }
        
        // Parse the token into a Date object
        const date = new Date(token);
    

        // Filter campaign data by the date
        const filteredViews = campaign.data.views.filter(view => {
            const viewDate = new Date(view.time);
            return viewDate.toDateString() === date.toDateString();
        });
        
        const filteredClicks = campaign.data.clicks.filter(click => {
            const clickDate = new Date(click.time);
            return clickDate.toDateString() === date.toDateString();
        });
       
        const labels = generateLabels(); // Assuming you have a function to generate labels
        const viewsData = generateData(filteredViews); // Assuming you have a function to generate data
        const clicksData = generateData(filteredClicks); // Assuming you have a function to generate data

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Views',
                    data: viewsData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                
                {
                    label: 'Clicks',
                    data: clicksData,
                    backgroundColor: 'rgba(39, 174, 96, 0.2)', // Darker green background color
                    borderColor: 'rgba(39, 174, 96, 1)', // Darker green border color
                      borderWidth: 1
                }
            ]
        };
        
        res.render("campaigns/analyseByDate.ejs", { chartData }); // Pass labels and data to the template
    } catch (error) {
        console.error("Error in analyseByDate:", error);
        req.flash("error", "Error rendering analysis by date");
        res.redirect("/MailMetrics");
    }
};






// Function to generate labels for each date in a month
function generateDateLabels(month, year) {
    const labels = [];
    const daysInMonth = new Date(year, month , 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${i}`);
    }
    return labels;
}

// Function to generate data for each date in a month
function generateDateData(campaign, month, year) {
    if (!campaign || campaign.length === 0) {
       
        const daysInMonth = new Date(year, month , 0).getDate();
        return Array(daysInMonth).fill(0); // If no data, return an array of zeros for each date in the month
    }

    const timestamps = campaign.map(type => {
        try {
            const date = new Date(type.time);
            
            if (date.getMonth()+1 === month && date.getFullYear() === year) {
                return date.getDate() - 1; // Adjusting to zero-based index
            }
            return null;
        } catch (error) {
            console.error("Error processing data:", error);
            return null;
        }
    });

    

    const daysInMonth = new Date(year, month , 0).getDate();
    const data = Array(daysInMonth).fill(0); // Initialize array for each date in the month
    timestamps.forEach(day => {
        if (day !== null) {
            data[day]++;
        }
    });

    return data;
}

module.exports.analyseByDateInMonth = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { token } = req.query;
       
        const [year, month] = token.split("-");
        

        const campaign = await Campaign.findById(id).populate('receiver data.views.subscriber data.clicks.subscriber');

        if (!campaign) {
            req.flash("error", "Campaign not found!");
            return res.redirect("/MailMetrics");
        }

        const monthIndex = parseInt(month);
        const yearNum = parseInt(year);
        

        // Filter campaign data by the month and year
        const filteredViews = campaign.data.views.filter(view => {
            const viewDate = new Date(view.time);
            return viewDate.getMonth()+1 === monthIndex && viewDate.getFullYear() === yearNum;
        });
        
        

        const filteredClicks = campaign.data.clicks.filter(click => {
            const clickDate = new Date(click.time);
            return clickDate.getMonth()+1 === monthIndex && clickDate.getFullYear() === yearNum;
        });

     

        const labels = generateDateLabels(monthIndex, yearNum); // Function to generate date labels
        const viewsData = generateDateData(filteredViews, monthIndex, yearNum); // Function to generate date data
        const clicksData = generateDateData(filteredClicks, monthIndex, yearNum); // Function to generate date data

        console.log("view:",viewsData);
        console.log("clicks:",clicksData);
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Views',
                    data: viewsData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Clicks',
                    data: clicksData,
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                }
            ]
        };

        res.render("campaigns/analyseByDateInMonth.ejs", { chartData }); // Pass labels and data to the template
    } catch (error) {
        console.error("Error in analyseByDateInMonth:", error);
        req.flash("error", "Error rendering analysis by date in month");
        res.redirect("/MailMetrics");
    }
};






// Function to generate labels for each month
function generateMonthLabels() {
    const labels = [];
    for (let i = 0; i < 12; i++) {
        labels.push(new Date(0, i).toLocaleString('default', { month: 'long' }));
    }
    return labels;
}

// Function to generate data for each month
function generateMonthData(campaign) {
    if (!campaign || campaign.length === 0) {
        return Array(12).fill(0); // If no data, return an array of zeros for 12 months
    }

    const timestamps = campaign.map(type => {
        try {
            return new Date(type.time).getMonth();
        } catch (error) {
            console.error("Error processing data:", error);
            return null;
        }
    });

    const data = Array(12).fill(0); // Initialize array for 12 months
    timestamps.forEach(month => {
        data[month]++;
    });

    return data;
}

module.exports.analyseByMonth = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { token } = req.query;
        console.log("token: ",token);

        const campaign = await Campaign.findById(id).populate('receiver data.views.subscriber data.clicks.subscriber');

        if (!campaign) {
            req.flash("error", "Campaign not found!");
            return res.redirect("/MailMetrics");
        }

        const date = new Date(token);

        // Filter campaign data by the month
        const filteredViews = campaign.data.views.filter(view => {
            const viewDate = new Date(view.time);
            return  viewDate.getFullYear() === date.getFullYear();
        });

        const filteredClicks = campaign.data.clicks.filter(click => {
            const clickDate = new Date(click.time);
            return  clickDate.getFullYear() === date.getFullYear();
        });

        const labels = generateMonthLabels(); // Function to generate month labels
        const viewsData = generateMonthData(filteredViews); // Function to generate month data
        const clicksData = generateMonthData(filteredClicks); // Function to generate month data

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Views',
                    data: viewsData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Clicks',
                    data: clicksData,
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                }
            ]
        };

        res.render("campaigns/analyseByMonth.ejs", { chartData }); // Pass labels and data to the template
    } catch (error) {
        console.error("Error in analyseByMonth:", error);
        req.flash("error", "Error rendering analysis by month");
        res.redirect("/MailMetrics");
    }
};

  

module.exports.click=async(req, res) => {
    
    let {emailId, subscriberId} =req.params;
    let link = req.query.token; // Capture the 'token' query parameter
    const campaign = await Campaign.findOne({ emailId: emailId }).exec();

    const subscriber = await Subscriber.findById(subscriberId);
    
    if (link && campaign && subscriber ) {
      const view={
        subscriber:subscriberId,
        time:new Date(),
      };
      const click={
        subscriber:subscriberId,
        time:new Date(),
      };
      campaign.data = campaign.data || {}; // Ensure campaign.data is initialized
      campaign.data.views = campaign.data.views || [];
      campaign.data.clicks = campaign.data.clicks || [];
      
    
      campaign.data.clicks.push(click);

      await campaign.save();
        res.redirect(link);
    } else {
        res.status(400).send("Bad Request: Missing token parameter");
    }
};





module.exports.open=async(req, res) => {

    
    const {campaignId, subscriberId} = req.params
    const buf = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
      0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
      0x02, 0x44, 0x01, 0x00, 0x3b
    ]);
    res.set('Content-Type', 'image/png');
    res.end(buf, 'binary');
    const campaign = await Campaign.findById(campaignId).exec();

    const subscriber = await Subscriber.findById(subscriberId);
   
    if ( campaign && subscriber ) {
        const view={
          subscriber:subscriberId,
          time:new Date(),
        };
        
        campaign.data = campaign.data || {}; // Ensure campaign.data is initialized
        campaign.data.views = campaign.data.views || [];
       
        
        campaign.data.views.push(view);
      
  
        await campaign.save();

    }else {
        res.status(400).send("Bad Request: Missing token parameter");
    }


    const email = { id: campaign.emailId._id, to: 'recipient@example.com', subject: 'Test Email' };
    console.log('Email was opened');
    console.log(campaign.receiver);
    console.log(email.subject);

  
 
    
  };
  