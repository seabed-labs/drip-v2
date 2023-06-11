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
      "name": "updateSuperAdmin",
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
            "defined": "UpdateSuperAdminParams"
          }
        }
      ]
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
      "name": "initPairConfig",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
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
    }
  ],
  "accounts": [
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
      "name": "UpdateSuperAdminParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newSuperAdmin",
            "type": "publicKey"
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
            "name": "InitPairConfig"
          },
          {
            "name": "Drip"
          },
          {
            "name": "UpdateDefaultDripFees"
          },
          {
            "name": "UpdatePythPriceFeed"
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
      "name": "updateSuperAdmin",
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
            "defined": "UpdateSuperAdminParams"
          }
        }
      ]
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
      "name": "initPairConfig",
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
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
    }
  ],
  "accounts": [
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
      "name": "UpdateSuperAdminParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newSuperAdmin",
            "type": "publicKey"
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
            "name": "InitPairConfig"
          },
          {
            "name": "Drip"
          },
          {
            "name": "UpdateDefaultDripFees"
          },
          {
            "name": "UpdatePythPriceFeed"
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
    }
  ]
};
