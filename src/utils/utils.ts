import * as anchor from '@coral-xyz/anchor';
import { PublicKey, ConfirmOptions, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  Connection,
  TransactionSignature,
  Transaction,
  Signer,
  AccountInfo,
  sendAndConfirmRawTransaction,
  SystemProgram,
  Keypair,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  AccountLayout as TokenAccountLayout,
  createInitializeAccountInstruction,
  getMinimumBalanceForRentExemptAccount,
} from '@solana/spl-token';
import BufferLayout from 'buffer-layout';
import { TransactionError, fcnIdlErrors } from './errors';
import { TokenAccount } from '../types/sdk-types';
import { SOL_PUBKEY } from './addresses';

import _ from 'lodash'; // Used for Object Equality Comparisons
import { VaultStatus } from '../types/program-types';

export function defaultCommitment(): ConfirmOptions {
  return {
    skipPreflight: true,
    preflightCommitment: 'processed',
    commitment: 'processed',
  };
}

// Methods for SDK

// enums are stored in Rust not as integrers, but rather obejcts
// for example, a status with traded status is represented as { traded: {} }
export function getStatusNumber(status: any) {
  if (_.isEqual(status, { notTraded: {} })) {
    return VaultStatus.NotTraded;
  }
  if (_.isEqual(status, { traded: {} })) {
    return VaultStatus.Traded;
  }
  if (_.isEqual(status, { epochEnded: {} })) {
    return VaultStatus.EpochEnded;
  }
  if (_.isEqual(status, { payoffCalculated: {} })) {
    return VaultStatus.PayoffCalculated;
  }
  if (_.isEqual(status, { feesCollected: {} })) {
    return VaultStatus.FeesCollected;
  }
  if (_.isEqual(status, { processingWithdrawQueue: {} })) {
    return VaultStatus.ProcessingWithdrawQueue;
  }
  if (_.isEqual(status, { withdrawQueueProcessed: {} })) {
    return VaultStatus.WithdrawQueueProcessed;
  }
  if (_.isEqual(status, { zombie: {} })) {
    return VaultStatus.Zombie;
  }
  if (_.isEqual(status, { processingDepositQueue: {} })) {
    return VaultStatus.ProcessingDepositQueue;
  }
  if (_.isEqual(status, { depositQueueProcessed: {} })) {
    return VaultStatus.DepositQueueProcessed;
  }
}

export function nextUTC(hour: number): number {
  const date = new Date();
  const nowUTC =
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, 0, 0) / 1000;
  if (date.getUTCHours() < hour) {
    return nowUTC;
  }
  return nowUTC + 60 * 60 * 24;
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms, undefined));
}

const uint64 = (property = 'uint64') => BufferLayout.blob(8, property);

const int64 = (property = 'int64') => BufferLayout.blob(8, property);

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L758
export const ERR_BUFFER_OUT_OF_BOUNDS = () =>
  new Error('Attempt to access memory outside buffer bounds');

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L968
export const ERR_INVALID_ARG_TYPE = (name: string, expected: string, actual: string) =>
  new Error(`The "${name}" argument must be of type ${expected}. Received ${actual}`);

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L1262
export const ERR_OUT_OF_RANGE = (str: string, range: string, received: number) =>
  new Error(`The value of "${str} is out of range. It must be ${range}. Received ${received}`);

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/validators.js#L127-L130
export function validateNumber(value: number, name: string) {
  if (typeof value !== 'number') throw ERR_INVALID_ARG_TYPE(name, 'number', value);
}

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/buffer.js#L68-L80
export function boundsError(value: number, length: number) {
  if (Math.floor(value) !== value) {
    validateNumber(value, 'offset');
    throw ERR_OUT_OF_RANGE('offset', 'an integer', value);
  }

  if (length < 0) throw ERR_BUFFER_OUT_OF_BOUNDS();

  throw ERR_OUT_OF_RANGE('offset', `>= 0 and <= ${length}`, value);
}

