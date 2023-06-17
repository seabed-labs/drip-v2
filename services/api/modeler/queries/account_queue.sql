-- name: EnqueueAccount :exec
INSERT INTO dcaf.account_queue (
  "public_key",
  "priority",
  "attempts",
  "max_attempts",
  "time",
  "retry_time"
) VALUES (
  $1, $2, $3, $4, $5, $6
);

-- name: ListAllQueuedAccount :many
SELECT
  "id",
  "public_key",
  "priority",
  "attempts",
  "max_attempts",
  "time",
  "retry_time"
FROM dcaf.account_queue
ORDER BY id;

-- name: DequeueAccount :exec
DELETE
FROM dcaf.account_queue
WHERE id = $1;
