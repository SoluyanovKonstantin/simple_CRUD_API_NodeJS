export async function makeObjectForRequest(req, res, workerIndex) {
    const options = {
        hostname: 'localhost',
        port: +process.env.PORT + +workerIndex,
        path: req.url,
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        }
    };

    const buff = [];
    let body = await new Promise((res, rej) => {
        req.on('data', (chunk) => {
            buff.push(chunk)
        })
        .on('end', () => {
            const body = Buffer.concat(buff).toString().trim();
            res(body);
        })
    })


    return { options, body }
}

export function createPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
            resolve(chunk);
        })
    })
}