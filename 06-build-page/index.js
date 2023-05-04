const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');
const { pipeline } = require('stream/promises');

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
    if(err) throw err;
})

fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', async(err, data) => {
    if(err) throw err;
    else {
        const allComponents = await readdir(path.join(__dirname, 'components'), {withFileTypes: true});
        let temp;
        let newTemp;
        allComponents.forEach((el) => {
            fs.readFile(path.join(__dirname, 'components', `${el.name}`), 'utf-8', (err, file) => {
                if(err) throw err;
                else {
                    if(temp === undefined) {
                        temp = data.replace(`{{${el.name.slice(0, -5)}}}`, file);
                        fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), temp, 'utf-8', (err) => {
                            if(err) throw err;
                        })
                    }
                    else {
                        temp = newTemp.replace(`{{${el.name.slice(0, -5)}}}`, file);
                        fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), temp, 'utf-8', (err) => {
                            if(err) throw err;
                        })
                    }
                    newTemp = temp;
                }
            })
        })
    }
})

fs.access(path.join(__dirname, 'project-dist', 'style.css'), (err) => {
    if(err);
    else fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), (err) => {
        if(err) throw err;
    })
})

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    else {
        files.forEach((el) => {
            if(el.isFile()) {
                let extension = path.extname(path.join(__dirname, 'styles', `${el.name}`));
                if(extension === '.css') {
                    fs.open(path.join(__dirname, 'project-dist', 'style.css'), 'w', (err) => {
                        if(err) throw err;
                    })
                    fs.readFile(path.join(__dirname, 'styles', `${el.name}`), (err, data) => {
                        if(err) throw err;
                        else {
                            fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), data + '\n', (err) => {
                                if(err) throw err;
                            })
                        }
                    })
                }
            }
        })
    }    
})

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, (err) => {
    if(err) throw err;
})

fs.readdir(path.join(__dirname, 'project-dist', 'assets'), (err, files) => {
    if(err) throw err;
    else {
        files.forEach((el) => {
            fs.readdir(path.join(__dirname, 'project-dist', 'assets', el), (err, items) => {
                if(err) throw err;
                else {
                    items.forEach((element) => {
                        fs.unlink(path.join(__dirname, 'project-dist', 'assets', el, element), (err) => {
                            if(err) throw err;
                        })
                    })
                }
            })
        })
    }
})

async function copyDir() {
    const folder = await readdir(path.join(__dirname, 'assets'), {withFileTypes: true});

    for (file of folder) {
        if(file.isFile()) {
        const rs = fs.createReadStream(path.join(__dirname, 'assets', `${file.name}`));
        const ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'assets', `${file.name}`), {flags: 'w+'});
        await pipeline(rs, ws);
        }

        else {
            fs.mkdir(path.join(__dirname, 'project-dist', 'assets', `${file.name}`), {recursive: true}, (err) => {
                if(err) throw err;
            })

            const innerFolder = await readdir(path.join(__dirname, 'assets', `${file.name}`), {withFileTypes: true});

            for (el of innerFolder) {
                const reads = fs.createReadStream(path.join(__dirname, 'assets', `${file.name}`, `${el.name}`));
                const writes = fs.createWriteStream(path.join(__dirname, 'project-dist', 'assets', `${file.name}`, `${el.name}`), {flags: 'w+'});
                await pipeline(reads, writes);
            }
        }
    }
}

copyDir();