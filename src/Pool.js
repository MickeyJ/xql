import util from 'util'
import _Pool from 'mysql/lib/Pool'
import _PoolConfig from 'mysql/lib/PoolConfig'

import {
    cacheSet,
    cacheGet,
    cacheClear,
} from '../services/cache'

export class Query{
    _cacheKey = null;
    _cacheEnabled = false;
    _cacheClearEnabled = false;

    constructor(method){
        this._method = method;
    }


    get cacheKey(){
        return this._cacheKey;
    }
    get cacheEnabled(){
        return this._cacheEnabled;
    }
    get cacheClearEnabled(){
        return this._cacheClearEnabled;
    }


    cache(cacheKey = 'default'){
        this._cacheKey = cacheKey;
        this._cacheEnabled = true;
        return this;
    }
    clearCache(cacheKey){
        this._cacheKey = cacheKey;
        this._cacheClearEnabled = true;
        return this;
    }
    async exec(params){

        // is caching enable?
        if(this._cacheEnabled){
            console.log('Cache Enabled:', this._cacheKey);

            // if there's anything in the cache use it
            const cachedData = cacheGet(this._cacheKey);
            if(cachedData){
                console.log('Found Cache:', this._cacheKey);
                return cachedData;
            }

            // otherwise set the cache
            console.log('Set Cache:', this._cacheKey);
            const result = await this._method(params);
            cacheSet(this._cacheKey, result);
            return result;
        }

        if(this._cacheClearEnabled){
            console.log('Clear Cache:', this._cacheKey);
            cacheClear(this._cacheKey);
        }

        return await this._method(params);
    }

}

_Pool.prototype.query = util.promisify(_Pool.prototype.query);

export default class Pool extends _Pool{
    constructor(config){
        super(config);
    }
    q(string, inserts = null){
        return new Query((params = null) => {
            return this.query(string, params || inserts)
        });
    }
}

export function createPool(config){
    return new Pool({config: new _PoolConfig(config)});
}
