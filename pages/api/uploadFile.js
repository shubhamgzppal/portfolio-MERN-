// pages/api/uploadFile.js
import formidable from "formidable";
import cloudinary from "../../lib/cloudinary";
import streamifier from "streamifier";
import fs from "fs";

export const config = { api: { bodyParser: false, },};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true, maxFileSize: MAX_FILE_SIZE,});
    form.parse(req, (err, fields, files) => { if (err) reject(err); else resolve({ fields, files }); });
  });

const streamUpload = (buffer, folder, resourceType, transformations = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || "profile/assets", resource_type: resourceType || "auto", ...transformations, },
      (error, result) => { if (result) resolve(result); else reject(error);}
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ success: false, error: "Method not allowed" });}

  try { const { fields, files } = await parseForm(req); const fileObj = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!fileObj || !fileObj.filepath) { return res.status(400).json({ success: false, error: "No file uploaded" });}
    const stats = fs.statSync(fileObj.filepath);
    if (stats.size > MAX_FILE_SIZE) { return res.status(400).json({ success: false, error: "File too large (max 25MB)" });}

    const buffer = fs.readFileSync(fileObj.filepath);

    const fileType = fileObj.mimetype;
    let resourceType = "auto";
    let transformations = {};

    if (fileType.startsWith("image/")) { resourceType = "image"; transformations = { transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" },],};} 
    else if (fileType === "application/pdf") { resourceType = "raw";} 
    else if (fileType.startsWith("video/")) { resourceType = "video";} 
    else { return res.status(400).json({ success: false, error: "Unsupported file type" });}

    const uploadResult = await streamUpload( buffer, "profile/assets", resourceType, transformations );

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      original_filename: uploadResult.original_filename,
      fields,
    });
  } catch (error) { console.error("Upload error:", error); return res.status(500).json({ success: false, error: "Upload failed" });}
}
