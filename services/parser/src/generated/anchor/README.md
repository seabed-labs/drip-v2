# Why is drip-types duplicated here?

The api codegen library we use, tsoa, does not support generating types from third parties (and for a <https://github.com/lukeautry/tsoa/blob/master/docs/ExternalInterfacesExplanation.MD>).

However, our use case is different in that we want the api to always pipe out the parsed result, so to circumvent this in our build system we re-generate for parser.
