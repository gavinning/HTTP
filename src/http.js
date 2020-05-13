const axios = require('axios')
const extend = require('extend')

class HTTP {
    constructor({ baseURL, api, token, timeout = 10000, before, resolver }) {

        // 请求预处理
        before = before || function before(options) { return options }

        // 请求后处理
        resolver = resolver || function resolver(err, response) { return err ? console.error(err) : response.data }

        Object.defineProperty(this, '$ops', {
            value: { baseURL, api, token, timeout, before, resolver }
        })

        // HTTP实例自动创建api所有方法
        for (let name in this.$ops.api) {

            // 自动创建的api方法
            // 第一个参数固定为数据参数，将会被透传给api对应的同名方法
            // 第二个参数为axios的options对象，可选，允许为空
            Object.defineProperty(this, name, {
                value: (data, options) => {
                    return this.$fetch(this.$ops.api[name](data), options)
                }
            })
        }
    }

    $auth() {
        if ('string' === typeof this.$ops.token) {
            return { Authorization: 'Bearer ' + this.$ops.token }
        }
        else if ('function' === typeof this.$ops.token) {
            return { Authorization: 'Bearer ' + this.$ops.token() }
        }
        return {}
    }

    $appendToken(options) {
        if (!options.headers) {
            options.headers = {}
        }
        if (!options.headers.Authorization) {
            options.headers.Authorization = this.$auth().Authorization
        }
        return options
    }

    async $fetch(api, options) {
        
        // 写入Token
        api = this.$appendToken(api)

        // 写入baseURL，api内配置优先级更高
        api.baseURL = api.baseURL || this.$ops.baseURL

        // 写入timeout，api内配置优先级更高
        api.timeout = api.timeout || this.$ops.timeout

        // 合并接口调用时传入的高优先级附加options
        options = extend(true, api, options || {})

        // 执行请求发送之前预处理函数
        options = this.$ops.before(options) || options

        try {
            return this.$ops.resolver(null, await axios(options), options, this)
        }
        catch (err) {
            return this.$ops.resolver(err, null, options, this)
        }
    }
}

HTTP.axios = axios
HTTP.extend = extend

module.exports = HTTP
