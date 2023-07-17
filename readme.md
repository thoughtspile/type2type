## type2type

Four classic data structures implemented in TypeScript type system: Stack, Queue, Set, and Map. No JS, only types. Finally, you can `TStack.push<stack, number>` or `TMap<[[string, 'string']]>`  Good (type-only) unit test coverage. Why?

- Fun.
- Explore type-only APIs and limitations of TS.
- Build even more excessively tricky tools on top of this solid foundation.

## Installation

```sh
npm i type2type
```

## Usage

Here's how you can implement static [parentheses validation](https://leetcode.com/problems/valid-parentheses/) in TS type system uning `type2type`:

```ts
import { TMap, TStack } from "type2type";

// declare valid open / closing parentheses pairs
type Brackets = TMap<[
  [')', '('],
  [']', '[']
]>;
type close = TMap.keys<Brackets>[number];
type open = TMap.values<Brackets>[number];

type IsValidBrackets<seq extends string, stack extends TStack<unknown[]> = TStack> = 
  // if we see an opening bracket...
  seq extends `${infer s extends open}${infer tail}`
    // recurse, recording the bracket type
    ? IsValidBrackets<tail, TStack.push<stack, s>>
  // if we see a closing bracket...
  : seq extends `${infer s extends close}${infer tail}`
    // if it matches the expect
    ? (TMap.get<Brackets, s> extends TStack.peek<stack>
      // recurse
      ? IsValidBrackets<tail, TStack.pop<stack>>
      // fail
      : never)
  // if we see a non-bracket symbol...
  : seq extends `${infer _first}${infer tail}`
    // recurse on rest
    ? IsValidBrackets<tail, stack>
  // if seq is empty, ensure we have no unmatched brackets
  : TStack.empty<stack>;

// Use it as a generic type:
type Valid1 = IsValidBrackets<'2 * (1 + (5 + 1))'>
  // ^? true
type Valid2 = IsValidBrackets<'2 * (1 + [5 + 1])'>
  // ^? true
type Wrong1 = IsValidBrackets<'2 * ((1 + (5 + 1))'>
  // ^? never
type Wrong2 = IsValidBrackets<'2 * (1 + [5 + 1))'>
  // ^? never
```

To apply this validation outside type system, declare a function return type based on the generic:

```ts
function calculate<Expr extends string>(expr: Expr): true extends IsValidBrackets<Expr> ? number : never {
  return 9 as any;
}

const x = calculate('2 * (1 + (5 + 1))');
  // ^? number
const y = calculate('2 * (1 + [5 + 1])');
  // ^? number
const err1 = calculate('2 * ((1 + (5 + 1))');
  // ^? never
const err2 = calculate('2 * (1 + [5 + 1))');
  // ^? never
```

## API

General principles:

```ts
// All types are named TType to avoid confusion with JS builtin
import { TStack, TQueue, TSet, TMap } from 'type2type'

// Types create an empty collection when called with no parameters
type EmptyStack = TStack
// Types accept a tuple initializer
type NumQueue = TQueue<[1, 2, 3]>

// Type "methods" are called via TType.method
type TrueSet = TStack.push<
  // The first generic parameter is the TType instance
  TStack,
  1
>

// Of course, data structures are immutable
type Effect = TStack.push<EmptyStack, 1>
type T = TStack.empty<EmptyStack>
  // ^? true

// Type has a "size" method
type Three = TQueue.size<NumQueue>
// And "empty" method
type Yes = TMap.empty<TMap>
  // ^? returns "true" if true
type No = TQueue.empty<NumQueue>
  // ^? returns "never" if false
```

### TStack

Type stack has three extra methods:

```ts
type Empty = TStack

// push adds an element:
type OneStack = TStack.push<Empty, 1>
type TwoStack = TStack.push<OneStack, 2>

// peek shows the last added element
type Two = TStack.peek<TwoStack>
// or "never" for an empty stack
type e = TStack.peek<Empty>

// pop removes the last added element:
type EmptyAgain = TStack.pop<OneStack>
```

### TQueue

Same as `TStack`, but in FIFO order:

```ts
type Empty = TStack
type OneStack = TStack.push<Empty, 1>
type TwoStack = TStack.push<OneStack, 2>

// peek shows the first added element
type One = TStack.peek<TwoStack>
  // ^? 1
```

### TSet

TSet is a set of types. It has three set methods from ES:

```ts
type EmptySet = TSet;

// add
type Set1 = TSet.add<EmptySet, 1>;
type Set2 = TSet.add<Set1, 'hello'>;

// remove
type HelloSet = TSet.remove<Set2, 1>;

// has
type HasHello = TSet.has<HelloSet, 'hello'>;
  // ^? true
type HasBye = TSet.has<HelloSet, 'bye'>;
  // ^? never
```

Three binary set operations:

```ts
type Set12 = TSet.union<TSet<[1]>, TSet<[2]>>;
type Set2 = TSet.intersection<TSet<[1, 2]>, TSet<[2, 3]>>;
type Set1 = TSet.difference<TSet<[1, 2]>, TSet<[2, 3]>>;
```

A neat `select` method that picks all elements of a certain type:

```ts
type SetMixed = TSet<[1, 'hello', 3, true]>
type SetNumbers = TSet.select<SetMixed, number>;
  // ^? TSet<[1, 3]>
```

And `asUnionType`:

```ts
type SetMixed = TSet<[1, 'hello', 3, number]>
type Allowed = TSet.asUnionType<SetMixed>;
  // ^? 'hello' | number
```

NB: union type might look like a set of types, but it actually describes a set of possible values. Union items swallow each other by subtype: `1 | number -> number`, while `TSet<[1, number]>` will always preserve types as is.

### TMap

TMap maps a "key-type" to a "value-type". It has four usual map operations:

```ts
// set
type map1 = TMap.set<TMap, 1, number>;
// get
type Num = TMap.get<map1, 1>;
// has
type Yep = TMap.has<map1, 1>;
type Nope = TMap.has<map1, 2>;
// remove
type EmptyAgain = TMap.remove<map1, 1>;
```

Similar to `TSet`, you get a `select` method which can match key or value types:

```ts
type MixedMap = TMap<[[1, number], [2, number], ['hello', string]]>;
// select by key
type SetNumbers = TSet.select<MixedMap, number>;
  // ^? TMap<[[1, number], [2, number]]>
// select by value
type SetNumbers = TSet.select<MixedMap, unknown, string>;
  // ^? TMap<[['hello', string]]>
// select by both
type SetNumbers = TSet.select<MixedMap, number, string>;
  // ^? TMap<[]>
```

And `keys` / `values` that extract one map component as a tuple:

```ts
type MixedMap = TMap<[[1, number], [2, number], ['hello', string]]>;
type MixedKeys = TMap.keys<MixedMap>;
  // ^? [1, 2, 'hello']
type MixedValues = TMap.values<MixedMap>;
  // ^? [number, number, string]
// converts to union type:
type PossibleValues = TMap.values<MixedMap>[number];
  // ^? number | string
```

---

Built in 2023 by [Vladimir Klepov](https://blog.thoughtspile.tech)

Special thanks to:

- [expect-type](https://github.com/mmkal/expect-type) for awesome type-only test utils.
- [nano-staged](https://github.com/usmanyunusov/nano-staged) for quick prettier integration.

[MIT License](./LICENSE) 

