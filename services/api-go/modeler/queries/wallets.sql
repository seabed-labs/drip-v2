-- name: GetWalletByPublicKey :one
SELECT
  id,
  public_key
FROM dcaf."wallets"
WHERE public_key = $1;

-- name: InsertWallet :exec
INSERT INTO dcaf."wallets" (
  public_key
) VALUES (
  $1
);
