const path = require('path');
const fs = require('fs');


fs.access(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
    if(err);
    else fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
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
                    fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w', (err) => {
                        if(err) throw err;
                    })
                    fs.readFile(path.join(__dirname, 'styles', `${el.name}`), (err, data) => {
                        if(err) throw err;
                        else {
                            fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data + '\n', (err) => {
                                if(err) throw err;
                            })
                        }
                    })
                }
            }
        })
    }    
})