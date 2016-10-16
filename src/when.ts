
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export interface IWhen<T, V> {
  is: <I>(expression: T, value: ((expr?: T) => I) | I) => IWhen<T, V | I>,
  else: <E>(value: ((expr?: T) => E) | E) => V | E
}

const resolvedWhen = <T, V>(resolvedValue: V) => ({
  is: () =>
    resolvedWhen(resolvedValue),

  else: () =>
    resolvedValue
})

const when = <T>(expression: T) => ({
  is: <V>(constantExpression: T, value: ((expr?: T) => V) | V): IWhen<T, V> =>
    expression === constantExpression ?
      resolvedWhen(
        value instanceof Function ? value(expression) : value
      )
      : when(expression),

  else: <V>(defaultValue: ((_: T) => V) | V): V =>
    defaultValue instanceof Function ? defaultValue(expression) : defaultValue
})

export default when
