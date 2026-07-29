const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLOUD_NAME = 'xphsifzn';
const API_KEY = '818644847141857';
const API_SECRET = '-pWSvtuyuDhnIdgDc38QNvNb2j8';

const imagePath = path.join(__dirname, 'public', 'images', 'event6.png');
const fileBuffer = fs.readFileSync(imagePath);

const timestamp = Math.round(new Date().getTime() / 1000);
const folder = 'DevEvent';

// Cloudinary signature is created by signing all parameters sorted alphabetically, excluding file, api_key, resource_type, signature.
// Parameter string to sign: folder=DevEvent&timestamp=XXX
const signatureString = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

const FormData = require('form-data'); // Cloudinary SDK uses form-data or similar under the hood. Since form-data might not be installed, we can just use native fetch with a multipart boundary or standard JS FormData.
// Wait, Node.js 18+ has a native FormData class. Let's use it.

(async () => {
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, { filename: 'event6.png', contentType: 'image/png' });
        formData.append('api_key', API_KEY);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders ? formData.getHeaders() : {}
        });

        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("Headers:", Object.fromEntries(response.headers.entries()));
        
        const bodyText = await response.text();
        console.log("Body:", bodyText);
    } catch (e) {
        console.error("Fetch error:", e);
    }
})();
