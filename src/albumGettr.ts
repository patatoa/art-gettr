import axios from 'axios';
import AlbumRecord from './albumRecord';
import AlbumRequest from './albumRequest';

async function downloadImage(url:string, filepath:string): Promise<string> {
    const {Storage} = require('@google-cloud/storage');
    const storage = new Storage();
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    const bucket = storage.bucket(process.env.GOOGLE_BUCKET_ID);
    const file = bucket.file(filepath);

    try {
        await response.data.pipe(file.createWriteStream());
    }
    catch (err:any) {
        throw new Error(`Error Saving file to server. Message: ${err.message}`);
    }
    return file.publicUrl();
}
async function saveToDb(request: AlbumRecord): Promise<void> {
    const Firestore = require('@google-cloud/firestore');

    const db = new Firestore({
        projectId: process.env.GOOGLE_PROJECT_ID,
    });
    const docRef = db.collection('album').doc();
    try {
        await docRef.set(request);
    }
    catch (err:any) {
        throw new Error(`Error Saving to DB. Message: ${err.message}`);
    }
}
async function getAlbumArt(request: AlbumRequest): Promise<string> {
    const albumArt = require('album-art');
    try{
        const albumUrl = await albumArt(request.artist, { album: request.album});
        return albumUrl;
    }
    catch (err:any) {
        throw new Error(`Error finding album art. Message: ${err.message}`);
        
    }
}
async function albumGettr(request: AlbumRequest): Promise<boolean> {
    const url:string = await getAlbumArt(request);
    const filepath:string = `${request.artist}-${request.album}-${Math.floor(Math.random() * 100000)}.jpg`;

    const ourUrl = await downloadImage(url, filepath);
    const record: AlbumRecord = {
        artist: request.artist,
        album: request.album,
        year: request.year,
        imagePath: ourUrl
    };
    await saveToDb(record);
    return true;
}

export {albumGettr, AlbumRecord, AlbumRequest};

