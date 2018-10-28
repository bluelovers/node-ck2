/**
 * Created by user on 2017/3/2.
 */

const self = Object.assign(module.exports, {

		stringify: require('./stringify').stringify,

		equal(...arr)
		{
			if (arr.length > 1)
			{
				let _init = true;
				let _last;

				for (let a of arr)
				{
					if (!a || !(typeof a == 'string' || typeof a == 'object'))
					{
						throw '';
					}

					let data = typeof a != 'string' ? self.stringify(a) : a;

					if (_init)
					{
						_init = false;
						_last = data;

						continue;
					}

					if (data !== _last)
					{
						return false;
					}

					_last = data;
				}

				return true;
			}

			throw '';
		},

	}
);
