package app

type Queue string
type Owner int64

const (
	TransactionQueue Queue = "transaction"
	AccountQueue     Queue = "account"
)

const (
	DirectOwner    Owner = 1
	TokenizedOwner Owner = 2
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
