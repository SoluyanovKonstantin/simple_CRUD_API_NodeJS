import http from 'http';
import Router from './src/routing.js';
import environment from './environments/environment.js';
import { Domain } from 'domain';

const router = new Router();

http.createServer(async (req, res) => {
    const domain = new Domain();

    domain.on('error', (err) => {
        res.writeHead(500, 'Server Error', {'Content-Type': 'text/plain'});
        res.end("Server error: " + err.message);
    })

    domain.add(req);
    domain.add(res);

    domain.run(() => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        router.route(req, res);
    })

}).listen(environment.port, () => {
    console.log("server start at port " + environment.port);
})