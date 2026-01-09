const path = require("path");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const Admin = require("../../../models/AdminModel"); 
const { hashPassword,comparePassword} = require("../../../utils/password");
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





/* ======================================================
   DELETE ADMIN
====================================================== */
const deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if (!admin_id) {
      return res.status(200).json({
        status: false,
        message: "Admin ID is required",
      });
    }

    // Check if admin exists
    const admin = await Admin.findById(admin_id);
    
    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Admin not found",
      });
    }

    // Delete profile image if exists
    if (admin.profile_image) {
      const imagePath = path.join(
        __dirname,
        "../../../public/admin/profile",
        admin.profile_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete admin record
    await Admin.delete(admin_id);

    return res.status(200).json({
      status: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



/* ======================================================
   ADMIN LOGIN - SEND OTP
====================================================== */
const send_otp = async (req, res) => {
  try {
    const { username, password } = req.body;

    /* ================= VALIDATION ================= */
    if (!username) {
      return res.status(200).json({
        status: false,
        message: "Username is required",
      });
    }

    if (!password) {
      return res.status(200).json({
        status: false,
        message: "Password is required",
      });
    }

    /* ================= FIND ADMIN ================= */
    const admin = await Admin.findByUsername(username);

    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Invalid username or password",
      });
    }

    /* ================= STATUS CHECK ================= */
    if (admin.status !== "1") {
      return res.status(200).json({
        status: false,
        message: "Admin account is inactive",
      });
    }

    /* ================= PASSWORD CHECK ================= */
    const isMatch = await comparePassword(password, admin.admin_password);

    if (!isMatch) {
      return res.status(200).json({
        status: false,
        message: "Invalid username or password",
      });
    }

    /* ================= STATIC OTP ================= */
    const STATIC_OTP = "123456";
    const encryptedOtp = await hashPassword(STATIC_OTP);

    // Save encrypted OTP in DB
    await Admin.updatePassOtp(admin.admin_id, encryptedOtp);

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      otp_required: true,
      // ⚠️ Do NOT send OTP in production
      otp: STATIC_OTP, // remove later
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};




/* ======================================================
   ADMIN LOGIN - VERIFY OTP
====================================================== */
const verifyOtp = async (req, res) => {
  try {
   
    const { username, otp } = req.body;

    /* ================= VALIDATION ================= */
    if (!username) {
      return res.status(200).json({
        status: false,
        message: "Username is required",
      });
    }

    if (!otp) {
      return res.status(200).json({
        status: false,
        message: "OTP is required",
      });
    }

    /* ================= FIND ADMIN ================= */
    const admin = await Admin.findByUsername(username);
    // console.log(admin);

    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "Invalid username",
      });
    }

    /* ================= OTP CHECK ================= */
    const isOtpMatch = await comparePassword(otp, admin.pass_otp);

    if (!isOtpMatch) {
      return res.status(200).json({
        status: false,
        message: "Invalid OTP",
      });
    }

   

    /* ================= JWT TOKEN ================= */
    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        username: admin.admin_username,
        type: admin.admin_type,
      },
      process.env.JWT_SECRET || "ADMIN_SECRET_KEY",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      admin: {
        admin_id: admin.admin_id,
        fname: admin.admin_fname,
        lname: admin.admin_lname,
        username: admin.admin_username,
        type: admin.admin_type,
      },
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
  deleteAdmin,
  send_otp,
  verifyOtp
};
