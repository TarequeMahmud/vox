import redis from "@/lib/redis";
export const verifyOTP = async (email: string, Otp: string) => {
  try {
    const otp = await redis.get(`otp:${email}`);
    await redis.del(`otp:${email}`);
    if (!otp) {
      return null;
    }

    if (otp !== Otp) {
      return "OTP_NOT_EQUAL";
    }
  } catch (error: unknown) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
