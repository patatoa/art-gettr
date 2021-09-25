import { albumGettr, AlbumRequest } from "./albumGettr";

(async () => {
    const request: AlbumRequest = {
        artist: 'The Beatles',
        album: 'Abbey Road'
    };
    await albumGettr(request);
})();