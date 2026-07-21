const DeviceRegistration = async (req, res) => {
  const { deviceName, macAddress, building, section } = req.body;

  try {
    const existing = await Device.findOne({ macAddress });
    if (existing) return res.status(400).json({ message: "Device already exists" });

    const newDevice = new Device({
      owner: req.user.id,
      deviceName,
      macAddress,
      location: { building, section },
      approvalStatus: 'pending' // Kept in limbo until admin acts
    });

    await newDevice.save();
    return res.status(201).json({ message: "Registration request sent. Awaiting Admin approval." });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    DeviceRegistration
}