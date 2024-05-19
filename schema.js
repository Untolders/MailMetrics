const Joi =require("joi");




module.exports.campaignSchema = Joi.object({
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






module.exports.emailValidationSchema = Joi.object({
  title: Joi.string().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  sender: Joi.string().required(),
  createdAt: Joi.date().default(Date.now())
});







module.exports.subscriberValidationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(1).required()
});






module.exports.userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  
});

