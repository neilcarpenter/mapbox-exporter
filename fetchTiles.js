const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const promiseLimit = require('promise-limit');

const CONCURRENT_REQUEST_LIMIT = 10;

module.exports = (allTileData, dirName) => {
    const limit = promiseLimit(CONCURRENT_REQUEST_LIMIT);

    return Promise.all(allTileData.map(tile => limit(() =>
        new Promise((resolve, reject) => {
            const { z, x, y } = tile;
            const fileName = `${z}-${x}-${y}`;

            console.info(`Fetching tile - ${fileName}...`)

            fetch(tile.url)
                .then(res => {
                    const dest = fs.createWriteStream(
                        path.resolve(__dirname, `./output/${dirName}/${fileName}.png`)
                    );

                    dest.on('close', () => {
                        resolve();
                        console.info(`...download complete - ${fileName}`)
                    });

                    res.body.pipe(dest);
                })
                .catch(reject)
        }))
    ));
}
