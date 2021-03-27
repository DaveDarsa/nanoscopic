import { createState } from "./internals/createState.js";

function Header() {
  const [item, changeItem] = createState("Bahahaha");
  return `<div>Hello ${item()}</div>`;
}
function Body(...props) {
  return `<div>Hello body</div>`;
}

function Footer() {
  return `<div>Hello footer</div>`;
}

function App() {
  //this is where compiler should be;
  // the combined fragments inside the compiler
  //props should be passed straight into the function as an object
  Build("root", Header, Body, Footer);
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
  document.getElementById(rootID).innerHTML = "";
  document.getElementById(rootID).appendChild(fragment);
}

function ToDOM(component) {
  //this is where the parsing shoud happen to a valid HTMLelement, gets appeneded to Build fragment and turned into root's child
  var range = document.createRange();
  var fragmentFromComponent = range.createContextualFragment(component());
  return fragmentFromComponent;
}

App();
