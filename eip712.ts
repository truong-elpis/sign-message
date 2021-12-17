const ethSigUtil = require("eth-sig-util")
import { utils } from "ethers"
const { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } = utils

export const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
]

export function domainSeparator(name, version, chainId, verifyingContract) {
  return (
    "0x" + ethSigUtil.TypedDataUtils.hashStruct("EIP712Domain", { name, version, chainId, verifyingContract }, { EIP712Domain }).toString("hex")
  )
}

export function getEvolutionDataMessage(name, version, chainId, verifyingContract, tokenId, permitHolder, nonce, deadline) {
  const message = {
    tokenId: tokenId,
    permitHolder: permitHolder,
    nonce: nonce,
    deadline: deadline,
  }

  return {
    types: {
      EIP712Domain,
      EvolvePermit: [
        { name: "tokenId", type: "uint256" },
        { name: "permitHolder", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: { name, version, chainId, verifyingContract },
    primaryType: "EvolvePermit",
    message,
  }
}

export function getRecruitmentDataMessage(name, version, chainId, verifyingContract, tokenId0, tokenId1, permitHolder, nonce, deadline) {
  const message = {
    tokenId0,
    tokenId1,
    permitHolder,
    nonce,
    deadline,
  }

  return {
    types: {
      EIP712Domain,
      RecruitPermit: [
        { name: "tokenId0", type: "uint256" },
        { name: "tokenId1", type: "uint256" },
        { name: "permitHolder", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: { name, version, chainId, verifyingContract },
    primaryType: "RecruitPermit",
    message,
  }
}
