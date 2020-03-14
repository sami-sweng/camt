const fs = require('fs');
const util = require('util');
const xml4js = require('xml4js');
const camtNameMap = require('./name-map');

const versions = [
    '001.01',
    '001.02',
    '001.03',
    '001.04',
    '001.05',
    '001.06',
    '001.08',
];

class CamtParser {
    constructor(options = {}) {
        this.parser = new xml4js.Parser(options);
        this.options = options;
        this.map = camtNameMap;
    }

    async init() {
        await Promise.all(versions.map(version => {
            const schemaFileName = __dirname + `/xsd/camt.053.${version}.xsd`;
            return util.promisify(fs.readFile)(schemaFileName, 'utf-8')
                .then(schema => {
                    const namespace = `urn:iso:std:iso:20022:tech:xsd:camt.053.${version}`;
                    return util.promisify(this.parser.addSchema).bind(this.parser)(namespace, schema);
                });
        }));
    }

    async parseString(xml) {
        const result = await util.promisify(this.parser.parseString)(xml);

        if (this.options.skipNameMapping) {
            return result;
        } else {
            return this.mapNames(result);
        }
    }

    mapNames(object) {
        const copy = object.length ? [] : {};

        for (let key in object) {
            const newKey = this.map[key] || key;

            if (typeof object[key] === 'object' && !util.isDate(object[key])) {
                copy[newKey] = this.mapNames(object[key]);
            } else {
                copy[newKey] = object[key];
            }
        }

        return copy;
    }
}

module.exports = CamtParser;
