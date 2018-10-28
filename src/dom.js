'use strict';
const stringify = require('./stringify');
const self = Object.assign(module.exports, {
    _parse_key: stringify._parse_key,
    _selector_options(...options) {
        return Object.assign({
            sep: '',
        }, ...options);
    },
    selector(query, ...options) {
        options = self._selector_options(...options);
        let regexp = new RegExp('(?!\\\\)["\']|[\\\s\uFEFF\xA0]+' + options.sep, 'ug');
        let paths = [];
        let m, m_last = {
            index: 0,
            lastIndex: 0,
        };
        let _cache = {
            lastIndex: 0,
        };
        query = query.toString().trim();
        while (m = regexp.exec(query)) {
            m.lastIndex = regexp.lastIndex;
            switch (m[0]) {
                case '"':
                case "'":
                    if (!_cache.in_string) {
                        _cache.in_string = m[0];
                    }
                    else if (_cache.in_string == m[0]) {
                        _cache.in_string = false;
                        let s = query.substr(_cache.lastIndex, m.lastIndex - _cache.lastIndex);
                        paths.push(s);
                    }
                    _cache.lastIndex = m.index;
                    break;
                case options.sep:
                default:
                    if (_cache.in_string) {
                        continue;
                    }
                    if (!/['"]/ug.test(m_last[0]) && (m[0] === options.sep || /^[\s\uFEFF\xA0]+$/ug.test(m[0]))) {
                        let s = query.substr(_cache.lastIndex, m.index - _cache.lastIndex);
                        paths.push(s);
                    }
                    _cache.lastIndex = regexp.lastIndex;
                    break;
            }
            m_last = m;
        }
        if (m_last.lastIndex < query.length) {
            let s = query.substr(m_last.lastIndex);
            if (s !== '') {
                paths.push(s);
            }
        }
        return paths;
    },
    query(query, o, ...options) {
        options = self._selector_options(...options);
        let selector = self.selector(query, options);
        options.selector = selector.join(' ');
        return self._query(selector, o, options, 0);
    },
    filter(query, o, ...options) {
        options = self._selector_options(...options);
        let selector = self.selector(query, options);
        return self._query(selector, o, options, 1);
    },
    _query(selector, o, options, deep, data = [], _cache_ = {
        path: [],
    }) {
        if (!selector.length) {
            return o;
        }
        o = Object.keys(o).reduce(function (a, b) {
            let k = self._parse_key(b);
            let type_ok = typeof o[b] !== 'object' || Array.isArray(o[b]);
            let r;
            let path = _cache_.path.concat(b);
            if (selector[0] == k) {
                if (1 == selector.length) {
                    r = o[b];
                    if (deep) {
                        a = a || {};
                        a[b] = r;
                    }
                    else {
                        data = data || [];
                        data.push({
                            id: b,
                            name: k,
                            selector: options.selector,
                            value: r,
                            path: path,
                        });
                        return data;
                    }
                    return a;
                }
                selector = selector.slice(1);
            }
            else if (type_ok && selector.length) {
                if (deep == 0) {
                    return data;
                }
                return a;
            }
            let c = Object.assign({}, _cache_, {
                path: path,
            });
            r = self._query(selector, o[b], options, deep, data, c);
            if (typeof r != "undefined") {
                if (deep) {
                    a = a || {};
                    a[b] = r;
                }
                else {
                    return data;
                }
            }
            if (deep == 0) {
                return data;
            }
            return a;
        }, void (0));
        if (deep == 0) {
            return data;
        }
        return o;
    },
});
