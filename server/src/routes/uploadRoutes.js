import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// TEMP FOLDER
const upload = multer({ dest: 'temp/' });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// SINGLE UPLOAD
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'gentelaid',
      resource_type: 'image',
    });

    // cleanup
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ success: false, message: 'upload failed' });
  }
});

export default router;
