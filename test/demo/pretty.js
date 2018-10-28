"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ck2 = require("../../index");
const fs2 = require("../../src/fs");
const path = require("upath2");
const _iconv = require("iconv-jschardet");
const ENCODING = 'GBK';
let file = 'D:/Users/Documents/Paradox Interactive/Crusader Kings II/mod/00.plus/decisions/vassal_decisions.txt';
let file_output = '../test/temp/' + path.basename(file);
let input = fs2.readFile(file, {
    from: ENCODING,
});
let data = ck2.parse(input);
let output = ck2.stringify(data, {
    pretty: false,
});
let buffer = _iconv.BufferFrom(output, 'UTF-8', ENCODING);
fs2.writeFileSync(file_output, buffer);
