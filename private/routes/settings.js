const _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid');
const {isLength} = require('validator');

const {isNumber} = require('../../shared/validations');

const db = require('../utils/db');
const {getData} = db;
const {CURRENCY_TABLE, CATEGORY_TABLE, LABEL_TABLE, ENTRY_TABLE} = db.tables;

const {getUserByPublicCode} = require('../utils/authentication');

const {valEntry} = require('../../shared/validations/entry');

const CODE_LEN = 36;

module.exports = {
	// ======================= >> CURRENCY << =======================
	saveCurrency(req, res) {
		const code = _.get(req.body, 'code', '');
		const currency = _.get(req.body, 'currency', '');
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0 || !isLength(code, CODE_LEN) || !isLength(currency, 3) || isNumber(currency)) {
			res.status(406).end();
			return;
		}

		const {id: userId, private_code} = user;
		const localCurrency = _.get(getData(CURRENCY_TABLE, {private_code}), '[0]', {});

		if (_.size(localCurrency) > 0) {

			db.table(CURRENCY_TABLE)
				.find({id: localCurrency.id})
				.assign({currency, update_date_time: new Date().toISOString()})
				.value();

		} else {

			db.table(CURRENCY_TABLE)
				.push({
					id: uuid.v4(),
					currency,
					user_id: userId,
					private_code,
					entry_date_time: new Date().toISOString()
				})
				.value();
		}

		res.status(200).end();
	},
	// Currency and Exchange
	getCurrency(req, res) {
		const code = _.get(req.query, 'code', '');
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0 || !isLength(code, CODE_LEN)) {
			res.status(406).end();
			return;
		}

		const {private_code} = user;
		let {currency, exchange} = _.get(getData(CURRENCY_TABLE, {private_code}), '[0]', {});
		currency = currency || '';
		exchange = exchange || 1;

		res.send({currency, exchange});
	},
	// ======================= >> EXCHANGE << =======================
	saveExchange(req, res) {
		const code = _.get(req.body, 'code', '');
		const exchange = _.get(req.body, 'exchange', '');
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0 || !isNumber(exchange)) {
			res.status(406).end();
			return;
		}

		const {id: userId, private_code} = user;
		const localCurrency = _.get(getData(CURRENCY_TABLE, {private_code}), '[0]', {});

		if (_.size(localCurrency) > 0) {

			db.table(CURRENCY_TABLE)
				.find({id: localCurrency.id})
				.assign({exchange, update_date_time: new Date().toISOString()})
				.value();

		} else {

			db.table(CURRENCY_TABLE)
				.push({
					id: uuid.v4(),
					exchange,
					user_id: userId,
					private_code,
					entry_date_time: new Date().toISOString()
				})
				.value();
		}

		res.status(200).end();
	},
	// ======================= >> CATEGORY << =======================
	saveCategory(req, res) {
		const {code, category} = req.body;
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0 || _.size(category) === 0) {
			res.status(406).end();
			return;
		}

		const {id: user_id, private_code} = user;
		const dbCategory = getData(CATEGORY_TABLE, {
			user_id,
			private_code,
			category
		});

		if (_.size(dbCategory) > 0) {
			res.status(406).end();
			return;
		}

		db.table(CATEGORY_TABLE)
			.push({
				id: uuid.v4(),
				category,
				user_id,
				private_code,
				active: true,
				entry_date_time: new Date().toISOString()
			})
			.value();

		res.status(200).end();
	},
	updateCategory(req, res) {
		const {code, id, category, active: act} = req.body;
		const user = getUserByPublicCode(code);
		const {id: user_id, private_code} = user;

		const active = _.toString(act) === 'true';
		if (_.size(user) === 0 || _.size(id) === 0 || _.size(category) === 0 || !_.isBoolean(active)) {
			res.status(406).end();
			return;
		}

		const dbCategory = getData(CATEGORY_TABLE, {
			user_id,
			private_code,
			id
		});

		if (_.size(dbCategory) === 0) {
			res.status(406).end();
			return;
		}

		db.table(CATEGORY_TABLE)
			.find({id: dbCategory[0].id})
			.assign({
				category,
				active,
				update_date_time: new Date().toISOString()
			})
			.value();

		res.status(200).end();
	},
	loadCategories(req, res) {
		const code = _.get(req.query, 'code', '');
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0) {
			res.status(406).end();
			return;
		}

		const dbCategory = db.table(CATEGORY_TABLE)
			.filter({user_id: user.id})
			.map((category) => _.pick(category, ['id', 'category', 'active']))
			.sortBy('category')
			.value() || [];

		res.send(dbCategory);
	},
	// ======================= >> LABELS << =======================
	saveLabel(req, res) {
		const {code, label} = req.body;
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0 || _.size(label) === 0) {
			res.status(406).end();
			return;
		}

		const {id: user_id, private_code} = user;
		const dbLabel = getData(LABEL_TABLE, {
			user_id,
			private_code,
			label
		});

		if (_.size(dbLabel) > 0) {
			res.status(406).end();
			return;
		}

		db.table(LABEL_TABLE)
			.push({
				id: uuid.v4(),
				label,
				user_id,
				private_code,
				active: true,
				entry_date_time: new Date().toISOString()
			})
			.value();

		res.status(200).end();
	},
	updateLabel(req, res) {
		const {code, id, label, active: act} = req.body;
		const user = getUserByPublicCode(code);
		const {id: user_id, private_code} = user;

		const active = _.toString(act) === 'true';
		if (_.size(user) === 0 || _.size(id) === 0 || _.size(label) === 0 || !_.isBoolean(active)) {
			res.status(406).end();
			return;
		}

		const dbLabel = getData(LABEL_TABLE, {
			user_id,
			private_code,
			id
		});

		if (_.size(dbLabel) === 0) {
			res.status(406).end();
			return;
		}

		db.table(LABEL_TABLE)
			.find({id: dbLabel[0].id})
			.assign({
				label,
				active,
				update_date_time: new Date().toISOString()
			})
			.value();

		res.status(200).end();
	},
	loadLabels(req, res) {
		const code = _.get(req.query, 'code', '');
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0) {
			res.status(406).end();
			return;
		}

		const dbLabel = db.table(LABEL_TABLE)
				.filter({user_id: user.id})
				.map((label) => _.pick(label, ['id', 'label', 'active']))
				.sortBy('label')
				.value() || [];

		res.send(dbLabel);
	},
	// ======================= >> ENTRIES << =======================
	saveEntry(req, res) {
		if (!valEntry(req.body)) {
			res.status(406).end();
			return;
		}

		const {currency, exchange, amount, entryDate: entry_date, category, label, description, code,
			amountUSD: amount_usd, amountLC: amount_lc, exchangeCurrency: exchange_currency,
			exchangeAmount: exchange_amount} = req.body;

		const user = getUserByPublicCode(code);
		if (_.size(user) === 0) {
			res.status(406).end();
			return;
		}

		const {id: userId, private_code} = user;

		db.table(ENTRY_TABLE)
			.push({
				id: uuid.v4(),
				currency,
				exchange,
				amount,
				entry_date,
				category,
				label,
				description,
				amount_usd,
				amount_lc,
				exchange_currency,
				exchange_amount,
				month: moment(entry_date, 'YYYY-MM-DD').get('month') + 1,
				year: moment(entry_date, 'YYYY-MM-DD').get('year'),
				user_id: userId,
				private_code,
				entry_date_time: new Date().toISOString()
			})
			.value();

		res.status(200).end();
	},
	deleteEntry(req, res) {

		const {id: idEntry, code} = req.body;

		const user = getUserByPublicCode(code);
		if (_.size(user) === 0 || _.size(idEntry) === 0) {
			res.status(406).end();
			return;
		}

		const {id: userId, private_code} = user;

		db.table(ENTRY_TABLE)
			.remove({
				id: idEntry,
				user_id: userId,
				private_code
			})
			.value();

		res.status(200).end();
	},
	loadFilteredEntries(req, res) {
		const {code, filters} = req.query;
		const user = getUserByPublicCode(code);

		if (_.size(user) === 0) {
			res.status(406).end();
			return;
		}

		const dbEntries = db.table(ENTRY_TABLE)
			.filter({user_id: user.id})
			.reduce((memo, entry) => {

				let matchEntry = false; // Flag if Standard Filters does match
				let matchDate = false;  // Flag if Date Filter does match
				let includesDate = false; // Flag if "date" filter was requested

				_.each(filters, (filter) => {
					const {path, value, date} = JSON.parse(filter);

					if (!_.isEmpty(date)) {
						includesDate = true;
						// If Date comparison still pending to be found.
						// If the entry found the filter criteria, then it will select the entry as valid
						if (!matchDate) {
							const year = date[0];
							const month = date[1];

							matchDate = _.toString(_.get(entry, year.path)) === _.toString(year.value) &&
								_.toString(_.get(entry, month.path)) === _.toString(month.value);

							if (matchDate) {
								matchEntry = true;
							}

						}

					} else {

						// Check if Entry does match with the Standard filter criteria
						if (!matchEntry) {
							if (_.toString(_.get(entry, path)) === _.toString(value)) {
								matchEntry = true;
							}
						}

					}
				});

				// Is valid if the Entry matched with a criteria and date filter was not requested.
				if (matchEntry && !includesDate) {
					memo.push(_.chain(entry)
						.cloneDeep(entry)
						.omit(['user_id', 'private_code'])
						.value()
					);
				// Is valid if the Entry matched and date filter was found PLUS date criteria matched
				} else if (matchEntry && includesDate && matchDate) {
					memo.push(_.chain(entry)
						.cloneDeep(entry)
						.omit(['user_id', 'private_code'])
						.value()
					);
				// Return all entries if there are not filters
				} else if (_.size(filters) === 0) {
					memo.push(_.chain(entry)
						.cloneDeep(entry)
						.omit(['user_id', 'private_code'])
						.value()
					);
				}
				return memo;
			}, [])
			.sortBy('entry_date')
			.reverse()
			.value() || [];

		res.send(dbEntries);
	}
};
