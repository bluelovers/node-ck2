/**
 * Created by user on 2017/3/1.
 */

'use strict';

const self = Object.assign(module.exports, {

		_lastError: null,

		_parse_options(...options)
		{
			return Object.assign({
					comment: false,
				}, ...options
			);
		},

		parse(input, ...options)
		{
			options = self._parse_options(...options);

			if (!Array.isArray(input))
			{
				input = input.split(/\r\n|\r(?!\n)|\n/)
			}

			let _cache = {
				i: 0,
				deep: 0,
				path: 'root',

				comment: '',
				s: '',
				empty_line: 0,

				path_obj: ['root'],
			};

			//let regexp = /(?!\\)"|[#\{\}\=]/g;
			let regexp = /(?!\\)"|[#{}=]/ug;

			let data = {};

			let _data = self._new_row(_cache, data);

			label_1: while (_cache.i < input.length)
			{
				let line = input[_cache.i].trim();

				let _cache_row = {
					index: 0,
					lastIndex: 0,
				};

				let _do = true;

				label_2: while (_do)
				{
					let m = regexp.exec(line);

					if (!m)
					{
						_do = false;
					}

					if (m)
					{
						_cache_row.m_last = m;

						switch (m[0])
						{
							case '"':
								_cache_row.in_string = !_cache_row.in_string;

								if (_cache_row.in_string)
								{
									_cache_row.index = m.index;
								}
								else
								{
									_cache.s_last = _cache.s;
									/*
									 _cache.s = line.substr(_cache_row.lastIndex,
									 regexp.lastIndex - _cache_row.lastIndex
									 ).trim();
									 */
									_cache.s = self.substr_index(line, _cache_row.lastIndex, regexp.lastIndex);

									_cache_row.lastIndex = regexp.lastIndex;

									if (_data.chk_object > 1 && !_data.is_array && _cache.in_value || _data.chk_object && _cache.in_value)
									{
										_data.is_object = true;
										_data.is_array = false;
										_data.chk_object = 0;
									}

									if (_cache.in_value && !_data.is_array)
									{
										_data.is_object = true;

										_data.data = _data.data || {};
										_data.data[_cache.key] = _cache.s;
										_cache.s = '';

										_cache.in_value = false;
									}
									else if (_data.chk_object > 1)
									{
										_data.chk_object = 0;

										if (_data.is_array || !_data.is_object)
										{
											_data.is_object = false;
											_data.is_array = true;
											_cache.in_value = false;

											_data.data = _data.data || [];

											if (_cache.s_last !== undefined)
											{
												_data.data.push(_cache.s_last)
											}
										}
									}
									else if (_data.chk_object)
									{
										_data.chk_object = 2;
									}

									if (_data.is_array)
									{
										_data.data.push(_cache.s)
									}

									//console.log([m, _cache, _cache_row, _data]);

								}

								break;
							case '#':
								if (_cache_row.in_string)
								{
									continue label_2;
								}
								else
								{
									//_cache.comment += line.substr(_cache_row.index) + "\n"

									if (_cache.in_value)
									{
										_cache.s = self.substr_index(line, _cache_row.lastIndex, m.index - 1);

										_data.data[_cache.key] = _cache.s;
										_cache.in_value = false;

										//console.log(555, m, _cache_row, _cache, _data);
									}

									_cache_row.lastIndex = regexp.lastIndex = line.length;

									//console.log(333, regexp.lastIndex, m, _cache_row, _cache, _data);
								}

								break;
							case '=':
								if (_cache_row.in_string)
								{
									continue label_2;
								}
								else
								{


									//console.log(_cache.i, _cache.s)

									if (!_cache.s)
									{
										//_cache.s = line.substr(_cache_row.lastIndex, m.index - _cache_row.lastIndex);
										_cache.s = self.substr_index(line, _cache_row.lastIndex, m.index);

										if (_cache.in_value && !data.is_array && /\s/.test(_cache.s))
										{
											let a = self.parseValue(_cache.s.split(/\s+/));

											if (a.length == 2)
											{
												_data.data = _data.data || {};

												_data.data[_cache.key] = a[0];

												_cache.s = a[1];
											}

											//console.log(_cache.i, m, _cache.s, _cache_row, _cache);
										}

										//console.log(_cache.i, m, _cache.s, _cache_row, _cache);
									}

									_cache.key = _cache.s;
									_cache.s = '';

									if (_data.chk_object)
									{
										_data.is_object = true;
										_data.is_array = false;
										_data.chk_object = 0;
									}

									_cache.in_value = true;

									_data.data = _data.data || {};

									_data.data[_cache.key] = null;

									_cache_row.lastIndex = regexp.lastIndex;

									//console.log(666, _cache_row, _cache, _data);

									if (_cache.key == '=')
									{
										//console.log(666, m, line, _cache_row, _cache, _data);

										throw '';
									}

									delete _cache.s_last;
								}

								break;
							case '{':
								if (_cache_row.in_string)
								{
									continue label_2;
								}
								else
								{
									_cache.deep++;

									_cache.path_obj.push(_cache.key);
									_cache.path = _cache.path_obj.join('/');

									if (!_cache.key)
									{
										console.log([m, _cache, _cache_row, _data, data]);
									}

									_data = self._new_row(_cache, data);

									_cache.in_value = false;
									_data.chk_object = 1;

									_data.is_array = _data.is_object = false;

									_cache_row.lastIndex = regexp.lastIndex;

									delete _cache.s_last;
								}

								break;
							case '}':
								if (_cache_row.in_string)
								{
									continue label_2;
								}
								else
								{
									_cache.deep--;

									let key = _cache.path_obj.pop();
									_cache.path = _cache.path_obj.join('/');

									if (_data.chk_object)
									{
										//console.log(777, line, _cache_row.lastIndex, m.index);

										/*
										 _data.data = line.substr(_cache_row.lastIndex,
										 m.index - _cache_row.lastIndex
										 ).trim().split(" ");
										 */
										_data.data = _data.data || [];

										let a = self.substr_index(line, _cache_row.lastIndex, m.index - 1).split(" ");

										a = self.parseValue(a);

										//_data.data = _data.data.concat(a);
										_data.data = self._array_push(_data.data, a);
									}
									else if (_cache.in_value)
									{
										let a = self.substr_index(line, _cache_row.lastIndex, m.index);
										a = self.parseValue(a);

										_data.data[_cache.key] = a;
									}

									_cache.in_value = false;

									_data.chk_object = 0;
									_cache_row.lastIndex = regexp.lastIndex;

									_cache.s = '';

									data[_cache.path].data[key] = _data.data;

									//console.log([m, key, _cache, _cache_row, _data, data]);

									//_data = undefined;
									_data = data[_cache.path];

									//console.log([m, _cache, _cache_row, _data]);

									delete _cache.s_last;
								}

								break;
						}
					}

					//console.log([m, line, _cache, _cache_row]);
				}

				let s = self.substr_index(line, _cache_row.lastIndex);

				if (!_do)
				{
					if (s != '' && !_cache.in_value && _data.chk_object)
					{
//						console.log([444, s, _cache, _cache_row, _data]);

						_data.is_object = false;
						_data.is_array = true;

//						let a = s.split(' ');
//						a = self.parseValue(a);
//
//						console.log(s, a);
					}

					if (_data.is_array)
					{
						//console.log([444, s, _cache, _cache_row, _data]);

						let a = s.split(' ');
						a = self.parseValue(a);

//						_data.data = _data.data || [];
//						_data.data = _data.data.concat(a);

						_data.data = self._array_push(_data.data, a);

//						console.log(a);
					}
				}

				if (s != '' && _cache.in_value && !_data.is_array)
				{
					let s = line.substr(_cache_row.lastIndex).trim();

					//console.log([888, _cache, _cache_row]);

					if (s != '')
					{
						_data.is_object = true;
						_data.is_array = false;

						_data.data = _data.data || {};
						_data.data[_cache.key] = self.parseValue(s);
						_cache.s = '';

						_cache.in_value = false;
					}
				}

				_cache.i++;
			}

			return data.root.data;
		},

		_array_push(a, b)
		{
			a = a || [];

			if (!(b == '' || !b.length || b.length == 1 && b[0] == ''))
			{
				a = a.concat(b);
			}

			return a;
		},

		_parseValue(value)
		{
			return JSON.parse(value);
		},

		parseValue(value)
		{
			if (Array.isArray(value))
			{
				return value.reduce(function (a, b)
					{
						a.push(self.parseValue(b));
						return a;
					}, []
				);
			}

			try
			{
				if (typeof value == 'string' && !/["'\.{}$#=_\/\\]/.test(value))
				{
					return self._parseValue(value);
				}
			}
			catch (e)
			{
				self._lastError = e;
			}

			return value;
		},

		substr_index(s, start, end)
		{
			if (end)
			{
				s = s.substr(start, end - start);
			}
			else
			{
				s = s.substr(start);
			}

			return s.trim();
		},

		_new_row(_cache, data)
		{
			let _data = {
				path: _cache.path_obj.join('/'),
				data: void(0),
				_cache: {},
			};

			data[_data.path] = _data;

			return _data;
		},

	}
);
