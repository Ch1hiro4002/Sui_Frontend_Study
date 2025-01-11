import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID_v1: "0xcb764601ba2573e1e31fc11f5770897753ee2934ed11e8c86612b8ca5c73e9af",
      State: "0x185d432938a81bec3945417806c11ef739c962a7d99b5aa55292d894d31651dd",
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
