const Joi = require('joi');

const adminRegisterSchema = Joi.object({
    admin_fname: Joi.string().min(2).max(50).required(),
    admin_lname: Joi.string().min(2).max(50).allow('', null),
    mob_one: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid mobile number'
        }),
    email_id: Joi.string().email().required(),
    admin_username: Joi.string().min(4).max(30).required(),
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
