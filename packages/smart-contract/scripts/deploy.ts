// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx smart-contract run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {
    INITIAL_SUPPLY,
    WCHICKS_NAME,
    WCHICKS_SYMBOL,
} from "./params";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { publish } from "./publish";

task("deploy:WChicks", "Deploy WChicks Token").setAction(
  async function (taskArguments: TaskArguments, hre) {
    const WChicksFactory = await hre.ethers.getContractFactory(
      "WChicks"
    );

    // Deploy Contract
    const wChicksContract = await WChicksFactory.deploy(
      WCHICKS_NAME, WCHICKS_SYMBOL, INITIAL_SUPPLY
    );
    await wChicksContract.deployed();

    console.log("WChicks Token deployed to:", wChicksContract.address);

    await publish(wChicksContract.address);
  }
);

task("verify:WChicks", "Verify WChicks Token")
    .addParam("address", "the deployed token contract address")
    .setAction(
    async function (taskArguments: TaskArguments, hre) {
        // Deploy Contract
        await hre.run(
            "verify:verify",
            {
                 address: taskArguments.address,
                 constructorArguments: [
                     WCHICKS_NAME, WCHICKS_SYMBOL, INITIAL_SUPPLY
                 ]
            }
        );

        console.log("WChicks was verified successfully!");
    }
);
