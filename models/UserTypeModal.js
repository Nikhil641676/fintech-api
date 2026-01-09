const db = require("../config/db");

class UserType {

  /* ================= USER TYPE LIST ================= */
  static list() {
    const sql = `
      SELECT 
        id,
        user_name,
        user_id,
        uregamt,
        lockamt,
        status,
        insert_date,
        insert_user,
        update_date,
        update_user
      FROM x_ueser_type
      ORDER BY id ASC
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

}

module.exports = UserType;
