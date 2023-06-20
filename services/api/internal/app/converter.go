package app

import "encoding/json"

func decodeTransactionPayload(b []byte) (*Transaction, error) {
	tx := new(Transaction)

	return tx, json.Unmarshal(b, tx)
}

func decodeAccountPayload(b []byte) (*Account, error) {
	acc := new(Account)

	return acc, json.Unmarshal(b, acc)
}
