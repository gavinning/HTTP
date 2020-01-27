const axios = require('axios')
const lib = require('./lib')

class Http {
    constructor(ops = { baseURL, api, timeout, token, resolver }) {
        this.ops = ops
        this.ops.resolver = ops.resolver || (() => {})
        this.$auto = true
    }

    api(name, data) {
        if (!this.ops.api) {
            throw new Error('没有初始化api配置')
        }
        if (!this.ops.api[name]) {
            throw new Error(`没有找到${name}的api配置`)
        }
        return this.fetch(this.ops.api[name](data))
    }

    auto(arg) {
        this.$auto = arg ? true : false
        return this
    }

    get(url, options = {}) {
        options.url = url
        options.method = 'GET'
        return this.fetch(options)
    }

    put(url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'PUT'
        return this.fetch(options)
    }

    post(url, data, options = {}) {
        options.url = url
        options.data = data
        options.method = 'POST'
        return this.fetch(options)
    }

    async fetch(options) {
        options = this.$patch(options)
        if (!this.ops.resolver) {
            return axios(options)
        }
        try {
            // @resolver
            // @param {Object} err 错误实例
            // @param {Object} response axios响应
            // @param {Object} options axios请求参数
            // @param {Object} http Http实例
            return this.ops.resolver(null, await axios(options), options, this)
        }
        catch(err) {
            return this.ops.resolver(err, null, options, this)
        }
    }

    $patch(options) {
        options = this.$authPatch(options)
        options.timeout = options.timeout || this.ops.timeout || 5000
        this.ops.baseURL && (options.baseURL = this.ops.baseURL)
        return options
    }

    $urlPatch(uri) {
        if (lib.isString(uri) && lib.noHttpPrefix(uri)) {
            uri = this.ops.baseURL + uri
        }
        else if (lib.isObject(uri) && lib.noHttpPrefix(uri.url)) {
            uri.url = this.$urlPatch(uri.url)
        }
        return uri
    }

    $authPatch(options) {
        if (lib.isString(this.ops.token)) {
            options.headers = Object.assign({}, options.headers, {
                Authorization: 'Bearer ' + this.ops.token
            })
        }
        else if (lib.isFunction(this.ops.token)) {
            options.headers = Object.assign({}, options.headers, {
                Authorization: 'Bearer ' + this.ops.token()
            })
        }
        return options
    }
}

module.exports = Http
