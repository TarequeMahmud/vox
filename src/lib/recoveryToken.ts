import redis from "@/lib/redis";
import crypto from "crypto";

export const recoveryToken = async (
  email: string,
  mode: "GENERATE" | "VERIFY"
) => {
  try {
    if (mode === "GENERATE") {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = 10 * 60;

      await redis.set(`recovery:${email}`, token, {
        EX: tokenExpiry,
      });

      return token;
    } else if (mode === "VERIFY") {
      const storedToken = await redis.get(`recovery:${email}`);
      if (!storedToken) {
        throw new Error("Token expired or not found");
      }
      //delete token
      await redis.del(`recovery:${email}`);
      return storedToken;
    } else {
      throw new Error("Invalid mode");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing OTP:", error.message);
      throw new Error("Failed to process OTP");
    }
    console.error("Error processing OTP:", error);
    throw new Error("Internal Server Error");
  }
};
