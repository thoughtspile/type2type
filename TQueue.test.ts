import { TQueue } from ".";
import { expectTypeOf } from 'expect-type';

type q0 = TQueue;
expectTypeOf<TQueue.empty<q0>>().toEqualTypeOf<true>()
expectTypeOf<TQueue.size<q0>>().toEqualTypeOf<0>()

// push
type q1 = TQueue.push<TQueue, 1>;
expectTypeOf<TQueue.empty<q1>>().toEqualTypeOf<never>()
expectTypeOf<TQueue.size<q1>>().toEqualTypeOf<1>()

// multiple push
type q4 = TQueue.push<TQueue.push<TQueue.push<TQueue.push<TQueue, 1>, 2>, 3>, 4>;
expectTypeOf<TQueue.empty<q4>>().toEqualTypeOf<never>()
expectTypeOf<TQueue.size<q4>>().toEqualTypeOf<4>()

// peek
expectTypeOf<TQueue.peek<q4>>().toEqualTypeOf<1>()
// pop
type q3 = TQueue.pop<q4>;
expectTypeOf<TQueue.size<q3>>().toEqualTypeOf<3>()
expectTypeOf<q3>().toEqualTypeOf<TQueue.push<TQueue.push<TQueue.push<TQueue, 2>, 3>, 4>>()

// empty peek
expectTypeOf<TQueue.peek<q0>>().toEqualTypeOf<never>()
// empty pop
expectTypeOf<TQueue.pop<q0>>().toEqualTypeOf<TQueue>()
