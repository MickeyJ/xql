

export default class Cache{
    data = {};

    get(key){
        return this.data[key];
    }
    set(key, value){
        this.data[key] = value;
    }
    clear(key){
        delete this.data[key];
    }
}
