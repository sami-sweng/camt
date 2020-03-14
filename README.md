# camt
Parse camt 053 files

## Usage
```javascript
const fs = require('fs');
const util = require('util');
const CamtParser = require('camt');


async function main() {
    const parser = new CamtParser();
    await parser.init();

    const xml = await util.promisify(fs.readFile)('camt.xml', 'utf-8');

    const result = await parser.parseString(xml);
    console.log(util.inspect(result, false, null));
}

main();
```
