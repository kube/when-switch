
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import when from '../when'

// Here getDrinkPrice returns a number
describe('with a simple return-type', () => {
  const getDrinkPrice = (drink: 'Pepsi' | 'Coke' | 'Orangina'): number =>
    when(drink)
      .is('Coke', 1.5)
      .is('Pepsi', 1.8)
      .else(2.0)

  it('returns value if matches an expression', () => {
    expect(getDrinkPrice('Coke')).toEqual(1.5)
    expect(getDrinkPrice('Pepsi')).toEqual(1.8)
  })

  it('returns default value if no match', () => {
    expect(getDrinkPrice('Orangina')).toEqual(2.0)
  })
})

// Here getDrinkPrice can return number, string or boolean
// We expect TypeScript to not throw any type error
describe('with a union return-type', () => {
  const getDrinkPrice = (
    drink: 'Pepsi' | 'Coke' | 'Orangina'
  ): number | string | boolean =>
    when(drink)
      .is('Coke', 1.5)
      .is('Pepsi', true)
      .else('Free')

  it('returns value if matches an expression', () => {
    expect(getDrinkPrice('Coke')).toEqual(1.5)
    expect(getDrinkPrice('Pepsi')).toEqual(true)
  })

  it('returns default value if no match', () => {
    expect(getDrinkPrice('Orangina')).toEqual('Free')
  })
})

describe('with a function as `is` return value', () => {
  type Action = { type: string }
  const action: Action = { type: 'INCREMENT' }

  // We expect the return type of apply to be `string | number | boolean`
  const apply = (action: Action) =>
    when(action.type)
      .is('INCREMENT', () => 2)
      .is('DECREMENT', () => true)
      .else('NONE')

  it('returns value if matches an expression', () => {
    expect(apply({ type: 'INCREMENT' })).toEqual(2)
    expect(apply({ type: 'DECREMENT' })).toEqual(true)
  })

  it('returns default value if no match', () => {
    expect(apply({ type: 'Hello' })).toEqual('NONE')
    expect(apply({ type: 'World' })).toEqual('NONE')
  })
})

describe('when entry expression is a string', () => {
  it('provides a `match` method', () => {
    expect(typeof when('hello').match).toBe('function')
  })

  describe('match method', () => {
    const getCaseStyle = (text: string) =>
      when(text)
        .match(/^([A-Z][a-z]*)+$/, 'UpperCamelCase')
        .match(/^([a-z]+[A-Z][a-z]*)+$/, 'LowerCamelCase')
        .match(/^([a-z]+_[a-z]+)+$/, 'SnakeCase')
        .else('Unknown')

    it('returns first match', () => {
      expect(getCaseStyle('Hello')).toEqual('UpperCamelCase')
      expect(getCaseStyle('HelloWorld')).toEqual('UpperCamelCase')
      expect(getCaseStyle('helloWorld')).toEqual('LowerCamelCase')
      expect(getCaseStyle('hello_world')).toEqual('SnakeCase')
      expect(getCaseStyle('hello')).toEqual('Unknown')
      expect(getCaseStyle('Hello_World')).toEqual('Unknown')
    })
  })
})

describe('when entry expression is not a string', () => {
  it('does not provides a `match` method', () => {
    expect(when(42).match).toBeUndefined()
  })
})
