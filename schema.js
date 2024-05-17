const Joi =require("joi");








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
