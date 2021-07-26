 #  AdGuard Go Team YAML Guidelines

 *  **TODO(a.garipov):** Define naming conventions for schema names in our
    OpenAPI YAML file.  And just generally OpenAPI conventions.

 *  **TODO(a.garipov):** Find a YAML formatter or write our own.

 *  <a href="#li-c412a475" id="li-c412a475" name="li-c412a475">§</a>
    All strings, including keys, must be quoted.  Reason: the “[NO-rway Law]”.

 *  <a href="#li-2a425f43" id="li-2a425f43" name="li-2a425f43">§</a>
    Indent with two (**2**) spaces.  YAML documents can get pretty
    deeply-nested.

 *  <a href="#li-231fdb57" id="li-231fdb57" name="li-231fdb57">§</a>
    No extra indentation in multiline arrays:

    ```yaml
    'values':
    - 'value-1'
    - 'value-2'
    - 'value-3'
    ```

 *  <a href="#li-2af45c9c" id="li-2af45c9c" name="li-2af45c9c">§</a>
    Prefer single quotes for strings to prevent accidental escaping, unless
    escaping is required or there are single quotes inside the string (e.g. for
    GitHub Actions).

 *  <a href="#li-442b7b18" id="li-442b7b18" name="li-442b7b18">§</a>
    Use `>` for multiline strings, unless you need to keep the line breaks.  Use
    `|` for multiline strings when you do.

[NO-rway Law]: https://news.ycombinator.com/item?id=17359376
