var Parser = require('../lib/parser');

describe('BEM modifiers section', function() {
    var parser;
    
    beforeEach(function () {
        parser = new Parser();
    });  
    
    it('should return a `modifiers` object', function() {
        var cssText = '/*=== My Component\n\nModifiers\n---------\n\nbtn--primary   Primary button ===*/';
        var expected = {
            components: [{
                name: 'My Component',
                modifiers: [
                    {name: 'btn--primary', description: 'Primary button'}
                ]
            }]
        };
        expect(parser.parse(cssText)).toEqual(expected);
    });
    
    it('should throw if empty', function() {
        var cssText = '/*=== My Component\n\nModifiers\n--------\n===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected TABLE, got EOF');
    });

    it('should throw if it contains more than one token', function() {
        var cssText = '/*=== My Component\n\nModifiers\n---------\n\nbtn--primary   Primary button\n\nText ===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected EOF, got TEXT at line 8');
    });
    
    it('should throw if it contains a CODE token', function() {
        var cssText = '/*=== My Component\n\nModifiers\n---------\n\n<code></code> ===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected TABLE, got CODE at line 6');
    });

    it('should throw if it contains a TEXT token', function() {
        var cssText = '/*=== My Component\n\nModifiers\n---------\n\nText ===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected TABLE, got TEXT at line 6');
    });

});
