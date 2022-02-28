const objectID = require('mongodb').ObjectId;

let users;

class Users {
    constructor(email, password, name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

    static async injectDB(conn) {
        try {
            users = await conn.db('dailyfix').collection('users');
        } catch (e) {
            console.error(`Unable to establish a collection handle : ${e}`);
        }
    }

    async save() {
        try {
            await users.insertOne(this);
        } catch (error) {
            console.log('some error while creating new post');
        }
    }

    static async findUserByEmail(email) {
        try {
            const result = await users.findOne({ email: email });
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    static async getUserName(userId) {
        try {
            const name = await users.findOne(
                {
                    _id: objectID(userId),
                },
                { projection: { name: 1, _id: 0 } }
            );

            return name;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Users;
