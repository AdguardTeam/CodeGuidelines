# AdGuard Javascript Guidelines
*Version: 0.2*

- [Introduction](#introduction)
- [Naming Conventions](#naming-conventions)
    - [Namespaces](#namespaces)
    - [Classes and Constructors](#classes-and-constructors)
    - [Functions](#functions)
    - [Local Variables and Object Properties](#local-variables-and-object-properties)
    - [Combined declarations](#combined-declarations)
    - [Constants and Global Variables](#constants-and-global-variables)
    - [Reserved Words](#reserved-words)
- [Comments and Documentation](#comments-and-documentation)
    - [JSDoc](#jsdoc)
    - [Public Functions, Methods, Properties](#public-functions-methods-properties)
    - [Private Functions Comments](#private-functions-comments)
    - [Inline Comments](#inline-comments)
    - [Regular Expressions](#regular-expressions)
    - [Commenting Out Entire Blocks of Code](#commenting-out-entire-blocks-of-code)
- [General Code Quality](#general-code-quality)
    - [Line Length](#line-length)
    - [Method and Block Length](#method-and-block-length)
    - [File Length](#file-length)
    - [Using Semicolons](#using-semicolons)
    - [Trailing Commas](#trailing-commas)
    - [Brackets and Blocks](#brackets-and-blocks)
    - [One Class Per File](#one-class-per-file)
    - [Debugging Statements](#debugging-statements)
    - [Ternary Operators](#ternary-operators)
    - [Regular Expressions](#regular-expressions)
- [Best Practices](#best-practices)
    - [Use the Module Pattern to Encapsulate](#use-the-module-pattern-to-encapsulate)
    - [Namespace your JavaScript if you need to refer to it elsewhere](#namespace-your-javascript-if-you-need-to-refer-to-it-elsewhere)
    - [Anonymously scope JavaScript if you’re never going to call it elsewhere](#anonymously-scope-javascript-if-youre-never-going-to-call-it-elsewhere)
    - [Beware of Function Hoisting](#beware-of-function-hoisting)
    - [Be Careful With Anonymous Functions](#be-careful-with-anonymous-functions)
- [Performance](#performance)
    - [When Optimizating, Focus On The Big Things](#when-optimizating-focus-on-the-big-things)
    - [Document Reflows](#document-reflows)

## Introduction

This is a coding standard and best practices guide for Javascript we should use in AdGuard projects.

Heavily inspired by and partly composed of [Sencha code guidelines](https://github.com/sencha/code-guidelines) and [Pragmatic Javascript](https://github.com/stevekwan/best-practices/blob/master/javascript/best-practices.md) by Steve Kwan.

## Naming Conventions
> "There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors."

### Namespaces

You can use either *TitleCase* or *lowerCase* for top-level namespaces. Just keep it consistent. Always use *lowerCase* for intermediate namespaces.

```javascript
// "Foo" as the top-level namespace
// "bar" as an intermediate-level namespace
// "Baz" as the class name
Foo.bar.Baz = {};
Ext.data.reader.Json = {};

// In another project
// "foo" as the top-level namespace
// "Bar" as the class name
foo.Bar = function() {};
```

### Classes and Constructors

Always use *TitleCase* when creating classes, and constructors.

```javascript
// "MyClass" is a constructor :: new MyClass();
MyClass = function () {};
```

### Functions

* Always use *camelCase* when creating functions.
* Use leading underscore `_` when naming functions that are supposed to be private, but not encapsulated by a closure. However, **try to avoid having** such, and use [Module Pattern](#use-the-module-pattern-to-encapsulate) to encapsulate.

```javascript
// function expression
var sortSomeStuff = function () {};

// function declaration
function findSomething () {}

// the same concept applies to object functions
var someObject = {
    objectMethod: function () {},

    // if possible - use module pattern instead of that
    _notReallyPrivateMethod: function () {}
};
```

### Local Variables and Object Properties

When it's possible, always use `let` to declare local variables. However, sometimes you need to support older browsers. In this case, always use `var` -- not doing so will result in the creation of global variables, and we **must** avoid polluting the global namespace.

```javascript
// bad
foo = true;

// good
var foo = true;
```

* Uses *camelCase* when creating local variables and object properties. 
* Use a leading underscore `_` when naming properties that are supposed to be private, but not encapsulated by a closure. However, **try to avoid having** such, and use [Module Pattern]((#use-the-module-pattern-to-encapsulate)) to encapsulate.

```javascript
// local variable
var fooBar = true;

// object property
var someObject = {
    someProperty: true,

    // if possible - use module pattern instead of that
    _notSoPrivateProperty: true
};
```

Variables should be given meaningful names, so that the intended purpose and functionality of the variables is clear (while also concise). Avoid single letter names; the lone exception to this rule would be an iterator.

```javascript
// bad, too short. Not descriptive and easy to confuse with number "1"
var l = group.length;

// bad, variable name is unnecessarily long
var mainClassConfigVariableSectionOneRefreshInterval = 5000;

// good, variable name is concise yet still meaningful
var len = group.length;

// iterators are an exception
var i;
for (i = 0; i < len; i++) {}
```

### Combined declarations

Despite what you might have read in some javascript best practices docs, **avoid** using combined `var` declarations in AdGuard projects. Here is the [meaningful explanation](https://github.com/stevekwan/best-practices/blob/master/javascript/best-practices.md#combined-var-declarations).

```javascript
// bad
var foo = 1,
    bar = 2,
    baz, fuz;

// good
var foo = 1;
var bar = 2;
var baz;
var fuz;
```

### Constants and Global Variables

Use `CONSTANT_CASE` when creating global variables because of the clear visual indication that the variable is special.

```javascript
const TIMEOUT = 123;
```

### Reserved Words

Don't use reserved words as keys because they break things in older versions of Internet Explorer. Use readable synonyms in place of reserved words instead.

```javascript
// bad
var model = {
    name: 'Foo',
    private: true // reserved word!
};

// good
var model = {
    name: 'Foo',
    hidden: true
};
```

## Comments and Documentation

Have you ever heard that "good code is supposed to be self-explanatory"? I'd love to find the author of this statement and tell him everything I think about it. This guy is responsible for thousands of unmaintainable projects because devs are lazy by nature and use it as excuse whenever it's possible.

The problem is rather obvious: self-explanatory code only tell how it is working. It rarely tells how it should work. That's why we have some strict rules regarding code documentation and comments.

### JSDoc

We use [JSDoc style](https://en.wikipedia.org/wiki/JSDoc), read more about it [here](http://usejsdoc.org/).

### Public Functions, Methods, Properties

This is a very simple rule. All **public** functions, methods and properties **must** have a comment. Even if you think that the name of the function/property is simple and explains itself, your code will **not pass** the code review.

Please note that this rule is about **public** members only.

```javascript
// bad

var utils = {
    waitTimeout: 10,

    intToString: function(val) {
        if (typeof val !== "number") {
            return null;
        }

        return "" + val;
    }
};

// good

/**
 * Class that contains helper functions 
 */
var utils = {

    /**
     * Default timeout we use for setTimeout calls
     * in all the utils methods
     */
    waitTimeout: 10,

    /**
     * Converts Integer to String
     * 
     * @param val Integer value
     * @returns string value or null in the case of non-number parameter
     */
    intToString: function(val) {
        if (typeof val !== "number") {
            return null;
        }

        return "" + val;
    }
};
```

### Private Functions Comments

Javascript does not [yet](https://github.com/tc39/proposal-class-fields] provide a simple way to encapsulate private fields and functions save for some [workarounds](http://exploringjs.com/es6/ch_classes.html#sec_private-data-for-classes) or a traditional module pattern. If you declare a function that is exposed to the global scope, but it is supposed to be used internally, accompany it with a `@private` comment.

```javascript
/** @private */
this.privateFunc = function() {}
```

### Inline Comments

Inline comments should always be added when the intent or purpose of any code isn't completely explicit, but the code itself ought to be clear enough to follow logically.

```javascript
// In a majority of cases, the controller ID will be the same as the name.
// However, when a controller is manually given an ID, it will be keyed
// in the collection that way. So if we don't find it, we attempt to loop
// over the existing controllers and find it by classname
if (!controller) {
   all = controllers.items;
   for (i = 0, len = all.length; i < len; ++i) {
       cls = all[i];
       className = cls.getModuleClassName();
       if (className && className === name) {
           controller = cls;
           break;
       }
   }
}
```

### Regular Expressions

Regular expressions should also always be explained with a comment because of their inherently confusing syntax.

```javascript
// match Roman Number input
var romanNums = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
```

### Commenting Out Entire Blocks of Code

Commenting out entire blocks of code should be avoided entirely, that's why you have version control systems in place.

## General Code Quality

### Line length

Try to limit line length. This limit can be arbitrary (e.g. 80 or 100 characters) and not rigidly enforced, but the goal is to reduce the amount of horizontal scrolling for the developer.

### Method and Block Length

How long can a method or code block get before you consider breaking functionality into smaller utility methods?

A good rule-of-thumb is to limit the length of method and code blocks (e.g. 50 or 100 lines) so that they are not trying to do too much. Shorter methods are easier to test, and smaller sections of code are more quickly comprehended by developers.

### File Length

How long should a file be before you consider breaking functionality into mixins, modules or other utility classes?

As with method/block length, comments can easily impact the length of a file. Abstract classes might also be longer than usual because they define interfaces and baseline functionality. Nevertheless, defining an arbitrary file length (e.g. 500 or 1000 lines) might give you an indication of whether-or-not a class might need to be refactored.

### Using Semicolons

Automatic Semicolon Insertion (ASI) is not a feature. [Don't rely on it.](http://benalman.com/news/2013/01/advice-javascript-semicolon-haters/)

Crockford recommends putting a semicolon at the end of every simple statement because JavaScript allows any expression to be used as a statement, which can mask some tricky errors. What is worse, these errors may not be apparent in the development process but could appear in the minified production code instead, and that would make them even harder to debug.

```javascript
// bad
var a = obj
[a].forEach(logProp);
// Because a semicolon isn't used that code behaves like this:
// var a = obj[a].forEach(logProp)

// good
var a = obj;
[a].forEach(logProp); // this works fine
```

### Trailing Commas

**Avoid** using trailing commas.  

```javascript
// bad
var myArray = [ 1, 2, 3, ]; // trailing comma

// good
var myArray = [ 1, 2, 3]; // no trailing comma
```
Use trailing commas in the multiline statements
```javascript
// good
var myObject = {
    foo : 1,
    bar : 2, // trailing comma
};

// bad
var myObject = {
    foo : 1,
    bar : 2 // no trailing comma
};
```

### Brackets and Blocks

Always use brackets when creating code blocks of any kind. Every block, even if it is only one line, needs to have its own curly braces in order to avoid confusion and prevent the possibility of hard to track bugs.

```javascript
// bad
if (foobar) doSomething();
 
// good
if (foobar) {
    doSomething();
}
```

### One Class Per File

Doing so makes maintaining and debugging applications easier, because the developer knows exactly where to find their code. In addition, we recommend using a consistent approach to naming and organizing your files. The file name should match the class name defined within, and the physical file location should match the class' namespace. For example, the class `Foo.bar.Baz` might be defined in `Baz.js`. Per the full namespace, the file might be located at `/src/Foo/bar/Baz.js`.

### Debugging Statements

Debugging statements like `console.log()` and `debugger` should never be shipped into standard production environments. A better approach is to bake these statements into a service that can easily be disabled in production.

```javascript
// bad
function foo () {
    console.log('inside the foo() method');
    return true;
}

// good
function foo () {
    // where logger() only outputs statements in development
    MyApp.util.logger('inside the foo() method');
    return true;
}
```

### Ternary Operators

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices.

```javascript
// bad
var value = a && b ? 11 : a ? 10 : b ? 1 : 0;

// good
var value = isSimple ? 11 : 1;
```

Ternary expressions should never be nested because they just add to the confusion.

### Regular Expressions

> "Have a problem and you think RegEx is the solution? Now you have 2 problems."

Regular expressions are very powerful but can be confusing -- therefore keeping them maintainable is a high priority.

Don't inline regular expressions; store them in a variable to improve readability and [performance](https://jsperf.com/caching-regex-objects/15), and always add comments to explain their purpose. When it comes to performance, a better practice is to cache literal Regular Expressions in a more permanent way -- so that they are not re-compiled each time a function is run.

```javascript
// bad
function hasNumbers (value) {
    var numberTest = /\d+/; //gets re-defined on each function call

    return numberTest.test(value);
}

// good
var numberTest = /\d+/; //gets re-defined on each function call
function hasNumbers (value) {
    return numberTest.test(value);
}
```

## Best Practices

### Use the Module Pattern to Encapsulate

The Module Pattern uses functions and closures to provide encapsulation in functional languages like JavaScript.

The Module pattern is the right solution if you want to:

* Encapsulate a chunk of code and a "class" doesn't make sense
* Provide public/private support (which "classes" don't support).
* The Module Pattern tends to work well for a chunk of code that could be described as a Singleton class.

For a thorough demonstration of the Module Pattern, see [this Module Pattern example](https://github.com/stevekwan/experiments/blob/master/javascript/module-pattern.html).

### Namespace your JavaScript if you need to refer to it elsewhere

Your JavaScript shouldn't be floating off in the global namespace, where it collides with other stuff you've included.

Although JavaScript doesn't have built-in notions of namespaces, its object model is flexible enough that you can emulate them. Here's an example:

```javascript
var MyNamespace = MyNamespace || {};

MyNamespace.MyModule = function()
{
    // Your module is now in a namespace!
}
```

### Anonymously scope JavaScript if you’re never going to call it elsewhere

If you're writing a one-off chunk of JavaScript that never needs to be referred to by other code, it's wise to anonymously scope it so it won't get accidentally referenced elsewhere.

To do this, just wrap your code in an anonymous function closure:

```javascript
// An anonymous function that can never be referenced by name...
(function(){
    var x = 123;
    console.log(x);
})(); // Call the anonymous function once, then throw it away!

console.log(x);
```

### Beware of Function Hoisting

When defining JavaScript functions, beware of [hoisting](http://elegantcode.com/2011/03/24/basic-javascript-part-12-function-hoisting/).

Function declarations are evaluated at parse-time (when the browser first downloads the code):

```javascript
// FUNCTION DECLARATION (preferred)
function sum (x, y) {
  return x + y;
}
```

Because the declaration is hoisted to the top of its scope at parse-time, it doesn't matter when the function is defined:

```javascript
sum(1,2); // returns 3

// FUNCTION DECLARATION (preferred)
function sum (x, y) {
  return x + y;
}
```

Function expressions are evaluated at run-time (when the call stack physically hits a line of code), just like any 
other variable assignment:

```javascript
// FUNCTION EXPRESSION
var sum = function (x, y) {
    return x + y;
};
```

Because function expressions are NOT hoisted at parse-time, it DOES matter when the function is defined:

```javascript
sum(1,2); //throws an error "undefined is not a function"

// FUNCTION EXPRESSION
var sum = function (x, y) {
    return x + y;
};
```

Using function expressions can result in better compression because the name can be safely replaced by
a shorter version. This is not typically done for the name in a function declaration.

### Be Careful With Anonymous Functions

Anonymous functions can be very convenient, but poorly constructed code can easily lead to 
[memory leaks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript#Memory_leaks). 
Consider the following example:

```javascript
function addHandler () {
    var el = document.getElementById('el');

    el.addEventListener(
        'click', 
        function () { // anonymous function
            el.style.backgroundColor = 'red';
        }
    );
}
```

There are two issues caused by using an anonymous function:

1. We don’t have a named reference to the click handler function, so we can’t remove it via [removeEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener)
2. The reference to `el` is inadvertently caught in the closure created for the inner function, and therefore cannot be garbage collected. This creates a circular reference between JavaScript (the function) and the DOM (`el`).

* To avoid the first problem, always use named functions when adding event listeners to DOM elements.
* To avoid the second problem, carefully craft your scopes to prevent leaks and promote garbage collection:

```javascript
function clickHandler () {
    this.style.backgroundColor = 'red';
}

function addHandler () {
    var el = document.getElementById('el');
    el.addEventListener('click', clickHandler);
}
```

## Performance
> "Performance is only a problem if performance is a problem."

Every developer should care about performance -- but developers also shouldn't spend time optimizing minute sections of code **without first proving** such efficiencies are necessary. For example, optimizations that make sense in a JavaScript library/framework may have little impact in application code.

### When Optimizating, Focus On The Big Things

Some things cause a big dip in performance, such as:

* Excessive DOM changes that force the page to re-render
* Events that get fired all the time (for example, resizing/scrolling)
* Lots of HTTP requests (and even this is becoming less important).

These are problems you should address.

However, there are a lot of other "problems" that have very little impact on the performance. Yes, you may be able to shave off a few milli(micro?)seconds by optimizing your selectors or caching function results, but is it worth the effort?

If your optimizations are making your code uglier (and thus more difficult to maintain), ask yourself: are these "optimizations" worth it? For most webpages, 1ms isn't going to make or break the user experience. There are probably better uses of your time.

### Document Reflows

Avoid patterns that cause [unnecessary page reflows](http://www.kellegous.com/j/2013/01/26/layout-performance/). 

A reflow involves changes that affect the CSS layout of a portion or the entire HTML page. Reflow of an element causes 
the subsequent reflow of all child and ancestor elements, as well as any elements following it in the DOM.

The browser will automatically keep track of DOM and CSS changes, issuing a "reflow" when it needs to change the 
position or appearance of something. Unwieldy JavaScript code can force the browser to invalidate the CSS layout -- for 
example, reading certain results from the DOM (e.g. offsetHeight) can cause browser style recalculation of layout. 
Therefore developers must be incredibly careful to avoid causing multiple page reflows as they will cause application 
performance to noticeably lag.

```javascript
// bad
elementA.className = "a-style";       // style change invalidates the CSS layout
var heightA = elementA.offsetHeight;  // reflow to calculate offset
elementB.className = "b-style";       // invalidates the CSS layout again
var heightB = elementB.offsetHeight;  // reflow to calculate offset
    
// good
elementA.className = "a-style";       // style change invalidates the CSS layout
elementB.className = "b-style";       // CSS layout is already invalid; but no reflow yet
var heightA = elementA.offsetHeight;  // reflow to calculate offset
var heightB = elementB.offsetHeight;  // CSS layout is up-to-date; no second reflow!
```
