import { PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

/**
 * Wallet interface for objects that can be used to sign provider transactions.
 */
export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export class DummyWallet implements Wallet {
  constructor() { }

  async signTransaction(_tx: Transaction): Promise<Transaction> {
    throw Error('Not supported by dummy wallet!');
  }

  async signAllTransactions(_txs: Transaction[]): Promise<Transaction[]> {
    throw Error('Not supported by dummy wallet!');
  }

  get publicKey(): PublicKey {
    throw Error('Not supported by dummy wallet!');
  }
}

export interface TokenAccount {
  mint: PublicKey;
  owner: PublicKey;
  amount: anchor.BN;
  decimals: number;
}
