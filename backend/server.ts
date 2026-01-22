import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload and convert endpoint
app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const format = req.body.format || 'png';
    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const nameWithoutExt = path.parse(originalName).name;
    const outputFilename = `${nameWithoutExt}-converted.${format}`;
    const outputPath = path.join('uploads', outputFilename);

    // Convert image
    const image = sharp(inputPath);
    
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        await image.jpeg({ quality: 80 }).toFile(outputPath);
        break;
      case 'png':
        await image.png({ compressionLevel: 9 }).toFile(outputPath);
        break;
      case 'webp':
        await image.webp({ quality: 80 }).toFile(outputPath);
        break;
      case 'pdf':
        const { width, height } = await image.metadata();
        const buffer = await image.jpeg({ quality: 90 }).toBuffer();
        await sharp({
          create: {
            width: width || 1000,
            height: height || 1000,
            channels: 3,
            background: { r: 255, g: 255, b: 255 }
          }
        })
        .composite([{ input: buffer }])
        .toFormat('pdf')
        .toFile(outputPath);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Unsupported format' 
        });
    }

    // Get file size
    const stats = fs.statSync(outputPath);
    const size = `${(stats.size / 1024).toFixed(2)} KB`;
    const originalSize = `${(req.file.size / 1024).toFixed(2)} KB`;

    res.json({
      success: true,
      message: 'Image converted successfully',
      data: {
        filename: outputFilename,
        format: format.toLowerCase(),
        size: size,
        originalSize: originalSize,
        downloadUrl: `/api/convert/download/${outputFilename}`
      }
    });

  } catch (error: any) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Download endpoint
app.get('/api/convert/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filePath);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`🌐 Accepting requests from: http://localhost:3000`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});