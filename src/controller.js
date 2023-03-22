import fs from 'fs'
import { v4 as uuid, validate } from 'uuid';

let users = [];

function createPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
            resolve(chunk);
        })
    })
}

export default class Controller {
    constructor() {}

    async getMainPage(res) {
        const chunk = await createPromise(fs.createReadStream('./presentation/index.html'))
        res.write(chunk);
        res.end();
    }

    async getScript(res) {
        const chunk = await createPromise(fs.createReadStream('./presentation/script.js'))
        res.write(chunk);
        res.end();
    }

    getUsers(res) {
        res.write(JSON.stringify(users));
        res.end();
    }

    getUser(id, res) {
        if(!validate(id)) {
            res.writeHead(400);
            res.end();
            return;
        }
        const user = JSON.stringify(users.find(user => user.id === id));
        if(user) {
            res.write(user);
        } else {
            res.writeHead(404);
        }
        res.end();
    }

    createUser(user, res) {
        let newUser = JSON.parse(new TextDecoder().decode(user));

        if(!user.username || !user.age || !user.hobbies) {
            res.writeHead(400)
            res.write('Required fields are not filled');
            res.end();
        }

        newUser.id = uuid();
        users.push(newUser);
        res.writeHead(201);
        res.end();
    }

    updateUser(id, user, res) {
        if(!validate(id)) {
            res.writeHead(400);
            res.end();
            return;
        }

        const updatedUser = JSON.parse(new TextDecoder().decode(user));

        if (!users.find((user, index) => {
            if(user.id === id) {
                users[index] = updatedUser;
                return true;
            }

            return false;
        })) {
            res.writeHead(404);
            res.end();
            return;
        }

        res.end();
    }

    deleteUser(id, res) {
        if(!validate(id)) {
            res.writeHead(400);
            res.end();
            return;
        }
        
        const index = users.findIndex((user) => user.id === id);
        if(id === -1) {
            res.writeHead(404);
            res.end();
            return;
        }
        if(id === 0) {
            users = users.slice(1);
            res.end();
            return;
        }
        users = users.slice(0, index).concat(users.slice(index + 1));
        
        res.writeHead(204);
        res.end();
    }
}