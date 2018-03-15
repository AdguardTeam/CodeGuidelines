
# AdGuard Java Guidelines
*Version: 0.1*

- [Introduction](#introduction)
- [Naming Conventions](#naming-conventions)
- [Comments and Documentation](#comments-and-documentation)
  - [General Documentation Quality](#general-documentation-quality)
  - [Documenting a Class](#documenting-a-class)
  - [Documenting a Method](#documenting-a-method)
  - [Inline Comments](#inline-comments)
- [General Code Quality](#general-code-quality)
- [Best Practices](#best-practices)
  - [Preconditions](#preconditions)
  - [Use Interfaces](#use-interfaces)
  - [Minimize Visibility](#minimize-visibility)
  - [Exceptions](#exceptions)
  - [Premature Optimization](#premature-optimization)


## Introduction

This is a coding standard and best practices guide for Java we should use in AdGuard projects.

Heavily inspired by and partly mirrors [Twitter's guide](https://github.com/twitter/commons/blob/master/src/java/com/twitter/common/styleguide.md).

## Naming Conventions

**Classes and Interfaces**

* Class names should be nouns in **CamelCase**.
* Use whole words and avoid acronyms and abbreviations.

Examples:
```java
interface Bicycle
Class MountainBike implements Bicycle
```
**Methods**
* Methods should be verbs in **lowerCamelCase**.

Examples:
```java
void changeGear(int newValue);
void speedUp(int increment);
void applyBrakes(int decrement);
```

**Variables**

Variable names should be short yet meaningful. Always use **lowerCamelCase** for variable names.

* Should not start with underscore(`_`) or dollar sign `$` characters.
* Should be mnemonic i.e, designed to indicate to the casual observer the intent of its use.
* One-character variable names should be avoided except for temporary variables.
* Include units in variable names

Examples:
```
// Bad.
long pollInterval;
int fileSize;

// Good.
long pollIntervalMs;
int fileSizeGb.

// Better.
//   - Unit is built in to the type.
//   - The field is easily adaptable between units, readability is high.
Amount<Long, Time> pollInterval;
Amount<Integer, Data> fileSize;
```

**Constant variables**

* Should be all uppercase with words separated by underscores (`_`).

Examples:
```java
// Some  Constant variables used in predefined Float class
public static final float POSITIVE_INFINITY = 1.0f / 0.0f;
public static final float NEGATIVE_INFINITY = -1.0f / 0.0f;
public static final float NaN = 0.0f / 0.0f;
```

## Comments and Documentation

Have you ever heard that "good code is supposed to be self-explanatory"? I'd love to find the author of this statement and tell him everything I think about it. This guy is responsible for thousands of unmaintainable projects because devs are lazy by nature and use it as excuse whenever it's possible.

The problem is rather obvious: self-explanatory code only tell how it is working. It rarely tells how it should work. That's why we have some strict rules regarding code documentation and comments.

The more visible a piece of code is (and by extension - the farther away consumers might be), the more documentation is needed.

### General Documentation Quality

* Use [Javadoc](http://www.oracle.com/technetwork/java/javase/tech/index-137868.html)-style comments.
* No author tags. The author can be always found in the commits history.
* Every public class or method **must** have a comment.
* Don't document overriding methods unless you want to tell what's different in its behavior.

### Documenting a Class

Documentation for a class may range from a single sentence to paragraphs with code examples. Documentation should serve to disambiguate any conceptual blanks in the API, and make it easier to quickly and **correctly** use your API. A thorough class doc usually has a one sentence summary and, if necessary, a more detailed explanation.

```java
/**
 * An RPC equivalent of a unix pipe tee.  Any RPC sent to the tee input is guaranteed to have
 * been sent to both tee outputs before the call returns.
 *
 * @param <T> The type of the tee'd service.
 */
public class RpcTee<T> {
  ...
}
```

### Documenting a Method

A method doc should tell what the method does. Depending on the argument types, it may also be important to document input format.

```java
// Bad.
//   - The doc tells nothing that the method declaration didn't.
//   - This is the 'filler doc'.  It would pass style checks, but doesn't help anybody.
/**
 * Splits a string.
 *
 * @param s A string.
 * @return A list of strings.
 */
List<String> split(String s);

// Better.
//   - We know what the method splits on.
//   - Still some undefined behavior.
/**
 * Splits a string on whitespace.
 *
 * @param s The string to split.  An {@code null} string is treated as an empty string.
 * @return A list of the whitespace-delimited parts of the input.
 */
List<String> split(String s);

// Great.
//   - Covers yet another edge case.
/**
 * Splits a string on whitespace.  Repeated whitespace characters are collapsed.
 *
 * @param s The string to split.  An {@code null} string is treated as an empty string.
 * @return A list of the whitespace-delimited parts of the input.
 */
List<String> split(String s);
```

### Inline Comments

Inline comments should always be added when the intent or purpose of any code isn't completely explicit, but the code itself ought to be clear enough to follow logically.

```java
// In a majority of cases, the controller ID will be the same as the name.
// However, when a controller is manually given an ID, it will be keyed
// in the collection that way. So if we don't find it, we attempt to loop
// over the existing controllers and find it by classname
if (controller == null) {
   all = controllers.items;
   for (i = 0; i < all.length; ++i) {
       cls = all[i];
       className = cls.getModuleClassName();
       if (className && className == name) {
           controller = cls;
           break;
       }
   }
}
```

## General Code Quality

**Line length**

Try to limit line length. This limit can be arbitrary (e.g. 80 or 100 characters) and not rigidly enforced, but the goal is to reduce the amount of horizontal scrolling for the developer.

**Method and block length**

Try to limit the length of method and code blocks by 50 lines so that they are not trying to do too much. Shorter methods are easier to test, and smaller sections of code are more quickly comprehended by developers.

**Brackets and blocks**

Always use brackets when creating code blocks of any kind. Every block, even if it is only one line, needs to have its own curly braces in order to avoid confusion and prevent the possibility of hard to track bugs.

```java
// bad
if (foobar) doSomething();
 
// good
if (foobar) {
    doSomething();
}
```

**Ternary operators**

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices.

```java
// bad
int value = a && b ? 11 : a ? 10 : b ? 1 : 0;

// good
int value = isSimple ? 11 : 1;
```

Ternary expressions should never be nested because they just add to the confusion.

**Use final fields**

Final fields are useful because they declare that a field may not be reassigned. When it comes to checking for thread-safety, a final field is one less thing that needs to be checked.

**Extract constants whenever it makes sense**

**Centralize duplicate logic in utility functions**

## Best Practices

### Preconditions

Preconditions checks are a good practice, since they serve as a well-defined barrier against bad input from callers. As a convention, object parameters to public constructors and methods should always be checked against null, unless null is explicitly allowed.

```java
// Bad.
//   - If the file or callback are null, the problem isn't noticed until much later.
class AsyncFileReader {
  void readLater(File file, Closure<String> callback) {
    scheduledExecutor.schedule(new Runnable() {
      @Override public void run() {
        callback.execute(readSync(file));
      }
    }, 1L, TimeUnit.HOURS);
  }
}

// Good.
class AsyncFileReader {
  void readLater(File file, Closure<String> callback) {
    checkNotNull(file);
    checkArgument(file.exists() && file.canRead(), "File must exist and be readable.");
    checkNotNull(callback);

    scheduledExecutor.schedule(new Runnable() {
      @Override public void run() {
        callback.execute(readSync(file));
      }
    }, 1L, TimeUnit.HOURS);
  }
}
```

### Use Interfaces

Interfaces decouple functionality from implementation, allowing you to use multiple implementations without changing consumers. Interfaces are a great way to isolate packages - provide a set of interfaces, and keep your implementations package private.

Many small interfaces can seem heavyweight, since you end up with a large number of source files. Consider the pattern below as an alternative.

```java
interface FileFetcher {
  File getFile(String name);

  // All the benefits of an interface, with little source management overhead.
  // This is particularly useful when you only expect one implementation of an interface.
  static class HdfsFileFetcher implements FileFetcher {
    @Override File getFile(String name) {
      ...
    }
  }
}
```

### Minimize Visibility

In a class API, you should support access to any methods and fields that you make accessible. Therefore, only expose what you intend the caller to use. This can be imperative when writing thread-safe code.

```java
public class Parser {
  // Bad.
  //   - Callers can directly access and mutate, possibly breaking internal assumptions.
  public Map<String, String> rawFields;

  // Bad.
  //   - This is probably intended to be an internal utility function.
  public String readConfigLine() {
    ..
  }
}

// Good.
//   - rawFields and the utility function are hidden
//   - The class is package-private, indicating that it should only be accessed indirectly.
class Parser {
  private final Map<String, String> rawFields;

  private String readConfigLine() {
    ..
  }
}
```

### Exceptions

**Catch narrow exceptions**

Sometimes when using try/catch blocks, it may be tempting to just `catch Exception`, `Error`, or `Throwable` so you don't have to worry about what type was thrown. This is usually a bad idea, as you can end up catching more than you really wanted to deal with. For example, `catch Exception` would capture `NullPointerException`, and `catch Throwable` would capture `OutOfMemoryError`.

```java
// Bad.
//   - If a RuntimeException happens, the program continues rather than aborting.
try {
  storage.insertUser(user);
} catch (Exception e) {
  LOG.error("Failed to insert user.");
}

try {
  storage.insertUser(user);
} catch (StorageException e) {
  LOG.error("Failed to insert user.");
}
```

**Don't swallow exceptions**

An empty catch block is usually a bad idea, as you have no signal of a problem. Coupled with narrow exception violations, it's a recipe for disaster.

**When interrupted, reset thread interrupted state**

Many blocking operations throw InterruptedException so that you may be awaken for events like a JVM shutdown. When catching InterruptedException, it is good practice to ensure that the thread interrupted state is preserved.

IBM has a good [article](http://www.ibm.com/developerworks/java/library/j-jtp05236/index.html) on this topic.

```java
// Bad.
//   - Surrounding code (or higher-level code) has no idea that the thread was interrupted.
try {
  lock.tryLock(1L, TimeUnit.SECONDS)
} catch (InterruptedException e) {
  LOG.info("Interrupted while doing x");
}

// Good.
//   - Interrupted state is preserved.
try {
  lock.tryLock(1L, TimeUnit.SECONDS)
} catch (InterruptedException e) {
  LOG.info("Interrupted while doing x");
  Thread.currentThread().interrupt();
}
```

**Throw appropriate exception types**

Let your API users obey the "catch narrow exceptions" rule, don't throw `Exception`. Even if you are calling another naughty API that throws `Exception`, at least hide that so it doesn't bubble up even further. You should also make an effort to hide implementation details from your callers when it comes to exceptions.

```java
// Bad.
//   - Caller is forced to catch Exception, trapping many unnecessary types of issues.
interface DataStore {
  String fetchValue(String key) throws Exception;
}

// Better.
//   - The interface leaks details about one specific implementation.
interface DataStore {
  String fetchValue(String key) throws SQLException, UnknownHostException;
}

// Good.
//   - A custom exception type insulates the user from the implementation.
//   - Different implementations aren't forced to abuse irrelevant exception types.
interface DataStore {
  String fetchValue(String key) throws StorageException;

  static class StorageException extends Exception {
    ...
  }
}
```

### Premature Optimization

**Premature optimization is the root of all evil.**

Donald Knuth is a smart guy, and he had a few things to [say](http://c2.com/cgi/wiki?PrematureOptimization) on the topic.

Unless you have strong evidence that an optimization is necessary, it's usually best to implement the un-optimized version first (possibly leaving notes about where optimizations could be made).

So before you spend a week writing your memory-mapped compressed huffman-encoded hashmap, use the stock stuff first and measure.
