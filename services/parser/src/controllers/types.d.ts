export type ResponseCommon<T extends object, E extends Error> = {
  serverTimestamp: number;
  data: T;
  error?: E;
};
export type PingResponse = ResponseCommon<
  {
    message: string;
  },
  Error
>;
//# sourceMappingURL=types.d.ts.map
