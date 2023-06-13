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
      "name": "withdrawFees",
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
            "defined": "WithdrawFeesParams"
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
          "name": "owner",
          "isMut": false,
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
      "name": "tokenizeDripPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": false,
          "relations": [
            "drip_position_signer"
          ]
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
          "name": "dripPositionNftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPositionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionNftMapping",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-nft-mapping"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "drip_position_nft_mint"
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
            "name": "owner",
            "type": {
              "defined": "DripPositionOwner"
            }
          },
          {
            "name": "dripPositionSigner",
            "type": "publicKey"
          },
          {
            "name": "autoCreditEnabled",
            "type": "bool"
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
            "name": "inputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "outputTokenAccount",
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
            "name": "totalInputTokenDripped",
            "type": "u64"
          },
          {
            "name": "totalOutputTokenReceived",
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
      "name": "dripPositionNftMapping",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripPositionNftMint",
            "type": "publicKey"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
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
            "type": "u64"
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
            "type": "u64"
          },
          {
            "name": "inputTokenDripFeePortionBps",
            "type": "u64"
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
      "name": "InitDripPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripAmount",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
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
            "type": "u64"
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
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawFeesParams",
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
      "name": "DripPositionOwner",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Direct",
            "fields": [
              {
                "name": "owner",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Tokenized",
            "fields": [
              {
                "name": "owner_nft_mint",
                "type": "publicKey"
              }
            ]
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
            "name": "WithdrawFees"
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
      "msg": "SuperAdmin/Admin pubkey cannot be default"
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
      "name": "GlobalConfigGlobalSignerMismatch",
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
      "name": "withdrawFees",
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
            "defined": "WithdrawFeesParams"
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
          "name": "owner",
          "isMut": false,
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
      "name": "tokenizeDripPosition",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dripPosition",
          "isMut": true,
          "isSigner": false,
          "relations": [
            "drip_position_signer"
          ]
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
          "name": "dripPositionNftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dripPositionNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dripPositionNftMapping",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "drip-v2-drip-position-nft-mapping"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "drip_position_nft_mint"
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
            "name": "owner",
            "type": {
              "defined": "DripPositionOwner"
            }
          },
          {
            "name": "dripPositionSigner",
            "type": "publicKey"
          },
          {
            "name": "autoCreditEnabled",
            "type": "bool"
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
            "name": "inputTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "outputTokenAccount",
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
            "name": "totalInputTokenDripped",
            "type": "u64"
          },
          {
            "name": "totalOutputTokenReceived",
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
      "name": "dripPositionNftMapping",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripPositionNftMint",
            "type": "publicKey"
          },
          {
            "name": "dripPosition",
            "type": "publicKey"
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
            "type": "u64"
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
            "type": "u64"
          },
          {
            "name": "inputTokenDripFeePortionBps",
            "type": "u64"
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
      "name": "InitDripPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dripAmount",
            "type": "u64"
          },
          {
            "name": "frequencyInSeconds",
            "type": "u64"
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
            "type": "u64"
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
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawFeesParams",
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
      "name": "DripPositionOwner",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Direct",
            "fields": [
              {
                "name": "owner",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Tokenized",
            "fields": [
              {
                "name": "owner_nft_mint",
                "type": "publicKey"
              }
            ]
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
            "name": "WithdrawFees"
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
      "msg": "SuperAdmin/Admin pubkey cannot be default"
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
      "name": "GlobalConfigGlobalSignerMismatch",
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
    }
  ]
};
