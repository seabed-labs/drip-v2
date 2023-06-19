package app

const (
	QueueTransaction = "transaction"
	QueueAccount     = "account"
)

type (
	TransactionSignature string
	AccountPublicKey     string
)

type Transaction struct {
	Signature TransactionSignature `json:"tx_signature"`
}

type Account struct {
	PublicKey AccountPublicKey `json:"acc_publicKey"`
}
