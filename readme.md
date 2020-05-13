HTTP
---
HTTP工具包，更高效的接口调用方式

### Install
```sh
npm i @4a/http
```

### Usage
接口对象配置详请参照 [``axios.options``](https://github.com/axios/axios#request-config)
```js
const api = {

    user() {
        return {
            url: '/api/user',
            method: 'GET'
        }
    },

    post(data) {
        return {
            url: '/api/post',
            data,
            method: 'POST'
        }
    },
}

module.exports = api
```
```js
const HTTP = require('@4a/http')

/**
 * @param {Object} api 接口配置，必须
 * @param {String | Function} token 可选，推荐
 * @param {String} baseURL 可选，推荐
 * @param {Number} timeout 超时时间，可选，推荐
 * @param {Function} before 请求预处理函数，可选
 * @param {Function} resolver 请求后处理函数，可选，推荐
 */
const http = new HTTP({
    api,
    token,
    baseURL,
    timeout,
    // 可用于添加签名等预处理操作
    before(options) {
        options.params = options.params || {}
        options.params.sign = 1
        return options
    },
    /**
     * 请求后处理
     * @param {Error} err 错误实例
     * @param {Object} response axios响应结果
     * @param {Object} options axios请求参数
     * @param {HTTP} http
     */
    async resolver(err, response, options, http) {
        if (err) {
            // 可在此处执行 错误处理，错误上报 等操作
            console.error('请求异常:', err)
            throw err
        }
        if (response.data && response.data.code !== 0) {
            // 可在此处执行 异常处理，异常上报 等操作
            console.warn('请求异常:', response.data.message)
        }
        return response.data
    }
})
```

### Example
高级操作：token失效，自动刷新，自动重试上次请求
```js
const http = new HTTP({
    api,
    token,
    baseURL,
    timeout,
    async resolver(err, response, options, http) {
        
        // 错误上报
        if (err) {
            action.error(err, {
                action: '请求异常',
                context: options
            })
            throw err
        }

        // 校验token异常
        if ( isTokenError(response.data.code) ) {
            // 刷新token
            await auth.refreshToken()
            // 更新token
            options.headers = http.$auth()
            // 重试上次请求
            return (await axios(options)).data
        }

        // 异常上报
        if (response.data.code !== 0) {
            action.error(null, {
                action: '请求异常',
                context: options,
                key: 'code',
                value: response.data.code,
                message: response.data.message
            })
        }

        return response.data
    }
})
```

#### 请求发起示例
```js
http.user() // 实例方法根据接口配置自动生成
http.post({ title: 'foo', content: 'bar' })
```

### 依赖模块导出
```js
// axios导出
HTTP.axios // 原生axios模块引用

// extend导出
HTTP.extend // 原生extend模块引用
```


#### 关于token
* 这里的token指的是jwt标准的token  
* token参数支持``string``类型和``function``类型  
* 如果配置了token参数则会自动在header里添加token 用于请求某些需要token的api


<br />

> npm test
