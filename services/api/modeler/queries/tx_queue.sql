-- name: EnqueueTransaction :exec
INSERT INTO dcaf.tx_queue (
  "signature",
  "priority",
  "attempts",
  "max_attempts",
  "time",
  "retry_time"
) VALUES (
  $1, $2, $3, $4, $5, $6
);

-- name: ListAllQueuedTransactions :many
SELECT
  "id",
  "signature",
  "priority",
  "attempts",
  "max_attempts",
  "time",
  "retry_time"
FROM dcaf.tx_queue
ORDER BY id;

-- name: DequeueTransaction :exec
DELETE
FROM dcaf.tx_queue
WHERE id = $1;
