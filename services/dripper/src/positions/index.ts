export interface IPositionsFetcher {
    getPositionsPendingDrip(limit?: number): Promise<IPosition[]>;
}

export interface IPosition {
    drip(): Promise<string>;
}
