export default class Router {
    constructor(controller) {
        this.controller = controller;
    }

    async route(req, res) {

        if (req.url === '/') {
            this.controller.getMainPage(res);
        } else if(req.url === '/script.js') {
            this.controller.getScript(res);
        } else if (req.url === '/api/users' && req.method === 'GET') {
            this.controller.getUsers(res);
        } else if (req.url === '/api/users' && req.method === 'POST') {
            req.on('data', (chunk) => {
                this.controller.createUser(chunk, res);
            })
        } else if (req.url.includes('/api/users/') && req.method === 'GET') {
            const id = req.url.split('/')[req.url.split('/').length - 1];
            this.controller.getUser(id, res);

        } else if (req.url.includes('/api/users/') && req.method === 'PUT') {
            const id = req.url.split('/')[req.url.split('/').length - 1];
            req.on('data', (chunk) => {
                this.controller.updateUser(id, chunk, res);
            })
        } else if (req.url.includes('/api/users/') && req.method === 'DELETE') {
            const id = req.url.split('/')[req.url.split('/').length - 1];
            this.controller.deleteUser(id, res);
        } else if(req.url === '/api/500') {
            throw new Error('500');
        }
        else {
            res.writeHead(404, '');
            res.write('Such resource not found');
            res.end();
        }
    }
}