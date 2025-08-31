const Booking = require("../../models/user/Booking");
const Business = require("../../models/user/Business");

const createBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("userId", userId);

        if (!userId) {
            return res.status(404).json({ status: false, message: 'Customer not found' });
        }

        const {
            booking_location,
            businessId,
            booking_datetime,
            planId,
            total_amount,
            tax,
            final_amount,
            customer_req,
            quantity
        } = req.body;

        console.log("body", req.body);

        const business = await Business.findById(businessId).lean();
        console.log("BusinessId", businessId);
        console.log("Full Business Object:", business);

        if (!business) {
            return res.status(404).json({ status: false, message: 'Business Not found' });
        }

        if (!business.business_plan || !Array.isArray(business.business_plan)) {
            return res.status(400).json({
                status: false,
                message: 'No plans found for this business'
            });
        }

        const selectedPlan = business.business_plan.find(
            p => p._id && p._id.toString() === planId
        );
        console.log("PlanId", planId);
        console.log("Business Plan:", business.business_plan);
        console.log("Is Array?", Array.isArray(business.business_plan));


        if (!selectedPlan) {
            return res.status(404).json({
                status: false,
                message: 'Plan not found in business'
            });
        }

        const booking = await Booking.create({
            userId,
            booking_location,
            booking_datetime,
            amount: {
                total_amount,
                tax,
                final_amount
            },
            customer_req,
            quantity,
            planId,
            businessId: business._id
        });

        return res.status(200).json({
            status: true,
            data: booking
        });

    } catch (err) {
        console.error("booking error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
};


module.exports = { createBooking};
