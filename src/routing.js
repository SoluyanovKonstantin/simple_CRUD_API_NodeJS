import Controller from './controller.js';

export default class Router {
    constructor() {
        this.controller = new Controller();
    }

    async route(req, res) {

        if (req.url === '/') {
            this.controller.getMainPage(res);
        } else if (req.url === 'api/users' && req.method === 'GET') {
            this.controller.getUsers(res);
        } else if (req.url === 'api/users' && req.method === 'POST') {
            this.controller.createUser(req.data);
        } else if (req.url.includes('api/users/') && req.method === 'GET') {
            this.controller.getUser(req.data, res);
        } else if (req.url.includes('api/users/') && req.method === 'PUT') {
            this.controller.updateUser(req.data.id, req.data);
        } else if (req.url.includes('api/users/') && req.method === 'DELETE') {
            this.controller.deleteUser(req.data);
        } else {
            res.writeHead(404, 'such request not found')
            res.end();
        }
    }
}