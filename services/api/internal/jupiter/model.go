package jupiter

const (
	RedisJupiterTokensKey = "jupiter_tokens"
)

type (
	TokenAddress string
	ChainID      int64
	Symbol       string
)

type extensions struct {
	CoingeckoId string `json:"coingeckoId"`
}

type Token struct {
	Address    TokenAddress `json:"address"`
	ChainID    ChainID      `json:"chainId"`
	Decimals   int64        `json:"decimals"`
	Name       string       `json:"name"`
	Symbol     Symbol       `json:"symbol"`
	LogoURI    string       `json:"logoURI"`
	Tags       []string     `json:"tags"`
	Extensions extensions   `json:"extensions"`
}
