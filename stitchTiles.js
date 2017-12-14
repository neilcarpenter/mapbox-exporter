const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
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

    Promise.all(positionedTileData.map(tile => drawTile(dirName, tile, ctx)))
        .then(() => exportImage(dirName, canvas))
        .catch(e => console.error('Failed to generate image', e));
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

const drawTile = (dirName, tile, ctx) => {
    const { z, x, y, canvasX, canvasY } = tile;
    return new Promise(resolve => {
        loadImage(`./output/${dirName}/${z}-${x}-${y}.png`).then((image) => {
            console.info('Image loaded ', `./output/${dirName}/${z}-${x}-${y}.png`);
            ctx.drawImage(image, canvasX, canvasY, PIXEL_TILE_SIZE, PIXEL_TILE_SIZE);
            resolve();
        }).catch(e => console.error('Failed to load and draw tile image', e))
    });
};

const exportImage = (dirName, canvas) => {
    const stream = canvas.pngStream();
    const output = fs.createWriteStream(`./output/${dirName}/stitched.png`);

    stream.on('data', (chunk) => {
        output.write(chunk);
    });

    stream.on('end', () => {
        console.log('Output successfully generated');
    });
};

module.exports = stitchTiles;