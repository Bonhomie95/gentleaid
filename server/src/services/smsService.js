import dotenv from "dotenv";
dotenv.config();

let client = null;

// If Twilio is chosen
if (process.env.SMS_PROVIDER === "twilio") {
  const twilio = await import("twilio");
  client = twilio.default(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
  );
}

export const sendOtpSms = async (phone, code) => {
  const message = `GentelAid OTP: ${code}`;

  try {
    if (process.env.SMS_PROVIDER === "twilio") {
      await client.messages.create({
        body: message,
        to: phone,
        from: process.env.TWILIO_FROM,
      });

      console.log("OTP sent via Twilio:", phone);
      return true;
    }

    // Default fallback (console only)
    console.log(`OTP (${code}) to ${phone} [SIMULATED]`);
    return true;

  } catch (err) {
    console.error("SMS sending failed:", err.message);
    throw new Error("Failed to send OTP");
  }
};
