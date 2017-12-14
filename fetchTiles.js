const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = (allTileData, dirName) => 
    Promise.all(allTileData.map(tile =>
        new Promise(resolve => {
            fetch(tile.url)
                .then(res => {
                    const { z, x, y } = tile;
                    const fileName = `${z}-${x}-${y}`;
                    const dest = fs.createWriteStream(path.resolve(__dirname, `./output/${dirName}/${fileName}.png`));

                    dest.on('close', () => {
                        resolve();
                        console.info(`Download complete - ${fileName}`)
                    });

                    res.body.pipe(dest);
                })
        })
    ));
