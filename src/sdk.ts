import * as anchor from '@coral-xyz/anchor';
import { Connection, ConfirmOptions } from '@solana/web3.js';
import { defaultCommitment } from './utils/utils';
import { Fcn } from './types/fcn';

export default class CegaSolSDKV2 {
  private _connection: Connection;
  private _confirmationOptions: ConfirmOptions;
  private _provider: anchor.AnchorProvider;
  private _signerWallet: anchor.Wallet;

  // Programs
  private _fcnProgram?: anchor.Program<Fcn>;

  constructor(
    connection: Connection,
    signerWallet: anchor.Wallet,
    opts: ConfirmOptions = defaultCommitment(),
  ) {
    this._connection = connection;
    this._provider = new anchor.AnchorProvider(connection, signerWallet, opts);
    this._signerWallet = signerWallet;
    this._confirmationOptions = opts;
  }

  setProvider(provider: anchor.AnchorProvider) {
    this._provider = provider;
  }

  setSignerWallet(signerWallet: anchor.Wallet) {
    this._signerWallet = signerWallet;
    this._provider = new anchor.AnchorProvider(
      this._connection,
      signerWallet,
      this._confirmationOptions,
    );
  }

  getProducts() {
    return this._fcnProgram?.account.fcnProduct.all();
  }
}
