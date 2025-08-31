const express = require('express');
const router = express.Router();
const {login, userSignUp, verifyOtp, forgetPassword, resetPassword} = require('../../controllers/user/authController');
const { registerBusiness} = require('../../controllers/user/businessController');
const upload  = require('../../config/multer');
const { userAuth } = require('../../middleware/userAuth');
const { createBooking } = require('../../controllers/user/bookingController');
const { stripeWebhook, createCheckout } = require('../../controllers/user/subscriptionController');

//auth-part
router.post('/signup', userSignUp);
router.post('/login', login);
router.post('/verify', verifyOtp);
router.post('/forgot', forgetPassword);
router.post('/reset', resetPassword);

//business
router.post(
  '/register',
  upload.fields([
    { name: 'businessImage', maxCount: 5 },
    { name: 'flayer', maxCount: 1 },
    { name: 'business_documents', maxCount: 5 },
    { name: 'plan_image', maxCount: 5 } 
  ]),
  registerBusiness
);

//booking
router.post('/booking', userAuth, createBooking);

//subscription
router.post('/subscription', createCheckout);
router.post('/webhook', stripeWebhook);


module.exports = router;
