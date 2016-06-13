var Lexer = require('../lexer/index');
var ParserError = require('../errors/parser-error');


/**
 * Creates a new Parser instance.
 * @class
 */
function Parser() {
}


/**
 * Parses the given CSS text document and returns a parse tree
 * or, if the content is invalid, throws a `ParserError`.
 * 
 * @param {string} text - The CSS content to parse
 * @returns {Object} - The parse tree
 */
Parser.prototype.parse = function(text) {
    var result = {},
        lexer = new Lexer();
        
    lexer.setInput(text);

    processZeroOrMore(lexer, 'COMMENT', function (token) {
        if (!result.components) {
            result.components = [];
        }
        result.components.push(parseComponent(lexer));
    });

    if (lexer.peek()) {
        throw parseError(lexer.peek(), 'EOF');
    }

    result.components = result.components.sort(function (a, b) {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    })

    return result;
}


/**
 * Parses a CSS component using the passed lexer instance.
 */
function parseComponent(lexer) {
    var component = {};

    processOne(lexer, 'TEXT', function (token) {
        component.name = token.value;
    });

    if (lexer.nextTokenIs('TEXT')) {
        component.description = parseDescription(lexer);
    }

    processZeroOrMore(lexer, 'SECTION', function (token) {
        var section;
        var sectionId = token.value.toLowerCase();
        if (sectionId === 'elements') {
            component.elements = parseBemSection(lexer);
        } else if (sectionId === 'modifiers') {
            component.modifiers = parseBemSection(lexer);
        } else if (sectionId === 'example' || sectionId.startsWith('example:')) {
            if (!component.examples) {
                component.examples = [];
            }
            section = parseExampleSection(lexer);
            if (token.value.length > 8) {
                section.name = token.value.substring(9);
            }
            component.examples.push(section);
        } else {
            throw new ParserError('Unknown section "' + sectionId + "'", token.line);
        }
    });

    return component;
}

/**
 * Parses a description by combining concurrent TEXT tokens
 * using the passed lexer.
 */
function parseDescription(lexer) {
    var description;

    processZeroOrMore(lexer, 'TEXT', function (token) {
        if (!description) {
            description = token.value;
        } else {
            description += '\n\n' + token.value;
        }
    });

    return description;

}


/**
 * Parses a CSS BEM section using the passed lexer.
 */
function parseBemSection(lexer) {
    var section;

    processOne(lexer, 'TABLE', function (token) {
        section = token.value.map(function (row) {
            return {
                name: row[0],
                description: row[1]
            }
        });
    });

    return section;
}


/**
 * Parses a useage example section using the passed lexer.
 */
function parseExampleSection(lexer) {
    var example = {};

    if (lexer.nextTokenIs('TEXT')) {
        example.description = parseDescription(lexer);
    }

    processOne(lexer, 'CODE', function (token) {
         example.code = token.value;
    });
    return example;
}


/**
 * Test for and consume a single token.
 */
function processOne(lexer, tokenName, callback) {
    if (lexer.nextTokenIs(tokenName)) {
        callback(lexer.token());
    } else {
        throw parseError(lexer.peek(), tokenName);
    }
}


/**
 * Test for and processes a token 0 or more times.
 */
function processZeroOrMore(lexer, tokenName, callback) {
    while (lexer.nextTokenIs(tokenName)) {
        callback(lexer.token());
    }
}


/**
 * Helper for creating parser Errors
 */
function parseError(token, tokenName) {
    if (!token) {
        return new ParserError('Expected ' + tokenName + ', got EOF');
    }
    return new ParserError('Expected ' + tokenName + ', got ' + token.name, token.line);
}


module.exports = Parser;
