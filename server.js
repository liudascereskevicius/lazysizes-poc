// server
const compression = require('compression');
const express = require('express');
const path = require('path');

const app = express();
app.use(compression());

app.get('/:image', (req, res) => {

    let { w, h, f } = req.query;
    w = w ? parseInt(w) : undefined;
    h = h ? parseInt(h) : undefined;

    res.type(`image/${f || 'png'}`);

    const imagePath = path.join('images', req.params.image);
    resize(imagePath, f, w, h)
        .pipe(res);
});

app.listen(3000, () => {
    console.log(`Server started!`);
});

// resize
const fs = require('fs');
const sharp = require('sharp');

function resize(path, format, width, height) {

    const readStream = fs.createReadStream(path);
    let transform = sharp();

    if (format) {
        transform = transform.toFormat(format);
    }

    if (width || height) {
        transform = transform.resize(width, height);
    }

    return readStream.pipe(transform);
};
