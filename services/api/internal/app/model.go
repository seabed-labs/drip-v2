package app

import "time"

type (
	QueuedTransactionID  int64
	TransactionSignature string
)

type (
	QueuedAccountID int64
	PublicKey       string
)

type QueuedTransaction struct {
	ID                   QueuedTransactionID
	TransactionSignature TransactionSignature
	Priority             int64
	Attempts             int64
	MaxAttempts          int64
	Time                 *time.Time
	RetryTime            *time.Time
}

type QueuedAccount struct {
	ID          QueuedAccountID
	PublicKey   PublicKey
	Priority    int64
	Attempts    int64
	MaxAttempts int64
	Time        *time.Time
	RetryTime   *time.Time
}
