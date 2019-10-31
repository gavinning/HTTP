Http
---
通用API请求封装

### Install
依赖``axios``，请自行安装
```sh
npm i axios @gavinning/http
```

### Usage
```js
const Http = require('@gavinning/http')

const http = new Http({
    api, // 可选
    token, // 可选
    baseURL, // 可选
    // 中间处理层
    // 可将所有公共处理、异常处理放在这里处理
    // 例如普通请求上报，异常上报，异常提醒等等
    async resolver(err, response) {
        if (err) {
            return console.log('系统异常[id]:' + err.message)
        }
        if (response.data && response.data.code !== 0) {
            return console.log('请求异常[id]:' + response.data.message)
        }
        return response.data
    }
})
```
发起请求
```js
// 正常分类请求
// options参见axios:options
http.get(url, options)
http.put(url, data, options)
http.post(url, data, options)
// 综合请求
http.fetch(options)

// 如果设置api参数配置，可使用api方法进行快捷请求
// 假设某api配置name为user 则可以类似这样进行请求 不支持options
http.api('user', data)
```


#### 关于token
* 这里的token指的是jwt标准的token  
* token参数支持``string``类型和``function``类型  
* 如果配置了token参数则会自动在header里添加token 用于请求某些需要token的api


<br />

> npm test
