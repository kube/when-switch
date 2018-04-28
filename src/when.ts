
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export type When<T, V> = {
  is: <I>(expr: T, value: ((expr?: T) => I) | I) => When<T, V | I>
  match: <I>(expr: RegExp, value: ((expr?: T) => I) | I) => When<T, V | I>
  else: <E>(value: ((expr?: T) => E) | E) => V | E
}

const resolvedWhen = <V>(resolvedValue: V) => ({
  is: () => resolvedWhen(resolvedValue),
  match: () => resolvedWhen(resolvedValue),
  else: () => resolvedValue
})

const when = <T>(expr: T) => ({
  is: <V>(constExpr: T, value: ((expr?: T) => V) | V): When<T, V> =>
    expr === constExpr
      ? resolvedWhen(value instanceof Function ? value(expr) : value)
      : when(expr),

  match: <V>(
    matcher: { test: (x: any) => boolean },
    value: ((expr?: T) => V) | V
  ): When<T, V> =>
    matcher.test(expr)
      ? resolvedWhen(typeof value === 'function' ? value(expr) : value)
      : when(expr),

  else: <V>(defaultValue: ((_: T) => V) | V): V =>
    typeof defaultValue === 'function' ? defaultValue(expr) : defaultValue
})

export default when
