-- name: GetEnumByValue :one
SELECT
  "id",
  "value"
FROM dcaf."drip_positions_enums"
WHERE "value" = $1;
