package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

func Initialize() {
	viper.SetConfigName("default")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("failed to read config file: %w", err))
	}

	if os.Getenv("ENV") != "" {
		viper.SetConfigName(os.Getenv("ENV"))
		viper.SetConfigType("yaml")
		viper.AddConfigPath("./config")
		err := viper.MergeInConfig()
		if err != nil {
			panic(fmt.Errorf("failed to read config file: %w", err))
		}
	}
}
