import fs from 'fs'
import { v4 as uuid } from 'uuid';

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
        console.log('get users')
    }

    getUser(id, res) {
        res.write(JSON.stringify(users.find(user => user.id === id)));
        res.end();
        console.log('get user ', id)
    }

    createUser(user, res) {
        let newUser = JSON.parse(new TextDecoder().decode(user));

        newUser.id = uuid();
        users.push(newUser);
        console.log(users);
        res.end();
    }

    updateUser(id, user, res) {
        users.find((user, index) => {
            if(user.id === id) {
                users[index] = user;
                return true;
            }

            return false;
        })

        console.log(users);
        res.end();
        console.log('update user ', id, user)
    }

    deleteUser(id, res) {
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
        users = users.slice(0, index - 1).concat(users.slice(index + 1));
        
        console.log(users);
        res.end();
        console.log('delete user ', id)
    }
}