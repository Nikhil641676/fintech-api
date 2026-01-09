const path = require("path");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const UserType = require("../../../models/UserTypeModal"); 
const { hashPassword,comparePassword} = require("../../../utils/password");


/* ======================================================
   USER TYPE LIST API
====================================================== */
const user_type_list = async (req, res) => {
  try {
    const list = await UserType.list();

    if (!list || list.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No user type found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "User type list fetched successfully",
      data: list,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



module.exports = {
  user_type_list,
  
};
