import 'dotenv/config';
import express from 'express';
import { upload } from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

// Inline admin check since you don't have adminOnly middleware
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// POST /api/upload/image
router.post('/image', authenticate, adminOnly, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    return successResponse(res, {
        message: 'Image uploaded successfully',
        data: {
            url: req.file.path,
            public_id: req.file.filename,
        }
    });
});

// POST /api/upload/images (multiple)
router.post('/images', authenticate, adminOnly, upload.array('images', 5), (req, res) => {
    if (!req.files?.length) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const urls = req.files.map(f => ({ url: f.path, public_id: f.filename }));
    return successResponse(res, {
        message: 'Images uploaded successfully',
        data: urls,
    });
});

export default router;
