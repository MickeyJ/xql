

module.exports = (pool) => ({
    select: {

        users: pool.Q(`
            SELECT * 
            FROM users;
        `).cache('users'),

        user: pool.Q(`
            SELECT * 
            FROM users 
            WHERE user_id = ?;
        `),

        userPosts: pool.Q(`
            SELECT * 
            FROM posts
            WHERE user_id = ?;
        `),

    },
    insert: {

        user: pool.Q(`
            INSERT INTO 
            users(user_name) 
            VALUES(?)
        `),

        userPost: pool.Q(`
            INSERT INTO 
            posts(user_id, content) 
            VALUES(?, ?)
        `),

    },
});
