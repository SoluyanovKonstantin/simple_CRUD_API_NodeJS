import fs from 'fs'
import { v4 as uuid, validate } from 'uuid';
import { createPromise } from './utils.js';

export default class WorkerController {
    constructor(users) {
        this.users = users;
    }

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
        res.write(JSON.stringify(this.users));
        res.end();
    }

    getUser(id, res) {
        if(!validate(id)) {
            res.writeHead(400);
            res.end();
            return;
        }
        const user = JSON.stringify(this.users.find(user => user.id === id));
        if(user) {
            res.write(user);
        } else {
            res.writeHead(404);
        }
        res.end();
    }

    createUser(user, res) {
        let newUser = JSON.parse(new TextDecoder().decode(user));

        if(!newUser.username || !newUser.age || !newUser.hobbies) {
            res.writeHead(400)
            res.write('Required fields are not filled');
            res.end();
        }

        newUser.id = uuid();
        this.users.push(newUser);
        process.send(this.users);
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

        if (!this.users.find((user, index) => {
            if(user.id === id) {
                this.users[index] = updatedUser;
                this.users[index].id = id;
                process.send(this.users);
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
        
        const index = this.users.findIndex((user) => user.id === id);
        if(id === -1) {
            res.writeHead(404);
            res.end();
            return;
        }
        this.users.splice(index, 1);
        process.send(this.users);
        res.writeHead(204);
        res.end();
    }
}