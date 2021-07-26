 #  AdGuard Go Team Git Guidelines

 *  <a href="#li-b085c724" id="li-b085c724" name="li-b085c724">§</a>
    Call your branches either `NNNN-fix-foo` (where `NNNN` is the ID of the
    GitHub issue you worked on in this branch) or just `fix-foo` if there was no
    GitHub issue.

 *  <a href="#li-6ff49977" id="li-6ff49977" name="li-6ff49977">§</a>
    Do not put your text editors' temporary files into the project's
    `.gitignore` files.  The more are added, the harder they become to maintain.
    Put them into your [global `.gitignore`][ignore[ file instead.

    Only build, run, and test outputs should be placed into `.gitignore`,
    sorted, with negations at the bottom to make sure they take effect.

 *  <a href="#li-afc0d56c" id="li-afc0d56c" name="li-afc0d56c">§</a>
    Follow the commit message header format:

    ```none
    pkg: fix the network error logging issue
    ```

    Where `pkg` is the directory or Go package (without the `internal/` part)
    where most changes took place.  If there are several such packages, or the
    change is top-level only, write `all`.

 *  <a href="#li-ebd6a188" id="li-ebd6a188" name="li-ebd6a188">§</a>
    Keep your commit messages, including headers, to eighty (**80**) columns.

 *  <a href="#li-b5f7773a" id="li-b5f7773a" name="li-b5f7773a">§</a>
    Only use lowercase letters in your commit message headers.  The rest of the
    message should follow the [plain text conventions][text].

    The only exceptions are direct mentions of identifiers from the source code
    and filenames like `HACKING.md`.

[ignore]: https://stackoverflow.com/a/7335487/1892060.
[text]:   Text.md
