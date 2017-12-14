const { RESOLUTION, TILE_SIZE } = require('./constants');

const getTileURL = (accessToken, mapId, z, x, y) =>
    `https://api.mapbox.com/styles/v1/${mapId}/tiles/${TILE_SIZE}/${z}/${x}/${y}${RESOLUTION === 2 ? '@2x' : ''}?access_token=${accessToken}`;

// slippy tile utils from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
const lon2tile = (lon, zoom) =>
    (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));

const lat2tile = (lat, zoom) =>
    (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)))

const getBoundTileSize = (north, east, south, west, zoom) => {
    var top = lat2tile(north, zoom);
    var left = lon2tile(west, zoom);
    var bottom = lat2tile(south, zoom);
    var right = lon2tile(east, zoom);
    var width = Math.abs(left - right) + 1;
    var height = Math.abs(top - bottom) + 1;

    return {
        width,
        height
    };
}

const getAllTileData = (accessToken, mapId, north, east, south, west, z) => {
    const { width, height } = getBoundTileSize(north, east, south, west, z);
    const northWestTile = {
        y: lat2tile(north, z),
        x: lon2tile(west, z)
    };

    const allTileData = [];
    for (i = 0, len = height; i < height; i++) {
        for (j = 0, len2 = width; j < len2; j++) {
            const x = northWestTile.x + j;
            const y = northWestTile.y + i;
            allTileData.push({
                z,
                x,
                y,
                url: getTileURL(accessToken, mapId, z, x, y)
            });
        }
    }

    return allTileData;
}

module.exports = getAllTileData;