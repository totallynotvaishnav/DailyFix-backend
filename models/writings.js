const objectID = require('mongodb').ObjectId;
let posts;

items_per_page = 2;

class Writings {
    constructor(authorId, content) {
        this.authorId = authorId;
        this.content = content;
        this.createdAt = new Date();
    }

    static async injectDB(conn) {
        try {
            posts = await conn.db('dailyfix').collection('entries');
        } catch (e) {
            console.error(`Unable to establish a collection handle : ${e}`);
        }
    }

    static async fetchPosts() {
        try {
            const allPosts = await posts.find().toArray();
            const totalPosts = await posts.countDocuments();
            const result = {
                items: allPosts,
                totalPosts,
            };
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async fetchPostById(id) {
        try {
            const post = await posts.findOne({
                _id: objectID(id),
            });
            return post;
        } catch (error) {
            console.log(error);
        }
    }

    async save() {
        try {
            const post = await posts.insertOne(this);
            return post.ops[0];
        } catch (error) {
            console.log('some error while creating new post');
        }
    }

    static async update(id, updatedPost) {
        try {
            await posts.updateOne(
                {
                    _id: objectID(id),
                },
                { $set: updatedPost }
            );
        } catch (error) {
            console.log('some error while updating posts');
        }
    }

    static async deletePost(id) {
        try {
            const result = await posts.deleteOne({
                _id: objectID(id),
            });
        } catch (error) {
            console.log('some error while deleting post');
        }
    }

    static async fetchPostByUserId(userId) {
        try {
            const items = await posts
                .find(
                    {
                        authorId: userId,
                    },
                    { projection: { author: 0 } }
                )
                .toArray();

            return items;
        } catch (error) {
            console.log('some error while fetching user posts');
        }
    }
}

module.exports = Writings;
