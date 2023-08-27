import { IPosition } from '../position';

export interface IPositionsFetcher {
    getPositionsToDrip(limit?: number): Promise<IPosition[]>;
}
