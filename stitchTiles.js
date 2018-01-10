const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { PIXEL_TILE_SIZE } = require('./constants');

const stitchTiles = (allTileData, dirName) => {
    const { width, height } = getCanvasSize(allTileData);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const topLeftTile = allTileData[0];
    const positionedTileData = allTileData.map(tile => Object.assign(tile, {
        canvasX: (tile.x - topLeftTile.x) * PIXEL_TILE_SIZE,
        canvasY: (tile.y - topLeftTile.y) * PIXEL_TILE_SIZE
    }));

    return Promise.all(positionedTileData.map(tile => drawTile(dirName, tile, ctx)))
        .then(results => countErrors(results))
        .then(errorCount => exportImage(errorCount, dirName, canvas));
};

const getCanvasSize = allTileData => {
    const topLeftTile = allTileData[0];
    const bottomRightTile = allTileData[allTileData.length - 1];
    const width = ((bottomRightTile.x - topLeftTile.x) + 1) * PIXEL_TILE_SIZE;
    const height = ((bottomRightTile.y - topLeftTile.y) + 1) * PIXEL_TILE_SIZE;

    return {
        width,
        height
    }
};

const countErrors = results =>
    results.reduce((errorCount, result) => {
        return result instanceof Error ? errorCount + 1 : errorCount;
    }, 0);

const drawTile = (dirName, tile, ctx) => {
    const { z, x, y, canvasX, canvasY } = tile;
    const fileName = `${z}-${x}-${y}`;
    return new Promise(resolve => {
        loadImage(path.resolve(__dirname, `./output/${dirName}/${fileName}.png`)).then((image) => {
            console.info('Image loaded ', `./output/${dirName}/${fileName}.png`);
            ctx.drawImage(image, canvasX, canvasY, PIXEL_TILE_SIZE, PIXEL_TILE_SIZE);
            resolve();
        }).catch(e => {
            console.error(`Failed to load and draw tile image for file ${fileName}`, e);
            resolve(e);
        })
    });
};

const exportImage = (errorCount, dirName, canvas) =>
    new Promise((resolve, reject) => {
        const stream = canvas.pngStream();
        const output = fs.createWriteStream(path.resolve(__dirname, `./output/${dirName}/stitched.png`));

        stream.on('data', chunk => {
            output.write(chunk);
        });

        stream.on('end', () => {
            console.log(`Output ./output/${dirName}/stitched.png generated with ${errorCount} errors`);
            resolve();
        });

        stream.on('error', reject)
    });

module.exports = stitchTiles;