package app

type Queue string

const (
	TransactionQueue Queue = "transaction"
	AccountQueue     Queue = "account"
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
