
const cache = {};

export function cacheSet(key, value){
    cache[key] = value;
}

export function cacheGet(key){
    return cache[key];
}

export function cacheClear(key){
    delete cache[key];
}

export default cache