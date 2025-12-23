import logger from "@/helper_functions/logger";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_APP_NAME,
});

const uploadonCloudinary = async (file: Blob): Promise<string | null> => {
  try {
    if (!file) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "quick-drop",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url ?? null);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (err) {
    logger.error("Error occured while uploadin image ::", err);
  }

  return null;
};

export default uploadonCloudinary;
