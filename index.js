#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const argv = require('yargs')
    .alias('a', 'access_token')
    .describe('a', 'Mapbox access token')
    .alias('m', 'map_id')
    .describe('m', 'Mapbox map ID')
    .alias('n', 'north')
    .describe('n', 'Bounding box north latitude')
    .alias('e', 'east')
    .describe('e', 'Bounding box east latitude')
    .alias('s', 'south')
    .describe('s', 'Bounding box south latitude')
    .alias('w', 'west')
    .describe('w', 'Bounding box west latitude')
    .alias('z', 'zoom')
    .describe('z', 'Map zoom level')
    .demandOption(['a', 'm', 'n', 'e', 's', 'w', 'z'])
    .argv

const getTileData = require('./getTileData');
const fetchTiles = require('./fetchTiles');
const stitchTiles = require('./stitchTiles');

const allTileData = getTileData(
    argv.access_token,
    argv.map_id,
    argv.north,
    argv.east,
    argv.south,
    argv.west,
    argv.zoom
);

if (!fs.existsSync(path.resolve(__dirname, './output'))) {
    fs.mkdirSync(path.resolve(__dirname, './output'));
}

const dirName = Date.now();
fs.mkdirSync(path.resolve(__dirname, `./output/${dirName}`));

fetchTiles(allTileData, dirName)
    .catch(e => console.error('Failed to fetch', e))
    .then(() => stitchTiles(allTileData, dirName))
    .catch(e => console.error('Failed to stitch', e));
