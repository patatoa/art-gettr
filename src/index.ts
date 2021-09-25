import axios from 'axios';

async function downloadImage(url:string, filepath:string): Promise<void> {
    const {Storage} = require('@google-cloud/storage');
    const storage = new Storage();
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    const bucket = storage.bucket('mu-list-album-art-bkt');
    const file = bucket.file(filepath);

    try {
        await response.data.pipe(file.createWriteStream());
    }
    catch (err:any) {
        throw new Error(`Error Saving file to server. Message: ${err.message}`);
    }
}

async function albumGettr(): Promise<string> {
    const albumArt = require('album-art');
    try{
        const albumUrl = await albumArt('Beatles', { album: 'Abbey Road' });
        return albumUrl;
    }
    catch (err:any) {
        throw new Error(`Error finding album art. Message: ${err.message}`);
        
    }
}
(async () => {
    const url:string = await albumGettr();
    await downloadImage(url, 'test12345555.jpg');
})();

