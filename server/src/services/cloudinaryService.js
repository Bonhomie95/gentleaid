import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadToCloudinary = async (filePath, folder = 'gentelaid') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });

    // delete temp file
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    throw new Error('Failed to upload image');
  }
};
