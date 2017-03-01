# node-ck2
GFX game configuration format parser. Crusader Kings II | Paradox Interactive

`npm install ck2`

this version is very stupid and slow, wellcome rewrite code

```js

const ck2 = require('ck2');
const assert = require('assert');

let options = {
	//pretty: false,
	comment: false,
	pretty: true,
	//pretty: false,
	print_length: 50,
};

let input = `
##########remedy_fe_swapping6##########
fe131  = { random = no customizer = no hidden = yes } #辛格尔德
fe132  = { random = no customizer = no hidden = yes } #艾丝琳
fe133  = { random = no customizer = no hidden = yes } #亚斯穆尔
fe134  = { random = no customizer = no hidden = yes } #克尔特
fe135  = { random = no customizer = no hidden = yes }	#拜隆
fe136  = { random = no customizer = no hidden = yes }	#林格
fe137  = { random = no customizer = no hidden = yes }	#雷普托尔
fe138  = { random = no customizer = no hidden = yes }	#兰格巴鲁特

loputousu = {
		graphical_culture = westerngfx
		graphical_unit_culture = western
		
		color = { 1.0 0.0 0.0 }
		
		# ?222 ?254 ?208 ?240 ?
		}
		}
`;

let data = ck2.parse(input, options);
let output = ck2.stringify(data, options);
let data2 = ck2.parse(output, options);

console.log(data);

assert.deepEqual(data, data2);
```

