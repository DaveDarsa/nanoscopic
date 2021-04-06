import { createState } from "./internals/createState.js";
import { virtualDOM } from "./internals/virtualDOM.js";
import { ToDOM } from "./internals/ToDOM.js";

//testing a component
function Header() {
  const [item, changeItem] = createState("Bahahaha", Header.name);
  setTimeout(() => {
    changeItem("not bahahaa");
  }, 2000);
  return `<div component=Header>Hello ${item()}</div>`;
}

function Test() {
  const [test, changeTest] = createState("Test component", Test.name);
  setTimeout(() => {
    changeTest("lets see");
  }, 4000);
  return `<div component=Test>Hello ${test()}</div>`;
}

// function Body(...props) {
//   return `<div>Hello body</div>`;
// }

// function Footer() {
//   return `<div>Hello footer</div>`;
// }

//emitter
//event emitter that triggers during state change and forces "virtual dom" creation and comparison
export function customEventEmitter(eventType, component) {
  if (!eventType) {
    console.error("NO EVENT TYPE PROVIDED");
    return;
  }
  //if state changed time to re-render a virtual dom and compare to it's previous self
  if (eventType === "change") {
    console.log("change detected");
    console.log(component);
    Build.prototype.onChange(component);
    //must call virtual dom somehow
  }
}

//the top level api that should be exposed to the user
function App() {
  //this is where compiler should be;
  // the combined fragments inside the compiler
  //props should be passed straight into the function as an object
  Build("root", Header, Test);
}
//the virtualdomdom variable outside
var dom;

function Build(rootID, ...args) {
  //takes in the array of elements from top to bottom
  //compiles everything to a DOM tree by calling the helper for each of the fragments
  var fragment = new DocumentFragment();
  args.forEach((component) => {
    fragment.appendChild(ToDOM(component));
  });

  //if any of em isnt a function/invokable then error out
  //in the end append the fragment to the container in html
  dom = virtualDOM();
  dom.createDOM(fragment.cloneNode(true));

  //append to the root element
  document.getElementById(rootID).innerHTML = "";
  document.getElementById(rootID).appendChild(fragment);
}

Build.prototype.onChange = function (where) {
  console.log("change is happening");
  //where was the change detected
  console.log(where);
  //force virtualdom rerender
  //somehow get reference to virtualdom and use the compare function within
  dom.updateDOM(where);
};
App();
