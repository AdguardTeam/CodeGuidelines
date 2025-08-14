# AdGuard Go Team Development Guidelines

Following this document is obligatory for all new Go code. Some of the rules aren’t enforced as thoroughly or remain broken in old code, but this is still the place to find out about what we **want** our code to look like and how to improve it.

The rules are mostly sorted in the alphabetical order.

## Contents

- [Code](#code)
- [Commenting](#commenting)
- [Error Handling](#errors)
- [Formatting](#formatting)
- [Naming](#naming)
- [Testing](#testing)
- [Recommended Reading](#recommended-reading)

> Not Golang, not GO, not GOLANG, not GoLang. It is Go in natural language, golang for others.

— [@rakyll](https://twitter.com/rakyll/status/1229850223184269312)

## <a href="#code" id="code" name="code">Code</a>

- <a href="#li-cb105c8c" id="li-cb105c8c" name="li-cb105c8c">§</a> Avoid `break` and `continue` with labels. Most of the time the code can be rewritten without them, and most of the time the resulting new code is also clearer.

- <a href="#li-5305b436" id="li-5305b436" name="li-5305b436">§</a> Always `recover` from panics in new goroutines. Preferably in the very first statement. If all you want there is a log message, use `log.OnPanic`.

- <a href="#li-02028202" id="li-02028202" name="li-02028202">§</a> Avoid `fallthrough`. It makes it harder to rearrange `case`s, to reason about the code, and also to switch the code to a handler approach, if that becomes necessary later.

- <a href="#li-ab65882d" id="li-ab65882d" name="li-ab65882d">§</a> Avoid `goto`.

- <a href="#li-928170b7" id="li-928170b7" name="li-928170b7">§</a> Avoid `init` and use explicit initialization functions instead.

- <a href="#li-fa33e482" id="li-fa33e482" name="li-fa33e482">§</a> Avoid lazy initialization. Constructors should validate their arguments and return meaningful errors.

- <a href="#li-6ae6bc94" id="li-6ae6bc94" name="li-6ae6bc94">§</a> Avoid `new`, especially with structs, unless a temporary value is needed, for example when checking the type of an error using `errors.As`.

- <a href="#li-c9d7fde7" id="li-c9d7fde7" name="li-c9d7fde7">§</a> Avoid packages `reflect` and `unsafe` unless absolutely necessary. Always provide a comment explaining why you are using it.

- <a href="#li-9d94cb85" id="li-9d94cb85" name="li-9d94cb85">§</a> <a href="#li-c85dd96a" id="li-c85dd96a" name="li-c85dd96a"></a> Be aware of and strive to shorten resource scopes.

    For example, if you have a long function that makes an HTTP request and defers the close of the body at the beginning and then does more stuff, it’s better to factor out the HTTP request and the response parsing into a separate method. Same goes for mutexes.

    That is, do **not** do this:

    ```go
    // Bad!  Resource r is only closed at the end of the very long function.
    func Foo() (err error) {
        r, err := open()
        check(err)
        defer r.close()

        v, err := decode(r)
        check(err)

        // Lots of slow stuff with v. r is only closed once Foo exits.
    }
    ```

    Do this instead:

    ```go
    // Good, r is closed after loadV returns.
    func Foo() (err error) {
        v, err := loadV()
        check(err)

        // Lots of slow stuff with v.
    }

    func loadV() (v *V, err error) {
        r, err := open()
        check(err)
        defer r.close()

        return decode(r)
    }
    ```

- <a href="#li-d027c6cd" id="li-d027c6cd" name="li-d027c6cd">§</a> Be aware of structure alignment as well as the number of [pointer bytes][ptr]. Exceptions could be made if a suboptimal alignment produces significantly better readability.

    ```go
    // Bad!  Lots of padding between the uint64s and bools. Pointers are at the
    // end of the structure.
    type bad struct {
        a uint64
        b bool
        c uint64
        d bool
        e uint64
        f bool
        g uint64
        h bool

        y *otherType
        z *otherType
    }

    // Good. The padding is minimized, and the pointers are closer to the top.
    type good struct {
        y *otherType
        z *otherType

        g uint64
        e uint64
        c uint64
        a uint64

        h bool
        f bool
        d bool
        b bool
    }
    ```

    Use the [`fieldalignment`][fa] analyzer when unsure.

- <a href="#li-6f8bd178" id="li-6f8bd178" name="li-6f8bd178">§</a> Check against empty strings like this:

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

- <a href="#li-eaba198b" id="li-eaba198b" name="li-eaba198b">§</a> Context values should be considered immutable. Do not use modifications of context values as a means of communicating something up the stack. That is, do **not** do this:

    ```go
    // Bad!  Function outer expects inner to mutate logEntry.
    func outer(ctx context.Context, /* … */) {
        logEntry := &LogEntry{}
        ctx = contextWithLogEntry(ctx, logEntry)

        inner(ctx, /* … */)

        if logEntry.Success {
            // …
        }
    }

    // Bad!  Function inner mutates logEntry just so that outer could receive
    // that change.
    func inner(ctx context.Context, /* … */) {
        logEntry := logEntryFromContext(ctx)
        logEntry.Success = true

        // …
    }
    ```

- <a href="#li-450c3236" id="li-450c3236" name="li-450c3236">§</a> Don’t rely only on file names for build tags to work. Always add build tags as well.

- <a href="#li-7a36cc4c" id="li-7a36cc4c" name="li-7a36cc4c">§</a> Don’t use `fmt.Sprintf` where a more structured approach to string conversion could be used. For example, `netutil.JoinHostPort`, `net.JoinHostPort` or `url.(*URL).String`.

- <a href="#li-71081433" id="li-71081433" name="li-71081433">§</a> Don’t use naked `return`s.

- <a href="#li-6eedb3ac" id="li-6eedb3ac" name="li-6eedb3ac">§</a> Eschew external dependencies, including transitive, unless absolutely necessary.

- <a href="#li-b34a7563" id="li-b34a7563" name="li-b34a7563">§</a> In templates, put spaces between the delimiters (`{{` and `}}` by default) and the content, because when the minus sign is used to remove whitespace, it’s an error to omit these spaces.

- <a href="#li-b97aacf8" id="li-b97aacf8" name="li-b97aacf8">§</a> Outside of subtests and `t`/`b` helpers, no name shadowing, including of predeclared identifiers, since it can often lead to subtle bugs, especially with errors. This rule does not apply to struct fields, since they are always used together with the name of the struct value, so there isn’t any confusion.

- <a href="#li-74517cf1 " id="li-74517cf1 " name="li-74517cf1">§</a> Prefer build constraints to `runtime.GOOS`.

- <a href="#li-851dedf8" id="li-851dedf8" name="li-851dedf8">§</a> Prefer constants to variables where possible. Avoid global variables unless necessary. Use [constant errors] instead of `errors.New`.

- <a href="#li-3a7f3909" id="li-3a7f3909" name="li-3a7f3909">§</a> Prefer defining `Foo.String` and `ParseFoo` in terms of `Foo.MarshalText` and `Foo.UnmarshalText` correspondingly and not the other way around.

- <a href="#li-edd678a8" id="li-edd678a8" name="li-edd678a8">§</a> Prefer to use pointers to structs in function arguments, including method receivers, unless there is a reason to do the opposite. Among valid reasons are:

    - the struct is small, which typically means less than a few machine words;
    - the struct is read-only, like `netip.Addr` or `time.Time`;
    - the struct is immediately used by an external API that requires a non-pointer struct;
    - the method implements a `FooMarshaler` kind of interface, and so a non-pointer receiver is required (see [`staticcheck` issue 911][staticcheck-911]).

- <a href="#li-c178ad65" id="li-c178ad65" name="li-c178ad65">§</a> Prefer to [return structs and accept interfaces][struct].

- <a href="#li-8e702ad5" id="li-8e702ad5" name="li-8e702ad5">§</a> Prefer to use named functions for goroutines.

- <a href="#li-2ea2bbf3" id="li-2ea2bbf3" name="li-2ea2bbf3">§</a> Prefer to use package `golang.org/x/sys` and not package `syscall`, as the latter is frozen.

- <a href="#li-6e457108" id="li-6e457108" name="li-6e457108">§</a> Program code lines should not be longer than one hundred (**100**) columns. For comments, see the [text guidelines][text].

    Don’t forget to also [set the tab width][tab] in your editor’s settings.

- <a href="#li-4bfdabf9" id="li-4bfdabf9" name="li-4bfdabf9">§</a> Use linters. `make go-lint`, if the project has one. A minimum of `go vet`, `errcheck`, and staticcheck if the project does not.

- <a href="#li-29dc9ef0" id="li-29dc9ef0" name="li-29dc9ef0">§</a> When returning an error from a function that also returns a non-nilable type, for example a `time.Time`, a `time.Duration`, or a `netip.Addr`, spell the empty value explicitly to show that the value is invalid.

    So, do this:

    ```go
    func fooTime() (t time.Time, err error) {
        err = bar()
        if err != nil {
            return time.Time{}, err
        }

        // …
    }
    ```

    and **not** this:

    ```go
    func fooTime() (t time.Time, err error) {
        err = bar()
        if err != nil {
            // Bad!  This could be read as t being valid, which it is not.
            return t, err
        }

        // …
    }
    ```

- <a href="#li-4c8cc15a" id="li-4c8cc15a" name="li-4c8cc15a">§</a> Write logs and error messages in lowercase only to make it easier to `grep` logs and error messages without using the `-i` flag.

- <a href="#li-8c55e31a" id="li-8c55e31a" name="li-8c55e31a">§</a> Write static interface type checks like this, including the standard comment:

    ```go
    // type check
    var _ ifaceType = (*implType)(nil)
    ```

    Put them right before the declaration of the first method implementing the interface in question.

[constant errors]:  https://dave.cheney.net/2016/04/07/constant-errors
[fa]:               https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/fieldalignment/cmd/fieldalignment
[ptr]:              https://github.com/golang/go/issues/44877#issuecomment-794565908
[staticcheck-911]:  https://github.com/dominikh/go-tools/issues/911
[struct]:           https://medium.com/@cep21/what-accept-interfaces-return-structs-means-in-go-2fe879e25ee8
[tab]:              Text.md#li-84467c92
[text]:             Text.md

## <a href="#commenting" id="commenting" name="commenting">Commenting</a>

See also the [text guidelines][text].

- <a href="#li-4e61a581" id="li-4e61a581" name="li-4e61a581">§</a> Document everything, including unexported top-level identifiers, to build a habit of writing documentation.

- <a href="#li-2b24cce6" id="li-2b24cce6" name="li-2b24cce6">§</a> Don’t put identifiers into any kind of quotes; if necessary, use square brackets to make a godoc link.

- <a href="#li-7eda22b4" id="li-7eda22b4" name="li-7eda22b4">§</a> Put comments above the documented entity, **not** to the side, to improve readability.

- <a href="#li-56009d84" id="li-56009d84" name="li-56009d84">§</a> When a method implements an interface, start the doc comment with the standard template:

    ```go
    // Foo implements the [Fooer] interface for *foo.
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

- <a href="#li-dca638fe" id="li-dca638fe" name="li-dca638fe">§</a> Write names of RFCs without a hyphen and don’t put a newline between the letters and the numbers. Godoc and pkg.go.dev both will add a link to the RFC, but only if the RFC is spelled that way.

    So, do this:

    ```go
    // toTime parses an RFC 3339 timestamp.
    ```

    and **not** this:

    ```go
    // Bad!  A hyphen is used.

    // toTime parses an RFC-3339 timestamp.
    ```

    ```go
    // Bad!  A newline before the number.

    // toTime parses and also uses an optimized validation technique on an RFC
    // 3339 timestamp.
    ```

- <a href="#li-92230a03" id="li-92230a03" name="li-92230a03">§</a> Document important contracts (assertions, pre- and postconditions) of fields, functions and methods. That is, nilness of arguments, state of mutexes, relationship between struct fields, and so on. As an exception, a method receiver can be generally considered to be required to be non-nil, unless a different behavior is explicitly documented.

    For example:

    ```go
    // needsNonNil is an example of a method that requires a non-nil argument.
    // m must not be nil. r.mu is expected to be locked.
    func (r *Receiver) needsNonNil(m *Message) (err error) {
        // …
    }
    ```

## <a href="#errors" id="errors" name="errors">Error Handling</a>

- <a href="#li-651fcd50" id="li-651fcd50" name="li-651fcd50">§</a> Add context to errors but avoid duplication. For example, `os.Open` always adds the path to its error, so this is redundant:

    ```go
    // Bad!  Will duplicate the file name.
    f, err := os.Open(fileName)
    if err != nil {
        return fmt.Errorf("opening %q: %w", fileName, err)
    }
    ```

    If a function returns enough context, or a deferred helper is used, document that. Prefer to use a standard comment across a project. For example:

    ```go
    err = f()
    if err != nil {
        // Don’t wrap the error, because it’s informative enough as is.
        return err
    }
    ```

- <a href="#li-17e872ff" id="li-17e872ff" name="li-17e872ff">§</a> Avoid having multiple errors in a function. In situations when it’s not feasible, use meaningful names. For example, `closeErr` for errors from `Close()` or `testErr` for subtest errors.

- <a href="#li-9e172a2e" id="li-9e172a2e" name="li-9e172a2e">§</a> Avoid using the word `error` inside error messages.

    ```go
    // BAD!
    err = foo()
    if err != nil {
        return fmt.Errorf("error while calling foo: %w", err)
    }
    ```

    Just provide the action instead:

    ```go
    // Good.
    err = foo()
    if err != nil {
        return fmt.Errorf("performing foo: %w", err)
    }
    ```

- <a href="#li-31fae402" id="li-31fae402" name="li-31fae402">§</a> Parsing functions should include the invalid input into the error message, unless the input is too big.

- <a href="#li-be5ea7a7" id="li-be5ea7a7" name="li-be5ea7a7">§</a> Use only lowercase unless you have to reference an identifier in code or the project has its own conventions regarding uppercase letters.

- <a href="#li-6d1104bd" id="li-6d1104bd" name="li-6d1104bd">§</a> Use `panic` **only** to indicate critical assertion failures. **Do not** use panics for normal error handling.

- <a href="#li-f6d13b11" id="li-f6d13b11" name="li-f6d13b11">§</a> Use utilities from the [`github.com/AdguardTeam/golibs/testutil`][testutil] package when necessary.

[testutil]: https://pkg.go.dev/github.com/AdguardTeam/golibs/testutil

## <a href="#formatting" id="formatting" name="formatting">Formatting</a>

- <a href="#li-9f87a6e3" id="li-9f87a6e3" name="li-9f87a6e3">§</a> Consider putting empty lines between documented struct fields and interface methods to improve readability:

    ```go
    // FooConfig is the configuration for a single foo.
    type FooConfig struct {
        // ID is the unique ID of foo.
        ID FooID

        // Name is the human-readable name of this foo.
        Name string

        // Timeout is the timeout used for all frobulation operations
        // performed by this foo.
        Timeout time.Duration
    }
    ```

- <a href="#li-018bb84c" id="li-018bb84c" name="li-018bb84c">§</a> Decorate `break`, `continue`, `return`, and other terminating statements with empty lines unless it’s the only statement in that block.

- <a href="#li-82784b41" id="li-82784b41" name="li-82784b41">§</a> Don’t group type declarations together. Unlike with blocks of `const`s, where a `iota` may be used or where all constants belong to a certain type, there is no reason to group `type`s.

- <a href="#li-baa640a3" id="li-baa640a3" name="li-baa640a3">§</a> Don’t mix horizontal and vertical placement of groups of arguments and [return values][ret] in calls and definitions of functions and methods. That is, either this:

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

    An exception to this rule is made for logger attributes and similar paired values, like command flags:

    ```go
    // Good, makes key-value pairs easier to read.
    slog.InfoContext(
        ctx,
        "download finished",
        "file", fileName,
        "elapsed", time.Since(start),
    )
    ```

- <a href="#li-73ab5406" id="li-73ab5406" name="li-73ab5406">§</a> Don’t write code with more than four (**4**) levels of indentation. Just like [Linus said][3tabs], plus an additional level for an occasional error check or struct initialization.

- <a href="#li-537482f3" id="li-537482f3" name="li-537482f3">§</a> Group `require.*` blocks together with the preceding related statements, but separate from the following `assert.*` and unrelated requirements.

    ```go
    val, ok := valMap[key]
    require.True(t, ok)
    require.NotNil(t, val)

    assert.Equal(t, expected, val)
    ```

- <a href="#li-46a924cd" id="li-46a924cd" name="li-46a924cd">§</a> Put deferred calls of destructors, for example `f.Close()`, into the same paragraph as constructors. This is an exception to the [paragraph rule][par].

    ```go
    f, err := os.Open(fileName)
    if err != nil {
        return err
    }
    defer func() { processError(f.Close()) }()
    ```

- <a href="#li-a54ab45b" id="li-a54ab45b" name="li-a54ab45b">§</a> Split numbers with more than four (**4**) digits into triplets using underscores:

    ```go
    const (
        max8  = 255
        max16 = 65_535
        max32 = 4_294_967_295
    )
    ```

- <a href="#li-f2156af9" id="li-f2156af9" name="li-f2156af9">§</a> Start a new paragraph after the final closing curly brace of a block. So this:

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

    The exceptions are the final block inside a bigger block and the [destructor `defer`s][dtr].

- <a href="#li-0a444faf" id="li-0a444faf" name="li-0a444faf">§</a> Use `gofumpt --extra -s`.

- <a href="#li-d9b8f5a8" id="li-d9b8f5a8" name="li-d9b8f5a8">§</a> When a function’s definition becomes [too long][long], first make the function’s arguments vertically placed and only then do the same with the return values. That is, do this:

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

    With generics:

    ```go
    func genericFunctionWithALongName[
        T any,
    ](
        argumentWithALongName typeWithALongName,
    ) (returnValueWithALongName typeWithALongName, err error) {
        // …
    }
    ```

- <a href="#li-1f286e31" id="li-1f286e31" name="li-1f286e31">§</a> Write `switch`es with large lists of values in one `case` like this:

    ```go
    switch n {
    case
        longValueName1,
        longValueName2,
        longValueName3,
        longValueName4,
        longValueName5:
        return true
    default:
        return false
    }
    ```

- <a href="#li-202c752c" id="li-202c752c" name="li-202c752c">§</a> Write slices of struct like this:

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

## <a href="#naming" id="naming" name="naming">Naming</a>

- <a href="#li-58922472" id="li-58922472" name="li-58922472">§</a> Example files should be names `example_test.go` if there is one such file for the whole package and `foo_example_test.go` if there are several.

- <a href="#li-cc358586" id="li-cc358586" name="li-cc358586">§</a> Don’t use underscores in file and package names, unless they’re build tags or for tests. This is to prevent accidental build errors with weird tags.

- <a href="#li-5a2d4941" id="li-5a2d4941" name="li-5a2d4941">§</a> For brands or words with more than 1 capital letter, lowercase all letters: `githubToken`, **not** `gitHubToken`.

- <a href="#li-177c14d4" id="li-177c14d4" name="li-177c14d4">§</a> Methods that convert types for external data, such as configuration structures and response structures, into internal types should be called `toInternal`:

    ```go
    // toInternal converts a user object from the configuration file into
    // a *User.
    func (u *confUser) toInternal() (user *User) {
        // …
    }
    ```

- <a href="#li-a3a30716" id="li-a3a30716" name="li-a3a30716">§</a> Name benchmarks and tests using the same convention as examples. For example:

    ```go
    func TestFunction(t *testing.T) { /* … */ }
    func TestFunction_suffix(t *testing.T) { /* … */ }
    func TestType_Method(t *testing.T) { /* … */ }
    func TestType_Method_suffix(t *testing.T) { /* … */ }
    ```

- <a href="#li-4b3adb1b" id="li-4b3adb1b" name="li-4b3adb1b">§</a> Name `context.Context` helper functions that return values from the context `FooFromContext` and the ones that return a new contest with new values, `ContextWithFoo` or `WithFoo`. Just like in the standard library, the parent context should be called `parent`.

    ```go
    // ContextWithFoo returns a copy of the parent context with the value of `f`
    // attached to it.
    func ContextWithFoo(parent context.Context, f Foo) (ctx context.Context) {
        // …
    }

    // FooFromContext returns the Foo attached to the context.
    func FooFromContext(parent context.Context) (f Foo, ok bool) {
        // …
    }
    ```

- <a href="#li-ac62f22b" id="li-ac62f22b" name="li-ac62f22b">§</a> Name parameters in interface definitions:

    ```go
    type Frobulator interface {
        Frobulate(f Foo, b Bar) (r Result, err error)
    }
    ```

- <a href="#li-0251df78" id="li-0251df78" name="li-0251df78">§</a> Unused arguments in anonymous functions must be called `_`:

    ```go
    v.onSuccess = func(_ int, msg string) {
        // …
    }
    ```

- <a href="#li-da463e1c" id="li-da463e1c" name="li-da463e1c">§</a> Use named returns to improve readability of function signatures:

    ```go
    func split(data []*datum) (less, greater []*datum) {
        // …
    }
    ```

- <a href="#li-3932b162 " id="li-3932b162 " name="li-3932b162">§</a> Use names like `ErrFoo` for package-level error values and `FooError` for error types.

- <a href="#li-c2c377e4" id="li-c2c377e4" name="li-c2c377e4">§</a> When naming a file which defines an entity, use singular nouns, unless the entity is some form of a container for other entities:

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

- <a href="#li-67056eab" id="li-67056eab" name="li-67056eab">§</a> In functions that append their results, name the original slice `orig` and the resulting slice something more informative, like `errs`:

    ```go
    // Outdated, the original slice uses the informative name.

    // appendErrors appends validation errors to errs.
    func (c *config) appendErrors(errs []error) (res []error) {
        res = errs

        // Use res and be careful not to use errs.

        return res
    }

    // Good, the informative name is used within the function.

    // appendErrors appends validation errors to orig.
    func (c *config) appendErrors(orig []error) (errs []error) {
        errs = orig

        // Use errs, which is more obvious.

        return errs
    }
    ```

## <a href="#testing" id="testing" name="testing">Testing</a>

- <a href="#li-4f4ff827" id="li-4f4ff827" name="li-4f4ff827">§</a> If you write a fake implementation of an interface for a test, prefer to write it using callbacks:

    ```go
    // FakeReader …
    type FakeReader struct {
        OnRead func(b []byte) (n int, err error)
    }

    // Read implements the [io.Reader] interface for *FakeReader.
    func (r *FakeReader) Read(b []byte) (n int, err error) {
        return r.OnRead(b)
    }
    ```

    If the method must not be called in this particular test, place a single `panic(testutil.UnexpectedCall(/* … */))` as its body:

    ```go
    r := &FakeReader{
        OnRead: func(b []byte) (n int, err error) { panic(testutil.UnexpectedCall(b)) },
    }
    ```

- <a href="#li-a52e192a" id="li-a52e192a" name="li-a52e192a">§</a> Prefer to put all tests into a separate [test package][tpkg]. Tests in the same package that check unexported APIs should be put into a separate file named `foo_internal_test.go`.

- <a href="#li-b4f670ce" id="li-b4f670ce" name="li-b4f670ce">§</a> Strive to make the test suite finish quickly. If you have long-running integration test or fuzzes, document them, put them into a separate Makefile target, and include them into the CI pipeline, but not the main `make test` target.

- <a href="#li-b956e7a9" id="li-b956e7a9" name="li-b956e7a9">§</a> Strive to make the test suite runnable multiple times with `--count=N`. That helps finding bugs in tests and also makes it easier to diagnose rare bugs in the code.

- <a href="#li-9124bf62" id="li-9124bf62" name="li-9124bf62">§</a> Use `assert.NoError` and `require.NoError` instead of `assert.Nil` and `require.Nil` on errors.

- <a href="#li-c12f7ecf" id="li-c12f7ecf" name="li-c12f7ecf">§</a> Use formatted helpers, like `assert.Nilf` or `require.Nilf`, instead of simple helpers when a formatted message is required.

- <a href="#li-2b1b6414" id="li-2b1b6414" name="li-2b1b6414">§</a> Use functions like `require.Foo` instead of `assert.Foo` when the test cannot continue if the condition is false.

[tpkg]: https://pkg.go.dev/cmd/go@master#hdr-Test_packages

## <a href="#recommended-reading" id="recommended-reading" name="recommended-reading">Recommended Reading</a>

Here are some links that describe the common ways Go code is written or have inspire some of the rules we use here:

- [The Go Wiki: Go Code Review Comments][rev]
- [The Go Wiki: Go Test Comments][test]
- [Go Proverbs][prov]
- [Dmitri Shuralyov: Idiomatic Go][shur]

[prov]: https://go-proverbs.github.io/
[rev]:  https://github.com/golang/go/wiki/CodeReviewComments
[shur]: https://dmitri.shuralyov.com/idiomatic-go
[test]: https://github.com/golang/go/wiki/TestComments
