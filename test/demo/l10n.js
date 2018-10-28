'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const fs2 = require("../../src/fs");
const path = require("upath2");
const Promise = require("bluebird");
Promise.promisifyAll(fs);
const csv = require("fast-csv");
const ENCODING = 'GBK';
const path_gbk = 'D:/Users/Documents/Paradox Interactive/Crusader Kings II/mod/A Game of Thrones （整合版）/localisation';
const path_en = 'D:/Users/Documents/Paradox Interactive/Crusader Kings II/mod/A Game of Thrones/localisation.old';
const path_output = 'D:/Users/Documents/The Project/JetBrains/ck2/test/temp/localisation';
let lists = {};
(async () => {
    let files = await fs.readdir(path_gbk);
    let ps = [];
    await Promise.all(files.map(async (file) => {
        await load_gbk(path.join(path_gbk, file), ENCODING);
    }))
        .catch((err) => {
    });
    {
        let files = await fs.readdir(path_en);
        await Promise.all(files.map(async (file) => {
            await load_merge(path.join(path_en, file));
        }))
            .catch((err) => {
        });
    }
})();
async function load_merge(file, encoding) {
    let CSV_STRING = await fs.readFile(file);
    let options_csv = {
        delimiter: ';',
    };
    options_csv.ignoreEmpty = true;
    options_csv.comment = '#';
    options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(12)).slice(0, 12);
    {
        let m;
        if (m = /^(#CODE;)?.+;x[;,]?/im.exec(CSV_STRING)) {
            if (m[1] == '#CODE;') {
                options_csv.headers = m[0].split(';');
            }
            else {
                m = m[0].split(';');
                options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(m.length)).slice(0, m.length);
            }
        }
    }
    let arr = [];
    let a = csv
        .fromString(CSV_STRING, options_csv)
        .on("data", function (data) {
        let row = Array(12);
        if (data['#CODE'] in lists) {
            data[ENCODING] = lists[data['#CODE']][ENCODING];
            row[1] = data[ENCODING];
            row[2] = data.ENGLISH;
        }
        else {
            row[1] = data.ENGLISH;
        }
        row[0] = data['#CODE'];
        arr.push(row);
    })
        .on("end", function () {
        let dest = path.join(path_output, path.basename(file));
        csv.writeToString(arr, {
            delimiter: ';',
            escape: '',
        }, function (err, data) {
            fs2.writeFileSync(dest, data, {
                to: ENCODING + '//TRANSLIT//IGNORE',
            });
        });
    });
}
async function load_gbk(file, encoding) {
    let CSV_STRING = await fs.readFile(file);
    if (encoding != 'ENGLISH') {
        CSV_STRING = fs2.convert_utf8(CSV_STRING, encoding);
    }
    let options_csv = {
        delimiter: ';',
    };
    options_csv.ignoreEmpty = true;
    options_csv.comment = '#';
    options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(12)).slice(0, 12);
    {
        let m;
        if (m = /^(#CODE;)?.+;x,?/im.exec(CSV_STRING)) {
            if (m[1] == '#CODE;') {
                options_csv.headers = m[0].split(';');
            }
            else {
                m = m[0].split(';');
                options_csv.headers = ['#CODE', 'ENGLISH'].concat(Array(m.length)).slice(0, m.length);
            }
        }
        options_csv.headers[1] = encoding;
    }
    return new Promise(function (resolve, reject) {
        csv
            .fromString(CSV_STRING, options_csv)
            .on("data", function (data) {
            lists[data['#CODE']] = lists[data['#CODE']] || {};
            lists[data['#CODE']][encoding] = data[encoding];
        })
            .on('error', function (err, ...a) {
            reject(err);
        })
            .on("end", function () {
            resolve(true);
        });
    })
        .then((data) => {
    })
        .catch((err) => {
        console.log('error', err);
    });
}
