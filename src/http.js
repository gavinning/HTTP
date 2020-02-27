const axios = require('axios')
const extend = require('extend')

class HTTP {
    constructor({ baseURL, api, token, timeout = 6000, resolver = () => {} }) {
        Object.defineProperty(this, '$ops', {
            value: { api, token, resolver }
        })
        Object.defineProperty(this, '$axios', {
            value: axios.create({
                baseURL,
                timeout,
                headers: { ...this.$auth() }
            })
        })
        Object.defineProperty(HTTP.prototype, '$extend', { value: extend })
        for (let name in this.$ops.api) {
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

    async $fetch(api, options) {
        options = extend(true, api, options)
        if (!this.$ops.resolver) {
            return this.$axios(options)
        }
        try {
            return this.$ops.resolver(null, await this.$axios(options), options, this)
        }
        catch (err) {
            return this.$ops.resolver(err, null, options, this)
        }
    }
}

HTTP.axios = axios
HTTP.extend = extend

module.exports = HTTP
