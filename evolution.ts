import { ethers, providers } from "ethers";
import { program } from "commander";
const ethSignUtil = require("eth-sig-util");
const ethUtil = require("ethereumjs-util");
import * as ElpisHeroEvolution from "./abi/ElpisHeroEvolution.json";
import { getEvolutionDataMessage } from "./eip712";

program
  .version("0.0.0")
  .requiredOption("-p, --privateKey <path>", "private key");
program.version("0.0.0").requiredOption("-t, --tokenId <path>", "token id");
program
  .version("0.0.0")
  .requiredOption("-h, --permitHolder <path>", "permit holder");
program.parse(process.argv);

const provider = new providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
const evolutionContract = new ethers.Contract(
  "0xE7F842D3B13220149d231b3Bd58216b53089a587",
  ElpisHeroEvolution,
  provider
);
const { privateKey, tokenId, permitHolder } = program.opts();
async function evolutionSignMessage(
  privateKey: string,
  tokenId: number,
  permitHolder: string
) {
  const wallet = new ethers.Wallet(privateKey);
  const nonce = (await evolutionContract.nonces(wallet.address)).toNumber();
  const data: any = getEvolutionDataMessage(
    "Elpis Hero Evolution",
    "1",
    97,
    evolutionContract.address,
    tokenId,
    permitHolder,
    nonce,
    99999999999
  );
  let signature = await ethSignUtil.signTypedMessage(Buffer.from(privateKey, 'hex'), {
    data,
  });
  let { v, s, r } = ethUtil.fromRpcSig(signature);
  console.log("v:", v, "s:", s.toString("hex"), "r:", r.toString("hex"));
}

evolutionSignMessage(privateKey, tokenId, permitHolder);
