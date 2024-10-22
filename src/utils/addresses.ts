import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const PYTH_PRICE_FEEDS = {
  localnet: {},
  // TODO: update devnet feeds, right now they mirror mainnet
  devnet: {},
  mainnet: {},
};

export const SOL_PUBKEY = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

export function getProductAddress(
  productName: string,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("PRODUCT_SEED"), Buffer.from(productName)],
    programId
  );
}

export function getProductUnderlyingTokenAddress(
  product: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("FCN_PRODUCT_UNDERLYING_SEED"), product.toBuffer()],
    programId
  );
}

export function getDepositQueueHeaderAddress(
  productAddress: PublicKey,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("DEPOSIT_QUEUE_SEED"), productAddress.toBuffer()],
    programId
  );
}

export function getVaultAddress(
  productName: string,
  vaultNumber: anchor.BN,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(productName), vaultNumber.toArrayLike(Buffer, "le", 8)],
    programId
  );
}
