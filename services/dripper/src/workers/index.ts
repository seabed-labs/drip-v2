export interface IWorker {
    start(): Promise<void>
    stop(): Promise<void>
}
