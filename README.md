# Nanoscopic-js

A passion project trying to emulate the core capabilities of React framework.

> NOTE: This framework isn't close to being feature rich nor super performant.
> But still offers a limited number of core capabilities.

# installation

```sh
node npm i nanoscopic-js
```

# usage:

Nano uses a single HTML file that just has a root div element, which gets updated dynamically. Example below:

**index.html**

```html
<div id="root"></div>
<script src="index.js"></script>
```

**index.js:**

```js
import { Nano } from "nanoscopic-js";
var { Build, createState, BindListener, Route } = Nano();
```

Nanoscopic comes with a module **Nano** exports the following functions:

- **Build**
- **Route**
- **createState**
- **BindListener**

# Build

Build function does what it says: Finalizes and builds the app.
Build function works 2 ways: With or without a router.
**without router**:

```js
Build("root", Header, MainContent, About);
//Header, MainContent and About are arbitrary components
```

Argument1: rootID - name of the root div in index.html
...rest - components that need to be rendered from top to bottom

**with router**:

```js
Build("root", Route("/", [Header, MainContent]), Route("/about", [About]));
//Header, MainContent and About are arbitrary components
```

Argument1: rootID - name of the root div in index.html
...rest - Route(path,[...componentsArr])

# Route

Route(path,[...componentsArr])  
**Route** creates pages based on the components array for each path.

> Note: For router to work, anchor tags leading to different routes
> need to have a linkto=path attribute.

Example:

```html
<a href="#" linkto="/">Go back to homepage</a>
```

# Components

A Nano component is just a JS function that looks like this

- Has a render() function that returns a template string of html
- render() function takes in state that's defined in the component using createState().
- if state is being used, then function has to return "render(item())",since the "item" variable is a getter;
- The returned template string needs to have component=componentString attribute
- To bind a click listener to an element it needs an "onTouch" attribute that calls
  BindListener() function which takes in a function reference defined in the component
  more about BindListener and createState below...

```js
function Header() {
  const [item, changeItem] = createState("StateText", render, Header.name);
  //random fetching
  setTimeout(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => changeItem(json.title));
  }, 2500);
  //click listener
  function ClickListener(e) {
    console.log(e);
  }
  function render(state) {
    return `<div component='Header' class='header' onTouch=${BindListener(
      ClickListener
    )} >Hello ${state} <a href="#" linkto=/about>Link here</a> </div>`;
  }
  return render(item());
}
```

# BindListener(function)

To register a click listener for an element it needs to have an ''onTouch" attribute

```js
onTouch = ${BindListener(functionName)}
```

# createState:

To create a state that also works behind the scenes(different routes), the following is required:

```js
const [item, changeItem] = createState(
  { foo: "bar" },
  renderFunc,
  componentName
);
```

**createState(stateValue,renderFunc,componentName)**

- stateValue - any valid JS value
- renderFunc - Component's defined render(state) function
- componentName - name of the component it's internal state is defined in.

# bindListener

**BindListener(function)**
usage:
An emelent must define an onTouch attribute like below:

```js
onTouch = BindListener(ListenerFunction);
```

# execution:

Once components with their internal state are defined, to run the app we either build with or without the router at the end of the index.js script

**without router**:

```js
Build("root", Header, MainContent, About);
//Header, MainContent and About are arbitrary components
```

Argument1: rootID - name of the root div in index.html
...rest - components that need to be rendered from top to bottom

**with router**:

```js
Build("root", Route("/", [Header, MainContent]), Route("/about", [About]));
//Header, MainContent and About are arbitrary components
```
