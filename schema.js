const Joi =require("joi");
const review = require("./models/review");


module.exports.listingSchema=Joi.object({
 

        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required()

  
});


module.exports.reviewSchema=Joi.object({
        review:Joi.object({
                rating:Joi.number().required().min(1).max(5),
                comment:Joi.string().required(),
        }).required(),
});



const campaignSchema = Joi.object({
  emailId: Joi.string().required(),
  receiver: Joi.array().items(Joi.string().required()).required(),
  data: Joi.object({
    views: Joi.array().items(
      Joi.object({
        subscriber: Joi.string().required(),
        time: Joi.date().default(() => new Date())
      })
    ),
    clicks: Joi.array().items(
      Joi.object({
        subscriber: Joi.string().required(),
        time: Joi.date().default(() => new Date())
      })
    )
  }).required(),
  sendAt: Joi.array().items(Joi.date().default(() => new Date())).required()
});

module.exports = { campaignSchema};
