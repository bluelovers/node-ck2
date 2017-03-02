/**
 * Created by user on 2017/3/1.
 */

const self = Object.assign(module.exports, {

		parse: require('./parse').parse,

		stringify: require('./stringify').stringify,

		equal: require('./equal').equal,

		selector: require('./dom').selector,
		query: require('./dom').query,
		filter: require('./dom').filter,

	}
);
