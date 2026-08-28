 const SurveillanceEvent = require('../models/surveillance');

 const Surveillance =  async (req, res) => {
  try {
    const events = await SurveillanceEvent.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {Surveillance}