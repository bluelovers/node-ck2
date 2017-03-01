/**
 * Created by user on 2017/3/1.
 */

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

		convert_utf8(input, from = ENCODING, to = ENCODING)
		{
			let iconv = new Iconv(from, to);
			let buffer = iconv.convert(input);
			return buffer.toString(to);
		},

	}
);
