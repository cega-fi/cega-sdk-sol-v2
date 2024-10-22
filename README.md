# Cega SDK for Solana Smart Contract Vaults

[![npm (tag)](https://img.shields.io/npm/v/@cega-fi/cega-sdk-sol-v2)](https://www.npmjs.com/package/@cega-fi/cega-sdk-sol-v2)
[![npm bundle size (scoped version)](https://img.shields.io/bundlephobia/minzip/@cega-fi/cega-sdk-sol-v2/latest.svg)](https://bundlephobia.com/result?p=@cega-fi/cega-sdk-sol-v2@latest)

This is the official SDK V2 for interacting with Cega’s Solana-based smart contract (SC) vaults. It provides an interface to communicate with Cega’s vaults on the Solana blockchain, allowing developers to integrate these functionalities into their projects with ease.

## Features

- Communicate with Cega’s Solana smart contract vaults.
- Supports Solana’s web3.js and SPL token interactions.
- Easily integrated into Solana-based decentralized applications (dApps).

## Installation

You can install the SDK via npm or yarn:

```
# Using yarn
yarn add @cega-fi/cega-sdk-sol-v2

# Using npm
npm install @cega-fi/cega-sdk-sol-v2
```

## Available Scripts

The SDK includes several scripts for development and formatting:

> Important: This project has been developed using Yarn from the beginning, so you must continue using Yarn to manage dependencies and scripts. Using npm may create a conflicting `package-lock.json` file, which can cause issues with dependency resolution.

#### build

```
yarn build
```

This script compiles the TypeScript code into JavaScript using the TypeScript compiler (tsc). The compiled files will be available in the dist/ directory.

#### prepublishOnly

```
yarn prepublishOnly
```

This script ensures that the SDK is built before being published. It runs automatically during the npm publish process to avoid any missing build artifacts.

#### format-fix

```
yarn format-fix
```

This script formats all the files in the project using Prettier, ensuring that your code follows the project’s style guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Resources

- Cega dApp - [app.cega.fi](https://app.cega.fi/)
- Cega Docs - [docs.cega.fi](https://docs.cega.fi)
