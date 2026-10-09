require('dotenv').config();
const twilio = require('twilio');


// Initialize client with credentials
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Sends a high-priority Fire Detection alert SMS via Twilio.
 * @param {string} to - Recipient phone number in E.164 format (e.g., '+15558675310')
 * @param {string} location - Location or zone where the fire was detected
 */
async function sendFireAlertSMS(to, location = 'Main Facility') {
  const alertBody = `🚨 [EMERGENCY ALERT] Fire/Flame detected at ${location}! Please take immediate action and check the system dashboard.`;

  try {
    const message = await client.messages.create({
      body: alertBody,
      from: process.env.TWILIO_PHONE_NUMBER, // Or process.env.TWILIO_MESSAGING_SERVICE_SID
      to: to,
    });

    console.log(`Fire alert SMS dispatched successfully! SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`Failed to send fire alert SMS: ${error.message}`);
    throw error;
  }
}

// Example Usage:
module.exports = {sendFireAlertSMS}