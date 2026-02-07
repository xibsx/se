const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const upload = async (filePath, fileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(filePath);
            
            formData.append('reqtype', 'fileupload');
            formData.append('userhash', ''); // Empty for anonymous upload
            formData.append('fileToUpload', fileStream, {
                filename: fileName,
                contentType: 'application/json'
            });

            const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders(),
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (response.data && response.data.includes('https://catbox.moe/')) {
                resolve(response.data.trim());
            } else {
                reject(new Error('Upload failed: ' + response.data));
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { upload };