'use strict';
const self = Object.assign(module.exports, {
    _lastError: null,
    _parse_options(...options) {
        return Object.assign({
            comment: false,
        }, ...options);
    },
    parse(input, ...options) {
        options = self._parse_options(...options);
        if (!Array.isArray(input)) {
            input = input.split(/\r\n|\r(?!\n)|\n/);
        }
        let _cache = {
            i: 0,
            deep: 0,
            path: 'root',
            comment: [],
            comment_inline: '',
            in_comment: false,
            i2: 0,
            s: '',
            empty_line: 0,
            path_obj: ['root'],
        };
        let regexp = /(?!\\)"|[#{}=]/ug;
        let data = {};
        let _data = self._new_row(_cache, data);
        label_1: while (_cache.i < input.length) {
            let line = input[_cache.i].trim();
            let _cache_row = {
                index: 0,
                lastIndex: 0,
                in_comment_inline: false,
            };
            let _do = true;
            label_2: while (_do) {
                let m = regexp.exec(line);
                if (!m) {
                    _do = false;
                }
                if (m) {
                    switch (m[0]) {
                        case '"':
                            _cache_row.in_string = !_cache_row.in_string;
                            if (_cache_row.in_string) {
                                _cache_row.index = m.index;
                            }
                            else {
                                _cache.s_last = _cache.s;
                                _cache.s = self.substr_index(line, _cache_row.lastIndex, regexp.lastIndex);
                                _cache_row.lastIndex = regexp.lastIndex;
                                if (_data.chk_object > 1 && !_data.is_array && _cache.in_value || _data.chk_object && _cache.in_value) {
                                    _data.is_object = true;
                                    _data.is_array = false;
                                    _data.chk_object = 0;
                                }
                                if (_cache.in_value && !_data.is_array) {
                                    _data.is_object = true;
                                    _data.data = _data.data || {};
                                    _data.data[_cache.key] = _cache.s;
                                    _cache.s = '';
                                    _cache.in_value = false;
                                }
                                else if (_data.chk_object > 1) {
                                    _data.chk_object = 0;
                                    if (_data.is_array || !_data.is_object) {
                                        _data.is_object = false;
                                        _data.is_array = true;
                                        _cache.in_value = false;
                                        _data.data = _data.data || [];
                                        if (_cache.s_last !== undefined) {
                                            _data.data.push(_cache.s_last);
                                        }
                                    }
                                }
                                else if (_data.chk_object) {
                                    _data.chk_object = 2;
                                }
                                if (_data.is_array) {
                                    _data.data.push(_cache.s);
                                }
                            }
                            break;
                        case '#':
                            if (_cache_row.in_string) {
                                continue label_2;
                            }
                            else {
                                let comment = line.substr(m.index);
                                if (_cache.in_value) {
                                    _cache.s = self.substr_index(line, _cache_row.lastIndex, m.index - 1);
                                    _data.data[_cache.key] = _cache.s;
                                    _cache.s = '';
                                    _cache.in_value = false;
                                    _cache_row.in_comment_inline = true;
                                }
                                else if (!_data.is_array && _cache_row.m_last && _cache_row.m_last[0] == '"') {
                                    _cache_row.in_comment_inline = true;
                                }
                                if (_cache_row.in_comment_inline) {
                                    if (_cache.comment.length) {
                                        _data.comment = _cache.comment;
                                    }
                                    _data.comment_inline[_cache.key] = comment;
                                    _cache.comment_inline = comment;
                                    _cache.in_comment = false;
                                    _cache.comment = [];
                                }
                                else {
                                    _cache.in_comment = true;
                                    _cache.comment.push(comment);
                                }
                                _cache_row.lastIndex = regexp.lastIndex = line.length;
                            }
                            break;
                        case '=':
                            if (_cache_row.in_string) {
                                continue label_2;
                            }
                            else {
                                if (!_cache.s) {
                                    _cache.s = self.substr_index(line, _cache_row.lastIndex, m.index);
                                    if (_cache.in_value && !data.is_array && /\s/.test(_cache.s)) {
                                        let a = self.parseValue(self._array_split(_cache.s));
                                        if (a.length == 2) {
                                            _data.data = _data.data || {};
                                            _data.data[_cache.key] = a[0];
                                            _cache.s = a[1];
                                        }
                                        else if (a.length > 1) {
                                            throw '';
                                        }
                                    }
                                }
                                _cache.key = _cache.s;
                                _cache.s = '';
                                if (_data.chk_object) {
                                    _data.is_object = true;
                                    _data.is_array = false;
                                    _data.chk_object = 0;
                                }
                                _cache.in_value = true;
                                _cache.key = self._data_attr(_data, _cache.key, void (0), {
                                    new: true,
                                    default: {},
                                    _data: _data,
                                    _cache: _cache,
                                    data: data,
                                    _cache_row: _cache_row,
                                });
                                _cache_row.lastIndex = regexp.lastIndex;
                                if (_cache.key == '=') {
                                    throw '';
                                }
                                delete _cache.s_last;
                            }
                            break;
                        case '{':
                            if (_cache_row.in_string) {
                                continue label_2;
                            }
                            else {
                                _cache.deep++;
                                if (!_cache.key) {
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
                            if (_cache_row.in_string) {
                                continue label_2;
                            }
                            else {
                                _cache.deep--;
                                let key = _cache.path_obj.pop();
                                _cache.path = _cache.path_obj.join('/');
                                if (_data.chk_object) {
                                    _data.data = _data.data || [];
                                    let a = self._array_split(self.substr_index(line, _cache_row.lastIndex, m.index - 1));
                                    a = self.parseValue(a);
                                    _data.data = self._array_push(_data.data, a);
                                }
                                else if (_cache.in_value) {
                                    let a = self.substr_index(line, _cache_row.lastIndex, m.index);
                                    a = self.parseValue(a);
                                    _data.data[_cache.key] = a;
                                }
                                _cache.in_value = false;
                                _data.chk_object = 0;
                                _cache_row.lastIndex = regexp.lastIndex;
                                _cache.s = '';
                                data[_cache.path].data[key] = _data.data;
                                _data = data[_cache.path];
                                delete _cache.s_last;
                            }
                            break;
                    }
                }
                _cache_row.m_last = m;
            }
            let s = self.substr_index(line, _cache_row.lastIndex);
            if (!_do) {
                if (s != '' && !_cache.in_value && _data.chk_object) {
                    _data.is_object = false;
                    _data.is_array = true;
                }
                if (_data.is_array) {
                    let a = s.split(' ');
                    a = self.parseValue(a);
                    _data.data = self._array_push(_data.data, a);
                }
            }
            if (s != '' && _cache.in_value && !_data.is_array) {
                let s = self.substr_index(line, _cache_row.lastIndex);
                if (s != '') {
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
    _data_attr(o, key, value, temp) {
        if (temp.new && o.data && key in o.data) {
            key += '#' + temp._cache.i2;
            temp._cache.i2++;
        }
        {
            o.data = o.data || temp.default;
        }
        o.data[key] = value;
        return key;
    },
    _array_push(a, b) {
        a = a || [];
        if (!(b == '' || !b.length || b.length == 1 && b[0] == '')) {
            a = a.concat(b);
        }
        return a;
    },
    _array_split(s) {
        return s.split(/[\s\uFEFF\xA0]+/);
    },
    _parseValue(value) {
        return JSON.parse(value);
    },
    parseValue(value) {
        if (Array.isArray(value)) {
            return value.reduce(function (a, b) {
                a.push(self.parseValue(b));
                return a;
            }, []);
        }
        try {
            if (typeof value == 'string' && !/["'\.{}$#=_\/\\]/.test(value)) {
                return self._parseValue(value);
            }
        }
        catch (e) {
            self._lastError = e;
        }
        return value;
    },
    substr_index(s, start, end) {
        if (end) {
            s = s.substr(start, end - start);
        }
        else {
            s = s.substr(start);
        }
        return s.trim();
    },
    _new_row(_cache, data) {
        let _parent = null;
        if (_cache.key) {
            _parent = data[_cache.path];
            let p = _cache.path_obj.concat(_cache.key).join('/');
            if (p in data) {
            }
            _cache.path_obj.push(_cache.key);
            _cache.path = _cache.path_obj.join('/');
        }
        let _data = {
            path: _cache.path_obj.join('/'),
            data: void (0),
            _cache: {},
            comment: [],
            comment_inline: {},
            parent: _parent,
        };
        data[_data.path] = _data;
        return _data;
    },
});
