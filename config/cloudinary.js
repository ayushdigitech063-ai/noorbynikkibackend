require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = (fileBuffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    
    const urlParts = imageUrl.split('/');
    const fileNameWithExt = urlParts.pop();
    const fileName = fileNameWithExt.split('.')[0];

    
    const uploadIndex = urlParts.indexOf('upload');
    const folderPath = urlParts.slice(uploadIndex + 2).join('/');

    const publicId = folderPath ? `${folderPath}/${fileName}` : fileName;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary asset deletion error:', error.message);
  }
};



module.exports = { cloudinary, uploadToCloudinary,deleteFromCloudinary };