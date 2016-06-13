var Handlebars = require('Handlebars');

Handlebars.registerHelper('textblock', function(text) {
    if (text) {
        text = Handlebars.Utils.escapeExpression(text);
        text = text.replace(/\n\n/g, '</p><p>');
        text = new Handlebars.SafeString('<p>' + text + '</p>')
    }
    return text;
});

Handlebars.registerHelper('anchor', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    return new Handlebars.SafeString(text.toLowerCase());
});

function render(template, data) {
    return Handlebars.compile(template)(data);
}

module.exports = {
    render: render
};
