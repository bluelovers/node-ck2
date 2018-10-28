/**
 * Created by user on 2017/3/12.
 */

'use strict';

import ck2 = require('../../index');
import fs = require('fs-extra');
import fs2 = require('../../src/fs');
import path = require('upath2');

import Promise = require("bluebird");
Promise.promisifyAll(fs);

import csv = require('fast-csv');

const ENCODING = 'GBK';

// 已經漢化過的資料夾位址
const path_gbk = 'D:/Users/Documents/Paradox Interactive/Crusader Kings II/mod/A Game of Thrones （整合版）/localisation';
// 未漢化的資料夾位置
const path_en = 'D:/Users/Documents/Paradox Interactive/Crusader Kings II/mod/A Game of Thrones/localisation.old';
// 整合輸出後的資料夾位置
const path_output = 'D:/Users/Documents/The Project/JetBrains/ck2/test/temp/localisation';

let lists = {};

(async () => {



	//let files;

	let files = await fs.readdir(path_gbk);

	let ps = [];

	/*
	for (let v of files)
	{
		let p = load_gbk(path.join(path_gbk, v), ENCODING);
		ps.push(p)
	}

	await Promise.all(ps);
	*/

	await Promise.all(files.map(async (file) => {
		await load_gbk(path.join(path_gbk, file), ENCODING);
	}))
	.catch((err)=>{
		//console.log('error', err);
	});

	//console.log(777, lists);

	{
		let files = await fs.readdir(path_en);

		await Promise.all(files.map(async (file) => {
			await load_merge(path.join(path_en, file));
		}))
		.catch((err)=>{
			//console.log('error', err);
		});
	}

})();

async function load_merge(file, encoding?)
{
	let CSV_STRING = await fs.readFile(file);

	let options_csv = {
		delimiter: ';',
		//quote: null,
		//strictColumnHandling: false,
	};

	options_csv.ignoreEmpty = true;
	options_csv.comment = '#';

	options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(12)).slice(0, 12);

	{
		let m;

		if (m = /^(#CODE;)?.+;x[;,]?/im.exec(CSV_STRING))
		{
			if (m[1] == '#CODE;')
			{
				options_csv.headers = m[0].split(';');
			}
			else
			{
				m = m[0].split(';');

				options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(m.length)).slice(0, m.length);
			}
			//console.log(options_csv.headers);
		}

	}

	let arr = [];

	let a = csv
	.fromString(CSV_STRING, options_csv)
	.on("data", function(data)
	{
		let row = Array(12);

		if (data['#CODE'] in lists)
		{
			data[ENCODING] = lists[data['#CODE']][ENCODING];
			row[1] = data[ENCODING];

			row[2] = data.ENGLISH;
		}
		else
		{
			row[1] = data.ENGLISH;
		}

		row[0] = data['#CODE'];

		arr.push(row);
	})
	.on("end", function(){

		let dest = path.join(path_output, path.basename(file))

		//console.log(arr)

		/*
		let ws = fs.createWriteStream(dest);

		csv
		.writeToStream(ws, arr, {
			delimiter: ';',
			escape: '',
			//quote: null,
		})
		*/

		csv.writeToString(arr, {
			delimiter: ';',
			escape: '',
			//quote: null,
		}, function(err, data){

			fs2.writeFileSync(dest, data, {
				to: ENCODING + '//TRANSLIT//IGNORE',
			});

		});

	});

	//console.log(a)
}

async function load_gbk(file, encoding)
{
	let CSV_STRING = await fs.readFile(file);

	if (encoding != 'ENGLISH')
	{
		CSV_STRING = fs2.convert_utf8(CSV_STRING, encoding);
	}

	let options_csv = {
		delimiter: ';',
		//quote: null,
		//strictColumnHandling: false,
	};

	options_csv.ignoreEmpty = true;
	options_csv.comment = '#';

	options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(12)).slice(0, 12);

	{
		let m;

		if (m = /^(#CODE;)?.+;x,?/im.exec(CSV_STRING))
		{
			if (m[1] == '#CODE;')
			{
				options_csv.headers = m[0].split(';');
			}
			else
			{
				m = m[0].split(';');

				options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(m.length)).slice(0, m.length);
			}

			//console.log(options_csv.headers);
		}

		options_csv.headers[1] = encoding;
	}

	//console.log(file, options_csv.headers.length, options_csv.headers);

	return new Promise(function(resolve, reject)
	{
		csv
		.fromString(CSV_STRING, options_csv)
		.on("data", function(data){
			//console.log(data);

			lists[data['#CODE']] = lists[data['#CODE']] || {};

			lists[data['#CODE']][encoding] = data[encoding];
		})
		.on('error', function(err, ...a){
			reject(err);
		})
		.on("end", function(){
			resolve(true);
		});
	})
	.then((data)=>{
		//console.log('done', data, file);
	})
	.catch((err)=>{
		console.log('error', err);
	})
}

