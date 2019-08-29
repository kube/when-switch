
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

export interface WhenSwitch {
  <T>(expr: T): When<T, never>
  
  /** Tests assertion and returns _value_ if assertion is true. */
  true: <T>(assertion: (() => boolean) | boolean, value: (() => T) | T) => True<T>
}

export type True<T> = {
  true: <U>(assertion: (() => boolean) | boolean, value: (() => U) | U) => True<T | U>,
  else: <U>(returnValue: (() => U) | U) => T | U
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
export const when = (<T>(expr: T): When<T, never> => ({
  is: (constExpr, value) =>
    expr === constExpr
      ? resolve(typeof value === 'function' ? (value as (x: any) => any)(constExpr) : value)
      : when(expr),

  match: (matcher, value) =>
    matcher.test(expr)
      ? resolve(typeof value === 'function' ? (value as (x: any) => any)(expr) : value)
      : when(expr),

  else: defaultValue =>
    typeof defaultValue === 'function' ? (defaultValue as (x: any) => any)(expr) : defaultValue
})) as WhenSwitch

/**
 * Exposes same API as `true`, but just propagates a resolved value,
 * without doing any further test.
 */
const resolveAssertion = (resolvedValue: any): True<any> => ({
  true: () => resolveAssertion(resolvedValue),
  else: () => resolvedValue
})

when.true = <T>(assertion: (() => boolean) | boolean, value: (() => T) | T): True<T> =>
  (typeof assertion === 'function' ? assertion() : assertion)
    ? resolveAssertion(typeof value === 'function' ? (value as (() => any))() : value)
    : ({
      true: when.true,
      else: defaultValue =>
        typeof defaultValue === 'function'
          ? (defaultValue as (() => any))()
          : defaultValue
    })

export default when
