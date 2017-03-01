/**
 * Created by user on 2017/3/1.
 */

'use strict';

const LF = "\n";
const TAB = "\t";

const stringWidth = require('string-width');

const self = Object.assign(module.exports, {

		_lastError: null,

		_stringify_options(...options)
		{
			return Object.assign({
					comment: false,
					pretty: true,
					//pretty: false,
					print_length: 50,
				}, ...options
			);
		},

		stringify(input, ...options)
		{
			options = self._stringify_options(...options);

			let output = self._stringify(input, options, 0).replace(/[\s\t]+$/mg, '');

			return output;
		},

		str_length(s)
		{
			return stringWidth(s + '');
			return s.length;
		},

		_array_join(input, options, deep)
		{
			let not_root = !!deep;

			let c = "\t".repeat(deep);

			//console.log(input);

			if (options.pretty && options.print_length)
			{
				let len = 0;
				let output = '';

				deep++;

				for (let v of input)
				{
					let c2 = (len || output) ? ' ' : '';

					len += self.str_length(v);

					if (len > options.print_length)
					{
						output += LF + c + v;

						len = 0;
					}
					else
					{
						output += c2 + v;
					}
				}

				return output;
			}

			return input.join(' ');
		},

		_object_join(input, options, deep)
		{
			let not_root = !!deep;

			let output = [];

			let c = "\t".repeat(deep);

			deep++;

			let len = 0;

			for (let k in input)
			{
				let v = self._stringify(input[k], options, deep) + '';

				let line = k + ' = ' + v.trim();

				len += self.str_length(line);

				output.push(line);
			}

			let c2 = LF + c;

			if (options.pretty && len <= options.print_length)
			{
				c2 = ' ';
			}

			return output.join(c2).replace(/^\n+|\n+$/, '');
		},

		_stringify(input, options, deep = 0)
		{
			let not_root = !!deep;

			let c = "\t".repeat(deep);
			let c2 = "\t".repeat(deep > 0 ? deep - 1 : deep);

			let output = '';

			if (typeof input == 'object')
			{
				if (Array.isArray(input))
				{
					output = self._array_join(input, options, deep);
				}
				else
				{
					output = self._object_join(input, options, deep)
				}

				if (not_root)
				{
					let c3 = LF + c;
					let c4 = LF + c2;

					let len = output.length + 2;

					if (options.pretty && len <= options.print_length)
					{
						c4 = c3 = ' ';
					}

					output = c4 + '{' + c3 + output + c4 + '}';
				}
			}
			else
			{
				output = input;
			}

			return output;
		},

	}
);
