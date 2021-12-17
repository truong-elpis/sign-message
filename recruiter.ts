import { ethers, providers } from "ethers";
import { program } from "commander";
const ethSignUtil = require("eth-sig-util");
const ethUtil = require("ethereumjs-util");
import * as ElpisHeroRecruiter from "./abi/ElpisHeroRecruiter.json";
import { getEvolutionDataMessage, getRecruitmentDataMessage } from "./eip712";

program
  .version("0.0.0")
  .requiredOption("-p, --privateKey <path>", "private key");
program.version("0.0.0").requiredOption("-t0, --tokenId0 <path>", "token id");
program.version("0.0.0").requiredOption("-t1, --tokenId1 <path>", "token id");
program
  .version("0.0.0")
  .requiredOption("-h, --permitHolder <path>", "permit holder");
program.parse(process.argv);

const provider = new providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
const recruiterContract = new ethers.Contract(
  "0x2700Bbf21583F7E810776b28379d13764C6df9b9",
  ElpisHeroRecruiter,
  provider
);
const { privateKey, tokenId0, tokenId1, permitHolder } = program.opts();
async function recruiterSignMessage(
  privateKey: string,
  tokenId0: number,
  tokenId1: number,
  permitHolder: string
) {
  const wallet = new ethers.Wallet(privateKey);
  const nonce = (await recruiterContract.nonces(wallet.address)).toNumber();
  const data: any = getRecruitmentDataMessage(
    "Elpis Hero Recruiter",
    "1",
    97,
    recruiterContract.address,
    tokenId0,
    tokenId1,
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

recruiterSignMessage(privateKey, tokenId0, tokenId1, permitHolder);
