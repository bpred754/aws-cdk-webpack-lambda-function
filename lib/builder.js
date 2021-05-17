"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const spawn = require("cross-spawn");
const path_1 = require("path");
/**
 * Builder
 */
class Builder {
    constructor(options) {
        this.options = options;
        try {
            this.webpackBinPath = path_1.resolve(require.resolve("webpack-cli"), "..", "..", "..", ".bin", "webpack-cli");
        }
        catch (err) {
            throw new Error("It looks like webpack-cli is not installed. Please install webpack and webpack-cli with yarn or npm.");
        }
    }
    build() {
        const args = [
            "--config",
            path_1.resolve(this.options.config),
            "--output-library-type",
            "commonjs",
            "--entry",
            path_1.resolve(this.options.entry),
            "--output-path",
            path_1.resolve(path_1.dirname(this.options.output)),
            "--output-filename",
            path_1.basename(this.options.output),
        ].filter(Boolean);
        const results = spawn.sync(this.webpackBinPath, args, {
            encoding: "utf-8",
        });
        if (results.error) {
            throw results.error;
        }
        if (results.status !== 0) {
            const { pid, status, stderr, signal, stdout } = results;
            throw new Error(JSON.stringify({ pid, signal, status, stdout, stderr }, null, 2));
        }
    }
}
exports.Builder = Builder;
