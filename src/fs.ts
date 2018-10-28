/**
 * Created by user on 2017/3/1.
 */

import { crlf, chkcrlf, LF, CRLF, CR } from 'crlf-normalize';
import * as _iconv from 'iconv-jschardet';
import * as fs from 'fs-extra';

export const ENCODING = 'UTF-8';
export type ENCODING = 'UTF-8' | 'GBK' | string | null

_iconv.disableCodecDataWarn(true)

export interface IOptions
{
	to_array?: boolean
	from?: ENCODING,
	to?: ENCODING,
}

export function _readFile_options<T extends IOptions | fs.WriteFileOptions>(...options: T[]): IOptions & T
{
	return Object.assign({
			to_array: true,
			from: ENCODING,
			to: ENCODING,
		}, ...options
	);
}

export function readFile(file: string, options: IOptions & {
	to_array: true
}): string[]
export function readFile(file: string, options?: IOptions): string
export function readFile(file, options: IOptions = {})
{
	options = _readFile_options(options);

	let input = fs.readFileSync(file) as any as string;
	input = convert_utf8(input, options.from, options.to);

	return options.to_array ? crlf(input.toString(), LF).split(LF) : input;
}

export function writeFileSync(file: string, data, options?: IOptions & fs.WriteFileOptions)
{
	options = _readFile_options(options);
	let output = iconv(data, options.from, options.to);
	return fs.writeFileSync(file, output, options);
}

export function iconv<T extends Buffer | string>(input: T, from: ENCODING = ENCODING, to: ENCODING = ENCODING)
{
	if (from == to || !from || !to)
	{
		return input;
	}

	return _iconv.BufferFrom(input, to, from);
}

export function convert_utf8(input, from = ENCODING, to = ENCODING): string
{
	let buffer = iconv(input, from, to);
	// @ts-ignore
	return buffer.toString(to);
}
