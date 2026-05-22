import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (filePath: string, folder: string, resourceType: "image" | "video" | "raw") => {
  if (!env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME === "dummy") {
    return filePath;
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType
  });

  return result.secure_url;
};

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "video" | "raw"
) => {
  if (!env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME === "dummy") {
    const mime = resourceType === "image" ? "image/png" : "application/pdf";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  }
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
