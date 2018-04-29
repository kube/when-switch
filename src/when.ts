
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export type Matcher<T, R extends T> = {
  test: ((x: T) => x is R) | ((x: T) => boolean)
}

export type When<T, V> = {
  is: <U extends T, W>(
    matcher: U,
    returnValue: ((inputValue: U) => W) | W
  ) => When<T, V | W>

  match: <U extends T, W>(
    matcher: Matcher<T, U>,
    returnValue: ((inputValue: U) => W) | W
  ) => When<T, V | W>

  else: <W>(returnValue: ((inputValue: T) => W) | W) => V | W
}

/**
 * Exposes same API as `when`, but just propagates a resolved value,
 * without doing any further test.
 */
const resolve = (resolvedValue: any): When<any, any> => ({
  is: () => resolve(resolvedValue),
  match: () => resolve(resolvedValue),
  else: () => resolvedValue
})

/**
 * Tests an object against multiple expressions.
 */
export const when = <T>(expr: T): When<T, never> => ({
  is: (constExpr, value) =>
    expr === constExpr
      ? resolve(typeof value === 'function' ? value(constExpr) : value)
      : when(expr),

  match: (matcher, value) =>
    matcher.test(expr)
      ? resolve(typeof value === 'function' ? value(expr) : value)
      : when(expr),

  else: defaultValue =>
    typeof defaultValue === 'function' ? defaultValue(expr) : defaultValue
})

export default when
