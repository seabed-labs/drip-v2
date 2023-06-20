import { Controller, Get, Route } from 'tsoa'
import { getServerResponseCommon } from './common'
import { PingResponse } from '../service/types'

@Route('/')
export class PingController extends Controller {
    @Get()
    public async ping(): Promise<PingResponse> {
        return {
            ...getServerResponseCommon(),
            data: {
                message: 'Pong',
            },
        }
    }
}
