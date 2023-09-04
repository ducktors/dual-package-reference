# Monorepo for Dual-Packages with CommonJS and ESM Support

This monorepo is designed to test the development and distribution of dual-packages that can be consumed by both CommonJS and ESM (ECMAScript Module) Node.js applications. It is managed using [pnpm](https://pnpm.io/). The structure of the monorepo consists of two main folders: `apps` and `packages`.

## Table of Contents
- [Purpose](#purpose)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Creating Dual-Packages](#creating-dual-packages)
  - [Consuming Dual-Packages](#consuming-dual-packages)
- [License](#license)

## Purpose

The primary purpose of this monorepo is to enable the development of packages compatible with both CommonJS and ESM, allowing them to be used in different Node.js environments seamlessly. Achieving this compatibility requires specific configurations in the `package.json` file of each package, along with leveraging TypeScript's latest features.

### Using the `exports` Field

In your package's `package.json` file, you can use the `exports` field to specify the entry points for your package, enabling dual-package support. Here's an example of how to set up the `exports` field for a package:

```json
{
  "type": "module", // Indicates that the packages is written as ESM
  "exports": {
    ".": {
      "import": "./dist/index.js", // ESM entry point
      "require": "./dist/index.cjs"  // CommonJS entry point
    }
  },
  // Other package.json configuration...
}
```

In this example:
- `"type": "module"` indicates that the package is written as ECMAScript Modules (ESM). This means the package source (`.ts` files) will be emitted as .js files with ESM syntax. Every dual package has some kind of build process that emits CommonJS, too.
- The `"exports"` field specifies the entry points for both ESM and CommonJS consumers.
  - `"import"` points to the ESM entry point.
  - `"require"` points to the CommonJS entry point.

### Using TypeScript's `module` and `moduleResolution`

To ensure TypeScript understands and resolves the ESM and CommonJS entry points correctly, you can use TypeScript's `module` and `moduleResolution` options in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    // Other TypeScript options...
  }
}
```

With `"module": "NodeNext"` and `"moduleResolution": "NodeNext"` TypeScript will correctly handle imports and resolve ESM and CommonJS modules based on the specified entry points in the `exports` field of the package's `package.json`.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) (v8.6.12 or higher)

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/ducktors/dual-package-reference.git
   ```

2. Navigate to the root directory of the monorepo:

   ```bash
   cd dual-package-reference
   ```

3. Install the dependencies for the entire monorepo using pnpm:

   ```bash
   pnpm install
   ```

## Usage
First, from the repo's root directory, build all the packages and applications calling:

`$ pnpm build`.

After everything is built, you can run all applications from the root folder using:

`$ pnpm start`

### Checking the emitted files and types
This monorepo installs [arethetypeswrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) as a dependency. From the monorepo root folder, you can check the compatibility of every package calling:

`$ pnpm attw`

## Exploring Dual-Packages

This repository explores all possible source and target combinations using tsc and tsup to build the dual-packages. We also use `"composite": true` in the `tsconfig.json` files to enable the `references` field in the `tsconfig.json` files of the applications. This allows us to consume the dual-packages as part of the monorepo and have a faster and better experience within the IDE.

The following table shows the possible combinations of source and targets:

|name|compiler|package.json type|
|---|---|---|
dual-package-tsc-cjs | tsc | CommonJS
dual-package-tsc-esm | tsc | ESM
dual-package-tsup-cjs | tsup | CommonJS
dual-package-tsup-esm | tsup | ESM

### TSC limitations
The packages that use tsc as the compiler need two different `tsconfig.json` files to emit both formats properly. In `dual-package-tsc-cjs` package, this additional configuration file is called `tsconfig.esm.json` since the default compilation emits ESM thanks to the `"type": "module"` property in the `package.json` file. On the other hand, `dual-package-tsc-esm` package needs a `tsconfig.cjs.json` file to emit CommonJS.

### TSUP limitations
As of this exploration's date, tsup cannot emit declaration maps. This prevents the package that uses tsup from having a correct "go-to definition" behavior in monorepos. In fact, when an ESM (`"type": "module"` in package.json) first package is consumed inside CommonJS application (`"type": "commonjs"` in package.json), the IDE will jump to the `*.d.cts` file. The same goes if a CommonJS package is consumed inside an ESM application. It works only when the type of the application and the package match.

## Consuming Dual-Packages
The app folder shows you how to consume a dual-pacakge. 
To do it properly, you must add a reference inside the application's `tsconfig.json` pointing to the dual-package's `tsconfig.json` file. This will allow the IDE to resolve the imports and provide a better experience. Moreover, after running the application, you can check that based on the application type (`"type": "module"` or `"type": "commonjs"`), the correct entry point is used. The opposite compilation target is used when the application's and package's types do not match. 

## License
MIT