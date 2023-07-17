import { TMap, TStack } from ".";

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

type Valid1 = IsValidBrackets<'2 * (1 + (5 + 1))'>
type Valid2 = IsValidBrackets<'2 * (1 + [5 + 1])'>
type Wrong1 = IsValidBrackets<'2 * ((1 + (5 + 1))'>
type Wrong2 = IsValidBrackets<'2 * (1 + [5 + 1))'>

function calculate<Expr extends string>(expr: Expr): true extends IsValidBrackets<Expr> ? number : never {
  return 9 as any;
}

const x = calculate('2 * (1 + (5 + 1))');
const y = calculate('2 * (1 + [5 + 1])');
const err1 = calculate('2 * ((1 + (5 + 1))');
const err2 = calculate('2 * (1 + [5 + 1))');
