 #  AdGuard Go Team Shell Scripts Guidelines

Following this document is obligatory for all new code.

The rules are mostly sorted in the alphabetical order.



##  Contents

 *  [General](#shell-scripting)
 *  [Conditionals](#shell-conditionals)



##  <a href="#shell-scripting" id="shell-scripting" name="shell-scripting">General</a>

 *  <a href="#li-dc1fbac9" id="li-dc1fbac9" name="li-dc1fbac9">§</a>
    Avoid bashisms and GNUisms, prefer POSIX features only.

 *  <a href="#li-834a99be" id="li-834a99be" name="li-834a99be">§</a>
    Avoid spaces between patterns of the same `case` condition.

 *  <a href="#li-f0aa2892" id="li-f0aa2892" name="li-f0aa2892">§</a>
    Don't use the option `-q` of the command `ls`.  Some systems that use the
    Busybox version of `ash` don't support it.

 *  <a href="#li-4c329619" id="li-4c329619" name="li-4c329619">§</a>
    `export` and `readonly` should be used separately from variable assignment,
    because otherwise failures in command substitutions won't stop the script.
    That is, do this:

    ```sh
    X="$( echo 42 )"
    export X
    ```

    And **not** this:

    ```sh
    # Bad!
    export X="$( echo 42 )"
    ```

 *  <a href="#li-df531547" id="li-df531547" name="li-df531547">§</a>
    If a boolean value is needed, use `0` for `false`, and `1` for `true`.

 *  <a href="#li-f41e78ee" id="li-f41e78ee" name="li-f41e78ee">§</a>
    Mark every variable that shouldn't change later as `readonly`.

 *  <a href="#li-78816dc3" id="li-78816dc3" name="li-78816dc3">§</a>
    Prefer `'raw strings'` to `"double quoted strings"` whenever possible.

 *  <a href="#li-3a851da5" id="li-3a851da5" name="li-3a851da5">§</a>
    Put spaces within `$( cmd )`, `$(( expr ))`, and `{ cmd; }`.  Avoid spaces
    within `${var}`.

 *  <a href="#li-1e74ed3b" id="li-1e74ed3b" name="li-1e74ed3b">§</a>
    Put utility flags in the ASCII order and **don't** group them together.  For
    example, `ls -1 -A -l`.

 *  <a href="#li-be24aa66" id="li-be24aa66" name="li-be24aa66">§</a>
    Script code lines should not be longer than one hundred (**100**) columns.
    For comments, see the text section below.

 *  <a href="#li-e9ecb034" id="li-e9ecb034" name="li-e9ecb034">§</a>
    `snake_case`, not `camelCase` for variables.  `kebab-case` for filenames.

 *  <a href="#li-d585008c" id="li-d585008c" name="li-d585008c">§</a>
    Start scripts with the following sections in the following order:

    1.  Shebang.
    1.  Some initial documentation (optional).
    1.  Verbosity level parsing (optional).
    1.  `set` options.

 *  <a href="#li-1c82df53" id="li-1c82df53" name="li-1c82df53">§</a>
    UPPERCASE names for external exported variables, lowercase for local,
    unexported ones.

 *  <a href="#li-1184f72a" id="li-1184f72a" name="li-1184f72a">§</a>
    Use `set -e -f -u` and also `set -x` in verbose mode.

 *  <a href="#li-ba83aa34" id="li-ba83aa34" name="li-ba83aa34">§</a>
    Use the `"$var"` form instead of the `$var` form, unless word splitting is
    required.

 *  <a href="#li-5a57edc0" id="li-5a57edc0" name="li-5a57edc0">§</a>
    When concatenating, always use the form with curly braces to prevent
    accidental bad variable names.  That is, `"${var}_tmp.txt"` and **not**
    `"$var_tmp.txt"`.  The latter will try to lookup variable `var_tmp`.

 *  <a href="#li-e5cd3adb" id="li-e5cd3adb" name="li-e5cd3adb">§</a>
    When concatenating, surround the whole string with quotes.  That is, use
    this:

    ```sh
    dir="${TOP_DIR}/sub"
    ```

    And **not** this:

    ```sh
    # Bad!
    dir="${TOP_DIR}"/sub
    ```



##  <a href="#shell-conditionals" id="shell-conditionals" name="shell-conditionals">Conditionals</a>

Guidelines and agreements for using command `test`, also known as `[`:

 *  <a href="#li-885ebcf2" id="li-885ebcf2" name="li-885ebcf2">§</a>
    For conditionals that check for equality against multiple values, prefer
    `case` instead of `test`.

 *  <a href="#li-489f40c9" id="li-489f40c9" name="li-489f40c9">§</a>
    Prefer the `!= ''` form instead of using `-n` to check if string is empty.

 *  <a href="#li-dbf52941" id="li-dbf52941" name="li-dbf52941">§</a>
    Spell compound conditions with `&&`, `||`, and `!` **outside** of `test`
    instead of `-a`, `-o`, and `!` **inside** of `test` correspondingly.  The
    latter ones are pretty much deprecated in POSIX.

    See also: “[Problems With the `test` Builtin: What Does `-a` Mean?][test]”.

 *  <a href="#li-729c95fc" id="li-729c95fc" name="li-729c95fc">§</a>
    Use `=` for strings and `-eq` for numbers to catch typing errors.

[test]: https://www.oilshell.org/blog/2017/08/31.html
