import {
    Cache,
    expect,
    assert,
    generateQueries,
} from 'test-helpers'
import faker from 'faker'

import Pool from '../src/Pool'
import Query from '../src/Query'

describe('Pool', () => {

    let pool;
    const cache = new Cache();

    const cacheKey = 'users';
    let queries;

    before((done) => {
      try {

          pool = new Pool({
              host     : process.env.LOCAL_HOST,
              user     : process.env.LOCAL_DB_USER,
              password : process.env.LOCAL_DB_PASSWORD,
              database : 'testing',
              multipleStatements: true,
              dateStrings: true,
          }, cache);

          queries = generateQueries(pool, cacheKey);

      } catch(e) {
          return done(e)
      }
      done();
    });

    it('should create a new Pool instance', () => {
        assert.isTrue(pool instanceof Pool);
    });

    describe('Pool.cache', () => {

        it('should have cache client get (isFunction)', () => {
            assert.isFunction(pool.cache.get);
        });

        it('should have cache client set (isFunction)', () => {
            assert.isFunction(pool.cache.set);
        });

        it('should have cache client clear (isFunction)', () => {
            assert.isFunction(pool.cache.clear);
        });

        it('should function properly ( get | set | clear )', () => {
            const key = 'test';
            const value = 1;
            pool.cache.set(key, value);
            expect(pool.cache.get(key)).to.equal(value);
            pool.cache.clear(key);
            assert.isUndefined(pool.cache.get(key));
        })

    });

    describe('Pool.q', () => {

        it('should create new Query instance ', () => {
            assert.isTrue(queries.select.users instanceof Query);
        });

        it('should not cache by default', () => {
            assert.isFalse(queries.select.users.cacheEnabled);
            assert.isNull(queries.select.users.cacheKey);
        });

        it('should run given query and return results (isArray) without caching', async () => {
            try {
                const users = await queries.select.users.exec();
                assert.isArray(users);
                assert.isUndefined(cache.get(cacheKey));
            } catch (e) {
                throw(e)
            }
        });

        it('should be able to enable caching', () => {
            queries.select.users.cache(cacheKey);
            assert.isTrue(queries.select.users.cacheEnabled);
            expect(queries.select.users.cacheKey).to.equal(cacheKey);
        });

        it('should set cache', async () => {
            try {
                assert.isUndefined(cache.get(cacheKey));
                await queries.select.users.exec();
                assert.isArray(cache.get(cacheKey));
            } catch (e) {
                throw(e)
            }
        });

        // TODO : how to test if cache was used?
        it('should use cache', async () => {
            try {
                await queries.select.users.exec();
            } catch (e) {
                throw(e)
            }
        });

        it('should be able to clear cache', async () => {
            try {
                const result = await (
                    queries.insert.user
                        .clearCache(cacheKey)
                        .exec(faker.name.firstName())
                );
                expect(result.affectedRows).to.equal(1);
                assert.isUndefined(cache.get(cacheKey));
                // console.log(await queries.select.users.exec());

            } catch (e) {
                throw(e)
            }
        });

    });

    describe('Pool.transaction', () => {

        it('should throw query syntax error and rollback insert', async () => {
            try {
                const previousUsers = await queries.select.users.exec();

                await assert.isRejected(pool.transaction(async (query) => {
                    const results = {};

                    // this insert query is ok...
                    results.insert = await query('insert into users(user_name) values(?)', [ 'nope' ]);

                    // this broken query should cause the transaction to rollback
                    results.users = await query('select *, from users');

                    return results;
                }), Error, 'You have an error in your SQL syntax');

                const nextUsers = await queries.select.users.exec();

                // the insert was rolled back :)
                expect(previousUsers.length).to.equal(nextUsers.length);

            } catch(e) {
                throw(e)
            }
        });


        it('should execute correctly?', async () => {

            try {

                const previousUsers = await queries.select.users.exec();

                const results = await pool.transaction( async (query) => {
                    const results = {};

                    // this insert query is ok...
                    results.insert = await query('insert into users(user_name) values(?)', [ faker.name.firstName() ]);

                    // this broken query should cause the transaction to rollback
                    results.users = await query('select * from users');

                    return results;
                });

                expect(results.insert.affectedRows).to.equal(1);
                expect(results.users.length).to.be.gt(previousUsers.length);

            } catch(e) {
                throw(e);
            }

        })

    })

});
