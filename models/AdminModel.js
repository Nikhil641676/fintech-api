const db = require('../config/db');

class Admin {

    /* ================= CREATE ================= */
    static create(data) {
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
            data.fname,
            data.lname,
            data.mobile,
            data.email,
            data.username,
            data.password,
            data.type || 'ADMIN',
            '1',
            data.insert_date,
            data.insert_user
        ];

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    /* ================= DUPLICATE CHECK (REGISTER) ================= */
    static existsByUsernameOrEmail(username, email) {
        const sql = `
            SELECT admin_id
            FROM mukta_admin_db
            WHERE admin_username = ? OR email_id = ?
            LIMIT 1
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [username, email], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.length > 0);
            });
        });
    }

    
    /* ================= DUPLICATE CHECK (UPDATE) ================= */
        static existsForUpdate(username, email, admin_id) {
            const sql = `
                SELECT admin_username, email_id
                FROM mukta_admin_db
                WHERE admin_id != ?
                AND (admin_username = ? OR email_id = ?)
                LIMIT 1
            `;

            return new Promise((resolve, reject) => {
                db.query(sql, [admin_id, username, email], (err, rows) => {
                    if (err) return reject(err);

                    if (rows.length === 0) {
                        return resolve(null); // no duplicate
                    }

                    resolve(rows[0]); // return matched row
                });
            });
        }


    /* ================= UPDATE (PARTIAL LIKE LARAVEL) ================= */
    static update(admin_id, data) {

        let fields = [];
        let values = [];

        if (data.fname) {
            fields.push("admin_fname = ?");
            values.push(data.fname);
        }

        if (data.lname) {
            fields.push("admin_lname = ?");
            values.push(data.lname);
        }

        if (data.mobile) {
            fields.push("mob_one = ?");
            values.push(data.mobile);
        }

        if (data.email) {
            fields.push("email_id = ?");
            values.push(data.email);
        }

        if (data.username) {
            fields.push("admin_username = ?");
            values.push(data.username);
        }

        if (data.password) {
            fields.push("admin_password = ?");
            values.push(data.password);
        }

        
        if (data.profile_image) {
            fields.push("profile_img = ?");
            values.push(data.profile_image);
        }

        fields.push("update_date = ?");
        fields.push("update_user = ?");

        values.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
        values.push("system");

        const sql = `
            UPDATE mukta_admin_db
            SET ${fields.join(', ')}
            WHERE admin_id = ?
        `;

        values.push(admin_id);

        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }


    static getProfileImage(admin_id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT profile_img FROM mukta_admin_db WHERE admin_id = ?",
      [admin_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]?.profile_image || null);
      }
    );
  });
}
}

module.exports = Admin;
