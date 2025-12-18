import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const uploadVoice = async (req, res) => {
  try {
    const { base64, mimeType, durationMs } = req.body;

    if (!base64 || !mimeType) {
      return res.status(400).json({ message: 'Invalid audio data' });
    }

    // Extract base64 data
    const buffer = Buffer.from(base64, 'base64');

    // Generate file
    const ext = mimeType.split('/')[1] || 'webm';
    const fileName = `voice-${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads/voice');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const voiceUrl = `/uploads/voice/${fileName}`;

    res.json({
      voiceUrl,
      durationMs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Voice upload failed' });
  }
};
