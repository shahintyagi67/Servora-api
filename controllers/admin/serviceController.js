const Agent = require("../../models/admin/Agent");
const Category = require("../../models/admin/Category");
const Subcategory = require("../../models/admin/Subcategory");

const Booking = require("../../models/user/Booking");
const Business = require("../../models/user/Business");
const User = require("../../models/user/User");

// Function to generate a random Agent Code
const generateAgentCode = () => {
  const prefix = "AGT"; 
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
};

const createAgent = async (req, res) => {
  try {
    const { agent_name, email, mobile_number } = req.body;

    if (!agent_name || !email) {
      return res.status(400).json({
        status: false,
        message: "Agent name and email are required",
      });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    let agentCode;
    let isUnique = false;

    while (!isUnique) {
      agentCode = generateAgentCode();
      const existingCode = await Agent.findOne({ agent_code: agentCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    const agent = new Agent({
      agent_name,
      email,
      mobile_number,
      agent_code: agentCode,
    });
    await agent.save();

    res.status(201).json({
      status: true,
      message: "Agent created successfully",
      data: agent,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { category_name, status } = req.body;

    if (!category_name) {
      return res.status(400).json({
        status: false,
        message: "Category name is required",
      });
    }

    let iconImage = "";
    if (req.file) {
      iconImage = req.file.path;
    }

    const category = new Category({
      category_name,
      icon: iconImage,
      status,
    });
    await category.save();

    res.status(200).json({
      status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const { subcategory_name, category, status } = req.body || {};
    if (!subcategory_name) {
      return res.status(400).json({ message: "Subcategory name is required." });
    }
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    const subcategory = new Subcategory({
      subcategory_name,
      status: status ? status : "active",
      category,
    });
    await subcategory.save();
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};


const getBusiness = async (req, res) => {
  const { status } = req.query;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search ? req.query.search.trim("") : "";
    const query = {};
    if (search) {
      query.$or = [{ business_name: { $regex: search, $options: "i" } }];
    }

    if (
      status !== "PENDING" &&
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      res.status(400).json({
        status: false,
        message: "Invalid status type",
      });
    }

    const total = await Business.countDocuments(query);
    const business = await Business.find({ status })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      mesaage: "Fetch business Successfully",
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
      data: business,
    });
  } catch (err) {
    console.error("Error registering business:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUsers = async (req, res) => {
  const { user_type } = req.query;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search ? req.query.search.trim("") : "";
    const query = {};

    if (search) {
      query.$or = [{ username: { $regex: search, $options: "i" } }];
    }

    if (user_type !== "CUSTOMER" && user_type !== "PROVIDER") {
      return res.status(400).json({ message: "Invalid TYpe" });
    }

    const total = await Business.countDocuments(query);
    const users = await User.find({ user_type })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      message: "Fetech user successfully",
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getBooking = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.search.trim() : "";
    const query = {};
    if (search) {
      query.$or = [{ planId: { $regex: search, options: "i" } }];
    }
    const totalBoking = await Booking.countDocuments(query);
    const booking = await Booking.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetch Booking Successfully",
      meta: {
        totalBoking,
        page,
        limit,
        totalPage: Math.ceil(totalBoking / limit),
      },
      data: booking,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Agents fetched successfully!",
      data: agents,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Category fetched successfully!",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllSubcategory = async (req, res) => {
  try {
    const category = await Subcategory.find();
    return res.status(200).json({
      status: true,
      code: 200,
      message: "Subcategory fetched successfully!",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getBusiness,
  getUsers,
  getBooking,
  createCategory,
  createSubcategory,
  createAgent,
  getAllAgents,
  getAllCategory,
  getAllSubcategory,
};
