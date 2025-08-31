const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
       userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    booking_location: {
        type: String
    },
    amount: {
        total_amount: { type: String },
        final_amount: { type: String },
        tax: { type: String },
    },
    customer_req: {
        type: String
    },
    booking_datetime: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
//      cancellationReason: {
//     type: String,
//     default: null,
//      select: false
//   },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "CANCELLED", "ACCEPTED"],
        default: 'PENDING'
    },
})
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;