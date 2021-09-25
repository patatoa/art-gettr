import fs from 'fs';
import axios from 'axios';

async function downloadImage(url:string, filepath:string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath)); 
    });
}

async function albumGettr(): Promise<string> {
    const albumArt = require('album-art');
    // Download the url to a file
    const albumUrl = await albumArt('Beatles', { album: 'Abbey Road' });
    return albumUrl;
}
(async () => {
    const url:string = await albumGettr();
    downloadImage(url, './test.jpg');
})();

