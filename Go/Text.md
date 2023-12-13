 #  AdGuard Go Team text and commenting guidelines

Following this document is obligatory for comments and text in new code.  Some
of the rules aren't enforced as thoroughly or remain broken in old texts, but
this is still the place to find out about what we **want** our texts to look
like and how to improve them.

The rules are mostly sorted in the alphabetical order.



 *  <a href="#li-7a907f69" id="li-7a907f69" name="li-7a907f69">§</a>
    Avoid overly technical and markup-ey comments.  Write comments for people,
    with full sentences and proper punctuation.

 *  <a href="#li-195be0d8" id="li-195be0d8" name="li-195be0d8">§</a>
    Avoid duplication of words, even if it's grammatically correct.  For
    example, avoid:

    ```none
    # Bad!  The duplication in “that that” impedes reading.
    It isn't obvious that that will not cause issues.
    ```

    instead, write something like:

    ```none
    It isn't obvious that the code will not cause issues.
    ```

 *  <a href="#li-4df3b56b" id="li-4df3b56b" name="li-4df3b56b">§</a>
    <a href="#li-2db43ebe" id="li-2db43ebe" name="li-2db43ebe"></a>
    Capitalize only the first letter in headers and titles, unless a proper name
    or an acronym is used.  So, a header should be something like this:

    ```none
    Using the new API
    ```

    and **not** like this:

    ```none
    Using The New API
    ```

 *  <a href="#li-a8c8a641" id="li-a8c8a641" name="li-a8c8a641">§</a>
    Changelogs should follow the [Keep a Changelog format][keep].  The
    “Security” section may be put first.

 *  <a href="#li-658f569b" id="li-658f569b" name="li-658f569b">§</a>
    End sentences with appropriate punctuation.  Do not add full stops to
    headers.

 *  <a href="#li-30850b1a" id="li-30850b1a" name="li-30850b1a">§</a>
    Mark temporary todos—that is, todos that must be resolved or removed before
    publishing a change—with two exclamation signs:

    ```go
    // TODO(usr1): !! Remove this debug before pushing!
    ```

    This makes it easier to find them both during development and during code
    review.

 *  <a href="#li-18ae73df" id="li-18ae73df" name="li-18ae73df">§</a>
    RFC links should lead to the HTMLized version on `datatracker.ietf.org`.
    For example:

    ```none
    https://datatracker.ietf.org/doc/html/rfc9000
    ```

 *  <a href="#li-30aa3281" id="li-30aa3281" name="li-30aa3281">§</a>
    Set your editor to always end all your files with a newline to make sure
    that Unix tools [work correctly][nl].

 *  <a href="#li-84467c92" id="li-84467c92" name="li-84467c92">§</a>
    Set your editor to consider one tab to be four (**4**) columns wide.  This
    is the default in most editors, and it is also a common preference among
    developers.

 *  <a href="#li-b281efe6" id="li-b281efe6" name="li-b281efe6">§</a>
    Start sentences with a capital letter, unless the first word is a reference
    to a variable name that starts with a lowercase letter.

 *  <a href="#li-80ccb701" id="li-80ccb701" name="li-80ccb701">§</a>
    Strive to not leave any space on the right side and properly justify the
    text.  For example, **do not** do this:

    ```none
    This text is way too
    narrow and should be
    expanded.
    ```

 *  <a href="#li-5e786fd3" id="li-5e786fd3" name="li-5e786fd3">§</a>
    Text should wrap at eighty (**80**) columns to be more readable, to use
    a common standard, and to allow editing or diffing side-by-side without
    wrapping.

    The only exception are long hyperlinks.

    Don't forget to also [set the tab width][tab] in your editor's settings.

 *  <a href="#li-56e8ee2f" id="li-56e8ee2f" name="li-56e8ee2f">§</a>
    Use U.S. English, as it is the most widely used variety of English in the
    code right now as well as generally.

 *  <a href="#li-0569cfab" id="li-0569cfab" name="li-0569cfab">§</a>
    Double spacing between sentences may be used in code comments to make
    sentence borders more clear.  In human-facing documentation (Markdown,
    etc.), prefer single spacing.

 *  <a href="#li-1a435693" id="li-1a435693" name="li-1a435693">§</a>
    Use the serial comma (a.k.a. Oxford comma) to improve comprehension,
    decrease ambiguity, and use a common standard.


 *  <a href="#li-2249ae11" id="li-2249ae11" name="li-2249ae11">§</a>
    Write todos like this:

    ```go
    // TODO(usr1): Fix the frobulation issue.
    ```

    Or, if several people need to look at the code:

    ```go
    // TODO(usr1, usr2): Fix the frobulation issue.
    ```

[keep]: https://keepachangelog.com/en/1.0.0/
[nl]:   https://stackoverflow.com/q/729692/1892060
[tab]:  #li-84467c92
