import http from 'http';
import Router from './src/routing.js'

const router = new Router();

http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    router.route(req, res);

}).listen(3000, () => {
    console.log("server start at port 3000");
})