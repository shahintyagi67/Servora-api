// const cron = require("node-cron");
// const admin = require('../config/firebaseAdmin')
// const User = require("../models/user/User");


// // Runs every day at 10 AM
// cron.schedule("*/1 * * * *", async () => {
//   console.log("⏰ Running daily notification job...");

//   try {
//     const tokensData = await User.find({});
//     const tokens = tokensData.map(user => user.deviceToken);

//     if (tokens.length > 0) {
//       const message = {
//         notification: {
//           title: "Daily Update 🚀",
//           body: "Hello! This is your scheduled notification from admin."
//         },
//         tokens
//       };

//       const response = await admin.messaging().sendMulticast(message);
//       console.log(`✅ Sent to ${tokens.length} users:`, response);
//     } else {
//       console.log("⚠️ No tokens found.");
//     }
//   } catch (err) {
//     console.error("❌ Error sending notifications:", err);
//   }
// }, {
//   timezone: "Asia/Kolkata"
// });
