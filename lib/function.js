"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackSingletonFunction = exports.WebpackFunction = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const builder_1 = require("./builder");
/**
 * A Node.js Lambda function bundled using Parcel
 */
class WebpackFunction extends aws_lambda_1.Function {
    constructor(scope, id, props) {
        const { runtime, handlerDir, outputBasename, handler } = preProcess(props);
        super(scope, id, {
            ...props,
            runtime,
            code: aws_lambda_1.Code.fromAsset(handlerDir),
            handler: `${outputBasename}.${handler}`,
        });
    }
}
exports.WebpackFunction = WebpackFunction;
class WebpackSingletonFunction extends aws_lambda_1.SingletonFunction {
    constructor(scope, id, props) {
        const { runtime, handlerDir, outputBasename, handler } = preProcess(props);
        super(scope, id, {
            ...props,
            runtime,
            code: aws_lambda_1.Code.fromAsset(handlerDir),
            handler: `${outputBasename}.${handler}`,
        });
    }
}
exports.WebpackSingletonFunction = WebpackSingletonFunction;
function preProcess(props) {
    const skipBuild = typeof props.skipBuild === "boolean"
        ? props.skipBuild
        : false;
    if (props.runtime && props.runtime.family !== aws_lambda_1.RuntimeFamily.NODEJS) {
        throw new Error("Only `NODEJS` runtimes are supported.");
    }
    if (!/\.(js|ts)$/.test(props.entry)) {
        throw new Error("Only JavaScript or TypeScript entry files are supported.");
    }
    if (!skipBuild && !fs_1.existsSync(props.entry)) {
        throw new Error(`Cannot find entry file at ${props.entry}`);
    }
    if (!skipBuild && !fs_1.existsSync(props.config)) {
        throw new Error(`Cannot find webpack config file at ${props.config}`);
    }
    const handler = props.handler || "handler";
    const runtime = props.runtime || aws_lambda_1.Runtime.NODEJS_14_X;
    const buildDir = props.buildDir || path_1.join(path_1.dirname(props.entry), ".build");
    const ensureUniqueBuildPath = typeof props.ensureUniqueBuildPath === "boolean"
        ? props.ensureUniqueBuildPath
        : true;
    const handlerDir = ensureUniqueBuildPath
        ? createUniquePath(buildDir, props.entry)
        : buildDir;
    const outputBasename = path_1.basename(props.entry, path_1.extname(props.entry));
    const outFile = path_1.join(handlerDir, outputBasename + ".js");
    if (!skipBuild) {
        // Build with webpack
        const builder = new builder_1.Builder({
            entry: path_1.resolve(props.entry),
            output: path_1.resolve(outFile),
            config: path_1.resolve(props.config),
        });
        builder.build();
    }
    else {
        if (!fs_1.existsSync(outFile)) {
            throw new Error(`Cannot find built file at ${outFile}`);
        }
    }
    return { runtime, handlerDir, outputBasename, handler };
}
function createUniquePath(buildDir, currentPath) {
    return path_1.join(buildDir, crypto_1.createHash("sha256").update(currentPath).digest("hex"));
}
