import request from 'supertest'
import nock from 'nock'
import missingAccountInfo from './fixtures/missingAccountInfo.json'
import mockGlobalConfigAccountInfo from './fixtures/globalConfigAccountInfo.json'
import mockGlobalConfig from './fixtures/globalConfig.json'
import mockInitGlobalConfigInfo from './fixtures/initGlobalConfigInfo.json'
import mockInitGlobalConfig from './fixtures/initGlobalConfig.json'
import { app } from '../../src/app'
import { rpcUrl } from '../../src/service/env'

describe('Test Fetch Controller', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jest.spyOn adds this functionallity
        console.error.mockImplementation(() => null)
    })

    afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jest.spyOn adds this functionallity
        console.error.mockRestore()
    })

    describe('Route GET /fetch/account/{accountPublicKey}', () => {
        beforeEach(() => {
            if (!nock.isActive()) {
                nock.activate()
            }
        })

        afterEach(() => {
            nock.cleanAll()
            nock.restore()
        })

        test('should return 400 for invalid public key', async () => {
            const res = await request(app).get('/fetch/account/123')
            expect(res.status).toEqual(400)
            expect(res.body).toEqual({
                message: 'public key 123 is not valid',
                status: 400,
            })
        })

        test('should return 404 for a missing account', async () => {
            nock(rpcUrl)
                .post(
                    '/',
                    (body) =>
                        body.params &&
                        body.params[0] ===
                            'G9wHUY9KUjsFq3V6DqZ7rMFYiDbpFD5tfyL2X54xJoNw'
                )
                .reply(200, missingAccountInfo)
            const res = await request(app).get(
                '/fetch/account/G9wHUY9KUjsFq3V6DqZ7rMFYiDbpFD5tfyL2X54xJoNw'
            )
            expect(res.status).toEqual(404)
            expect(res.body).toEqual({
                message:
                    'account G9wHUY9KUjsFq3V6DqZ7rMFYiDbpFD5tfyL2X54xJoNw not found',
                status: 404,
            })
        })

        test('should return 200 with global config account', async () => {
            //
            nock(rpcUrl)
                .post(
                    '/',
                    (body) =>
                        body.params &&
                        body.params[0] ===
                            'sHXA3HojCdXz9tupED61S8dnfHRqx9DaVSYv1mBqn6h'
                )
                .reply(200, mockGlobalConfigAccountInfo)
            const res = await request(app).get(
                '/fetch/account/sHXA3HojCdXz9tupED61S8dnfHRqx9DaVSYv1mBqn6h'
            )
            expect(res.status).toEqual(200)
            // await fs.writeFile('./test/controllers/fixtures/globalConfig.json', JSON.stringify(res.body))
            expect(res.body).toEqual(mockGlobalConfig)
        })
    })

    describe('Route GET /fetch/tx/{signature}', () => {
        beforeEach(() => {
            if (!nock.isActive()) {
                nock.activate()
            }
        })

        afterEach(() => {
            nock.cleanAll()
            nock.restore()
        })

        test('should return 200 for initGlobalConfig', async () => {
            nock(rpcUrl)
                .post(
                    '/',
                    (body) =>
                        body.params &&
                        body.params[0] ===
                            '2YA8y5j3bCdrV4LUCaZ1mFuAuQMNHjyJmjV1FXUKQFGkwGzSCp3nkzNiX3fpeE1VoAnCXEvxPsLC5yoNa1FAkqMt'
                )
                .reply(200, mockInitGlobalConfigInfo)
            const res = await request(app).get(
                '/fetch/tx/2YA8y5j3bCdrV4LUCaZ1mFuAuQMNHjyJmjV1FXUKQFGkwGzSCp3nkzNiX3fpeE1VoAnCXEvxPsLC5yoNa1FAkqMt'
            )
            expect(res.status).toEqual(200)
            // await fs.writeFile('./test/controllers/fixtures/initGlobalConfig.json', JSON.stringify(res.body))
            expect(res.body).toEqual(mockInitGlobalConfig)
        })
    })
})
