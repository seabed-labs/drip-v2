import { Controller, Get, Route } from 'tsoa'
import { PingResponse } from '../service/types'

@Route('/')
export class PingController extends Controller {
    @Get()
    public async ping(): Promise<PingResponse> {
        return {
            message: 'Pong',
        }
    }
}
