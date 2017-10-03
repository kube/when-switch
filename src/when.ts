
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

const resolvedWhen = <T, V>(resolvedValue: V) => ({
  is: () => resolvedWhen(resolvedValue),
  match: () => resolvedWhen(resolvedValue),
  else: () => resolvedValue
})

const when = <T>(expr: T) => ({
  is: <V>(constExpr: T, value: ((expr?: T) => V) | V): When<T, V> =>
    expr === constExpr
      ? resolvedWhen(value instanceof Function ? value(expr) : value)
      : when(expr),

  // Provide `match` method only if `expr` is a string
  match:
    typeof expr === 'string'
      ? <V>(regExp: RegExp, value: ((expr?: T) => V) | V): When<T, V> =>
          regExp.test(expr)
            ? resolvedWhen(value instanceof Function ? value(expr) : value)
            : when(expr)
      : undefined,

  else: <V>(defaultValue: ((_: T) => V) | V): V =>
    defaultValue instanceof Function ? defaultValue(expr) : defaultValue
})

export default when
