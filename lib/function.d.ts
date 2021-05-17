import { Function, FunctionOptions, Runtime, SingletonFunction } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";
/**
 * Properties for a NodejsFunction
 */
export interface WebpackFunctionProps extends FunctionOptions {
    /**
     * Path to the entry file (JavaScript or TypeScript).
     *
     * @example - aws/lambda/yourFunction.ts
     */
    readonly entry: string;
    /**
     * Path to webpack config file.
     */
    readonly config: string;
    /**
     * The name of the exported handler in the entry file.
     *
     * @default handler
     */
    readonly handler?: string;
    /**
     * The runtime environment. Only runtimes of the Node.js family are
     * supported.
     *
     * @default - NODEJS_14
     */
    readonly runtime?: Runtime;
    /**
     * The build directory
     *
     * @default - `.build` in the entry file directory
     */
    readonly buildDir?: string;
    /**
     * Ensure a unique build path
     *
     * @default - true
     */
    readonly ensureUniqueBuildPath?: boolean;
    /**
     * Skip the webpack build. Useful for CI/CD pipelines with separate package and deployment steps
     *
     * @default - false
     */
    readonly skipBuild?: boolean;
}
export interface WebpackSingletonFunctionProps extends WebpackFunctionProps {
    readonly uuid: string;
    readonly lambdaPurpose?: string;
}
/**
 * A Node.js Lambda function bundled using Parcel
 */
export declare class WebpackFunction extends Function {
    constructor(scope: Construct, id: string, props: WebpackFunctionProps);
}
export declare class WebpackSingletonFunction extends SingletonFunction {
    constructor(scope: Construct, id: string, props: WebpackSingletonFunctionProps);
}