export function readBigInt64LE(buffer: Uint8Array, offset = 0) {
  validateNumber(offset, 'offset');
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined) boundsError(offset, buffer.length - 8);
  const val =
    buffer[offset + 4] + buffer[offset + 5] * 2 ** 8 + buffer[offset + 6] * 2 ** 16 + (last << 24); // Overflow
  return (
    (BigInt(val) << BigInt(32)) +
    BigInt(
      first + buffer[++offset] * 2 ** 8 + buffer[++offset] * 2 ** 16 + buffer[++offset] * 2 ** 24,
    )
  );
}

const SystemClockLayout = BufferLayout.struct([
  uint64('slot'),
  int64('epochStartTimestamp'),
  uint64('epoch'),
  uint64('leaderScheduleEpoch'),
  int64('unixTimestamp'),
]);

export function getClockTimestamp(accountInfo: AccountInfo<Buffer>): number {
  const info = SystemClockLayout.decode(accountInfo.data);
  return Number(readBigInt64LE(info.unixTimestamp, 0));
}

export async function processTransaction(
  provider: anchor.AnchorProvider,
  tx: Transaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
): Promise<TransactionSignature> {
  const blockhash = await provider.connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash.blockhash;
  tx.feePayer = provider.wallet.publicKey;

  tx = await provider.wallet.signTransaction(tx);
  if (signers === undefined) {
    signers = [];
  }

  signers
    .filter((s) => s !== undefined)
    .forEach((kp) => {
      tx.partialSign(kp);
    });

  try {
    const txSig = await sendAndConfirmTransaction(
      provider.connection,
      tx,
      signers,
      opts || defaultCommitment(),
    );
    return txSig;
  } catch (err) {
    console.log(err);
    // Check for Timeouts
    if (`${err}`.includes('Transaction was not confirmed')) {
      const txSig = `${err}`.split('signature')[1].split(' ')[1].trim();

      // TODO: use error numbers, 999999 is a stand-in variable currently
      throw new TransactionError(
        'Transaction was not confirmed',
        'TRANSACTION_NOT_CONFIRMED',
        999999,
        txSig,
      );
    }

    const translatedErr = anchor.ProgramError.parse(err, fcnIdlErrors);
    if (translatedErr !== null) {
      throw translatedErr;
    }
    throw err;
  }
}

export async function createWrappedNativeAccount(
  connection: Connection,
  owner: PublicKey,
  payer: PublicKey,
  amount: number,
): Promise<[Transaction, Keypair]> {
  // Allocate memory for the account
  const balanceNeeded = await getMinimumBalanceForRentExemptAccount(connection);

  // Create a new account
  const newAccount = Keypair.generate();
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: TokenAccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  );

  // Send lamports to it (these will be wrapped into native tokens by the token program)
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: newAccount.publicKey,
      lamports: amount,
    }),
  );

  // Assign the new account to the native token mint.
  // the account will be initialized with a balance equal to the native token balance.
  // (i.e. amount)
  transaction.add(createInitializeAccountInstruction(newAccount.publicKey, SOL_PUBKEY, owner));

  // Send the three instructions
  return [transaction, newAccount];
}

// https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
export async function getTokenAccountsForMint(
  connection: Connection,
  mint: PublicKey,
): Promise<TokenAccount[]> {
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165, // number of bytes
      },
      {
        memcmp: {
          offset: 0, // number of bytes
          bytes: mint.toBase58(), // base58 encoded string
        },
      },
    ],
  });

  return accounts.map((acc: any) => ({
    mint: new PublicKey(acc.account.data.parsed.info.mint),
    owner: new PublicKey(acc.account.data.parsed.info.owner),
    uiAmount: acc.account.data.parsed.info.tokenAmount.uiAmount,
    amount: new anchor.BN(acc.account.data.parsed.info.tokenAmount.amount),
    decimals: acc.account.data.parsed.info.tokenAmount.decimals,
  }));
}
