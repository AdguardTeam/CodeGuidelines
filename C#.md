# AdGuard C# Guidelines
*Version: 0.1*

- [Introduction](#introduction)
- [Access Modifiers](#access-modifiers)
- [Naming Conventions](#naming-conventions)
- [Comments and Documentation](#comments-and-documentation)
  - [General Documentation Quality](#general-documentation-quality)
  - [Documenting a Class](#documenting-a-class)
  - [Documenting a Method](#documenting-a-method)
  - [Inline Comments](#inline-comments)
- [General Code Quality](#general-code-quality)
- [Best Practices](#best-practices)	
  - [Minimize Visibility](#minimize-visibility)
  - [Exceptions](#exceptions)
  - [Premature Optimization](#premature-optimization)
  - [Always Use Properties instead of Public Variables](#always-use-properties-instead-of-public-variables)
  - [Use IDisposable Interface](#use-idisposable-interface)
  - [Prefer “is” and “as” Operators While Casting](#prefer-“is”-and-“as”-operators-while-casting)
  
  
## Introduction

This is a coding standard and best practices guide for C# we should use in AdGuard projects.

Based on: [AdGuard Java Guidelines](https://github.com/AdguardTeam/CodeGuidelines/blob/master/Java.md)

## Access Modifiers

Access level modifiers should be explicitly defined when it's possible.
Examples:
```c#
// Bad.
class mountainBike	// implicit internal
{
	object Frame { get; set; }	// implicit private
	object[] Wheels { get; set; }	// implicit private
}

// Good.
private class mountainBike
{
	private object Frame { get; set; }
	private object[] Wheels { get; set; }
}
```


## Naming Conventions

**General Guidelines**

* All names should be meaningful.
* Use whole words and avoid acronyms and abbreviations.

**Classes**

* Class names should be nouns in **PascalCase**.
* Multiple classes in the single file are allowed, but when it really makes sense.

Examples:
```c#
// Bad.
private class mountainBike
{

}

// Good.
private class MountainBike
{

}
```


**Interfaces**

* Interface names should be nouns in **PascalCase**.
* Interfaces should be prefaced with the letter **I**.
Examples:
```c#
// Bad.
public interface Bike
{

}

// Good.
public interface IBike
{

}
```

**Namespaces, Enums, Structs, Delegates, Events, Methods and Properties**

* **PascalCase** should be used

**Variables and Constants general guidelines**

* Variable names should be short yet meaningful.
* Should not start with underscore(_) or dollar sign $ characters.
* Should be mnemonic i.e, designed to indicate to the casual observer the intent of its use.
* One-character variable names should be avoided except for temporary variables.
* Magic-numbers (hard-coded numbers) shouldn't be used
* Include units in variable names

Examples:
```c#
private void DoSomething()
{
	// Bad.
	long pollInterval;
	int fileSize;
}

private void DoSomething()
{
	// Good.
	long pollIntervalMs;
	int fileSizeGb.
}
```

**Constants**

* Should be all uppercase with words separated by underscores (_).

Examples:
```c#
// Bad.
public const int TimeInSeconds = 5;

//Good.
public const int TIME_IN_SECONDS = 5;
```

**Private variables**

* Should be written in **PascalCase**.
* Should be prefixed with the **m_**

Examples:
```c#
// Bad.
int fileSize;

// Good.
int m_FileSizeGb.
```

**Local variables**

* Should be written in **lowerCamelCase**.
* Using the implicit typing for the local variables declaration is encouraged.

Examples:
```c#
private void DoSomething()
{
	// Bad.
	long PollInterval = Convert.ToInt32(Console.ReadLine());;
}

private void DoSomething()
{
	// Good.
	var pollIntervalMs = Convert.ToInt32(Console.ReadLine());
}
```

## Comments and Documentation

Have you ever heard that "good code is supposed to be self-explanatory"? I'd love to find the author of this statement and tell him everything I think about it. This guy is responsible for thousands of unmaintainable projects because devs are lazy by nature and use it as excuse whenever it's possible.

The problem is rather obvious: self-explanatory code only tell how it is working. It rarely tells how it should work. That's why we have some strict rules regarding code documentation and comments.

The more visible a piece of code is (and by extension - the farther away consumers might be), the more documentation is needed.

### General Documentation Quality

* Use [XMLDoc](http://msdn.microsoft.com/en-us/library/b2s063f7%28v=VS.100%29.aspx)-style comments.
* Every public class or method **must** have a comment.
* Don't document overriding methods unless you want to tell what's different in its behavior.
* Documentation text should be written using complete sentences, full stops are not necessary.

### Documenting a Class
Documentation for a class may range from a single sentence to paragraphs with code examples. Documentation should serve to disambiguate any conceptual blanks in the API, and make it easier to quickly and **correctly** use your API. A thorough class doc usually has a one sentence summary and, if necessary, a more detailed explanation.

```C#
/// <summary>
/// Implements a variable-size List that uses an array of objects to store the
/// elements. A List has a capacity, which is the allocated length
/// of the internal array. As elements are added to a List, the capacity
/// of the List is automatically increased as required by reallocating the
/// internal array.
/// </summary>
public class List<T> : IList<T>, System.Collections.IList, IReadOnlyList<T>
{
	...
}
```

### Documenting a Method

A method doc should tell what the method does. Depending on the argument types, it may also be important to document input format.

```C#
/// <summary>
/// Adds two doubles and returns the result.
/// </summary>
/// <returns>
/// The sum of two doubles.
/// </returns>
/// <exception cref="System.OverflowException">Thrown when one parameter is max 
/// and the other is greater than zero.</exception>
/// See <see cref="Math.Add(int, int)"/> to add integers.
/// <param name="a">A double precision number.</param>
/// <param name="b">A double precision number.</param>
public static double Add(double a, double b)
{
	...
}
```

### Inline Comments

Inline comments should always be added when the intent or purpose of any code isn't completely explicit, but the code itself ought to be clear enough to follow logically.

```C#
private void EnsureCapacity(int min) 
{
	if (m_Items.Length < min) 
	{
		var newCapacity = m_Items.Length == 0 ? m_DefaultCapacity : m_Items.Length * 2;
		// Allow the list to grow to maximum possible capacity (~2G elements) before encountering overflow.
		// Note that this check works even when m_Items.Length overflowed thanks to the (uint) cast
		if ((uint)newCapacity > Array.MaxArrayLength) newCapacity = Array.MaxArrayLength;
		if (newCapacity < min) newCapacity = min;
		Capacity = newCapacity;
	}
}
```

## General Code Quality

**Single responsibility principle**

Every module, class or method should have responsibility over a single part of the functionality provided by the software.

**Line length**

Try to limit line length. This limit can be arbitrary (e.g. 80 or 100 characters) and not rigidly enforced, but the goal is to reduce the amount of horizontal scrolling for the developer.

**Method and block length**

Try to limit the length of method and code blocks by 50 lines so that they are not trying to do too much. Shorter methods are easier to test, and smaller sections of code are more quickly comprehended by developers.

**Brackets and blocks**

Open braces should always be at the beginning of the line after the statement that begins the block.

```C#
// bad
private void DoSomething() {
	...
}
 
// good
private void DoSomething()
{
	...
}
```

An empty line should be used after block of code in the methods.
```C#
// bad
private void DoSomething() 
	{
	if (foobar)
	{
		...
	}
	DoAnotherAction();
}
 
// good
private void DoSomething() 
	{
	if (foobar)
	{
		...
	}
	
	DoAnotherAction();
}
```

Always use brackets when creating code blocks of any kind. Every block, even if it is only one line, needs to have its own curly braces in order to avoid confusion and prevent the possibility of hard to track bugs.

```C#
// bad
if (foobar) DoSomething();
 
// good
if (foobar) 
{
    DoSomething();
}
```

**Ternary operators**

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices.

```C#
// bad
var value = a && b ? 11 : a ? 10 : b ? 1 : 0;

// good
var value = isSimple ? 11 : 1;
```

Ternary expressions should never be nested because they just add to the confusion.

**Centralize duplicate logic in utility functions**

**Using the `dynamic` keyword allowed only in tests**

**Use a StringBuilder instead of string if multiple concatenations are required**

**Override ToString method for the types which you want to provide with custom information.**

**Avoid straightaway copy/pasting of code from other sources. It is always recommended to hand write the code.**

**Usage of 'out' and 'ref' keywords be avoided as recommended by Microsoft [(in the Code analysis Rules and guidelines)](https://msdn.microsoft.com/en-us/library/dd264925.aspx)**

## Best Practices

### Minimize Visibility

In a class API, you should support access to any methods and fields that you make accessible. Therefore, only expose what you intend the caller to use. This can be imperative when writing thread-safe code.

```C#
public class Parser 
{
  // Bad.
  //   - Callers can directly access and mutate, possibly breaking internal assumptions.
  public Dictionary<String, String> RawFields;

  // Bad.
  //   - This is probably intended to be an internal utility function.
  public String ReadConfigLine() 
  {
    ..
  }
}

// Good.
//   - rawFields and the utility function are hidden
//   - The class is package-private, indicating that it should only be accessed indirectly.
class Parser 
{
  private Dictionary<String, String> m_RawFields;

  private string ReadConfigLine() 
  {
    ..
  }
}
```

### Exceptions

**Catch narrow exceptions**

Sometimes when using try/catch blocks, it may be tempting to just `catch Exception`, so you don't have to worry about what type was thrown. This is usually a bad idea, as you can end up catching more than you really wanted to deal with. For example, `catch Exception` would capture `NullReferenceException`, and would capture `OutOfMemoryException`.

```C#
// Bad.
//   - If a OutOfMemoryException happens, the program continues rather than aborting.
try 
{
  storage.InsertUser(user);
} 
catch (Exception ex) 
{
  LOG.Error("Failed to insert user.");
}

try 
{
  storage.InsertUser(user);
} 
catch (StorageException ex) 
{
  LOG.Error("Failed to insert user.");
}
```

**Don't swallow exceptions**

An empty catch block is usually a bad idea, as you have no signal of a problem. Coupled with narrow exception violations, it's a recipe for disaster.

**Throw appropriate exception types**

Let your API users obey the "catch narrow exceptions" rule, don't throw `Exception`. Even if you are calling another naughty API that throws `Exception`, at least hide that so it doesn't bubble up even further. You should also make an effort to hide implementation details from your callers when it comes to exceptions.

```C#
// Bad.
//   - Caller is forced to catch Exception, trapping many unnecessary types of issues.
public class DataStore 
{
  public string FetchValue(string key)
  {
    ...
    throw new Exception("error message");
  }
}

// Better.
//   - The interface leaks details about one specific implementation.
public DataStore
{
  public string FetchValue(string key)
  {
    ...
    throw new SQLException("error message");
  }
}

// Good.
//   - A custom exception type insulates the user from the implementation.
//   - Different implementations aren't forced to abuse irrelevant exception types.
public DataStore
{
  public string FetchValue(string key)
  {
	...
	throw new StorageException("error message");
  }
  
  public class StorageException : Exception
  {
    ...
  }
}
```

## Premature Optimization

**Premature optimization is the root of all evil.**

Donald Knuth is a smart guy, and he had a few things to [say](http://c2.com/cgi/wiki?PrematureOptimization) on the topic.

Unless you have strong evidence that an optimization is necessary, it's usually best to implement the un-optimized version first (possibly leaving notes about where optimizations could be made).

So before you spend a week writing your memory-mapped compressed huffman-encoded hashmap, use the stock stuff first and measure.

## Always Use Properties instead of Public Variables

Reason behind this is, it makes your code properly encapsulated in OOPs environment. By using getters & setters, you can restrict the user directly accessing the member variables. You can restrict setting the values explicitly thus making your data protected from accidental changes. Also, properties give you easier validation for your data.

## Use IDisposable Interface

Use IDisposable interface to free all the resources from the memory. Once you implement IDisposable interface in your class, you will get a Dispose() method there. Write code there to free the resources. If you implement IDisposable, you can initialize your class like this:

```C#
using (PersonDataSource personDataSource = DataSource.GetPerson())
{
    // write your code here
}
```

After the using() {} block, it will call the Dispose() method automatically to free up the class resources. You will not have to call the Dispose() explicitly for the class.

## Prefer “is” and “as” Operators While Casting

It is better to use “is” and “as” operator while casting. Instead of Explicit casting, use the Implicit casting.

## Structured approach to logging

### INFO

As the name suggests, these are purely informational messages. To use this log level effectively, try to think about what general information would be useful for diagnosing an application error or oddities.

### WARN

Should be used to indicate that the application faced a potential problem; however, the user experience has not been affected in any way. In this case, it is acceptable to swallow an exception in the catch block.

### ERROR
Should be used to indicate that the application faced a significant problem and that, as a result, the user experience was affected in some way. In this case, it is necessary to, optionally, modify exception and throw it again.

### VERBOSE
Information that is diagnostically helpful to the developer.
