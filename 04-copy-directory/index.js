const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');

fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if(err) throw err;
})

fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if(err) throw err;
    else {
        files.forEach((el) => {
            fs.unlink(path.join(__dirname, 'files-copy', el), (err) => {
                if(err) throw err;
            })
        })
    }
})

async function copyDir() {
    const folder = await readdir(path.join(__dirname, 'files'));

    for (file of folder) {
        const rs = fs.createReadStream(path.join(__dirname, 'files', file));
        const ws = fs.createWriteStream(path.join(__dirname, 'files-copy', file), {flags: 'w+'});
        await pipeline(rs, ws);
        console.log(file + ' copied successfully');
    }
}

copyDir();