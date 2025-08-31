const Business = require('../../models/user/Business');

const registerBusiness = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const {
      provider_type,
      business_name,
      document_id,
      description,
      offer_type,
      longitude,
      latitude,
      place_number,
      floor,
      area,
      city,
      landmark,
      days,
      is24hours,
      isClosed,
      openTime,
      closeTime,
      plan_name,
      plan_description,
      plan_price,
      category,
      subcategory
    } = req.body;
    console.log("body", req.body)

    // Validate required fields
    if (!provider_type || !business_name || !offer_type) {
      return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    const files = req.files || {};

    // Cloudinary URLs
    const documentUrls = files.business_documents?.map(file => file.path) || [];
    const businessImageUrls = files.businessImage?.map(file => file.path) || [];
    const flayerImage = files.flayer?.[0]?.path || '';

    // Location object
    const location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    // Location details
    const locationDetails = {
      place_number,
      floor,
      area,
      city,
      landmark
    };

    // Business timings
    const timing = [];
    if (Array.isArray(days)) {
      for (let i = 0; i < days.length; i++) {
        timing.push({
          days: days[i],
          is24hours: is24hours?.[i] === 'true' || is24hours?.[i] === true,
          isClosed: isClosed?.[i] === 'true' || isClosed?.[i] === true,
          openTime: openTime?.[i] || '',
          closeTime: closeTime?.[i] || ''
        });
      }
    } else if (days) {
      timing.push({
        days,
        is24hours: is24hours === 'true' || is24hours === true,
        isClosed: isClosed === 'true' || isClosed === true,
        openTime: openTime || '',
        closeTime: closeTime || ''
      });
    }

    // Business plans
    const planImageFiles = files.plan_image || [];
    const plans = [];
    if (Array.isArray(plan_name)) {
      for (let i = 0; i < plan_name.length; i++) {
        plans.push({
          plan_name: plan_name[i],
          plan_price: plan_price?.[i] || '',
          plan_description: plan_description?.[i] || '',
          plan_image: planImageFiles?.[i]?.path || ''
        });
      }
    } else if (plan_name) {
      plans.push({
        plan_name,
        plan_price,
        plan_description,
        plan_image: planImageFiles?.[0]?.path || ''
      });
    }

    // Create business in DB
    const business = await Business.create({
      userId,
      provider_type,
      business_name,
      description,
      offer_type,
      business_documents: {
        documents: documentUrls,
        document_id: document_id || ''
      },
      location,
      location_details: locationDetails,
      businessImage: businessImageUrls,
      flayer: flayerImage,
      business_timing: timing,
      business_plan: plans,
      services: {
        category,
        subcategory: Array.isArray(subcategory) ? subcategory : [subcategory]
      }
    });

    res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      data: business
    });

  } catch (error) {
    console.error('Error registering business:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { registerBusiness };
