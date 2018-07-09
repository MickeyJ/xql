
export default class Query{
    _cacheKey = null;
    _cacheEnabled = false;
    _cacheClearEnabled = false;

    constructor(pool, string){
        this._pool = pool;
        this._string = string;
    }

    get pool(){
        return this._pool;
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

    async query(){
        // console.log('running a query');
        return await this.pool.query.apply(this.pool, arguments)
    }

    cache(cacheKey = 'default'){
        if(this._cacheKey !== cacheKey){
            this._cacheKey = cacheKey;
            this._cacheEnabled = true;
        }
        return this;
    }
    clearCache(cacheKey){
        this.pool.cache.clear(cacheKey);
        return this;
    }
    async exec(...args){

        // is caching enable?
        if(this._cacheEnabled){

            // if there's anything in the cache use it
            const cachedData = this.pool.cache.get(this._cacheKey);
            if(cachedData){
                return cachedData;
            }

            // otherwise set the cache
            const result = await this.query(this._string, args);
            this.pool.cache.set(this._cacheKey, result);
            return result;
        }

        if(this._cacheClearEnabled){
            this.pool.cache.clear(this._cacheKey);
        }

        return await this.query(this._string, args);
    }

}
module.exports = Query;
