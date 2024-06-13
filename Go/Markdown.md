 #  AdGuard Go Team Markdown guidelines

> [!NOTE]
>
> Some rules are deprecated. New code should instead use `markdownlint` and follow the configuration and guidelines favored by the Content Team.
>
> See <https://github.com/AdguardTeam/KnowledgeBaseDNS/blob/master/.markdownlint.json> and <https://github.com/igorshubovych/markdownlint-cli>.

 *  <a href="#li-2e3958da" id="li-2e3958da" name="li-2e3958da">§</a>

    > [!WARNING]
    >
    > This rule is deprecated.  See message at the beginning of the document.

    <del>

    Align things to multiples of four columns. Leave two spaces between the
    marker and the content. Below are some examples:

     *  <a href="#li-6d4bac2a" id="li-6d4bac2a" name="li-6d4bac2a">§</a>
        Lists:

        ```md
         *  Item one.
         *  Item two.
        ```

        ```md
        1.  Item one.
        1.  Item two.
        ```

     *  <a href="#li-75f8e42c" id="li-75f8e42c" name="li-75f8e42c">§</a>
        Headers:

        ```md
         #  Article
        ##  Section
           ###  Subsection
          ####  Subsubsection
         #####  Subsubsubsection
        ######  Subsubsubsubsection
        ```

     *  <a href="#li-b705af0e" id="li-b705af0e" name="li-b705af0e">§</a>
        Quotes:

        ```md
         >  This is a quote from some other source. This is a rather long quote
         >  to show exactly how long quotes must be formatted.
        ```

     *  <a href="#li-53c02ead" id="li-53c02ead" name="li-53c02ead">§</a>
        Embedded HTML:

        ```md
        <p align="center">
            <img src="https://cdn.example.com/image.svg"/>
        </p>
        ```

    </del>

 *  <a href="#li-73836f61" id="li-73836f61" name="li-73836f61">§</a>
    Do not ever change elements' IDs. That breaks people's links. Strive to
    give links to moved content.

 *  <a href="#li-9568a3a2" id="li-9568a3a2" name="li-9568a3a2">§</a>
    Generate IDs for list items. To generate a new random ID, use something
    like the following Unix command:

    ```sh
    od -A n -N 4 -t x4 < /dev/urandom
    ```

 *  <a href="#li-e042388e" id="li-e042388e" name="li-e042388e">§</a>
    In numbered lists, use `1.` as the list item marker.

 *  <a href="#li-af423a7e" id="li-af423a7e" name="li-af423a7e">§</a>
    Only use tight lists—that is, lists without empty lines between the
    items—for lists of short numeric information or tables of contents. Use
    loose lists—lists with empty lines between the items—for everything else.

    ```md
    An example of a loose list:

     *  This text is a paragraph, and so will be separated from the other items
        by a longer vertical space.

     *  That is good because it improves readability both in the rendered form
        as well as in the text form.

     *  And we care about the readability of our texts and encourage people to
        write them better.
    ```

    ```md
    The tight list of valid values:

     *  6;
     *  24;
     *  72.
    ```

 *  <a href="#li-e2113143" id="li-e2113143" name="li-e2113143">§</a>
    Prefer triple-backtick fenced code blocks with language tags as info strings
    to indented code blocks and fenced code blocks without info strings. If the
    code block must contain a triple-backtick itself, use triple-tilde fenced
    code blocks instead.

 *  <a href="#li-0f43f94c" id="li-0f43f94c" name="li-0f43f94c">§</a>
    Provide a table of contents for large documents.

 *  <a href="#li-099ae6d9" id="li-099ae6d9" name="li-099ae6d9">§</a>
    Put punctuation inside the text in bold and italic:

    ```md
    This is **very important!**  You need to use *these;* those won't work.
    ```

 *  <a href="#li-d7f5ff79" id="li-d7f5ff79" name="li-d7f5ff79">§</a>
    Use asterisks and not underscores for bold and italic.

 *  <a href="#li-a825a6f4" id="li-a825a6f4" name="li-a825a6f4">§</a>
    Use both `id` and the deprecated `name` attributes to make it work in
    Markdown renderers that strip `id`s.

 *  <a href="#li-7b291978" id="li-7b291978" name="li-7b291978">§</a>
    Use either link references or link destinations only, unless making a table
    of contents. Put all link reference definitions at the end of the
    second-level section or, if the second-level section is large, at the end
    of a third-level one.

 *  <a href="#li-4e14be4c" id="li-4e14be4c" name="li-4e14be4c">§</a>
    Use `none` as the info string for plain text or custom formats, such as
    adblock rules.

 *  <a href="#li-6f29ab84" id="li-6f29ab84" name="li-6f29ab84">§</a>

    > [!WARNING]
    >
    > This rule is obsoleted by the [rule about `names`][names].

    <del>Use the IDs that GitHub would generate in order for this to work both
    on GitHub and most other Markdown renderers.</del>

 *  <a href="#li-fe52a949" id="li-fe52a949" name="li-fe52a949">§</a>

    > [!WARNING]
    >
    > This rule is deprecated.  See message at the beginning of the document.

    <del>

    When a code block interrupts a flow of a sentence, the line following the
    code block should start with a small letter.

    ~~~md
    For example, the following line of code:

    ```c
    printf("hello from process #%d\n", procnum);
    ```

    will print `hello from process #42`.
    ~~~

    </del>

[names]: #li-a825a6f4
