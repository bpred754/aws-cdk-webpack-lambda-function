# aws-cdk-webpack-lambda-function

forked from [@aws-cdk/aws-lambda-nodejs](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda-nodejs)

This library provides constructs for Node.js Lambda function bundled using webpack.

## Quick Start

1. install using yarn:

   ```sh
   yarn add -D aws-cdk-webpack-lambda-function @aws-cdk/core @aws-cdk/aws-lambda webpack webpack-cli
   # npm i -D aws-cdk-webpack-lambda-function @aws-cdk/core @aws-cdk/aws-lambda webpack webpack-cli
   ```

   Note: webpack@5 required.

1. add webpack.config.js:

   ```js
   module.exports = {
     mode: "production", // production or development
     target: "node",
     externals: [/^aws-sdk(\/.+)?$/], // important!!!
     devtool: "source-map", // if needed
     optimization: { minimize: false }, // if needed
     // for TypeScript
     module: {
       rules: [
         {
           test: /\.ts$/,
           use: {
             loader: "ts-loader",
             options: {
               configFile: "your/path/to/tsconfig.json", // if needed
               // colors: true,
               // logInfoToStdOut: true,
               // logLevel: 'INFO',
               transpileOnly: true,
             },
           },
           exclude: /node_modules/,
         },
       ],
     },
     resolve: {
       extensions: [".js", ".ts"],
     },
   };
   ```

1. (Optional) add tsconfig.json for lambda

   ```json
   {
     "extends": "../ ... /tsconfig.json",
     "compilerOptions": {
       "importHelpers": false,
       "target": "ES2018",
       "noEmit": false
     }
   }
   ```

1. your cdk source code:

   ```typescript
   import { WebpackFunction } from "aws-cdk-webpack-lambda-function";

   new WebpackFunction(this, "YourFunction", {
     entry: "your/path/to/function.ts",
     config: "your/path/to/webpack.config.js",
   });
   ```

## Options

### entry: string (required)

Path to the entry file (JavaScript or TypeScript).

### config: string (required)

Path to webpack config file.

### handler: string

The name of the exported handler in the entry file.

default: "handler"

### runtime: lambda.Runtime

The runtime environment. Only runtimes of the Node.js family are supported.

default: NODEJS_14

### buildDir: string

The build directory.

default: `.build` in the entry file directory

### ensureUniqueBuildPath: boolean

Control whether the build output is placed in a unique directory (sha256 hash) or not. This can be disabled to simplify development and debugging.

default: true

### skipBuild: boolean

Skip the webpack build. Useful for CI/CD pipelines with separate package and deployment steps

default: false

### ...other options

All other properties of lambda.Function are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).

## Run tests

```sh
yarn build
yarn test
```
