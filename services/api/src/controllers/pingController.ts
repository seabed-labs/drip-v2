import { Controller, Get, Route } from 'tsoa';

import { provideSingleton } from '../ioCTypes';

import { PingResponse } from './types';

@Route('/')
@provideSingleton(PingController)
export class PingController extends Controller {
    @Get()
    public async ping(): Promise<PingResponse> {
        return {
            message: 'Pong',
        };
    }
}
