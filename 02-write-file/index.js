const path = require('path');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
  
fs.open(path.join(__dirname, 'fun.txt'), 'w', (err) => {
    if (!err) {
        console.log('How are you?\n');
    }
    else throw err;
})

rl.on('SIGINT', () => {
    console.log('Have a nice day!');
    rl.close();
})

rl.on('line', (line) => {
    if(line === 'exit') {
        console.log('Have a nice day!');
        rl.close();
    }
    else {
    fs.appendFile(path.join(__dirname, 'fun.txt'), line + '\n', (err) => {
        if (err) throw err;
    })
    console.log('How are you?\n');
    }
})