const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: String,
    planName: String,
    amount: Number,
    startDate: Date,
    endDate: Date,
    status: String,
    paymentId: String
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;