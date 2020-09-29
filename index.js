
const fs = require('fs'),
	path = require('path');

class Dot {

	constructor(config = {}) {
		this.config = {
			verbose: config.verbose,
			log: config.log || console.log,
			path: config.path || path.resolve(process.cwd(), '.env'),
			encoding: config.encoding || 'utf8',
			parser: {
				newlineChar: '\n',
				values: /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,
				replaceNewline: /\\n/g,
				newline: /\n|\r|\r\n/,
				...(config.parser || {})
			}
		};
	}

	log(...arg) {
		if (this.config.verbose) {
			this.config.log(...arg);
		}
	}

	isQuoted(value) {
		const end = value.length - 1,
			double = (value[0] === '"' && value[end] === '"');
		return double || (value[0] === '\'' && value[end] === '\'') ? {end: end, double: double} : null;
	}

	trim(value) {
		const p = this.config.parser,
			quoted = this.isQuoted(value);

		if (quoted) {
			const subValue = value.substring(1, quoted.end);
			if (quoted.double) {
				return subValue.replace(p.replaceNewline, p.newlineChar);
			}
			return subValue;
		}
		return value.trim();
	}

	parse(str) {
		const out = {},
			p = this.config.parser,
			lines = str.split(p.newline);

		for (const i in lines) {
			const keyValue = lines[i].match(p.values);
			if (keyValue) {
				out[keyValue[1]] = this.trim(keyValue[2] || '');
			} else {
				this.log(`did not match key and value when parsing line ${i}: ${lines[i]}`);
			}
		}

		return out;
	}

	get() {
		try {
			const parsed = this.parse(fs.readFileSync(this.config.path, {encoding: this.config.encoding}).toString());
			for (const i in parsed) {
				if (!process.env[i]) {
					process.env[i] = parsed[i];
				} else {
					this.log(`"${i}" is already defined in \`process.env\` and will not be overwritten`);
				}
			}
			return {parsed: parsed};
		} catch (e) {
			return {error: e};
		}
	}

}

module.exports.config = (config) => {
	return new Dot(config).get();
};

module.exports.parse = (str, config) => {
	return new Dot(config).parse(str.toString());
};
