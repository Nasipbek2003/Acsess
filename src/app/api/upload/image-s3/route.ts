import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, AVIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const fileName = `${timestamp}${ext}`;

    let imageUrl: string;

    try {
      // Try S3 first
      console.log('Trying to upload to S3...');
      imageUrl = await uploadToS3(buffer, fileName, file.type);
      console.log('S3 upload successful:', imageUrl);
    } catch (s3Error) {
      console.log('S3 upload failed, falling back to local storage:', s3Error);
      
      // Fallback to local storage
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (mkdirError) {
        console.log('Directory already exists or created');
      }

      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/products/${fileName}`;
      console.log('Local upload successful:', imageUrl);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Изображение успешно загружено'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки изображения: ' + error },
      { status: 500 }
    );
  }
}
