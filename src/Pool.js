import util from 'util'
import { isFunction } from 'lodash'
import _Pool from 'mysql/lib/Pool'
import PoolConfig from 'mysql/lib/PoolConfig';
import Query from './Query'

const cacheClientMethods = [
    'get',
    'set',
    'clear',
];

_Pool.prototype.query = util.promisify(_Pool.prototype.query);

export default class Pool extends _Pool{
    constructor(config, cacheClient){
        super({config: new PoolConfig(config)});

        if(!cacheClient){
            throw(new Error('Pool cacheClient is required'))
        }
        for(const methodKey of cacheClientMethods){
            const method = cacheClient[methodKey];
            if(!isFunction(method)){
                throw(new TypeError(`Pool cacheClient must have the following functions: ["${cacheClientMethods.join('", "')}"]`))
            }
        }
        this.cache = cacheClient;
    }
    Q(string){
        return new Query(this, string);
    }
    transaction(cb){
        return new Promise((resolve, reject) => {
            this.getConnection((connError, connection) => {
                if(connError){
                    reject(connError);
                    return;
                }

                const query = makeQueryPromise(connection);

                connection.beginTransaction(async (e) => {
                    if (e) {
                        connection.release();
                        reject(e);
                        return;
                    }

                    let results;
                    try {
                        results = await cb(query)
                    } catch(e) {
                        connection.rollback(() => {
                            connection.release();
                            reject(e);
                        });
                        return;
                    }

                    connection.commit(function (e) {
                        if (e) {
                            connection.rollback(function () {
                                connection.release();
                                reject(e);
                            });
                            return;
                        }
                        connection.release();
                        resolve(results);
                    });
                })
            })
        })
    }
}
module.exports = Pool;

function makeQueryPromise(connection){
    return function(queryString, inserts){
        return new Promise((resolve, reject) =>{
            connection.query( queryString, inserts, (error, data) =>{
                if(error) return reject(error);
                resolve(data)
            });
        })
    }
}
