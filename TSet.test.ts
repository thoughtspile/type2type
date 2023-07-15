import { TSet } from ".";
import { expectTypeOf } from 'expect-type';

// add
{
  type set1 = TSet.add<TSet, 1>;
  expectTypeOf<set1>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.add<set1, 1>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.add<set1, 2>>().toEqualTypeOf<TSet<[1, 2]>>()
}

// remove
{
  expectTypeOf<TSet.remove<TSet, 1>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.remove<TSet<[1]>, 1>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.remove<TSet<[1]>, 2>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.remove<TSet<[1, 2, 3]>, 2>>().toEqualTypeOf<TSet<[1, 3]>>()
  expectTypeOf<TSet.remove<TSet<[1, 2, 3]>, 4>>().toEqualTypeOf<TSet<[1, 2, 3]>>()
}

// has
{
  expectTypeOf<TSet.has<TSet<[1]>, 1>>().toEqualTypeOf<true>()
  expectTypeOf<TSet.has<TSet<[1]>, 2>>().toEqualTypeOf<never>()
  expectTypeOf<TSet.has<TSet<[1, 2, 3]>, 3>>().toEqualTypeOf<true>()
  expectTypeOf<TSet.has<TSet<[1, 2, 3]>, 4>>().toEqualTypeOf<never>()
}

// empty
{
  expectTypeOf<TSet.empty<TSet>>().toEqualTypeOf<true>()
  expectTypeOf<TSet.empty<TSet<[1]>>>().toEqualTypeOf<never>()
}

// size
{
  expectTypeOf<TSet.size<TSet>>().toEqualTypeOf<0>()
  expectTypeOf<TSet.size<TSet<[1, 2, 3]>>>().toEqualTypeOf<3>()
}

// union
{
  expectTypeOf<TSet.union>().toEqualTypeOf<TSet>()

  // identity
  expectTypeOf<TSet.union<TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.union<TSet<[1]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.union<TSet<[1, 2, 3]>>>().toEqualTypeOf<TSet<[1, 2, 3]>>()

  // 2 sets, at least one is empty
  expectTypeOf<TSet.union<TSet, TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.union<TSet, TSet<[1]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.union<TSet, TSet<[1, 2, 3]>>>().toEqualTypeOf<TSet<[1, 2, 3]>>()
  expectTypeOf<TSet.union<TSet<[1]>, TSet>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.union<TSet<[1, 2, 3]>, TSet>>().toEqualTypeOf<TSet<[1, 2, 3]>>()

  // 2 sets
  expectTypeOf<TSet.union<TSet<[1]>, TSet<[2]>>>().toEqualTypeOf<TSet<[2, 1]>>()
  expectTypeOf<TSet.union<TSet<[1]>, TSet<[1, 2]>>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.union<TSet<[2]>, TSet<[1, 2]>>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.union<TSet<[1, 2]>, TSet<[3]>>>().toEqualTypeOf<TSet<[3, 1, 2]>>()
  expectTypeOf<TSet.union<TSet<[1, 2]>, TSet<[2, 3]>>>().toEqualTypeOf<TSet<[2, 3, 1]>>()

  // different data types
  expectTypeOf<TSet.union<TSet<[1]>, TSet<[number]>>>().toEqualTypeOf<TSet<[number, 1]>>()
  expectTypeOf<TSet.union<TSet<[1]>, TSet<[never]>>>().toEqualTypeOf<TSet<[never, 1]>>()
}

// intersection
{
  // identity
  expectTypeOf<TSet.intersection<TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet<[1]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.intersection<TSet<[1, 2, 3]>>>().toEqualTypeOf<TSet<[1, 2, 3]>>()

  // 2 sets, at least one is empty
  expectTypeOf<TSet.intersection<TSet, TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet, TSet<[1]>>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet, TSet<[1, 2, 3]>>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet<[1]>, TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet<[1, 2, 3]>, TSet>>().toEqualTypeOf<TSet>()

  // 2 sets
  expectTypeOf<TSet.intersection<TSet<[1, 2]>, TSet<[1, 2]>>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.intersection<TSet<[1, 2]>, TSet<[3, 4]>>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet<[1, 2]>, TSet<[1]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.intersection<TSet<[1, 2]>, TSet<[2]>>>().toEqualTypeOf<TSet<[2]>>()
  expectTypeOf<TSet.intersection<TSet<[1, 2, 4]>, TSet<[2, 3, 4, 5]>>>().toEqualTypeOf<TSet<[2, 4]>>()

  // different data types
  expectTypeOf<TSet.intersection<TSet<[1]>, TSet<[number]>>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.intersection<TSet<[1]>, TSet<[never]>>>().toEqualTypeOf<TSet>()
}

// test-difference
{
  // identity
  expectTypeOf<TSet.difference<TSet>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.difference<TSet<[1]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.difference<TSet<[1, 2, 3]>>>().toEqualTypeOf<TSet<[1, 2, 3]>>()

  // 2 sets
  expectTypeOf<TSet.difference<TSet<[1, 2]>, TSet<[1, 2]>>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.difference<TSet<[1, 2]>, TSet<[3, 4]>>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.difference<TSet<[1, 2]>, TSet<[1]>>>().toEqualTypeOf<TSet<[2]>>()
  expectTypeOf<TSet.difference<TSet<[1, 2]>, TSet<[2]>>>().toEqualTypeOf<TSet<[1]>>()
  expectTypeOf<TSet.difference<TSet<[1, 2, 4]>, TSet<[2, 3, 4, 5]>>>().toEqualTypeOf<TSet<[1]>>()
}

// test-select
{
  expectTypeOf<TSet.select<TSet<[1, 2]>>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.select<TSet, number>>().toEqualTypeOf<TSet>()
  expectTypeOf<TSet.select<TSet<[1,2]>, number>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.select<TSet<[1,2, 'a', 'b', 'c']>, number>>().toEqualTypeOf<TSet<[1, 2]>>()
  expectTypeOf<TSet.select<TSet<['a', 'b', 'c']>, number>>().toEqualTypeOf<TSet>()
}

// asUnionType
{
  expectTypeOf<TSet.asUnionType<TSet>>().toEqualTypeOf<never>()
  expectTypeOf<TSet.asUnionType<TSet<[1]>>>().toEqualTypeOf<1>()
  expectTypeOf<TSet.asUnionType<TSet<[1, number, 'a']>>>().toEqualTypeOf<number | 'a'>()
}