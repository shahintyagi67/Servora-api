const express = require('express');
const router = express.Router();
const { createCategory, getUsers, getBusiness, getBooking, createSubcategory, createAgent, getAllCategory, getAllSubcategory, getAllAgents } = require('../../controllers/admin/serviceController');
const upload = require('../../config/multer');

//create
router.post('/category', upload.single('icon'), createCategory);
router.post('/subcategory', createSubcategory);
router.post('/agent',createAgent);

//get api
router.get('/get-user', getUsers);
router.get('/business/status', getBusiness);
router.get('/booking', getBooking);
router.get('/category', getAllCategory);
router.get('/subcategory', getAllSubcategory);
router.get('/agent', getAllAgents);

module.exports = router;