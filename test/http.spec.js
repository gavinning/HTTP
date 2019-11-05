const Http = require('../')
const app = require('./express')
const assert = require('assert')

describe('Class Http function test', () => {

    before(() => {
        app.listen(10086)
    })

    after(() => {
        process.exit(0)
    })

    const api = {
        // 查询用户信息
        user(params) {
            return {
                url: '/api/user',
                params,
                method: 'GET'
            }
        }
    }

    const http = new Http({
        api,
        token: '123',
        baseURL: 'http://localhost:10086',
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

    it('$urlPath test 1', () => {
        let url = '/api/check'
        let ret = http.$urlPatch(url)
        assert.equal(ret, 'http://localhost:10086/api/check')
    })

    it('$urlPath test 2', () => {
        let ops = { url: '/api/check' }
        let ret = http.$urlPatch(ops)
        assert.equal(ret.url, 'http://localhost:10086/api/check')
    })

    it('$authPatch test 1', () => {
        let ops = { headers: { a: 1 } }
        let ret = http.$authPatch(ops)
        assert.equal(ret.headers.a, 1)
        assert.equal(ret.headers.Authorization, 'Bearer 123')
    })

    it('$authPatch test 2', () => {
        const http2 = new Http({ token: () => '123' })
        let ops = { headers: { a: 1 } }
        let ret = http2.$authPatch(ops)
        assert.equal(ret.headers.a, 1)
        assert.equal(ret.headers.Authorization, 'Bearer 123')
    })

    it('api test', async () => {
        const data = await http.api('user', { foo: 'bar' })
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.name, 'gavinning')
        assert.equal(data.data.foo, 'bar')
    })

    it('get test', async () => {
        const data = await http.get('/api/user', { params: { foo: 'bar' } })
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.name, 'gavinning')
        assert.equal(data.data.foo, 'bar')
    })

    it('post test', async () => {
        const data = await http.post('/api/user', { foo: 'bar1' })
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.name, 'gavinning')
        assert.equal(data.data.foo, 'bar1')
    })

    it('fetch test', async () => {
        const data = await http.fetch({
            url: '/api/user',
            data: { foo: 'bar2' },
            method: 'POST'
        })
        assert.equal(data.code, 0)
        assert.equal(data.message, 'ok')
        assert.equal(data.data.name, 'gavinning')
        assert.equal(data.data.foo, 'bar2')
    })

    it('auto test', async () => {
        assert.equal(http.$auto, true)
        http.auto()
        assert.equal(http.$auto, false)
        http.auto(true)
        assert.equal(http.$auto, true)
        http.auto(false)
        assert.equal(http.$auto, false)
    })
})
