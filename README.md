# Bhumi Farm Token (BHUMI)

Part of Bhumi Farm's submission to the Colosseum Crypto World's Fair 2026 (Solana track).

## What this is

A basic SPL fungible token template for Bhumi Farm, minted via Metaplex on Solana Devnet.
This is a fresh, standalone token — it shares no code, branding, or on-chain identity with
any earlier Bhumi Farm/ARTHA token experiments.

The token's exact role in the Bhumi Farm ecosystem (utility, governance, staking rewards,
or a combination) is still being decided. This repo currently ships a working, minimal
mint script so the flow is provable end-to-end on devnet; the placeholder supply and
decimals in `create-bhumi-token.mjs` are meant to be adjusted once that's settled.

## What's in this repo

| File | Purpose |
|---|---|
| `create-bhumi-token.mjs` | Creates the SPL mint + on-chain Metaplex metadata (name, symbol), then mints the initial supply to the treasury wallet. |
| `package.json` | Dependencies (Metaplex `umi` + `@solana/web3.js` / `spl-token`). |

## Stack

- [Metaplex Umi](https://developers.metaplex.com/umi) + [`mpl-token-metadata`](https://developers.metaplex.com/token-metadata) — `createFungible` for the mint + metadata
- `@solana/web3.js` + `@solana/spl-token` — minting the initial supply to the treasury's associated token account
- Solana Devnet

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

If the wallet's SOL balance is low, the script requests a devnet airdrop automatically.
It prints the mint address and a Solana Explorer (devnet) link when done, and writes the
result to `bhumi-token-info.json`.

## Roadmap

- Decide the token's role in the Bhumi Farm/ARTHA ecosystem and update the metadata
  (name, symbol stays BHUMI, supply, decimals) accordingly.
- Add a metadata image + off-chain JSON (currently `TOKEN_URI` is empty).
- Wire distribution (staking, rewards, liquidity) once the role is confirmed.
