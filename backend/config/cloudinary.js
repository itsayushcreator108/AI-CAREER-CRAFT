import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("✅ Cloudinary Configured Successfully");

    // Optional: Test call to verify credentials
    const result = await cloudinary.api.ping();
    console.log("🌐 Cloudinary Status:", result.status);

  } catch (error) {
    console.error("❌ Cloudinary Connection Failed:", error.message);
    throw error;
  }
};

export default connectCloudinary;
