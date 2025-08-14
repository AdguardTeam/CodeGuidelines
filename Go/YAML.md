# AdGuard Go Team YAML guidelines

- **TODO(a.garipov):** Define naming conventions for schema names in our OpenAPI YAML file. And just generally OpenAPI conventions.

- **TODO(a.garipov):** Find a YAML formatter that retains comments or write our own.

- <a href="#li-c412a475" id="li-c412a475" name="li-c412a475">§</a> All strings, including keys, must be quoted. Reason: the “[NO-rway Law]”.

- <a href="#li-2a425f43" id="li-2a425f43" name="li-2a425f43">§</a> Indent with four (**4**) spaces.

- <a href="#li-231fdb57" id="li-231fdb57" name="li-231fdb57">§</a> Multiline arrays should be formatted with two spaces, one hyphen, and one space:

    ```yaml
    'values':
      - 'value-1'
      - 'value-2'
      - 'value-3'
    ```

    Although four spaces before a hyphen is acceptable, when a program formats a document that way:

    ```yaml
    'values':
        - 'value-1'
        - 'value-2'
        - 'value-3'
    ```

- <a href="#li-2af45c9c" id="li-2af45c9c" name="li-2af45c9c">§</a> Prefer single quotes for strings to prevent accidental escaping, unless escaping is required or there are single quotes inside the string (e.g. for GitHub Actions).

- <a href="#li-442b7b18" id="li-442b7b18" name="li-442b7b18">§</a> Use `>` for multiline strings, unless you need to keep the line breaks. Use `|` for multiline strings when you do.

- <a href="#li-9dfaa1a3" id="li-9dfaa1a3" name="li-9dfaa1a3">§</a> When designing a schema, prefer to keep the top level and items of all arrays as objects to make it easier to extend them in the future:

    ```yaml
    # Not very good, hard to expand:
    'client_ips':
      - '192.0.2.1'
      - '192.0.2.2'
    # Better, can be expanded with additional properties:
    'clients':
      - 'ip': '192.0.2.1'
      - 'ip': '192.0.2.2'
    ```

[NO-rway Law]: https://news.ycombinator.com/item?id=17359376
