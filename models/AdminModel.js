const db = require('../config/db');

const AdminModel = {

    /* ================= CREATE ADMIN ================= */
    createAdmin: (data, callback) => {
        const sql = `
            INSERT INTO mukta_admin_db
            (
                admin_fname,
                admin_lname,
                mob_one,
                email_id,
                admin_username,
                admin_password,
                admin_type,
                status,
                insert_date,
                insert_user
            )
            VALUES (?,?,?,?,?,?,?,?,?,?)
        `;

        const values = [
            data.admin_fname,
            data.admin_lname,
            data.mob_one,
            data.email_id,
            data.admin_username,
            data.admin_password,
            data.admin_type,
            '1',
            data.insert_date,
            data.insert_user
        ];

        db.query(sql, values, callback);
    },

    /* ================= DUPLICATE CHECK (REGISTER) ================= */
    checkUsernameOrEmail: (username, email, callback) => {
        const sql = `
            SELECT admin_id 
            FROM mukta_admin_db 
            WHERE admin_username = ? OR email_id = ?
            LIMIT 1
        `;
        db.query(sql, [username, email], callback);
    },

    /* ================= DUPLICATE CHECK (UPDATE) ================= */
    checkUsernameOrEmailForUpdate: (username, email, admin_id, callback) => {
        const sql = `
            SELECT admin_id 
            FROM mukta_admin_db 
            WHERE (admin_username = ? OR email_id = ?)
            AND admin_id != ?
            LIMIT 1
        `;
        db.query(sql, [username, email, admin_id], callback);
    },

    /* ================= UPDATE ADMIN ================= */
    updateAdmin: (admin_id, data, callback) => {
        const sql = `
            UPDATE mukta_admin_db 
            SET 
                admin_fname   = ?,
                admin_lname   = ?,
                mob_one       = ?,
                email_id      = ?,
                admin_username= ?,
                admin_password= ?,
                update_date   = ?,
                update_user   = ?
            WHERE admin_id = ?
        `;

        const values = [
            data.admin_fname,
            data.admin_lname,
            data.mob_one,
            data.email_id,
            data.admin_username,
            data.admin_password,
            data.update_date,
            data.update_user,
            admin_id
        ];

        db.query(sql, values, callback);
    }

};

module.exports = AdminModel;
