// const { size } = require('lodash');

const {
    pool,
    queries: db,
} = require('./db');

const cacheKeys = {
    user: (user_id) => `user_${user_id}`,
    posts: (user_id) => `user_post_${user_id}`,
};

const url = 'http://localhost:3000';

module.exports = (api) => {

    api.use((req, res, next) => {
        const cacheMap = {};

        Object.keys(pool.cache.data).forEach(key => {
            cacheMap[key] = pool.cache.data[key].length
        });

        console.log(JSON.stringify(
            cacheMap,
            null,
            2
        ));
        next();
    });


    api.get('/users', async (req, res) => {

        const users = await db.select.users.exec();

        const userData = users.map(user => {
            return {
                ...user,
                link: `${url}/user/${user.user_id}`,
            }
        });

        res.send(userData);
    });


    api.get('/user/:user_id', async (req, res) => {

        const { user_id } = req.params;

        const results = await db.select.user.exec(user_id);

        if(!results[0]){
            return res.status(400).send(`User not found by id: ${user_id}`);
        }

        const user = results[0];

        user.posts = await (
            db.select.userPosts
                .cache(cacheKeys.posts(user_id))
                .exec(user_id)
        );

        // console.log(pool.cache.get(cacheKey));

        res.status(200).send({
            back: `${url}/users`,
            add_post: `${url}/add/user/${user_id}/post?content=post ${user.posts.length + 1}`,
            user,
        })
    });


    api.get('/add/user', async (req, res, next) => {

        const { name } = req.query;

        if(!name){
            return res.status(400).send('missing required query "name"');
        }

        let result;
        try {
            result = await (
                db.insert.user
                    .clearCache('users')
                    .exec(name)
            );
        } catch(e) {
            res.status(400);
            e.status = 400;
            return next(e);
        }

        res.redirect(`${url}/user/${result.insertId}`)
    });


    api.get('/add/user/:user_id/post', async (req, res, next) => {

        const { user_id } = req.params;
        const { content } = req.query;

        if(!content){
            return res.status(400).send('missing required query "content"');
        }

        const userResults = await db.select.user.exec(user_id);

        if(!userResults[0]){
            return res.status(400).send(`User not found by id: ${user_id}`);
        }

        try {
            await (
                db.insert.userPost
                    .clearCache(cacheKeys.posts(user_id))
                    .exec(user_id, content)
            );
        } catch(e) {
            res.status(400);
            e.status = 400;
            return next(e);
        }

        res.redirect(`${url}/user/${user_id}`)
    })


};
