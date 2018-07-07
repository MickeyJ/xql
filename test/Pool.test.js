import {
    expect,
    assert,
} from 'chai'
import faker from 'faker'

import cache from '../services/cache'

import Pool, {
    Query,
    createPool,
} from '../src/Pool'

describe('Pool', () => {

    let pool;

    before((done) => {
      try {
          pool = createPool({
              host     : process.env.LOCAL_HOST,
              user     : process.env.LOCAL_DB_USER,
              password : process.env.LOCAL_DB_PASSWORD,
              database : 'testing',
              multipleStatements: true,
              dateStrings: true,
          });
      } catch(e) {
          return done(e)
      }
      done();
    });

    it('should create a new Pool instance', () => {
        assert.isTrue(pool instanceof Pool);
    });

    describe('Pool.q', () => {

        const queries = {
            insert: {},
            select: {},
        };
        const cacheKey = 'users';

        before((done) => {
            queries.select.users = pool.q('SELECT * FROM users');
            queries.select.user = pool.q('SELECT * FROM users WHERE user_id = ?');
            queries.insert.user = pool.q('INSERT INTO users(user_name) VALUES(?)').clearCache(cacheKey);
            done()
        });

        it('should create new Query instance ', () => {
            assert.isTrue(queries.select.users instanceof Query);
        });

        it('should not cache by default', () => {
            assert.isFalse(queries.select.users.cacheEnabled);
            assert.isNull(queries.select.users.cacheKey);
        });

        it('should run given query and return results (isArray) without cache', async () => {
            try {
                const users = await queries.select.users.exec();
                assert.isArray(users);
                assert.isUndefined(cache[cacheKey]);
            } catch (e) {
                throw(e)
            }
        });

        it('should enable caching', () => {
            queries.select.users.cache(cacheKey);
            assert.isTrue(queries.select.users.cacheEnabled);
            expect(queries.select.users.cacheKey).to.equal(cacheKey);
        });

        it('should set cache', async () => {
            try {
                assert.isUndefined(cache[cacheKey]);
                await queries.select.users.exec();
                assert.isArray(cache[cacheKey]);
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
            assert.isTrue(queries.insert.user.cacheClearEnabled);
            try {
                const result = await queries.insert.user.exec([ faker.name.firstName() ]);
                expect(result.affectedRows).to.equal(1);
                assert.isUndefined(cache[cacheKey]);
                // console.log(await queries.select.users.exec());

            } catch (e) {
                throw(e)
            }
        });

    });

});