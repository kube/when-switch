
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import 'mocha'
import { expect } from 'chai'
import when from './when'

describe('when', () => {

  // Here getDrinkPrice returns a number
  describe('with a simple return-type', () => {
    const getDrinkPrice =
      (drink: 'Pepsi' | 'Coke' | 'Orangina'): number =>
        when(drink)
          .is('Coke', 1.50)
          .is('Pepsi', 1.80)
          .else(2.00)

    it('returns value if matches an expression', () => {
      expect(getDrinkPrice('Coke')).to.equal(1.50)
      expect(getDrinkPrice('Pepsi')).to.equal(1.80)
    })

    it('returns default value if no match', () => {
      expect(getDrinkPrice('Orangina')).to.equal(2.00)
    })
  })

  // Here getDrinkPrice can return number, string or boolean
  // We expect TypeScript to not throw any type error
  describe('with a union return-type', () => {
    const getDrinkPrice =
      (drink: 'Pepsi' | 'Coke' | 'Orangina'): number | string | boolean =>
        when(drink)
          .is('Coke', 1.50)
          .is('Pepsi', true)
          .else('Free')

    it('returns value if matches an expression', () => {
      expect(getDrinkPrice('Coke')).to.equal(1.50)
      expect(getDrinkPrice('Pepsi')).to.equal(true)
    })

    it('returns default value if no match', () => {
      expect(getDrinkPrice('Orangina')).to.equal('Free')
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
      expect(apply({ type: 'INCREMENT' })).to.equal(2)
      expect(apply({ type: 'DECREMENT' })).to.equal(true)
    })

    it('returns default value if no match', () => {
      expect(apply({ type: 'Hello' })).to.equal('NONE')
      expect(apply({ type: 'World' })).to.equal('NONE')
    })
  })
})
