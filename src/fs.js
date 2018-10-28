"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crlf_normalize_1 = require("crlf-normalize");
const _iconv = require("iconv-jschardet");
const fs = require("fs-extra");
exports.ENCODING = 'UTF-8';
_iconv.disableCodecDataWarn(true);
function _readFile_options(...options) {
    return Object.assign({
        to_array: true,
        from: exports.ENCODING,
        to: exports.ENCODING,
    }, ...options);
}
exports._readFile_options = _readFile_options;
function readFile(file, options = {}) {
    options = _readFile_options(options);
    let input = fs.readFileSync(file);
    input = convert_utf8(input, options.from, options.to);
    return options.to_array ? crlf_normalize_1.crlf(input.toString(), crlf_normalize_1.LF).split(crlf_normalize_1.LF) : input;
}
exports.readFile = readFile;
function writeFileSync(file, data, options) {
    options = _readFile_options(options);
    let output = iconv(data, options.from, options.to);
    return fs.writeFileSync(file, output, options);
}
exports.writeFileSync = writeFileSync;
function iconv(input, from = exports.ENCODING, to = exports.ENCODING) {
    if (from == to || !from || !to) {
        return input;
    }
    return _iconv.BufferFrom(input, to, from);
}
exports.iconv = iconv;
function convert_utf8(input, from = exports.ENCODING, to = exports.ENCODING) {
    let buffer = iconv(input, from, to);
    return buffer.toString(to);
}
exports.convert_utf8 = convert_utf8;
