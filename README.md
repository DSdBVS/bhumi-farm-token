# Bhumi Farm Token (BHUMI)

BHUMI is the Solana Devnet token component of the Bhumi Farm project, developed for the Colosseum Crypto World's Fair 2026.

The token is deployed on Solana Devnet with live on-chain metadata and can be independently verified through Solana explorers.

## Token

- **Name:** `Bhumi`
- **Symbol:** `BHUMI`
- **Network:** Solana Devnet
- **Mint:** `5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ`
- **Decimals:** `9`
- **Total supply:** `18,000,000,000 BHUMI`
- **Mint authority / treasury:** `8QK2ZWwmkYWxY62XEf7LSWL1ZXuHgKAacK8XwjgMCy7L`

**Explorer:**  
https://explorer.solana.com/address/5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ?cluster=devnet

**Solscan:**  
https://solscan.io/token/5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ?cluster=devnet

## What it is

BHUMI is the token component of the Bhumi Farm Solana prototype.

The broader Bhumi Farm project also includes an on-chain Batch Passport system using Solana NFTs. The token and NFT passport are maintained as separate components of the same project.

The current BHUMI deployment is a **Devnet prototype**. This repository does not claim production token utility, staking, governance, or tokenomics.

## On-chain metadata

The token includes on-chain metadata for:

- Name: `Bhumi`
- Symbol: `BHUMI`
- Token image / icon

Metadata is created and updated using Metaplex Token Metadata.

## Initial distribution

The current Devnet deployment has:

- **7,000,000,000 BHUMI** distributed to the project's founder Devnet wallet
- **11,000,000,000 BHUMI** retained by the treasury

These balances are part of the current Devnet demonstration and should not be interpreted as production tokenomics.

## What's in this repo

| File | Purpose |
|---|---|
| `create-bhumi-token.mjs` | Creates the SPL token mint, attaches Metaplex metadata, and mints the initial token supply. |
| `package.json` | Project dependencies and scripts. |

## Technical stack

- **Solana Devnet**
- **Metaplex Umi**
- **Metaplex Token Metadata**
- **`@solana/web3.js`**
- **`@solana/spl-token`**

## Run locally

Requires:

- Node.js
- A funded Solana Devnet wallet
- A local keypair configured for the script

Install dependencies:

```bash
npm install
