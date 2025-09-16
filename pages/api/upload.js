import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_.-]/gi, '_');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.multiples = false;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('formidable parse error', err);
      return res.status(500).json({ success: false, error: 'Error parsing form' });
    }

    try {
      const file = files.file;
      if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
      if (!fs.existsSync(publicAssetsDir)) {
        fs.mkdirSync(publicAssetsDir, { recursive: true });
      }

      const originalName = Array.isArray(file) ? file[0].name : file.name;
      const safeName = sanitizeFilename(originalName);

      const tempPath = Array.isArray(file) ? file[0].path : file.path;
      const destPath = path.join(publicAssetsDir, safeName);

      await fs.promises.rename(tempPath, destPath);

      return res.status(200).json({ success: true, message: 'Uploaded', filename: `/assets/${safeName}`, fields });
    } catch (e) {
      console.error('upload error', e);
      return res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });
}
// netlify/functions/upload.js
import { Buffer } from 'buffer';
import parseMultipart from 'parse-multipart-data';
import pdf from 'pdf-extraction';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (!contentType.startsWith('multipart/form-data')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Expected multipart/form-data' }),
      };
    }

    const boundary = parseMultipart.getBoundary(contentType);
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    const parts = parseMultipart.parse(bodyBuffer, boundary);

    const file = parts.find(p => p.filename);
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'No file uploaded' }),
      };
    }

    const data = await pdf(file.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, text: data.text }),
    };

  } catch (error) {
    console.error('Upload handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to parse PDF.' }),
    };
  }
}
