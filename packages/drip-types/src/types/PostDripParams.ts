// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface PostDripParamsFields {}

export interface PostDripParamsJSON {}

export class PostDripParams {
    constructor(fields: PostDripParamsFields) {}

    static layout(property?: string) {
        return borsh.struct([], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new PostDripParams({})
    }

    static toEncodable(fields: PostDripParamsFields) {
        return {}
    }

    toJSON(): PostDripParamsJSON {
        return {}
    }

    static fromJSON(obj: PostDripParamsJSON): PostDripParams {
        return new PostDripParams({})
    }

    toEncodable() {
        return PostDripParams.toEncodable(this)
    }
}
