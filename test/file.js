/**
 * Created by user on 2017/3/1.
 */

'use strict';

const local_dev = require('./_local-dev');
const path = require('upath2');

const ck2 = require('..');
const fs = require('fs');
const fs2 = require('../src/fs');

describe(local_dev.path_relative(__filename), function ()
	{
		const ENCODING = 'GBK';

		let _file_ = [
			/*
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\settings.txt',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\FE4\\eu4_export\\mod\\Converted_k_silesia769_09_29\\common\\countries\\Z00.txt',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\FE4\\interface\\messagetypes_custom.txt',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\FE4\\eu4_export\\mod\\Converted_k_silesia769_09_29\\history\\countries\\Z00.txt',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\mod\\FE4\\common\\cultures\\FE4_cultures.txt',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\mod\\FE4\\interface\\ag_FE4_domestic_r12crusaders_religion.gui',
			 'D:\\Users\\Documents\\Paradox Interactive\\Crusader Kings II\\mod\\FE4\\common\\traits\\remedy_portrait_traits.txt',
			 */
		];

		{
			let dir = __dirname + '/file/';

			let files = fs.readdirSync(dir);

			files.forEach(function(file)
			{
				_file_.push(dir + file);
			});
		}

		let options = {
			//pretty: false,
		};

		describe('file', function ()
			{
				this.timeout(0);

				_file_.forEach(function (file)
				{
					it(local_dev.path_relative(file), () =>
						{
							let input = fs2.readFile(file, {
								from: ENCODING,
							});

							let data = ck2.parse(input);
							let output = ck2.stringify(data, options);
							let data2 = ck2.parse(output);

//							console.log(file);
//							console.log(input);
//							console.log(data);
							//console.log(output);

							expect(data).to.deep.equal(data2);

							expect(ck2.equal(data, data2)).to.equal(true);
						}
					);
				});
			}
		);

	}
);
