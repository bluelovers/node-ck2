/**
 * Created by user on 2017/3/10.
 */

const ck2 = require('..');
const fs = require('fs');
const fs2 = require('../src/fs');
const path = require('upath2');

const Iconv = require('iconv').Iconv;

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

let iconv = new Iconv('UTF-8', ENCODING);
let buffer = iconv.convert(output);

fs2.writeFileSync(file_output, buffer);
