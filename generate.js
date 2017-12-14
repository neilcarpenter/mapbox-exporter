#!/usr/bin/env node
const fs = require('fs');
const argv = require('yargs')
    .alias('a', 'access_token')
    .alias('m', 'map_id')
    .alias('n', 'north')
    .alias('e', 'east')
    .alias('s', 'south')
    .alias('w', 'west')
    .alias('z', 'zoom')
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
    argv.zoom,
);

if (!fs.existsSync('./output')) {
    fs.mkdirSync(`./output`);
}

const dirName = Date.now();
fs.mkdirSync(`./output/${dirName}`);

fetchTiles(allTileData, dirName)
    .then(() => stitchTiles(allTileData, dirName))
    .catch(e => console.error('Failed to generate'));
