export type DripV2 = {
  "version": "0.1.0",
  "name": "drip_v2",
  "instructions": [
    {
      "name": "initGlobalConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-global-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitGlobalConfigParams"
          }
        }
      ]
    },
    {
      "name": "initPairConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "output_token_mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateSuperAdmin",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newSuperAdmin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateAdmin",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateAdminParams"
          }
        }
      ]
    },
    {
      "name": "updateDefaultDripFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateDefaultDripFeesParams"
          }
        }
      ]
    },
    {
      "name": "updatePythPriceFeed",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "inputTokenPythPriceFeed",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "outputTokenPythPriceFeed",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": []
    },
    {
      "name": "updateDefaultPairDripFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateDefaultPairDripFeesParams"
          }
        }
      ]
    },
    {
      "name": "collectFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalConfigSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-global-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              }
            ]
          }
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectFeesParams"
          }
        }
      ]
    },
    {
      "name": "initDripPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "output_token_mint"
              }
            ]
          }
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPositionSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitDripPositionParams"
          }
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sourceInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositParams"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "preDrip",
      "accounts": [
        {
          "name": "dripAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position.global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "ephemeralDripState",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-ephemeral-drip-state"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          }
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Accounts not in common with post_drip",
            ""
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PreDripParams"
          }
        }
      ]
    },
    {
      "name": "postDrip",
      "accounts": [
        {
          "name": "dripAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position.global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "ephemeralDripState",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-ephemeral-drip-state"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenFeeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Accounts not in common with pre_drip",
            ""
          ]
        },
        {
          "name": "outputTokenFeeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dripPosition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "pairConfig",
            "type": "publicKey"
          },
          {
            "name": "inputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "outputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dripAmountPreFees",
            "type": "u64"
          },
          {
            "name": "maxSlippageBps",
            "type": "u16"
          },
          {
            "name": "maxPriceDeviationBps",
            "type": "u16"
          },
          {
            "name": "dripFeeBps",
            "type": "u16"
          },
          {
            "name": "dripAmountRemainingPostFeesInCurrentCycle",
            "type": "u64"
          },
          {
            "name": "dripInputFeesRemainingForCurrentCycle",
            "type": "u64"
          },
          {
            "name": "totalInputFeesCollected",
            "type": "u64"
          },
          {
            "name": "totalOutputFeesCollected",
            "type": "u64"
          },
          {
            "name": "totalInputTokenDrippedPostFees",
            "type": "u64"
          },
          {
            "name": "totalOutputTokenReceivedPostFees",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
          },
          {
            "name": "dripMaxJitter",
            "type": "u32"
          },
          {
            "name": "dripActivationGenesisShift",
            "type": "i64"
          },
          {
            "name": "dripActivationTimestamp",
            "type": "i64"
          },
          {
            "name": "cycle",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dripPositionSigner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ephemeralDripState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
          },
          {
            "name": "dripperInputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripperOutputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripPositionInputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripPositionOutputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "inputTransferredToDripper",
            "type": "u64"
          },
          {
            "name": "minimumOutputExpected",
            "type": "u64"
          },
          {
            "name": "inputDripFeesBps",
            "type": "u16"
          },
          {
            "name": "outputDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "globalConfigSigner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "admins",
            "type": {
              "array": [
                "publicKey",
                20
              ]
            }
          },
          {
            "name": "adminPermissions",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          },
          {
            "name": "defaultDripFeeBps",
            "type": "u16"
          },
          {
            "name": "globalConfigSigner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "pairConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "inputTokenMint",
            "type": "publicKey"
          },
          {
            "name": "outputTokenMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "defaultPairDripFeeBps",
            "type": "u16"
          },
          {
            "name": "inputTokenDripFeePortionBps",
            "type": "u16"
          },
          {
            "name": "inputTokenPriceOracle",
            "type": {
              "defined": "PriceOracle"
            }
          },
          {
            "name": "outputTokenPriceOracle",
            "type": {
              "defined": "PriceOracle"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CollectFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "DepositParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitDripPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dripAmount",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
          },
          {
            "name": "maxSlippageBps",
            "type": "u16"
          },
          {
            "name": "maxPriceDeviationBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "InitGlobalConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "defaultDripFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "PreDripParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripAmountToFill",
            "type": "u64"
          },
          {
            "name": "minimumOutputTokensExpected",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateAdminParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminIndex",
            "type": "u64"
          },
          {
            "name": "adminChange",
            "type": {
              "defined": "AdminStateUpdate"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateDefaultDripFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newDefaultDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "UpdateDefaultPairDripFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newDefaultPairDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "AdminStateUpdate",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Clear"
          },
          {
            "name": "SetAdminAndResetPermissions",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "ResetPermissions"
          },
          {
            "name": "AddPermission",
            "fields": [
              {
                "defined": "AdminPermission"
              }
            ]
          },
          {
            "name": "RemovePermission",
            "fields": [
              {
                "defined": "AdminPermission"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AdminPermission",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Drip"
          },
          {
            "name": "UpdateDefaultDripFees"
          },
          {
            "name": "UpdatePythPriceFeed"
          },
          {
            "name": "UpdateDefaultPairDripFees"
          },
          {
            "name": "CollectFees"
          }
        ]
      }
    },
    {
      "name": "PriceOracle",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unavailable"
          },
          {
            "name": "Pyth",
            "fields": [
              {
                "name": "pyth_price_feed_account",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SuperAdminSignatureRequired",
      "msg": "Signer is not super_admin"
    },
    {
      "code": 6001,
      "name": "AdminIndexOutOfBounds",
      "msg": "Admin index out of bounds"
    },
    {
      "code": 6002,
      "name": "AdminPubkeyCannotBeDefault",
      "msg": "Admin pubkey cannot be default"
    },
    {
      "code": 6003,
      "name": "FailedToConvertU64toUSize",
      "msg": "Failed to convert u64 to usize"
    },
    {
      "code": 6004,
      "name": "OperationUnauthorized",
      "msg": "Unauthorized; Requires admin permission for this op or super admin signature"
    },
    {
      "code": 6005,
      "name": "CannotSerializePriceFeedAccount",
      "msg": "Pyth PriceFeed account serialization not supported"
    },
    {
      "code": 6006,
      "name": "PythPriceFeedLoadError",
      "msg": "Error when loading price from Pyth PriceFeed"
    },
    {
      "code": 6007,
      "name": "UnexpectedFeeTokenAccount",
      "msg": "Unexpected fee token account"
    },
    {
      "code": 6008,
      "name": "FeeRecipientMismatch",
      "msg": "Fee recipient token account owner does not match"
    },
    {
      "code": 6009,
      "name": "GlobalConfigMismatch",
      "msg": "Global config mismatch"
    },
    {
      "code": 6010,
      "name": "GlobalConfigSignerMismatch",
      "msg": "Global config and global config signer mismatch"
    },
    {
      "code": 6011,
      "name": "DripPositionSignerMismatch",
      "msg": "Drip position and drip position signer mismatch"
    },
    {
      "code": 6012,
      "name": "DripPositionOwnerNotSigner",
      "msg": "Drip position owner not a signer"
    },
    {
      "code": 6013,
      "name": "DripPositionAlreadyTokenized",
      "msg": "Drip position already tokenized"
    },
    {
      "code": 6014,
      "name": "CannotTokenizeAutoCreditEnabledDripPosition",
      "msg": "Cannot tokenize auto-credit enabled drip position"
    },
    {
      "code": 6015,
      "name": "DripPositionNftInvariantsFailed",
      "msg": "Drip position nft mint invariants failed"
    },
    {
      "code": 6016,
      "name": "CannotEnableAutoCreditWithTokenizedPosition",
      "msg": "Cannot enable auto-credit with tokenized position"
    },
    {
      "code": 6017,
      "name": "DripPositionNftMintAlreadyCreated",
      "msg": "Drip position NFT mint already created"
    },
    {
      "code": 6018,
      "name": "UnexpectedDripPositionNftAccountOwner",
      "msg": "Drip position NFT account owner should be position owner"
    },
    {
      "code": 6019,
      "name": "UnexpectedDripPositionNftMint",
      "msg": "Drip position NFT mint does not match drip position field"
    },
    {
      "code": 6020,
      "name": "UnexpectedDripPositionInputTokenAccount",
      "msg": "Unexpected drip position input token account"
    },
    {
      "code": 6021,
      "name": "DripPositionNotTokenized",
      "msg": "Drip position is not tokenized"
    },
    {
      "code": 6022,
      "name": "UnexpectedDripPositionNftAccount",
      "msg": "Drip position NFT account does not match mint"
    },
    {
      "code": 6023,
      "name": "InsufficientInfoForWithdrawal",
      "msg": "Insufficient information for withdrawal"
    },
    {
      "code": 6024,
      "name": "InsufficientInfoForTokenizedOwnerCheck",
      "msg": "Insufficient information for tokenized drip position owner check"
    },
    {
      "code": 6025,
      "name": "IncorrectAccountsForClosePosition",
      "msg": "Incorrect accounts for close_position"
    },
    {
      "code": 6026,
      "name": "CannotCloseDripPositionWithTokens",
      "msg": "Cannot close position with non-zero input/output token balance"
    },
    {
      "code": 6027,
      "name": "CannotFindPostDripIx",
      "msg": "Cannot find post-drip IX"
    },
    {
      "code": 6028,
      "name": "DripperInputTokenAccountBalanceSmallerThanExpected",
      "msg": "Dripper input token account balance smaller than expected"
    },
    {
      "code": 6029,
      "name": "DripAlreadyInProgress",
      "msg": "Drip already in progress"
    },
    {
      "code": 6030,
      "name": "DripFillAmountTooHigh",
      "msg": "Drip fill amount higher than remaining amount"
    },
    {
      "code": 6031,
      "name": "UnexpectedDripPositionOutputTokenAccount",
      "msg": "Unexpected drip position output token account"
    },
    {
      "code": 6032,
      "name": "PairConfigMismatch",
      "msg": "Pair config mismatch"
    },
    {
      "code": 6033,
      "name": "PreDripInvariantFailed",
      "msg": "Pre drip invariant failed"
    },
    {
      "code": 6034,
      "name": "CannotFindPreDripIx",
      "msg": "Cannot find pre-drip IX"
    },
    {
      "code": 6035,
      "name": "NoDripInProgres",
      "msg": "No drip in progress"
    },
    {
      "code": 6036,
      "name": "DripNotActivated",
      "msg": "Drip not activated yet"
    },
    {
      "code": 6037,
      "name": "ExpectedNonZeroOutputPostDrip",
      "msg": "Expected non-zero received_output_amount post-drip"
    },
    {
      "code": 6038,
      "name": "ExceededSlippage",
      "msg": "Exceeds slippages"
    },
    {
      "code": 6039,
      "name": "EphemeralDripStateDripPositionMismatch",
      "msg": "Ephemeral drip state and drip position mismatch"
    },
    {
      "code": 6040,
      "name": "ExpectedNonZeroInputPostDrip",
      "msg": "Expected non-zero used_input_amount post-drip"
    },
    {
      "code": 6041,
      "name": "ExpectedNonZeroDripFees",
      "msg": "Expected non-zero input/output drip fees"
    },
    {
      "code": 6042,
      "name": "InputFeesLargerThanReserved",
      "msg": "Input drip fees larger then reserved"
    },
    {
      "code": 6043,
      "name": "RequestedDripAmountExceedsMaxForPosition",
      "msg": "The requested drip amount is larger then the maximum allowable amount for this position cycle"
    }
  ]
};

export const IDL: DripV2 = {
  "version": "0.1.0",
  "name": "drip_v2",
  "instructions": [
    {
      "name": "initGlobalConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-global-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitGlobalConfigParams"
          }
        }
      ]
    },
    {
      "name": "initPairConfig",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "output_token_mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateSuperAdmin",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newSuperAdmin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateAdmin",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateAdminParams"
          }
        }
      ]
    },
    {
      "name": "updateDefaultDripFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateDefaultDripFeesParams"
          }
        }
      ]
    },
    {
      "name": "updatePythPriceFeed",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "inputTokenPythPriceFeed",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "outputTokenPythPriceFeed",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": []
    },
    {
      "name": "updateDefaultPairDripFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pairConfig",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateDefaultPairDripFeesParams"
          }
        }
      ]
    },
    {
      "name": "collectFees",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalConfigSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-global-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              }
            ]
          }
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectFeesParams"
          }
        }
      ]
    },
    {
      "name": "initDripPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "GlobalConfig",
                "path": "global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "output_token_mint"
              }
            ]
          }
        },
        {
          "name": "inputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outputTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPositionSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitDripPositionParams"
          }
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sourceInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositParams"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "preDrip",
      "accounts": [
        {
          "name": "dripAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position.global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "dripPosition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "ephemeralDripState",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-ephemeral-drip-state"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          }
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Accounts not in common with post_drip",
            ""
          ]
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PreDripParams"
          }
        }
      ]
    },
    {
      "name": "postDrip",
      "accounts": [
        {
          "name": "dripAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairConfig",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-pair-config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position.global_config"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.input_token_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "PairConfig",
                "path": "pair_config.output_token_mint"
              }
            ]
          }
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionSigner",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-signer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "ephemeralDripState",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-ephemeral-drip-state"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "DripPosition",
                "path": "drip_position"
              }
            ]
          },
          "relations": [
            "drip_position"
          ]
        },
        {
          "name": "dripPositionInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperInputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripperOutputTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inputTokenFeeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Accounts not in common with pre_drip",
            ""
          ]
        },
        {
          "name": "outputTokenFeeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dripPosition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "pairConfig",
            "type": "publicKey"
          },
          {
            "name": "inputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "outputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dripAmountPreFees",
            "type": "u64"
          },
          {
            "name": "maxSlippageBps",
            "type": "u16"
          },
          {
            "name": "maxPriceDeviationBps",
            "type": "u16"
          },
          {
            "name": "dripFeeBps",
            "type": "u16"
          },
          {
            "name": "dripAmountRemainingPostFeesInCurrentCycle",
            "type": "u64"
          },
          {
            "name": "dripInputFeesRemainingForCurrentCycle",
            "type": "u64"
          },
          {
            "name": "totalInputFeesCollected",
            "type": "u64"
          },
          {
            "name": "totalOutputFeesCollected",
            "type": "u64"
          },
          {
            "name": "totalInputTokenDrippedPostFees",
            "type": "u64"
          },
          {
            "name": "totalOutputTokenReceivedPostFees",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
          },
          {
            "name": "dripMaxJitter",
            "type": "u32"
          },
          {
            "name": "dripActivationGenesisShift",
            "type": "i64"
          },
          {
            "name": "dripActivationTimestamp",
            "type": "i64"
          },
          {
            "name": "cycle",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dripPositionSigner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ephemeralDripState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
          },
          {
            "name": "dripperInputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripperOutputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripPositionInputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "dripPositionOutputTokenAccountBalancePreDripBalance",
            "type": "u64"
          },
          {
            "name": "inputTransferredToDripper",
            "type": "u64"
          },
          {
            "name": "minimumOutputExpected",
            "type": "u64"
          },
          {
            "name": "inputDripFeesBps",
            "type": "u16"
          },
          {
            "name": "outputDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "globalConfigSigner",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "admins",
            "type": {
              "array": [
                "publicKey",
                20
              ]
            }
          },
          {
            "name": "adminPermissions",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          },
          {
            "name": "defaultDripFeeBps",
            "type": "u16"
          },
          {
            "name": "globalConfigSigner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "pairConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "globalConfig",
            "type": "publicKey"
          },
          {
            "name": "inputTokenMint",
            "type": "publicKey"
          },
          {
            "name": "outputTokenMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "defaultPairDripFeeBps",
            "type": "u16"
          },
          {
            "name": "inputTokenDripFeePortionBps",
            "type": "u16"
          },
          {
            "name": "inputTokenPriceOracle",
            "type": {
              "defined": "PriceOracle"
            }
          },
          {
            "name": "outputTokenPriceOracle",
            "type": {
              "defined": "PriceOracle"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CollectFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "DepositParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitDripPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dripAmount",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
          },
          {
            "name": "maxSlippageBps",
            "type": "u16"
          },
          {
            "name": "maxPriceDeviationBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "InitGlobalConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "defaultDripFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "PreDripParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripAmountToFill",
            "type": "u64"
          },
          {
            "name": "minimumOutputTokensExpected",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateAdminParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminIndex",
            "type": "u64"
          },
          {
            "name": "adminChange",
            "type": {
              "defined": "AdminStateUpdate"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateDefaultDripFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newDefaultDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "UpdateDefaultPairDripFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newDefaultPairDripFeesBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "AdminStateUpdate",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Clear"
          },
          {
            "name": "SetAdminAndResetPermissions",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "ResetPermissions"
          },
          {
            "name": "AddPermission",
            "fields": [
              {
                "defined": "AdminPermission"
              }
            ]
          },
          {
            "name": "RemovePermission",
            "fields": [
              {
                "defined": "AdminPermission"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "AdminPermission",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Drip"
          },
          {
            "name": "UpdateDefaultDripFees"
          },
          {
            "name": "UpdatePythPriceFeed"
          },
          {
            "name": "UpdateDefaultPairDripFees"
          },
          {
            "name": "CollectFees"
          }
        ]
      }
    },
    {
      "name": "PriceOracle",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unavailable"
          },
          {
            "name": "Pyth",
            "fields": [
              {
                "name": "pyth_price_feed_account",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SuperAdminSignatureRequired",
      "msg": "Signer is not super_admin"
    },
    {
      "code": 6001,
      "name": "AdminIndexOutOfBounds",
      "msg": "Admin index out of bounds"
    },
    {
      "code": 6002,
      "name": "AdminPubkeyCannotBeDefault",
      "msg": "Admin pubkey cannot be default"
    },
    {
      "code": 6003,
      "name": "FailedToConvertU64toUSize",
      "msg": "Failed to convert u64 to usize"
    },
    {
      "code": 6004,
      "name": "OperationUnauthorized",
      "msg": "Unauthorized; Requires admin permission for this op or super admin signature"
    },
    {
      "code": 6005,
      "name": "CannotSerializePriceFeedAccount",
      "msg": "Pyth PriceFeed account serialization not supported"
    },
    {
      "code": 6006,
      "name": "PythPriceFeedLoadError",
      "msg": "Error when loading price from Pyth PriceFeed"
    },
    {
      "code": 6007,
      "name": "UnexpectedFeeTokenAccount",
      "msg": "Unexpected fee token account"
    },
    {
      "code": 6008,
      "name": "FeeRecipientMismatch",
      "msg": "Fee recipient token account owner does not match"
    },
    {
      "code": 6009,
      "name": "GlobalConfigMismatch",
      "msg": "Global config mismatch"
    },
    {
      "code": 6010,
      "name": "GlobalConfigSignerMismatch",
      "msg": "Global config and global config signer mismatch"
    },
    {
      "code": 6011,
      "name": "DripPositionSignerMismatch",
      "msg": "Drip position and drip position signer mismatch"
    },
    {
      "code": 6012,
      "name": "DripPositionOwnerNotSigner",
      "msg": "Drip position owner not a signer"
    },
    {
      "code": 6013,
      "name": "DripPositionAlreadyTokenized",
      "msg": "Drip position already tokenized"
    },
    {
      "code": 6014,
      "name": "CannotTokenizeAutoCreditEnabledDripPosition",
      "msg": "Cannot tokenize auto-credit enabled drip position"
    },
    {
      "code": 6015,
      "name": "DripPositionNftInvariantsFailed",
      "msg": "Drip position nft mint invariants failed"
    },
    {
      "code": 6016,
      "name": "CannotEnableAutoCreditWithTokenizedPosition",
      "msg": "Cannot enable auto-credit with tokenized position"
    },
    {
      "code": 6017,
      "name": "DripPositionNftMintAlreadyCreated",
      "msg": "Drip position NFT mint already created"
    },
    {
      "code": 6018,
      "name": "UnexpectedDripPositionNftAccountOwner",
      "msg": "Drip position NFT account owner should be position owner"
    },
    {
      "code": 6019,
      "name": "UnexpectedDripPositionNftMint",
      "msg": "Drip position NFT mint does not match drip position field"
    },
    {
      "code": 6020,
      "name": "UnexpectedDripPositionInputTokenAccount",
      "msg": "Unexpected drip position input token account"
    },
    {
      "code": 6021,
      "name": "DripPositionNotTokenized",
      "msg": "Drip position is not tokenized"
    },
    {
      "code": 6022,
      "name": "UnexpectedDripPositionNftAccount",
      "msg": "Drip position NFT account does not match mint"
    },
    {
      "code": 6023,
      "name": "InsufficientInfoForWithdrawal",
      "msg": "Insufficient information for withdrawal"
    },
    {
      "code": 6024,
      "name": "InsufficientInfoForTokenizedOwnerCheck",
      "msg": "Insufficient information for tokenized drip position owner check"
    },
    {
      "code": 6025,
      "name": "IncorrectAccountsForClosePosition",
      "msg": "Incorrect accounts for close_position"
    },
    {
      "code": 6026,
      "name": "CannotCloseDripPositionWithTokens",
      "msg": "Cannot close position with non-zero input/output token balance"
    },
    {
      "code": 6027,
      "name": "CannotFindPostDripIx",
      "msg": "Cannot find post-drip IX"
    },
    {
      "code": 6028,
      "name": "DripperInputTokenAccountBalanceSmallerThanExpected",
      "msg": "Dripper input token account balance smaller than expected"
    },
    {
      "code": 6029,
      "name": "DripAlreadyInProgress",
      "msg": "Drip already in progress"
    },
    {
      "code": 6030,
      "name": "DripFillAmountTooHigh",
      "msg": "Drip fill amount higher than remaining amount"
    },
    {
      "code": 6031,
      "name": "UnexpectedDripPositionOutputTokenAccount",
      "msg": "Unexpected drip position output token account"
    },
    {
      "code": 6032,
      "name": "PairConfigMismatch",
      "msg": "Pair config mismatch"
    },
    {
      "code": 6033,
      "name": "PreDripInvariantFailed",
      "msg": "Pre drip invariant failed"
    },
    {
      "code": 6034,
      "name": "CannotFindPreDripIx",
      "msg": "Cannot find pre-drip IX"
    },
    {
      "code": 6035,
      "name": "NoDripInProgres",
      "msg": "No drip in progress"
    },
    {
      "code": 6036,
      "name": "DripNotActivated",
      "msg": "Drip not activated yet"
    },
    {
      "code": 6037,
      "name": "ExpectedNonZeroOutputPostDrip",
      "msg": "Expected non-zero received_output_amount post-drip"
    },
    {
      "code": 6038,
      "name": "ExceededSlippage",
      "msg": "Exceeds slippages"
    },
    {
      "code": 6039,
      "name": "EphemeralDripStateDripPositionMismatch",
      "msg": "Ephemeral drip state and drip position mismatch"
    },
    {
      "code": 6040,
      "name": "ExpectedNonZeroInputPostDrip",
      "msg": "Expected non-zero used_input_amount post-drip"
    },
    {
      "code": 6041,
      "name": "ExpectedNonZeroDripFees",
      "msg": "Expected non-zero input/output drip fees"
    },
    {
      "code": 6042,
      "name": "InputFeesLargerThanReserved",
      "msg": "Input drip fees larger then reserved"
    },
    {
      "code": 6043,
      "name": "RequestedDripAmountExceedsMaxForPosition",
      "msg": "The requested drip amount is larger then the maximum allowable amount for this position cycle"
    }
  ]
};
