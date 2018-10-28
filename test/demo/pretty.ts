/**
 * Created by user on 2017/3/10.
 */

import ck2 = require('../../index');
import fs = require('fs');
import fs2 = require('../../src/fs');
import path = require('upath2');
import * as _iconv from 'iconv-jschardet';

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

let buffer = _iconv.BufferFrom(output, 'UTF-8', ENCODING)

fs2.writeFileSync(file_output, buffer);
