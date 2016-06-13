var Parser = require('../lib/parser');

describe('Component', function() {
    var parser;
    
    beforeEach(function () {
        parser = new Parser();
    });
    
    it('should parse a comment containing a name', function() {
        var expected = {
            components: [{
                name: 'Test'
            }]
        };
        expect(parser.parse('/*===Test===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test ===*/')).toEqual(expected);
        expect(parser.parse('/* === Test === */')).toEqual(expected);
        expect(parser.parse('/*===\nTest\n=== */')).toEqual(expected);
        expect(parser.parse('/*===\n\nTest\n\n=== */')).toEqual(expected);
        expect(parser.parse('/*===\n \nTest\n \n=== */')).toEqual(expected);
    });

    it('should parse a comment containing a name and a single-line description', function() {
        var expected = {
            components: [{
                name: 'Test',
                description : 'description'
            }]
        };
        expect(parser.parse('/*=== Test\n\ndescription ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n\n\ndescription ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n \n \ndescription ===*/')).toEqual(expected);
    });

    it('should parse a comment containing a name and a multi-line description', function() {
        var expected = {
            components: [{
                name: 'Test',
                description : 'Description paragraph 1\n\nDescription paragraph 2'
            }]
        };
        expect(parser.parse('/*=== Test\n\nDescription paragraph 1\n\nDescription paragraph 2 ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n\nDescription paragraph 1\n\n\nDescription paragraph 2 ===*/')).toEqual(expected);
    });

    it('should parse a section', function() {
        var expected = {
            components: [{
                name: 'Test',
                examples: [
                    {code: '<code>1</code>'}
                ],
            }]
        };
        expect(parser.parse('/*=== Test\n\nExample\n-------\n<code>1</code> ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n\nExample\n-------\n\n<code>1</code> ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n\nExample\n-------\n \n<code>1</code> ===*/')).toEqual(expected);
        expect(parser.parse('/*=== Test\n\nExample\n-------\n \n \n<code>1</code> ===*/')).toEqual(expected);
    }); 
    
    it('should parse multiple sections', function() {
        var expected = {
            components: [{
                name: 'Test',
                examples: [
                    {code: '<code>1</code>'},
                    {code: '<code>2</code>'}
                ],
            }]
        };
        expect(parser.parse('/*=== Test\n\nExample\n-------\n\n<code>1</code>\n\nExample\n-------\n\n<code>2</code> ===*/')).toEqual(expected);
    }); 
});
