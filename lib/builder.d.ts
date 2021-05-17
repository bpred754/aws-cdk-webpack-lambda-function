/**
 * Builder options
 */
export interface BuilderOptions {
    /**
     * entry path
     */
    readonly entry: string;
    /**
     * output path
     */
    readonly output: string;
    /**
     * webpack config file path
     */
    readonly config: string;
}
/**
 * Builder
 */
export declare class Builder {
    private readonly options;
    private readonly webpackBinPath;
    constructor(options: BuilderOptions);
    build(): void;
}
