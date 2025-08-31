const User = require("../../models/user/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Business = require("../../models/user/Business");

exports.userSignUp = async (req, res) => {
  const {
    username,
    email,
    user_type,
    password,
    referalSource,
    business_phone,
    whatsapp_phone,
    country,
    agent,
    agent_code,
  } = req.body;
  console.log("BODY", req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("otp", otp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    console.log("otpExpires", otpExpires);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      user_type,
      password: hashedPassword,
      business_phone,
      whatsapp_phone,
      country,
      referalSource,
      agent,
      agent_code,
      otp,
      otpExpires,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or otp" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== parseInt(otp) || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "User verified successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const newOtp = Math.floor(1000 + Math.random() * 9000);
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();
    return res.status(200).json({ message: "Resend otp sucessfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Otp expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// exports.getUsers = async (req, res) => {
//   const {user_type} = req.query;
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const search = req.query.search ? req.query.search.trim("") : '';
//     const query = {};
   
//     if(search){
//       query.$or=[
//         {username : {$regex: search, $options:'i'}}
//       ]
//     }

//     if(user_type !== 'CUSTOMER' && user_type !== 'PROVIDER'){
//       return res.status(400).json({message:'Invalid TYpe'})
//     }

//    const total = await Business.countDocuments(query);
//    const users = await User.find({user_type}).skip((page-1)*limit).limit(limit).sort({createdAt: -1});
//     return res.status(200).json({
//       status: 200,
//       message: "Fetech user successfully",
//       meta:{
//       total,
//       page,
//       limit,
//       totalPage: Math.ceil(total/limit)
//       },
//       data: users,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };


