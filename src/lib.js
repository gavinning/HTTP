class Lib {

    isString(obj) {
        return 'string' === typeof obj
    }

    isObject(obj) {
        return 'object' === typeof obj
    }

    isFunction(obj) {
        return 'function' === typeof obj
    }

    hasHttpPrefix(uri) {
        return uri.match(/^https?/)
    }

    noHttpPrefix(uri) {
        return !this.hasHttpPrefix(uri)
    }
}

module.exports = new Lib
