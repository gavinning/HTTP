const api = require('./api')
const conf = require('./conf')
const Http = require('../')
const app = require('../test/express')

app.listen(10086)

const http = new Http({
    api,
    token: conf.token,
    baseURL: conf.baseURL,
    async resolver(err, response) {
        if (err) {
            console.log('系统异常[id]:' + err.message)
            throw err
        }
        if (response.data && response.data.code !== 0) {
            console.log('请求异常[id]:' + response.data.message)
        }
        return response.data
    }
})

// 这里拿到的data就是正确的结果
// 异常情况下中间层回调不会执行
// 所有错误异常处理由resolver完成处理
http.user()
    .then(console.log)
    .catch(console.error)
