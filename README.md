# Woby-Slider

<p align="center">
  A fast & lightweight woby component as a drop in replacement for HTML5 input range slider element.
</p>

Ported from [React-Rangeslider](https://whoisandy.github.io/react-rangeslider/)

## Installation
Using `npm` (use `--save` to include it in your package.json)

```bash
$ npm install woby-slider --save
```

Using `yarn` (this command also adds woby-slider to your package.json dependencies)

```bash
$ yarn add woby-slider
```


## Getting Started
Woby-slider is bundled with a slider component & default styles which can be overridden depending on your design requirements.

With a module bundler like webpack that supports either CommonJS or ES2015 modules, use as you would anything else:

```js
// Using an ES6 transpiler like Babel
import { Slider } from 'woby-slider'

// To include the default styles
import 'woby-slider/lib/index.css'

// Not using an ES6 transpiler
var Slider = require('woby-slider')
```

The UMD build is also available on [unpkg][unpkg]:

```html
<script src="https://unpkg.com/woby-slider/umd/rangeslider.min.js"></script>
```

You can find the library on `window.ReactRangeslider`. Optionally you can drop in the default styles by adding the stylesheet.
```html
<link rel="stylesheet" href="https://unpkg.com/woby-slider/umd/rangeslider.min.css" />
```
Check out [docs & examples](https://whoisandy.github.io/woby-slider).

## Basic Example

```tsx
import { $, $$, useEffect, type JSX } from 'woby'
import { Slider } from "woby-slider"

function Horizontal() {
    // Initialize the state value
    const value = $<number>(10)

    // Event handler for the change event start
    const handleChangeStart = () => {
        console.log("Change event started")
    }

    // Event handler for the change event completion
    const handleChangeComplete = () => {
        console.log("Change event completed")
    }

    useEffect(() => console.log($$(value)))
    return (
        <div class="slider">
            <Slider
                min={0}
                max={100}
                value={value}
                onChangeStart={handleChangeStart}
                onChange={value}
                onChangeComplete={handleChangeComplete}
            />
            <div class="value">{value}</div>
        </div>
    )
}

export default Horizontal

```


## API
Rangeslider is bundled as a single component, that accepts data and callbacks only as `props`.

### Component
```jsx
import Slider from 'woby-slider'

// inside render
<Slider
  min={Number}
  max={Number}
  step={Number}
  value={Number}
  orientation={String}
  reverse={Boolean}
  tooltip={Boolean}
  labels={Object}
  handleLabel={String}
  format={Function}
  onChangeStart={Function}
  onChange={Function}
  onChangeComplete={Function}
/>
```

### Props
Prop   	 			 |  Type      |  Default      |  Description
---------   	 |  -------   |  -------      |  -----------
`min`     		 |  number    |  0				   	|  minimum value the slider can hold
`max`    			 |  number    |  100				  |  maximum value the slider can hold
`step` 				 |  number    |  1          	|  step in which increments/decrements have to be made
`value`        |  number    |               |  current value of the slider
`orientation`  |  string    |  horizontal   |  orientation of the slider
`tooltip`      |  boolean   |  true         |  show or hide tooltip
`reverse`  		 |  boolean   |  false			  |  reverse direction of vertical slider (top-bottom)
`labels`       |  object    |  {}           |  object containing key-value pairs. `{ 0: 'Low', 50: 'Medium', 100: 'High'}`
`handleLabel`  |  string    |  ''           |  string label to appear inside slider handles
`format`     |  function  |               |  function to format and display the value in label or tooltip
`onChangeStart`  	 |  function  |               |  function gets called whenever the user starts dragging the slider handle
`onChange`  	 |  function  |               |  function gets called whenever the slider handle is being dragged or clicked
`onChangeComplete`     |  function  |               |  function gets called whenever the user stops dragging the slider handle.


## Development
To work on the project locally, you need to pull its dependencies and run `npm start`.

```bash
$ npm install
$ npm start
```

## Issues
Feel free to contribute. Submit a Pull Request or open an issue for further discussion.

## License
MIT


[npm_img]: https://img.shields.io/npm/v/woby-slider.svg?style=flat-square
[npm_site]: https://www.npmjs.org/package/woby-slider
[license_img]: https://img.shields.io/github/license/whoisandy/woby-slider.svg
[license_site]: https://github.com/whoisandy/woby-slider/blob/master/LICENSE
[npm_dm_img]: http://img.shields.io/npm/dm/woby-slider.svg?style=flat-square
[npm_dm_site]: https://www.npmjs.org/package/woby-slider
[trav_img]: https://api.travis-ci.org/whoisandy/woby-slider.svg
[trav_site]: https://travis-ci.org/whoisandy/woby-slider
[std_img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[std_site]: http://standardjs.com
[unpkg]: https://unpkg.com/woby-slider/umd/ReactRangeslider.min.js