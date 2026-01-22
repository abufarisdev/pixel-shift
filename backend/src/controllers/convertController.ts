import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const convertImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { format, quality } = req.body;
    
    if (!format) {
      return res.status(400).json({ error: 'Format is required' });
    }

    const inputPath = req.file.path;
    const originalFilename = req.file.originalname;
    const filenameWithoutExt = path.parse(originalFilename).name;
    const outputFilename = `${filenameWithoutExt}-converted.${format}`;
    const outputPath = path.join('uploads', outputFilename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Configure conversion options
    let conversionOptions: any = {};

    // Set quality based on format
    if (quality) {
      conversionOptions.quality = parseInt(quality);
    } else {
      // Default quality settings
      switch (format.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
          conversionOptions.quality = 80;
          break;
        case 'png':
          conversionOptions.compressionLevel = 9;
          break;
        case 'webp':
          conversionOptions.quality = 80;
          break;
        case 'pdf':
          conversionOptions.quality = 90;
          break;
      }
    }

    // Convert the image
    const sharpInstance = sharp(inputPath);

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        await sharpInstance
          .jpeg(conversionOptions)
          .toFile(outputPath);
        break;
      
      case 'png':
        await sharpInstance
          .png(conversionOptions)
          .toFile(outputPath);
        break;
      
      case 'webp':
        await sharpInstance
          .webp(conversionOptions)
          .toFile(outputPath);
        break;
      
      case 'pdf':
        // For PDF, we'll create a PDF with the image embedded
        const { width, height } = await sharpInstance.metadata();
        
        await sharpInstance
          .toFormat('jpeg', { quality: conversionOptions.quality })
          .toBuffer()
          .then(buffer => {
            // Create a simple PDF with the image (using sharp's PDF format)
            return sharp({
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
          });
        break;
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);

    // Send response with download URL
    const downloadUrl = `/api/convert/download/${outputFilename}`;

    res.json({
      success: true,
      message: 'Image converted successfully',
      data: {
        filename: outputFilename,
        format: format.toLowerCase(),
        size: `${fileSizeInKB} KB`,
        downloadUrl: downloadUrl,
        originalSize: `${(req.file.size / 1024).toFixed(2)} KB`
      }
    });

  } catch (error: any) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Conversion failed', 
      message: error.message 
    });
  }
};

export const downloadFile = (req: Request, res: Response) => {
  try {
    // Fix: Ensure filename is a string, not an array
    const filename = req.params.filename as string;
    const filePath = path.join(__dirname, '../../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      }
      
      // Optional: Clean up file after download
      // setTimeout(() => {
      //   if (fs.existsSync(filePath)) {
      //     fs.unlinkSync(filePath);
      //     console.log(`Cleaned up file: ${filename}`);
      //   }
      // }, 5000);
    });

  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
};