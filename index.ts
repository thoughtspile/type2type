import { Extends } from "expect-type";

type Equals<T1, T2> = T1 extends T2 ? T2 extends T1 ? true : never : never;

export type TQueue<Items extends unknown[] = []> = Items;
type AnyTQueue = TQueue<unknown[]>;
export namespace TQueue {
  export type push<Q extends AnyTStack, El> = TQueue<[...Q, El]>;
  export type peek<Q extends AnyTStack> = Q extends [infer Head, ...infer _] ? Head : never;
  export type pop<Q extends AnyTStack> = Q extends [infer _, ...infer Tail] ? TQueue<Tail> : Q;
  export type size<Q extends AnyTQueue> = Q['length'];
  export type empty<Q extends AnyTQueue> = Equals<size<Q>, 0>;
}

export type TStack<Items extends unknown[] = []> = Items;
type AnyTStack = TStack<unknown[]>;
export namespace TStack {
  export type push<Q extends AnyTQueue, El> = TQueue<[El, ...Q]>;
  export type peek<Q extends AnyTQueue> = Q extends [infer Head, ...infer _] ? Head : never;
  export type pop<Q extends AnyTQueue> = Q extends [infer _, ...infer Tail] ? TQueue<Tail> : Q;
  export type size<Q extends AnyTQueue> = Q['length'];
  export type empty<Q extends AnyTQueue> = Equals<size<Q>, 0>;
}

export type TSet<Items extends unknown[] = []> = Items;
type AnyTSet = TSet<unknown[]>;
export namespace TSet {
  export type has<Set extends AnyTSet, El> = { [T in keyof Set]: Equals<Set[T], El> }[number];
  export type add<Set extends AnyTSet, El> = TSet.has<Set, El> extends never ? TSet<[...Set, El]> : Set;
  export type remove<Set extends AnyTSet, El> = Set extends [infer Head, ...infer Tail]
    ? Equals<Head, El> extends never ? [Head, ...remove<Tail, El>] : remove<Tail, El>
    : Set;

  export type size<Set extends AnyTSet> = Set['length'];
  export type empty<Set extends AnyTSet> = Equals<size<Set>, 0>;

  export type union<
    S1 extends AnyTSet = TSet,
    S2 extends AnyTSet = TSet
  > = S1 extends [infer Head, ...infer Tail] ? union<Tail, add<S2, Head>> : S2;
  export type intersection<
    S1 extends AnyTSet, 
    S2 extends AnyTSet = S1
  > = S1 extends [infer Head, ...infer Tail]
    ? (has<S2, Head> extends never ? intersection<Tail, S2> : TSet<[Head, ...intersection<Tail, S2>]>)
    : TSet;
  export type difference<
    SL extends AnyTSet, 
    SR extends AnyTSet = TSet
  > = SR extends [infer Head, ...infer Tail]
    ? difference<remove<SL, Head>, Tail>
    : SL;
  
  export type select<
    S extends AnyTSet, 
    Pred = unknown
  > = S extends [infer Head, ...infer Tail]
    ? Head extends Pred ? [Head, ...select<Tail, Pred>] : select<Tail, Pred>
    : S;

  export type asUnionType<S extends AnyTSet> = S[number];
}

type TMapItem = [unknown, unknown][];
export type TMap<Items extends TMapItem = []> = Items;
type AnyTMap = TMap<TMapItem>;
export namespace TMap {
  export type get<Q extends AnyTMap, Key> = { [T in keyof Q]: Equals<Q[T][0], Key> extends never ? never : Q[T][1] }[number];
  export type has<Q extends AnyTMap, Key> = { [T in keyof Q]: Equals<Q[T][0], Key> }[number];
  export type set<Q extends AnyTMap, Key, Value> = TMap.has<Q, Key> extends never 
    ? [...Q, [Key, Value]]
    : { [T in keyof Q]: Equals<Q[T][0], Key> extends never ? Q[T] : [Key, Value] };
  export type remove<Q extends AnyTMap, Key> = Q extends [[infer KHead, infer VHead], ...infer Tail]
    ? Tail extends TMapItem
      ? Equals<KHead, Key> extends never ? [[KHead, VHead], ...remove<Tail, Key>] : remove<Tail, Key>
      : Q
      : Q;

  export type keys<M extends AnyTMap> = { [T in keyof M]: M[T][0] }[number];
  export type values<M extends AnyTMap> = { [T in keyof M]: M[T][1] }[number];

  export type size<Q extends AnyTMap> = Q['length'];
  export type isEmpty<Q extends AnyTMap> = Equals<size<Q>, 0>;

  export type select<
    M extends AnyTMap, 
    Key = unknown,
    Value = unknown
  > = M extends [infer Head, ...infer Tail]
    ? Tail extends TMapItem
      ? (Head extends [Key, Value] ? [Head, ...select<Tail, Key, Value>] : select<Tail, Key>)
      : M
      : M;
}
