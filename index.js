import { createState } from "./internals/createState.js";
import { virtualDOM } from "./internals/virtualDOM.js";
import { ToDOM } from "./internals/ToDOM.js";

//testing a component
function Header() {
  const [item, changeItem] = createState("Bahahaha", render, Header.name);
  setTimeout(() => {
    changeItem("not bahaha");
    console.log(item());
  }, 2000);
  setTimeout(() => {
    changeItem("Change 1");
  }, 5000);
  setTimeout(() => {
    changeItem("Change 2");
  }, 8000);
  function render(state) {
    return `<div component='Header'>Hello ${state}</div>`;
  }

  return render(item());
}
// function Body(...props) {
//   return `<div>Hello body</div>`;
// }

// function Footer() {
//   return `<div>Hello footer</div>`;
// }
function MainContent() {
  const [content, changeContent] = createState(
    "Random main page",
    render,
    MainContent.name
  );
  setTimeout(() => {
    changeContent("Lalalalala main content test");
  }, 1000);
  setTimeout(() => {
    changeContent("Some list fetched");
  }, 3000);
  setTimeout(() => {
    changeContent("Something updated");
  }, 10000);
  function click(test) {
    console.log("yay clicked");
    console.log(test);
  }

  function render(state) {
    return `<div component='MainContent' ${(onclick = function () {
      click("CLICKED ");
    })}>${state}</div>`;
  }

  return render(content());
}

//emitter
//event emitter that triggers during state change and forces "virtual dom" creation and comparison
export function customEventEmitter(eventType, componentRender, componentName) {
  if (!eventType) {
    console.error("NO EVENT TYPE PROVIDED");
    return;
  }
  //if state changed time to re-render a virtual dom and compare to it's previous self
  if (eventType === "change") {
    console.log("change detected");
    console.log(`name is ${componentName}`);
    dom.updateDOM(componentRender, componentName);
  }
}

//the top level api that should be exposed to the user
function App() {
  //this is where compiler should be;
  // the combined fragments inside the compiler
  //props should be passed straight into the function as an object
  Build("root", Header, MainContent);
}

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
//the virtualdomdom variable outside
var dom;

App();
