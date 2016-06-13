function normalizeWhitespace(text) {

    // remove trailing whitespace
    text = text.trim();

    // convert tabs to spaces
    text = text.replace(/\t/g, '  ');

    // remove whitespace after line breaks
    text = text.replace(/ *$/gm, '');

    return text;
}


function normalizeIndent(text) {
    var indent = text.match(/^(\s+)/);
    if (indent) {
        return text.replace(new RegExp('^' + indent[0], 'gm'), '');
    }
    return text;
}

module.exports = {
    normalizeWhitespace: normalizeWhitespace,
    normalizeIndent: normalizeIndent
};
