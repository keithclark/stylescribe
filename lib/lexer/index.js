var utils = require('../utils');

var RE_CSS_DOC_COMMENT_BLOCK = /(\/*\*\s*={3,})([\w\W]*?)={3,}\s*\*\//g;
var RE_CSS_DOC_COMMENT_CHUNK_DELIMITER = /(^(?:-{3,}\s*|\s*)$\n)/m;
var RE_CSS_DOC_COMMENT_TABLE = /(^((.*? {3,})+).*$\s?)+/m;
var RE_CSS_DOC_COMMENT_TABLE_CELLS = /\s{3,}/g;


/**
 * Creates a new Lexer instance with an optional
 * css text string.
 * @class
 */
function Lexer(cssText) {
    if (cssText) {
        this.setInput(cssText);
    }
}


/**
 * Sets the input value of the lexer. Clears any
 * existing tokens and resets the pointer.
 */
Lexer.prototype.setInput = function (cssText) {
    delete this.currentBlock;
    this.buffer = cssText;
    this.position = 0;
    this.peek();
}


/**
 * Returns the next token and advances the pointer
 */
Lexer.prototype.token = function () {
    var token = this.nextToken;
    if (token) {
        delete this.nextToken;
        this.peek();
    }
    return token;
}


/**
 * Checks the name of the next token
 */
Lexer.prototype.nextTokenIs = function (tokenName) {
    return this.peek() && this.peek().name === tokenName;
}


/**
 * Returns the next token without advancing the pointer
 */
Lexer.prototype.peek = function () {
    var token = null,
        chunks, chunk, whitespace, value;

    if (typeof this.nextToken !== 'undefined') {
        return this.nextToken;
    }
    if (this.currentBlock) {
        // Break the current block into chunks of content and
        // seperator whitespace
        chunks = this.currentBlock.split(RE_CSS_DOC_COMMENT_CHUNK_DELIMITER);
        chunk = chunks.shift();
        whitespace = chunks.shift();

        // The first element will be empty if the chunk starts
        // with whitespace so we advance the buffer position and
        // consume another chunk.
        if (!chunk) {
            this.position += whitespace.length;
            chunk = chunks.shift();
            whitespace = chunks.shift();
        }

        // Replace current block with remaining content
        this.currentBlock = chunks.join('');

        // If this chunk code...
        if (chunk.trimLeft().startsWith('<') && chunk.trimRight().endsWith('>')) {
            token = {
                name: 'CODE',
                value: utils.normalizeIndent(chunk).trim()
            };
        }

        // If this chunk is a new section...
        if (!token && whitespace && whitespace.startsWith('-')) {
            token = {
                name: 'SECTION',
                value: chunk.trim()
            };
        }

        // If this chunk is a table..
        if (!token) {
            value = chunk.match(RE_CSS_DOC_COMMENT_TABLE);
            if (value) {
                token = {
                    name: 'TABLE',
                    value: value[0].trim().split(/\n/g).map(function (row) {
                        return row.split(RE_CSS_DOC_COMMENT_TABLE_CELLS).map(utils.normalizeWhitespace);
                    })
                };
            }
        }

        // If this chunk is text..
        if (!token && chunk) {
            token = {
                name: 'TEXT',
                value: chunk.trim()
            };
        }

        // Set the current token position
        if (token) {
            token.pos = this.position;
        }
            // Advance the buffer position
            this.position += chunk.length;
            if (whitespace) {
                this.position += whitespace.length;
            }
        

    } else {
        RE_CSS_DOC_COMMENT_BLOCK.lastIndex = this.position;
        value = RE_CSS_DOC_COMMENT_BLOCK.exec(this.buffer);
        if (value) {
            this.currentBlock = value[2];
            token = {
                name: 'COMMENT',
                value: '',
                pos: value.index
            }
            this.position = value.index + value[1].length;
        }
    }

    if (token) {
        token.line = getLineBreakCount(this.buffer, token.pos);
    }

    this.nextToken = token;

    return token;
}


/**
 * returns the number of line breaks in a string
 */
function getLineBreakCount(text, pos) {
    return text.substring(0, pos).split(/\n/).length;
}

module.exports = Lexer;
