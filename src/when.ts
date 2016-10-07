
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export interface IWhen<T, V> {
  is: <I>(expression: T, value: I) => IWhen<T, V | I>,
  else: <E>(value: E) => V | E
}

const resolvedWhen = <T, V>(resolvedValue: V) => ({
  is: () =>
    resolvedWhen(resolvedValue),

  else: () =>
    resolvedValue
})

const when = <T>(expression: T) => ({
  is: <V>(constantExpression: T, value: V): IWhen<T, V> =>
    (expression === constantExpression ?
      resolvedWhen(value) : when(expression)),

  else: <V>(defaultValue: V): V =>
    defaultValue
})

export default when
