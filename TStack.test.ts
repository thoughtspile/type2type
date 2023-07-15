import { TStack } from ".";
import { expectTypeOf } from 'expect-type';

type q0 = TStack;
expectTypeOf<TStack.empty<q0>>().toEqualTypeOf<true>()
expectTypeOf<TStack.size<q0>>().toEqualTypeOf<0>()

// push
type q1 = TStack.push<TStack, 1>;
expectTypeOf<TStack.empty<q1>>().toEqualTypeOf<never>()
expectTypeOf<TStack.size<q1>>().toEqualTypeOf<1>()

// multiple push
type q4 = TStack.push<TStack.push<TStack.push<TStack.push<TStack, 1>, 2>, 3>, 4>;
expectTypeOf<TStack.empty<q4>>().toEqualTypeOf<never>()
expectTypeOf<TStack.size<q4>>().toEqualTypeOf<4>()

// peek
expectTypeOf<TStack.peek<q4>>().toEqualTypeOf<4>()
// pop
type q3 = TStack.pop<q4>;
expectTypeOf<TStack.size<q3>>().toEqualTypeOf<3>()
expectTypeOf<q3>().toEqualTypeOf<TStack.push<TStack.push<TStack.push<TStack, 1>, 2>, 3>>()

// empty peek
expectTypeOf<TStack.peek<q0>>().toEqualTypeOf<never>()
// empty pop
expectTypeOf<TStack.pop<q0>>().toEqualTypeOf<TStack>()
