[![CircleCI](https://circleci.com/gh/kube/when-switch.svg?style=svg)](https://circleci.com/gh/kube/when-switch)

<h1 align="center">when-switch</h1>

<h3 align="center">
  JavaScript functional implementation of switch/case, inspired by Ruby case/when.
</h3>

## Usage

You can convert a switch-case use in a functional way, using a single expression:

### Strict Equality

```js
import when from 'when-switch'

const getDrinkPrice = drink =>
  when(drink)
    .is('Coke', 1.5)
    .is('Pepsi', 1.8)
    .else(2.0)
```

### Structural Matching

You can use `match` method with any object exposing a `test` method.

#### Regular Expressions

```js
const getCaseStyle = text =>
  when(text)
    .match(/^([A-Z][a-z]*)+$/, 'UpperCamelCase')
    .match(/^([a-z]+[A-Z][a-z]*)+$/, 'LowerCamelCase')
    .match(/^([a-z]+_[a-z]+)+$/, 'SnakeCase')
    .else('Unknown')
```

#### Custom Type Guard Matcher

```ts
type SpaceObject = { x: number; y: number; z: number }
type Cube = SpaceObject & { width: number }
type Sphere = SpaceObject & { radius: number }

const SpaceObjectSchema = {
  test: (_: any): _ is SpaceObject =>
    typeof _.x === 'number' &&
    typeof _.y === 'number' &&
    typeof _.z === 'number'
}

const CubeSchema = {
  test: (_: any): _ is Cube =>
    typeof _.width === 'number' && SpaceObjectSchema.test(_)
}

const SphereSchema = {
  test: (_: any): _ is Sphere =>
    typeof _.radius === 'number' && SpaceObjectSchema.test(_)
}

const getObjectVolume = (object: SpaceObject) =>
  // Each match handler will receive correct static type
  when(object)
    .match(CubeSchema, cube => cube.width ** 3)
    .match(SphereSchema, sphere => Math.PI * 3 / 4 * sphere.radius ** 3)
    .else(_ => null)
```

> `match` and `is` can both be used in the same `when` expression.

## TypeScript

`when` is fully compatible with TypeScript, and will check the types you return in each `is` expression:

```js
const getDrinkPrice = (drink: 'Pepsi' | 'Coke' | 'Orangina'): number =>
  when(drink)
    .is('Coke', 1.5)
    .is('Pepsi', 1.8)
    .else(2.0)
```

Here the return type of the `when` expression will be `number`

### Union types

For each `is` or `else` expression added to the current `when` expression, the type is added as an union to the previous type.

```js
const getDrinkPrice = (drink: 'Pepsi' | 'Coke' | 'Orangina') =>
  when(drink)
    .is('Coke', 1.5)
    .is('Pepsi', true)
    .else('Free')
```

Here the return type of `getDrinkPrice` expression will be `number | string | boolean`
