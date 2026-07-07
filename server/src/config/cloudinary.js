import { v2 as cloudinary } from 'cloudinary';

let configured = false;

const isPlaceholder = (v) => !v || v.startsWith('your-');

export const getCloudinary = () => {
  if (!configured) {
    const name = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (isPlaceholder(name) || isPlaceholder(key) || isPlaceholder(secret)) {
      return null;
    }
    cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
    configured = true;
  }
  return cloudinary;
};

export default cloudinary;
