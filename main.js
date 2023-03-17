import http from 'http';
import fs from 'fs';

function createPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
            resolve(chunk);
        })
    })
}

http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

    const filePath = `.${req.url.length > 1 ? '/presentation' + req.url : '/presentation/index.html'}`;
    let chunk;

    switch(req.url) {
        case '/':
            chunk = await createPromise(fs.createReadStream(filePath))
            res.write(chunk);
            res.end();
        case '/script.js':
            chunk = await createPromise(fs.createReadStream(filePath))
            res.write(chunk);
            res.end();
        default:
            res.writeHead(404, 'such request not found')
            res.end();
    }



    req.on('data', (chunk) => {
        console.log(chunk);
    })

}).listen(3000, () => {
    console.log("server start at port 3000");
})