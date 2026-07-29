require('dotenv').config({path: '.env.local'});
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'public', 'images', 'event6.png');
const buffer = fs.readFileSync(imagePath);

(async () => {
    try {
        console.log("Config: ", cloudinary.config());
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }).end(buffer);
        });
        console.log("Upload Success!");
        console.log(uploadResult);
    } catch (e) {
        console.error("FULL ERROR:");
        console.dir(e, { depth: null });
    }
})();
