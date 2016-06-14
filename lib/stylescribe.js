/**
 * Stylescribe - A CSS documentation tool.
 * @module cssdoc
 */

var Parser = require('./parser');
var ParserError = require('./errors/parser-error');
var render = require('./renderer').render;
var version = require('../package.json').version;

/**
 * Returns a documentation tree for the given
 * CSS text.
 */
function parse(cssText) {
    var parser = new Parser();
    return parser.parse(cssText);
}


/**
 * Returns a formatted document using the passed
 * css and template.
 * 
 * @param {(string|object)} data - CSS text or document tree 
 * @param {string} templateText - template content
 */
function renderDocument(data, templateText) {
    if (typeof data === 'string') {
        data = parse(data);
    }
    return render(templateText, data);
}


module.exports = {
    parse: parse,
    renderDocument: renderDocument,
    ParserError: ParserError,
    version: version
};
