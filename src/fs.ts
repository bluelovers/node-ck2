/**
 * Created by user on 2017/3/1.
 */

'use strict';

const fs = require('fs');
const Iconv = require('iconv').Iconv;

const ENCODING = 'UTF-8';
//const ENCODING = 'GBK';

const self = Object.assign(module.exports, {

		ENCODING: ENCODING,

		_lastError: null,

		_readFile_options(...options)
		{
			return Object.assign({
					to_array: true,
					from: ENCODING,
					to: ENCODING,
				}, ...options
			);
		},

		readFile(file, options = {})
		{
			options = self._readFile_options(options);

			let input = fs.readFileSync(file);
			input = self.convert_utf8(input, options.from, options.to);

			return options.to_array ? input.split(/\r\n|\r(?!\n)|\n/) : input;
		},

		writeFileSync(file, data, options)
		{
			options = self._readFile_options(options);
			let output = self.iconv(data, options.from, options.to);
			return fs.writeFileSync(file, output, options);
		},

		iconv(input, from = ENCODING, to = ENCODING)
		{
			if (from == to || !from || !to)
			{
				return input;
			}

			let iconv = new Iconv(from, to);
			let buffer = iconv.convert(input);

			return buffer;
		},

		convert_utf8(input, from = ENCODING, to = ENCODING)
		{
			let buffer = self.iconv(input, from, to);
			return buffer.toString(to);
		},

	}
);
