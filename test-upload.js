require('dotenv').config({path: '.env.local'});
const cloudinary = require('cloudinary').v2;
const buffer = Buffer.from('dummy text file content just to test upload stream');

(async () => {
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'raw', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }).end(buffer);
        });
        console.log(uploadResult);
    } catch (e) {
        console.error("FULL ERROR:");
        console.dir(e, { depth: null });
    }
})();
