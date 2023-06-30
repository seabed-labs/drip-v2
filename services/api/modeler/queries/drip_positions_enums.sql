-- name: GetEnumByValue :one
SELECT
  "id",
  "value"
FROM dcaf."drip_positions_enums"
WHERE "value" = $1;

-- name: GetEnumByID :one
SELECT
  "id",
  "value"
FROM dcaf."drip_positions_enums"
WHERE "id" = $1;
