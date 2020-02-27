HTTP
---
HTTP工具包，更高效的接口调用方式

### 安装
```sh
npm i @4a/http
```

### 接口配置示例
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

### 使用示例
```js
const HTTP = require('@4a/http')

/**
 * @param {Object} api 接口配置，必须
 * @param {String | Function} token 可选，推荐
 * @param {String} baseURL 可选，推荐
 * @param {Number} timeout 超时时间，可选，推荐
 * @param {Function} resolver 请求处理中间件，可选，推荐
 */
const http = new HTTP({
    api,
    token,
    baseURL,
    timeout,
    /**
     * 中间处理层
     * @param {Error} err 错误实例
     * @param {Object} result axios响应结果
     * @param {Object} options axios请求参数
     * @param {HTTP} http
     */
    async resolver(err, result, options, http) {
        if (err) {
            // 可在此处执行 错误处理，错误上报 等操作
            console.error('请求异常:', err)
            throw err
        }
        if (result.data && result.data.code !== 0) {
            // 可在此处执行 异常处理，异常上报 等操作
            console.warn('请求异常:', result.data.message)
        }
        return result.data
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
http.$axios // axios实例，baseURL、timeout、token配置在该实例有效

// extend导出
HTTP.extend // 原生extend模块引用
http.$extend // 原生extend模块引用
```


#### 关于token
* 这里的token指的是jwt标准的token  
* token参数支持``string``类型和``function``类型  
* 如果配置了token参数则会自动在header里添加token 用于请求某些需要token的api


<br />

> npm test
