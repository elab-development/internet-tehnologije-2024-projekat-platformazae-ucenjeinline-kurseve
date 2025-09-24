import express from 'express';
import multer from 'multer';

import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from '../utils/cloudinary.js';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required',
      });
    }

    await deleteMediaFromCloudinary(id);

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting file',
    });
  }
});

export default router;
