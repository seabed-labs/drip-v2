export type DripV2 = {
  version: "0.1.0";
  name: "drip_v2";
  instructions: [
    {
      name: "initGlobalConfig";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalConfig";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: "InitGlobalConfigParams";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "globalConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u64";
          },
          {
            name: "superAdmin";
            type: "publicKey";
          },
          {
            name: "admins";
            type: {
              array: ["publicKey", 20];
            };
          },
          {
            name: "adminPermissions";
            type: {
              array: ["u64", 20];
            };
          },
          {
            name: "defaultDripFeeBps";
            type: "u64";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "InitGlobalConfigParams";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u64";
          },
          {
            name: "superAdmin";
            type: "publicKey";
          },
          {
            name: "defaultDripFeeBps";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: DripV2 = {
  version: "0.1.0",
  name: "drip_v2",
  instructions: [
    {
      name: "initGlobalConfig",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalConfig",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "params",
          type: {
            defined: "InitGlobalConfigParams",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "globalConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u64",
          },
          {
            name: "superAdmin",
            type: "publicKey",
          },
          {
            name: "admins",
            type: {
              array: ["publicKey", 20],
            },
          },
          {
            name: "adminPermissions",
            type: {
              array: ["u64", 20],
            },
          },
          {
            name: "defaultDripFeeBps",
            type: "u64",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "InitGlobalConfigParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u64",
          },
          {
            name: "superAdmin",
            type: "publicKey",
          },
          {
            name: "defaultDripFeeBps",
            type: "u64",
          },
        ],
      },
    },
  ],
};
