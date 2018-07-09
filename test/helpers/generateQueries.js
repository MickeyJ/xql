

export default (pool) => ({
    select: {
        users: pool.Q('SELECT * FROM users'),
        user: pool.Q('SELECT * FROM users WHERE user_id = ?'),
    },
    insert: {
        user: pool.Q('INSERT INTO users(user_name) VALUES(?)'),
    }
})
