const path = require('path');
const fs = require('fs');

let data = '';


// console.log(__dirname);
const stream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf-8');
stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));

