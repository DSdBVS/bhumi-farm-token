# Bhumi Farm Token (BHUMI)

Part of Bhumi Farm's submission to the Colosseum Crypto World's Fair 2026 (Solana track).

## What this is

BHUMI is Bhumi Farm's native token on Solana. It is live on devnet with its final name,
icon, and metadata, and it shares its on-chain identity (the same treasury/mint-authority
wallet) with the companion [Bhumi Farm NFT passport](https://github.com/DSdBVS/bhumi-farm-nft)
repo — the token and the traceability NFTs are one connected system, not two unrelated demos.

## Live on devnet

- Name: `Bhumi` · Symbol: `BHUMI`
- Mint: [`5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ`](https://explorer.solana.com/address/5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ?cluster=devnet)
- Solscan: https://solscan.io/token/5Jj9kxjcmfXbQU5RrXdBA7ZCyp7NuKs5vaYAihnyb8TJ?cluster=devnet
- Decimals: 9 · Total supply: 18,000,000,000 BHUMI
- Treasury / mint authority: `8QK2ZWwmkYWxY62XEf7LSWL1ZXuHgKAacKX8wjgMCy7L`
- Icon + on-chain metadata (name/symbol/image) attached via Metaplex `updateV1`
- First distribution sent: 7,000,000,000 BHUMI to the founder's devnet wallet, treasury holds the remaining 11,000,000,000

## What's in this repo

| File | Purpose |
|---|---|
| `create-bhumi-token.mjs` | Creates the SPL mint + on-chain Metaplex metadata (name, symbol), then mints the initial supply to the treasury wallet. |
| `package.json` | Dependencies (Metaplex `umi` + `@solana/web3.js` / `spl-token`). |

## Stack

- [Metaplex Umi](https://developers.metaplex.com/umi) + [`mpl-token-metadata`](https://developers.metaplex.com/token-metadata) — `createFungible` for the mint + metadata
- `@solana/web3.js` + `@solana/spl-token` — minting and transfers
- Solana Devnet

## In progress — not deployed yet

- **Staking** — design is built and proven (pause/resume switch, configurable APY, auto-burn), tested under an earlier token name. Needs a fresh deploy pointed at this BHUMI mint.
- **DAO / governance** — same situation: design exists, not yet redeployed for BHUMI.
- **Reward distribution** — depends on staking going live first.
- **ARTHA Wallet integration** — not started.

## Running it yourself

Requires a funded Solana devnet keypair. The script reads it from a local file path
(not committed to this repo — see `create-bhumi-token.mjs`, top of file, for the
expected path). It reuses the same devnet wallet as the companion
[Bhumi Farm NFT passport](https://github.com/DSdBVS/bhumi-farm-nft) repo, so the NFT
and this token share one treasury/mint-authority address.

```bash
npm install
node create-bhumi-token.mjs
```
