const AdminModel = require('../../../models/AdminModel');
const { hashPassword } = require('../../../utils/password');
const { adminRegisterSchema } = require('../../../utils/validators/admin.validator');

const register = async (req, res) => {
    try {

        /* ================= JOI VALIDATION ================= */
        const { error, value } = adminRegisterSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            return res.status(200).json({
                status: false,
                message: "Validation error",
                errors: error.details.map(err => err.message)
            });
        }

        const {
            admin_fname,
            admin_lname,
            mob_one,
            email_id,
            admin_username,
            password
        } = value;

        /* ================= DUPLICATE CHECK ================= */
        AdminModel.checkUsernameOrEmail(admin_username, email_id, async (err, result) => {
          
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: err.message
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    status: false,
                    message: "Username or Email already exists"
                });
            }

            /* ================= PASSWORD HASH ================= */
            const hashedPassword = await hashPassword(password);

            const adminData = {
                admin_fname,
                admin_lname,
                mob_one,
                email_id,
                admin_username,
                admin_password: hashedPassword,
                admin_type: 'ADMIN',
                insert_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                insert_user: 'system'
            };

            /* ================= INSERT ================= */
            AdminModel.createAdmin(adminData, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    status: true,
                    message: "Admin registered successfully",
                    admin_id: result.insertId
                });
            });
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};






module.exports = {
    register,
  
};
