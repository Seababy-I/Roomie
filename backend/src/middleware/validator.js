const Joi = require('joi');

// Validator wrapper middleware
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorDetails = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorDetails });
    }
    next();
};

// Schemas
const listingSchema = Joi.object({
    title: Joi.string().required().min(5).max(100),
    rent: Joi.number().required().min(0),
    location: Joi.string().required(),
    flatType: Joi.string().valid('1BHK', '2BHK', '3BHK', 'PG', 'Other').required(),
    genderPreference: Joi.string().valid('Male', 'Female', 'Any').required(),
    moveInDate: Joi.date().required(),
    description: Joi.string().required().max(1000),
});

const googleAuthSchema = Joi.object({
    tokenId: Joi.string().required()
});

module.exports = { validate, listingSchema, googleAuthSchema };
