import http from 'http';
import Router from './src/routing.js';
import { Domain } from 'domain';

import * as dotenv from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'node:os';
import { makeObjectForRequest } from './src/utils.js';

dotenv.config();

const isBalancer = process.env.CLUSTER_API && cluster.isPrimary;
const isWorker = process.env.CLUSTER_API && !cluster.isPrimary;
const numCPUs = cpus().length;

const {default: Controller} = isWorker ? await import('./src/workerController.js') : await import('./src/controller.js');
const controller = new Controller([]);
const router = new Router(controller);

if (!isBalancer) {
    const port = isWorker ? +process.env.PORT + +cluster.worker.process.env.workerIndex + 1 : +process.env.PORT;

    process.on('message', (message) => {
        controller.users = message;
    })

    http.createServer(async (req, res) => {
        const domain = new Domain();

        domain.on('error', (err) => {
            res.writeHead(500, 'Server Error', { 'Content-Type': 'text/plain' });
            res.end("Server error: " + err.message);
        })

        domain.run(() => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            router.route(req, res);
        })

    }).listen(port, () => {
        console.log("server start at port http://localhost:" + port);
    })
}
else {

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({ workerIndex: i });
    }

    cluster.on('message', (worker, message) => {
        for(const id in cluster.workers) {
            cluster.workers[id].send(message);
        }
    })

    let workerIndex = 1;

    http.createServer(async (req, res) => {
        const domain = new Domain();

        domain.on('error', (err) => {
            res.writeHead(500, 'Server Error', { 'Content-Type': 'text/plain' });
            res.end("Server error: " + err.message);
        })

        domain.run(async () => {
            let { options, body } = await makeObjectForRequest(req, res, workerIndex);

            if (workerIndex < numCPUs) {
                workerIndex++;
            } else workerIndex = 1;

            const workerRequest = http.request(options, (workerResolve) => {
                workerResolve.setEncoding('utf-8');

                const buffer = [];
                workerResolve
                    .on('data', (chunk) => {
                        buffer.push(chunk);
                        console.log(chunk)
                    })
                    .on('end', () => {
                        res.writeHead(workerResolve.statusCode, workerResolve.statusMessage);
                        res.write(buffer.join(''));
                        res.end();
                    })
            })

            if (body) workerRequest.write(body);
            workerRequest.end();
        })
    }).listen(process.env.PORT, () => {
        console.log(`Primary server ${process.pid} start at port http://localhost:` + process.env.PORT);
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}