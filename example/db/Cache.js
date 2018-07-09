const {
    size,
    isObject,
} = require('lodash');


function Cache(){
    this.data = {};
}

Cache.prototype.get = function(key){
    return this.data[key];
};

Cache.prototype.set = function(key, value){
    if(!shouldSetCache(value)) return;
    this.data[key] = value;
};

Cache.prototype.clear = function(key){
    delete this.data[key];
};

module.exports = Cache;

function shouldSetCache(value){

    if(Array.isArray(value)){
        if(!value.length) return false;
    }
    if(isObject(value)){
        if(!size(value)) return false;
    }
    if(value === 0) return false;

    return true;
}
