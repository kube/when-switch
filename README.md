# when-switch
> ### JavaScript functional implementation of switch/case, inspired by Ruby case/when.


Usage
-----
You can convert a switch-case use in a functional way, using a single expression:

### Strict Equality

```js
  import when from 'when-switch'

  const getDrinkPrice = drink =>
    when(drink)
      .is('Coke', 1.50)
      .is('Pepsi', 1.80)
      .else(2.00)
```

### Regular Expressions
You can use `match` method to check string against a regular expression.

```js
  const getCaseStyle = text =>
    when(text)
      .match(/^([A-Z][a-z]*)+$/, 'UpperCamelCase')
      .match(/^([a-z]+[A-Z][a-z]*)+$/, 'LowerCamelCase')
      .match(/^([a-z]+_[a-z]+)+$/, 'SnakeCase')
      .else('Unknown')
```

> `match` and `is` can both be used in the same `when` expression.


TypeScript
----------

`when` is fully compatible with TypeScript, and will check the types you return in each `is` expression:

```js
  const getDrinkPrice =
    (drink: 'Pepsi' | 'Coke' | 'Orangina'): number =>
      when(drink)
        .is('Coke', 1.50)
        .is('Pepsi', 1.80)
        .else(2.00)
```

Here the return type of the `when` expression will be `number`

### Union types

For each `is` or `else` expression added to the current `when` expression, the type is added as an union to the previous type.

```js
  const getDrinkPrice =
    (drink: 'Pepsi' | 'Coke' | 'Orangina') =>
      when(drink)
        .is('Coke', 1.50)
        .is('Pepsi', true)
        .else('Free')
```

Here the return type of `getDrinkPrice` expression will be `number | string | boolean`
