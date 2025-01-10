import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID_v1: "0x1e2694113cacf38672ab775c10662791d0af80c7dbaa9b3c7f09566885211427",
      State: "0x82576d371018b8d0b49abbd7179ece1c2b47a51f5641ca1807db934b19e899b1",
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
