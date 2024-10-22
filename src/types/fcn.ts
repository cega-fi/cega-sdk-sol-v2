/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fcn.json`.
 */
export type Fcn = {
  "address": "2DE1zVYmjoKy39qr2CS12jSySb7A2gSpk64sox7kwBoG",
  "metadata": {
    "name": "fcn",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "FCN V2 Contracts"
  },
  "instructions": [
    {
      "name": "initializeFcnProduct",
      "discriminator": [
        208,
        198,
        218,
        90,
        105,
        66,
        33,
        113
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "productAuthority"
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  99,
                  110,
                  95,
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "args.product_id"
              }
            ]
          }
        },
        {
          "name": "underlyingAssetMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeFcnProductArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "fcnProduct",
      "discriminator": [
        137,
        78,
        55,
        229,
        168,
        2,
        7,
        99
      ]
    }
  ],
  "types": [
    {
      "name": "fcnOptionBarrier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "strikeBps",
            "type": "u32"
          },
          {
            "name": "barrierBps",
            "type": "u32"
          },
          {
            "name": "barrierType",
            "type": {
              "defined": {
                "name": "fcnOptionBarrierType"
              }
            }
          },
          {
            "name": "asset",
            "type": "pubkey"
          },
          {
            "name": "exponentUnused",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "fcnOptionBarrierType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "knockIn"
          }
        ]
      }
    },
    {
      "name": "fcnProduct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "type": {
              "defined": {
                "name": "productBase"
              }
            }
          },
          {
            "name": "leverage",
            "type": "u8"
          },
          {
            "name": "isBondOption",
            "type": "bool"
          },
          {
            "name": "optionBarriers",
            "type": {
              "vec": {
                "defined": {
                  "name": "fcnOptionBarrier"
                }
              }
            }
          },
          {
            "name": "observationIntervalInSeconds",
            "type": "u16"
          },
          {
            "name": "unusedU64",
            "type": "u64"
          },
          {
            "name": "unusedU128",
            "type": "u128"
          },
          {
            "name": "unusedBool",
            "type": "bool"
          },
          {
            "name": "unusedPubkey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initializeFcnProductArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "productId",
            "type": "u16"
          },
          {
            "name": "tenorInSeconds",
            "type": "u32"
          },
          {
            "name": "lateFeeBps",
            "type": "u16"
          },
          {
            "name": "secondsToStartLateFees",
            "type": "u16"
          },
          {
            "name": "secondsToStartAuctionDefault",
            "type": "u16"
          },
          {
            "name": "secondsToStartSettlementDefault",
            "type": "u16"
          },
          {
            "name": "disputePeriodInSeconds",
            "type": "u16"
          },
          {
            "name": "disputeGraceDelayInSeconds",
            "type": "u16"
          },
          {
            "name": "minDepositAmount",
            "type": "u128"
          },
          {
            "name": "minWithdrawalAmount",
            "type": "u128"
          },
          {
            "name": "maxUnderlyingAmountLimit",
            "type": "u128"
          },
          {
            "name": "sumVaultUnderlyingAmounts",
            "type": "u128"
          },
          {
            "name": "leverage",
            "type": "u8"
          },
          {
            "name": "isBondOption",
            "type": "bool"
          },
          {
            "name": "optionBarriers",
            "type": {
              "vec": {
                "defined": {
                  "name": "fcnOptionBarrier"
                }
              }
            }
          },
          {
            "name": "observationIntervalInSeconds",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "productBase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "productId",
            "type": "u16"
          },
          {
            "name": "underlyingAssetMint",
            "type": "pubkey"
          },
          {
            "name": "numberOfVaults",
            "type": "u16"
          },
          {
            "name": "operationalStatus",
            "type": {
              "defined": {
                "name": "productOperationalStatus"
              }
            }
          },
          {
            "name": "isDepositQueueOpen",
            "type": "bool"
          },
          {
            "name": "tenorInSeconds",
            "type": "u32"
          },
          {
            "name": "lateFeeBps",
            "type": "u16"
          },
          {
            "name": "secondsToStartLateFees",
            "type": "u16"
          },
          {
            "name": "secondsToStartAuctionDefault",
            "type": "u16"
          },
          {
            "name": "secondsToStartSettlementDefault",
            "type": "u16"
          },
          {
            "name": "disputePeriodInSeconds",
            "type": "u16"
          },
          {
            "name": "disputeGraceDelayInSeconds",
            "type": "u16"
          },
          {
            "name": "minDepositAmount",
            "type": "u128"
          },
          {
            "name": "minWithdrawalAmount",
            "type": "u128"
          },
          {
            "name": "maxUnderlyingAmountLimit",
            "type": "u128"
          },
          {
            "name": "sumVaultUnderlyingAmounts",
            "type": "u128"
          },
          {
            "name": "unusedU64",
            "type": "u64"
          },
          {
            "name": "unusedU128",
            "type": "u128"
          },
          {
            "name": "unusedBool",
            "type": "bool"
          },
          {
            "name": "unusedPubkey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "productOperationalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "depositStoppedAndTrading"
          },
          {
            "name": "depositStoppedNotTrading"
          },
          {
            "name": "deprecated"
          }
        ]
      }
    }
  ]
};
