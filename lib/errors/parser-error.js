function ParserError(message, line) {
    this.name = 'ParserError';
    if (line) {
        this.line = line;
        this.message = message + ' at line ' + line;
    } else {
        this.message = message;
    }
    Error.captureStackTrace(this);
}

ParserError.prototype = Object.create(Error.prototype);

module.exports = ParserError;
