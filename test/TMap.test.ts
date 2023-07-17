import { TMap } from "..";
import { expectTypeOf } from "expect-type";


// get / set
{
  type map1 = TMap.set<TMap, 1, number>;
  expectTypeOf<TMap.size<map1>>().toEqualTypeOf<1>();
  expectTypeOf<TMap.get<map1, 1>>().toEqualTypeOf<number>();

  // override value
  type map1b = TMap.set<map1, 1, 'b'>;
  expectTypeOf<TMap.size<map1b>>().toEqualTypeOf<1>();
  expectTypeOf<TMap.get<map1b, 1>>().toEqualTypeOf<'b'>();
  
  // add value
  type map2 = TMap.set<map1, 'hello', string>;
  expectTypeOf<TMap.get<map2, 1>>().toEqualTypeOf<number>();
  expectTypeOf<TMap.get<map2, 'hello'>>().toEqualTypeOf<string>();
}

// remove
{
  type map1 = TMap<[[1, number], ['hello', string]]>;
  type stringMap = TMap.remove<map1, 1>;
  expectTypeOf<TMap.size<stringMap>>().toEqualTypeOf<1>();
  expectTypeOf<TMap.get<stringMap, 1>>().toEqualTypeOf<never>();
  expectTypeOf<TMap.get<stringMap, 'hello'>>().toEqualTypeOf<string>();

  // removing missing is a no-op
  expectTypeOf<TMap.remove<map1, boolean>>().toEqualTypeOf<map1>();
}

// get missing
{
  expectTypeOf<TMap.get<TMap, 2>>().toEqualTypeOf<never>();

  type map1 = TMap<[[1, number], ['hello', string]]>;
  expectTypeOf<TMap.get<map1, 2>>().toEqualTypeOf<never>();
}

// constructor
{
  type map1 = TMap<[[1, number]]>;
  expectTypeOf<TMap.size<map1>>().toEqualTypeOf<1>();
  expectTypeOf<TMap.get<map1, 1>>().toEqualTypeOf<number>();

  type map2 = TMap<[[1, number], ['hello', string]]>;
  expectTypeOf<TMap.size<map2>>().toEqualTypeOf<2>();
  expectTypeOf<TMap.get<map2, 1>>().toEqualTypeOf<number>();
  expectTypeOf<TMap.get<map2, 'hello'>>().toEqualTypeOf<string>();
}

// has
{
  type map1 = TMap<[[1, number]]>;
  expectTypeOf<TMap.has<map1, 1>>().toEqualTypeOf<true>();
  expectTypeOf<TMap.has<map1, 2>>().toEqualTypeOf<never>();

  type map2 = TMap<[[1, number], ['hello', string]]>;
  expectTypeOf<TMap.has<map2, 1>>().toEqualTypeOf<true>();
  expectTypeOf<TMap.has<map2, 'hello'>>().toEqualTypeOf<true>();
  expectTypeOf<TMap.has<map2, 2>>().toEqualTypeOf<never>();
}

// empty
{
  expectTypeOf<TMap.empty<TMap>>().toEqualTypeOf<true>();
  expectTypeOf<TMap.empty<TMap.set<TMap, 1, 2>>>().toEqualTypeOf<never>();
}

// size
{
  expectTypeOf<TMap.size<TMap>>().toEqualTypeOf<0>();
  expectTypeOf<TMap.size<TMap.set<TMap, 1, 2>>>().toEqualTypeOf<1>();
}

// select
// test-select
{
  type map2 = TMap<[[1, number], [2, number], ['hello', string]]>;
  
  // by key
  expectTypeOf<TMap.select<map2, string>>().toEqualTypeOf<TMap<[['hello', string]]>>();
  expectTypeOf<TMap.select<map2, number>>().toEqualTypeOf<TMap<[[1, number], [2, number]]>>();
  expectTypeOf<TMap.select<TMap, boolean>>().toEqualTypeOf<TMap>();
  
  // by value
  expectTypeOf<TMap.select<map2, unknown, string | number>>().toEqualTypeOf<map2>();
  expectTypeOf<TMap.select<map2, unknown, string>>().toEqualTypeOf<TMap<[['hello', string]]>>();
  expectTypeOf<TMap.select<map2, unknown, number>>().toEqualTypeOf<TMap<[[1, number], [2, number]]>>();
  expectTypeOf<TMap.select<TMap, unknown, boolean>>().toEqualTypeOf<TMap>();

  // by key & value
  expectTypeOf<TMap.select<map2, string | number, string | number>>().toEqualTypeOf<map2>();
  expectTypeOf<TMap.select<map2, string, string>>().toEqualTypeOf<TMap<[['hello', string]]>>();
  expectTypeOf<TMap.select<map2, string, number>>().toEqualTypeOf<TMap>();
  expectTypeOf<TMap.select<map2, number, string>>().toEqualTypeOf<TMap>();
}

// keys & values
{
  type map = TMap<[[1, number], [2, number], ['hello', string]]>;
  expectTypeOf<TMap.keys<map>>().toEqualTypeOf<[1, 2, 'hello']>();
  expectTypeOf<TMap.values<map>>().toEqualTypeOf<[number, number, string]>();
}