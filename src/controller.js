const users = [];

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
        const chunk = await createPromise(fs.createReadStream('../presentation/index.html'))
        res.write(chunk);
        res.end();
    }

    getUsers(res) {
        console.log('get users')
    }

    getUser(id, res) {
        console.log('get user ', id)
    }

    createUser(user) {
        console.log('create user ', user)
    }

    updateUser(id, user) {
        console.log('update user ', id, user)
    }

    deleteUser(id) {
        console.log('delete user ', id)
    }
}