# Mapbox static map exporter

Uses Mapbox [raster tile endpoint](https://www.mapbox.com/api-documentation/?language=cURL#retrieve-raster-tiles-from-styles) to generate static map based on OpenStreetMap [slippy map tiles](http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames), using [node canvas](https://github.com/Automattic/node-canvas) for image generation. Maps style is determined by [Mapbox map ID](https://www.mapbox.com/help/define-map-id/).

Note - this most likely shouldn't be used for commercial purposes with crediting Mapbox / OpenStreetMap, I'm not sure...

## Install:
1. Follow [node-canvas installation instructions](https://github.com/Automattic/node-canvas#installation)
2. `$ npm i`

## Usage:
```bash
$ ./index.js [options]

Options:
  -a, --access_token    Mapbox access token
  -m, --map_id          Mapbox map ID
  -n, --north           Bounding box north latitude
  -e, --east            Bounding box east latitude
  -s, --south           Bounding box south latitude
  -w, --west            Bounding box west latitude
  -z, --zoom            Map zoom level
```

## Example:
```bash
$ ./index.js --map_id=mapbox/streets-v10 --access_token=abcde --north=51.581589916190374 --east=-0.1105499267578125 --south=51.52181527709107 --west=-0.17578125 --zoom=15
```

This exports all tiles for the given area, as well as a stitched end results in a timestamped directory inside `./output/`.