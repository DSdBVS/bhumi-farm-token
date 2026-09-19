// create-bhumi-token.mjs
// Bhumi Farm — fungible token (BHUMI), Solana Devnet
// Basic template: creates the SPL mint + on-chain Metaplex metadata, then mints the
// initial supply to the treasury wallet. Adjust DECIMALS / SUPPLY / metadata below
// once the token's real role in the ecosystem (utility, governance, staking rewards,
// etc.) is decided.
//
// Run from your own Terminal (not through Claude's sandbox) from inside this folder:
//
//   npm install
//   node create-bhumi-token.mjs
//
// Reuses the same devnet keypair as the Bhumi Farm NFT passport scripts
// (artha-devnet.json), so the NFT and this token share one treasury/mint-authority
// wallet on devnet.

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata, createFungible } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';
import path from 'path';

const KEYPAIR_PATH = '/Users/igormezentsev/.config/solana/artha-devnet.json';
const MIN_BALANCE_SOL = 0.3;
const RPC_URL = 'https://api.devnet.solana.com';

// --- Placeholder values — adjust once the token's role is decided ---
const DECIMALS = 9;
const SUPPLY = 1_000_000_000n; // 1B, placeholder
const TOKEN_NAME = 'Bhumi Farm Token';
const TOKEN_SYMBOL = 'BHUMI';
const TOKEN_URI = ''; // optional: off-chain metadata JSON URI (logo, description)
// ----------------------------------------------------------------------

async function main() {
  const umi = createUmi(RPC_URL).use(mplTokenMetadata());

  if (!fs.existsSync(KEYPAIR_PATH)) {
    console.error(`No devnet keypair found at ${KEYPAIR_PATH}.`);
    console.error('This script expects the same wallet used by the Bhumi Farm NFT passport scripts.');
    process.exit(1);
  }

  console.log('Loading treasury / mint authority keypair...');
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8')));
  const treasury = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(treasury));
  console.log('Treasury / mint authority (devnet):', treasury.publicKey.toString());

  const checkBalanceSol = async () => {
    const bal = await umi.rpc.getBalance(treasury.publicKey);
    return Number(bal.basisPoints) / 1e9;
  };

  let balSol = await checkBalanceSol();
  console.log(`Current treasury balance: ${balSol} SOL`);

  if (balSol < MIN_BALANCE_SOL) {
    console.log('Balance low — requesting devnet airdrop...');
    try {
      await umi.rpc.airdrop(treasury.publicKey, sol(2), { commitment: 'confirmed' });
      console.log('Airdrop confirmed.');
    } catch (e) {
      console.error('Airdrop failed (devnet faucet is flaky, this is expected sometimes):', e.message);
    }
    balSol = await checkBalanceSol();
    console.log(`Balance after airdrop attempt: ${balSol} SOL`);
  }

  if (balSol < MIN_BALANCE_SOL) {
    console.error(`\nTreasury still underfunded (${balSol} SOL, need ~${MIN_BALANCE_SOL}+).`);
    console.error('Fund it manually, then re-run this script:');
    console.error(`  solana transfer ${treasury.publicKey.toString()} 2 --url devnet --allow-unfunded-recipient\n`);
    process.exit(1);
  }

  const rawAmount = SUPPLY * 10n ** BigInt(DECIMALS);
  const mint = generateSigner(umi);

  console.log(`Creating ${TOKEN_NAME} ($${TOKEN_SYMBOL}) mint + on-chain metadata...`);
  await createFungible(umi, {
    mint,
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: TOKEN_URI,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: DECIMALS,
  }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });
  console.log('Mint created:', mint.publicKey.toString());

  // Plain @solana/spl-token for the actual minting step — mpl-token-metadata's
  // mintV1 is NFT-oriented; this is the standard path for SPL fungible tokens.
  console.log('Waiting a moment for the mint account to propagate...');
  await new Promise((r) => setTimeout(r, 3000));

  const connection = new Connection(RPC_URL, 'confirmed');
  const treasuryWeb3Keypair = Keypair.fromSecretKey(treasury.secretKey);
  const mintPubkey = new PublicKey(mint.publicKey.toString());

  console.log('Creating associated token account for treasury...');
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    treasuryWeb3Keypair,
    mintPubkey,
    treasuryWeb3Keypair.publicKey
  );
  console.log('Treasury ATA:', ata.address.toString());

  console.log(`Minting initial supply: ${SUPPLY.toString()} ${TOKEN_SYMBOL} (raw: ${rawAmount.toString()})...`);
  const mintSig = await mintTo(
    connection,
    treasuryWeb3Keypair,
    mintPubkey,
    ata.address,
    treasuryWeb3Keypair,
    rawAmount
  );
  console.log('Mint tx confirmed:', mintSig);

  const result = {
    network: 'devnet',
    mint: mint.publicKey.toString(),
    treasury: treasury.publicKey.toString(),
    treasuryAta: ata.address.toString(),
    decimals: DECIMALS,
    initialSupply: SUPPLY.toString(),
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    explorer: `https://explorer.solana.com/address/${mint.publicKey.toString()}?cluster=devnet`,
    mintTxSignature: mintSig,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(path.dirname(new URL(import.meta.url).pathname), 'bhumi-token-info.json'),
    JSON.stringify(result, null, 2)
  );

  console.log('\n=== DONE ===');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
