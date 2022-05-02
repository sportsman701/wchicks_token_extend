import fs from "fs";

const buildFile =
  "./build/artifacts/contracts/WChicks.sol/WChicks.json";
const frontEndAbiDir = "../front-end/abi/";

export async function publish(address: string) {
  const contractData: string = fs.readFileSync(buildFile).toString();
  const contract = JSON.parse(contractData);

  fs.writeFileSync(
    `${frontEndAbiDir}${contract.contractName}.json`,
    JSON.stringify({ address: address, abi: contract.abi }, null, 2)
  );

  console.log("Published WChicks contract to the front-end package.");
}
