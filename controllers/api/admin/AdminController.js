const path = require("path");
const fs = require("fs");
const Admin = require("../../../models/AdminModel"); // ✅ NEW MODEL
const { hashPassword } = require("../../../utils/password");
const {
  adminRegisterSchema,
} = require("../../../utils/validators/admin.validator");

/* ======================================================
   REGISTER ADMIN
====================================================== */
const register = async (req, res) => {
  try {
    /* ================= JOI VALIDATION ================= */
    const { error, value } = adminRegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(200).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { fname, lname, mobile, email, username, password } = value;

    /* ================= DUPLICATE CHECK ================= */
    const exists = await Admin.existsByUsernameOrEmail(username, email);
    if (exists) {
      return res.status(409).json({
        status: false,
        message: "Username or Email already exists",
      });
    }

    /* ================= PASSWORD HASH ================= */
    const hashedPassword = await hashPassword(password);

    const adminData = {
      fname,
      lname,
      mobile,
      email,
      username,
      password: hashedPassword,
      type: "ADMIN",
      insert_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      insert_user: "system",
    };

    /* ================= INSERT ================= */
    const result = await Admin.create(adminData);

    return res.status(201).json({
      status: true,
      message: "Admin registered successfully",
      admin_id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE ADMIN (PARTIAL UPDATE LIKE LARAVEL)
====================================================== */
const update = async (req, res) => {
  try {
    const { admin_id } = req.body;
    const payload = req.body;

    if (!admin_id) {
      return res.status(200).json({
        status: false,
        message: "Admin ID is required",
      });
    }

    /* ================= ALLOWED FIELDS ================= */
    const allowedFields = [
      "fname",
      "lname",
      "mobile",
      "email",
      "username",
      "password",
    ];

    let updateData = {};

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== "") {
        updateData[field] = payload[field];
      }
    });


    if (req.file) {
      updateData.profile_image = req.file.filename;

      // 🔥 Optional: delete old image
      const oldProfile = await Admin.getProfileImage(admin_id);
      if (oldProfile) {
        const oldPath = path.join(
          __dirname,
          "../../../public/admin/profile",
          oldProfile
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No fields provided to update",
      });
    }




    /* ================= PASSWORD HASH ================= */
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    /* ================= DUPLICATE CHECK ================= */
    if (updateData.username || updateData.email) {
      const exists = await Admin.existsForUpdate(
        updateData.username || "",
        updateData.email || "",
        admin_id
      );

      if (exists) {
        if (updateData.email && exists.email_id === updateData.email) {
          return res.status(200).json({
            status: false,
            message: "Email ID already exists",
          });
        }

        if (
          updateData.username &&
          exists.admin_username === updateData.username
        ) {
          return res.status(200).json({
            status: false,
            message: "Username already exists",
          });
        }

        // fallback (rare case)
        return res.status(200).json({
          status: false,
          message: "Username or Email already exists",
        });
      }
    }

    /* ================= UPDATE ================= */
    await Admin.update(admin_id, updateData);

    return res.status(200).json({
      status: true,
      message: "Admin updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  update,
};
