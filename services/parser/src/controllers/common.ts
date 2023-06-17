export function getServerResponseCommon(): {
  serverTimestamp: number;
} {
  return {
    serverTimestamp: Math.floor(Date.now() / 1000),
  };
}
