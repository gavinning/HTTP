const Http = require('../')
const app = require('./express')
const assert = require('assert')

describe('Class Http function test', () => {

    before(() => {
        app.listen(10088)
    })

    after(() => {
        process.exit(0)
    })

    const api = {
        user(params) {
            return {
                url: '/api/user',
                params,
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

    const http = new Http({
        api,
        token: '123',
        baseURL: 'http://localhost:10088',
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

    it('GET user test', async () => {
        const data = await http.user({ foo: 'bar' })
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.name, 'gavinning')
        assert.equal(data.data.foo, 'bar')
    })

    it('POST post test', async () => {
        const post = { title: '文章标题', content: '文章内容' }
        const data = await http.post(post)
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.title, post.title)
        assert.equal(data.data.content, post.content)
    })
})
