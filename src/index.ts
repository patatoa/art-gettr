import axios from 'axios';
import AlbumRequest from './albumRequest';

async function downloadImage(url:string, filepath:string): Promise<string> {
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
    return file.publicUrl();
}

async function albumGettr(request: AlbumRequest): Promise<string> {
    const albumArt = require('album-art');
    try{
        const albumUrl = await albumArt(request.artist, { album: request.album});
        return albumUrl;
    }
    catch (err:any) {
        throw new Error(`Error finding album art. Message: ${err.message}`);
        
    }
}
(async () => {
    const url:string = await albumGettr({artist: 'The Beatles', album: 'Abbey Road'});
    const ourUrl = await downloadImage(url, 'test12345555.jpg');
})();

