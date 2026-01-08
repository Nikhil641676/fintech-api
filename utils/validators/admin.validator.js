const Joi = require('joi');

const adminRegisterSchema = Joi.object({
    fname: Joi.string().min(2).max(50).required(),
    lname: Joi.string().min(2).max(50).allow('', null),
    mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid mobile number'
        }),
    email: Joi.string().email().required(),
    username: Joi.string().min(4).max(30).required(),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters'
        }),
    admin_type: Joi.string().valid('ADMIN').optional()
});

module.exports = {
    adminRegisterSchema
};
