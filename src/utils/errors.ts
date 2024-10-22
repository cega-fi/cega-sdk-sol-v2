import * as anchor from "@coral-xyz/anchor";
import fcnIdl from "../idl/fcn.json";

export class TransactionError extends Error {
  code: number;

  txId: string;

  constructor(msg: string, name: string, code: number, txId: string) {
    super(msg);
    this.name = name;
    this.code = code;
    this.txId = txId;
  }
}

export function parseIdlErrors(idl: anchor.Idl): Map<number, string> {
  const errors = new Map();
  if (idl.errors) {
    idl.errors.forEach((e) => {
      const msg = e.msg ?? e.name;
      errors.set(e.code, msg);
    });
  }
  return errors;
}

export const fcnIdlErrors = parseIdlErrors(fcnIdl as anchor.Idl);
