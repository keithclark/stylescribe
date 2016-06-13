var Parser = require('../lib/parser');

describe('Examples section', function() {
    var parser;
    
    beforeEach(function () {
        parser = new Parser();
    });  
    
    it('should return an `examples` array', function() {
        var cssText = '/*=== My Component\n\nExample\n---\n\n<code></code> ===*/';
        var expected = {
            components: [{
                name: 'My Component',
                examples: [{
                    code: '<code></code>'
                }]
            }]
        };
        expect(parser.parse(cssText)).toEqual(expected);
    });

    it('should support an optional title', function() {
        var cssText = '/*=== My Component\n\nExample: My Example\n---\n\n<code></code> ===*/';
        var expected = {
            components: [{
                name: 'My Component',
                examples: [{
                    name: 'My Example',
                    code: '<code></code>'
                }]
            }]
        };
        expect(parser.parse(cssText)).toEqual(expected);
    });

    it('should support an optional description', function() {
        var cssText = '/*=== My Component\n\nExample: Example 1\n---\n\nDescription\n\n<code></code> ===*/';
        var expected = {
            components: [{
                name: 'My Component',
                examples: [{
                    name: 'Example 1',
                    description: 'Description',
                    code: '<code></code>'
                }]
            }]
        };
        expect(parser.parse(cssText)).toEqual(expected);
    });

    it('should support multiple examples', function() {
        var cssText = '/*=== My Component\n\nExample: Example 1\n---\n\n<code>a</code>\n\nExample: Example 2\n---\n\n<code>b</code> ===*/';
        var expected = {
            components: [{
                name: 'My Component',
                examples: [{
                    name: 'Example 1',
                    code: '<code>a</code>'
                },{
                    name: 'Example 2',
                    code: '<code>b</code>'
                }]
            }]
        };
        expect(parser.parse(cssText)).toEqual(expected);
    });

    it('should throw if empty', function() {
        var cssText = '/*=== My Component\n\nExample\n---\n===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected CODE, got EOF');
    });

    it('should throw if a description is present and code is missing', function() {
        var cssText = '/*=== My Component\n\nExample\n---\n\nDescription ===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected CODE, got EOF');
    });

    it('should throw if it contains a TABLE token', function() {
        var cssText = '/*=== My Component\n\nExample\n---\n\ncell1   cell2\n\n<code></code> ===*/';
        expect(parser.parse.bind(parser, cssText)).toThrowError('Expected CODE, got TABLE at line 6');
    });

});
