/// <reference types="node" />
import * as fs from 'fs-extra';
export declare const ENCODING = "UTF-8";
export declare type ENCODING = 'UTF-8' | 'GBK' | string | null;
export interface IOptions {
    to_array?: boolean;
    from?: ENCODING;
    to?: ENCODING;
}
export declare function _readFile_options<T extends IOptions | fs.WriteFileOptions>(...options: T[]): IOptions & T;
export declare function readFile(file: string, options: IOptions & {
    to_array: true;
}): string[];
export declare function readFile(file: string, options?: IOptions): string;
export declare function writeFileSync(file: string, data: any, options?: IOptions & fs.WriteFileOptions): void;
export declare function iconv<T extends Buffer | string>(input: T, from?: ENCODING, to?: ENCODING): Buffer | T;
export declare function convert_utf8(input: any, from?: string, to?: string): string;
