 #  AdGuard Go Team Development Guidelines

Following this document is obligatory for all new Go code.  Some of the rules
aren't enforced as thoroughly or remain broken in old code, but this is still
the place to find out about what we **want** our code to look like and how to
improve it.

The rules are mostly sorted in the alphabetical order.



## Contents

 *  [Code](#code)
 *  [Commenting](#commenting)
 *  [Formatting](#formatting)
 *  [Naming](#naming)
 *  [Testing](#testing)
 *  [Recommended Reading](#recommended-reading)



 >  Not Golang, not GO, not GOLANG, not GoLang. It is Go in natural language,
 >  golang for others.

— [@rakyll](https://twitter.com/rakyll/status/1229850223184269312)



##  <a href="#code" id="code" name="code">Code</a>

 *  <a href="#li-5305b436" id="li-5305b436" name="li-5305b436">§</a>
    Always `recover` from panics in new goroutines.  Preferably in the very
    first statement.  If all you want there is a log message, use `log.OnPanic`.

 *  <a href="#li-02028202" id="li-02028202" name="li-02028202">§</a>
    Avoid `fallthrough`.  It makes it harder to rearrange `case`s, to reason
    about the code, and also to switch the code to a handler approach, if that
    becomes necessary later.

 *  <a href="#li-ab65882d" id="li-ab65882d" name="li-ab65882d">§</a>
    Avoid `goto`.

 *  <a href="#li-928170b7" id="li-928170b7" name="li-928170b7">§</a>
    Avoid `init` and use explicit initialization functions instead.

 *  <a href="#li-6ae6bc94" id="li-6ae6bc94" name="li-6ae6bc94">§</a>
    Avoid `new`, especially with structs, unless a temporary value is needed,
    for example when checking the type of an error using `errors.As`.

 *  <a href="#li-6f8bd178" id="li-6f8bd178" name="li-6f8bd178">§</a>
    Check against empty strings like this:

    ```go
    if s == "" {
            // …
    }
    ```

    Except when the check is done to then use the first character:

    ```go
    if len(s) > 0 {
            c := s[0]
    }
    ```

 *  <a href="#li-fa33e482" id="li-fa33e482" name="li-fa33e482">§</a>
    Constructors should validate their arguments and return meaningful errors.
    As a corollary, avoid lazy initialization.

 *  <a href="#li-450c3236" id="li-450c3236" name="li-450c3236">§</a>
    Don't rely only on file names for build tags to work.  Always add build tags
    as well.

 *  <a href="#li-7a36cc4c" id="li-7a36cc4c" name="li-7a36cc4c">§</a>
    Don't use `fmt.Sprintf` where a more structured approach to string
    conversion could be used.  For example, `netutil.JoinHostPort`,
    `net.JoinHostPort` or `url.(*URL).String`.

 *  <a href="#li-71081433" id="li-71081433" name="li-71081433">§</a>
    Don't use naked `return`s.

 *  <a href="#li-6eedb3ac" id="li-6eedb3ac" name="li-6eedb3ac">§</a>
    Eschew external dependencies, including transitive, unless absolutely
    necessary.

 *  <a href="#li-9d94cb85" id="li-9d94cb85" name="li-9d94cb85">§</a>
    Minimize scope of variables as much as possible.

 *  <a href="#li-b97aacf8" id="li-b97aacf8" name="li-b97aacf8">§</a>
    No name shadowing, including of predeclared identifiers, since it can often
    lead to subtle bugs, especially with errors.  This rule does not apply to
    struct fields, since they are always used together with the name of the
    struct value, so there isn't any confusion.

 *  <a href="#li-851dedf8" id="li-851dedf8" name="li-851dedf8">§</a>
    Prefer constants to variables where possible.  Avoid global variables.  Use
    [constant errors] instead of `errors.New`.

 *  <a href="#li-3a7f3909" id="li-3a7f3909" name="li-3a7f3909">§</a>
    Prefer defining `Foo.String` and `ParseFoo` in terms of `Foo.MarshalText`
    and `Foo.UnmarshalText` correspondingly and not the other way around.

 *  <a href="#li-edd678a8" id="li-edd678a8" name="li-edd678a8">§</a>
    Prefer to define methods on pointer receivers, unless the type is small or
    a non-pointer receiver is required, for example `MarshalFoo` methods (see
    [`staticcheck` issue 911][staticcheck-911]).

 *  <a href="#li-8e702ad5" id="li-8e702ad5" name="li-8e702ad5">§</a>
    Prefer to use named functions for goroutines.

 *  <a href="#li-6e457108" id="li-6e457108" name="li-6e457108">§</a>
    Program code lines should not be longer than one hundred (**100**) columns.
    For comments, see the [text guidelines][text].

 *  <a href="#li-4bfdabf9" id="li-4bfdabf9" name="li-4bfdabf9">§</a>
    Use linters.  `make go-lint`.

 *  <a href="#li-4c8cc15a" id="li-4c8cc15a" name="li-4c8cc15a">§</a>
    Write logs and error messages in lowercase only to make it easier to `grep`
    logs and error messages without using the `-i` flag.

[constant errors]:  https://dave.cheney.net/2016/04/07/constant-errors
[staticcheck-911]:  https://github.com/dominikh/go-tools/issues/911
[text]:             Text.md



##  <a href="#commenting" id="commenting" name="commenting">Commenting</a>

See also the [text guidelines][text].

 *  <a href="#li-4e61a581" id="li-4e61a581" name="li-4e61a581">§</a>
    Document everything, including unexported top-level identifiers, to build
    a habit of writing documentation.

 *  <a href="#li-2b24cce6" id="li-2b24cce6" name="li-2b24cce6">§</a>
    Don't put identifiers into any kind of quotes.

 *  <a href="#li-cc1ce4d8" id="li-cc1ce4d8" name="li-cc1ce4d8">§</a>
    Prefer to add a file header comment describing what this file should
    contain.  For example, a file like `validation.go` could start like this:

    ```go
    package user

    import "strings"

    // User Validation
    ```

 *  <a href="#li-7eda22b4" id="li-7eda22b4" name="li-7eda22b4">§</a>
    Put comments above the documented entity, **not** to the side, to improve
    readability.

 *  <a href="#li-56009d84" id="li-56009d84" name="li-56009d84">§</a>
    When a method implements an interface, start the doc comment with the
    standard template:

    ```go
    // Foo implements the Fooer interface for *foo.
    func (f *foo) Foo() {
            // …
    }
    ```

    When the implemented interface is unexported:

    ```go
    // Unwrap implements the hidden wrapper interface for *fooError.
    func (err *fooError) Unwrap() (unwrapped error) {
            // …
    }
    ```



##  <a href="#formatting" id="formatting" name="formatting">Formatting</a>

 *  <a href="#li-018bb84c" id="li-018bb84c" name="li-018bb84c">§</a>
    Decorate `break`, `continue`, `return`, and other terminating statements
    with empty lines unless it's the only statement in that block.

 *  <a href="#li-82784b41" id="li-82784b41" name="li-82784b41">§</a>
    Don't group type declarations together.  Unlike with blocks of `const`s,
    where a `iota` may be used or where all constants belong to a certain type,
    there is no reason to group `type`s.

 *  <a href="#li-baa640a3" id="li-baa640a3" name="li-baa640a3">§</a>
    Don't mix horizontal and vertical placement of groups of arguments and
    [return values][ret] in calls and definitions of functions and methods.
    That is, either this:

    ```go
    func f(a, b, c T) {
            // …
    }
    ```

    ```go
    err := f(a, b, c)
    ```

    Or, when the arguments are too long, this:

    ```go
    func functionWithALongName(
            firstArgumentWithALongName typeWithALongName,
            secondArgumentWithALongName otherTypeWithALongName,
            thirdArgumentWithALongName thirdTypeWithALongName,
    ) {
            // …
    }
    ```

    ```go
    err := functionWithALongName(
            firstArgumentWithALongName,
            secondArgumentWithALongName,
            thirdArgumentWithALongName,
    )
    ```

    Or, with a call with a struct literal:

    ```go
    err := functionWithALongName(arg, structType{
            field1: val1,
            field2: val2,
    })
    ```

    But **never** this:

    ```go
    // Bad!
    func functionWithALongName(firstArgumentWithALongName typeWithALongName,
            secondArgumentWithALongName otherTypeWithALongName,
            thirdArgumentWithALongName thirdTypeWithALongName) {
            // …
    }
    ```

    ```go
    // Bad!
    err := functionWithALongName(firstArgumentWithALongName,
            secondArgumentWithALongName,
            thirdArgumentWithALongName,
    )
    ```

 *  <a href="#li-73ab5406" id="li-73ab5406" name="li-73ab5406">§</a>
    Don't write non-test code with more than four (**4**) levels of indentation.
    Just like [Linus said][3tabs], plus an additional level for an occasional
    error check or struct initialization.

    The exception proving the rule is the table-driven test code, where an
    additional level of indentation is allowed.

 *  <a href="#li-537482f3" id="li-537482f3" name="li-537482f3">§</a>
    Group `require.*` blocks together with the preceding related statements, but
    separate from the following `assert.*` and unrelated requirements.

    ```go
    val, ok := valMap[key]
    require.True(t, ok)
    require.NotNil(t, val)

    assert.Equal(t, expected, val)
    ```

 *  <a href="#li-46a924cd" id="li-46a924cd" name="li-46a924cd">§</a>
    Put deferred calls of destructors, for example `f.Close()`, into the same
    paragraph as constructors.  This is an exception to the [paragraph
    rule][par].

    ```go
    f, err := os.Open(fileName)
    if err != nil {
            return err
    }
    defer func() { processError(f.Close()) }()
    ```

 *  <a href="#li-f2156af9" id="li-f2156af9" name="li-f2156af9">§</a>
    Start a new paragraph after the final closing curly brace of a block.  So
    this:

    ```go
    if a == b {
            // …
    }

    for i := 0; i < N; i++ {
            // …
    }

    switch x {
            // …
    }
    ```

    and **not** this:

    ```go
    // Bad!
    if a == b {
            // …
    }
    for i := 0; i < N; i++ {
            // …
    }
    switch x {
            // …
    }
    ```

    The exceptions are the final block inside a bigger block and the [destructor
    `defer`s][dtr].

 *  <a href="#li-0a444faf" id="li-0a444faf" name="li-0a444faf">§</a>
    Use `gofumpt --extra -s`.

 *  <a href="#li-d9b8f5a8" id="li-d9b8f5a8" name="li-d9b8f5a8">§</a>
    When a function's definition becomes [too long][long], first make the
    function's arguments vertically placed and only then do the same with the
    return values.  That is, do this:

    ```go
    func functionWithALongName(
            argumentWithALongName typeWithALongName,
    ) (returnValueWithALongName typeWithALongName, err error) {
            // …
    }
    ```

    and **not** this:

    ```go
    // Bad!
    func functionWithALongName(argumentWithALongName typeWithALongName) (
            returnValueWithALongName typeWithALongName,
            err error,
    ) {
            // …
    }
    ```

 *  <a href="#li-202c752c" id="li-202c752c" name="li-202c752c">§</a>
    Write slices of struct like this:

    ```go
    ts := []T{{
            Field: Value0,
            // …
    }, {
            Field: Value1,
            // …
    }, {
            Field: Value2,
            // …
    }}
    ```

[3tabs]: https://www.kernel.org/doc/html/v4.17/process/coding-style.html#indentation
[dtr]:   #li-46a924cd
[long]:  #li-baa640a3
[par]:   #li-f2156af9
[ret]:   #li-d9b8f5a8


##  <a href="#naming" id="naming" name="naming">Naming</a>

 *  <a href="#li-58922472" id="li-58922472" name="li-58922472">§</a>
    Example files should be names `example_test.go` if there is one such file
    for the whole package and `foo_example_test.go` if there are several.

 *  <a href="#li-cc358586" id="li-cc358586" name="li-cc358586">§</a>
    Don't use underscores in file and package names, unless they're build tags
    or for tests.  This is to prevent accidental build errors with weird tags.

 *  <a href="#li-5a2d4941" id="li-5a2d4941" name="li-5a2d4941">§</a>
    For brands or words with more than 1 capital letter, lowercase all letters:
    `githubToken`, **not** `gitHubToken`.

 *  <a href="#li-a3a30716" id="li-a3a30716" name="li-a3a30716">§</a>
    Name benchmarks and tests using the same convention as examples.  For
    example:

    ```go
    func TestFunction(t *testing.T) { /* … */ }
    func TestFunction_suffix(t *testing.T) { /* … */ }
    func TestType_Method(t *testing.T) { /* … */ }
    func TestType_Method_suffix(t *testing.T) { /* … */ }
    ```

 *  <a href="#li-4b3adb1b" id="li-4b3adb1b" name="li-4b3adb1b">§</a>
    Name `context.Context` helper functions that return values from the context
    `FooFromContext` and the ones that return a new contest with new values,
    `WithFoo`.

 *  <a href="#li-17e872ff" id="li-17e872ff" name="li-17e872ff">§</a>
    Name deferred errors (e.g. when closing something) `derr`.

 *  <a href="#li-ac62f22b" id="li-ac62f22b" name="li-ac62f22b">§</a>
    Name parameters in interface definitions:

    ```go
    type Frobulator interface {
            Frobulate(f Foo, b Bar) (r Result, err error)
    }
    ```

 *  <a href="#li-0251df78" id="li-0251df78" name="li-0251df78">§</a>
    Unused arguments in anonymous functions must be called `_`:

    ```go
    v.onSuccess = func(_ int, msg string) {
            // …
    }
    ```

 *  <a href="#li-da463e1c" id="li-da463e1c" name="li-da463e1c">§</a>
    Use named returns to improve readability of function signatures.

 *  <a href="#li-c2c377e4" id="li-c2c377e4" name="li-c2c377e4">§</a>
    When naming a file which defines an entity, use singular nouns, unless the
    entity is some form of a container for other entities:

    ```go
    // File: client.go

    package foo

    type Client struct {
            // …
    }
    ```

    ```go
    // File: clients.go

    package foo

    type Clients []*Client

    // …

    type ClientsWithCache struct {
            // …
    }
    ```



##  <a href="#testing" id="testing" name="testing">Testing</a>

 *  <a href="#li-a52e192a" id="li-a52e192a" name="li-a52e192a">§</a>
    Put all tests into a separate [test package][tpkg].

 *  <a href="#li-9124bf62" id="li-9124bf62" name="li-9124bf62">§</a>
    Use `assert.NoError` and `require.NoError` instead of `assert.Nil` and
    `require.Nil` on errors.

 *  <a href="#li-c12f7ecf" id="li-c12f7ecf" name="li-c12f7ecf">§</a>
    Use formatted helpers, like `assert.Nilf` or `require.Nilf`, instead of
    simple helpers when a formatted message is required.

 *  <a href="#li-2b1b6414" id="li-2b1b6414" name="li-2b1b6414">§</a>
    Use functions like `require.Foo` instead of `assert.Foo` when the test
    cannot continue if the condition is false.

[tpkg]: https://pkg.go.dev/cmd/go@master#hdr-Test_packages



##  <a href="#recommended-reading" id="recommended-reading" name="recommended-reading">Recommended Reading</a>

Here are some links that describe the common ways Go code is written or have
inspire some of the rules we use here:

 *  [The Go Wiki: Go Code Review Comments][rev]
 *  [The Go Wiki: Go Test Comments][test]
 *  [Go Proverbs][prov]
 *  [Dmitri Shuralyov: Idiomatic Go][shur]

[prov]: https://go-proverbs.github.io/
[rev]:  https://github.com/golang/go/wiki/CodeReviewComments
[shur]: https://dmitri.shuralyov.com/idiomatic-go
[test]: https://github.com/golang/go/wiki/TestComments
