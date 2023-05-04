const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    else {
        files.forEach((el) => {
            if(el.isFile()) {
                let extension = path.extname(path.join(__dirname, 'secret-folder', `${el.name}`));
                fs.stat(path.join(__dirname, 'secret-folder', `${el.name}`), (err, stats) => {
                    if(err) throw err;
                    else console.log(el.name.split('.')[0] + ' - ' + extension.substring(1) + ' - ' + stats['size'] + ' byte');
                })
            }    
        })
    }
})