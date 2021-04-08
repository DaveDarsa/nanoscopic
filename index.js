import { createState } from "./internals/createState.js";
import { virtualDOM } from "./internals/virtualDOM.js";
import { ToDOM } from "./internals/ToDOM.js";

//testing a component
function Header() {
  const [item, changeItem] = createState("Bahahaha", render, Header.name);
  // setTimeout(() => {
  //   changeItem("not bahaha");
  //   console.log(item());
  // }, 2000);
  //   setTimeout(() => {
  //     changeItem("Change 1");
  //   }, 5000);
  //   setTimeout(() => {
  //     changeItem("Change 2");
  //   }, 8000);
  function render(state) {
    return `<div component='Header'>Hello ${state}</div>`;
  }

  return render(item());
}

const InsideMain = (props) => {
  //run only during initialization
  const [randomstuff, changerandom] = createState(
    "boo",
    render,
    InsideMain.name
  );
  console.log("still called...");
  setTimeout(() => {
    changerandom("inside main updated");
  }, 1500);
  // setTimeout(() => {
  //   changerandom("inside main updated");
  // }, 2500);

  //only invoke render after function's subsequent calls
  function render(state) {
    return `<div component='InsideMain' class='inside'>${props.first} and ${props.second} ${state}</div>`;
  }
  return render(randomstuff());
};
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
    changeContent("Lalalalalat test");
  }, 1000);
  setTimeout(() => {
    changeContent("Some list fetched");
  }, 3000);
  // setTimeout(() => {
  //   changeContent("Something updated");
  // }, 10000);
  function click(test) {
    console.log("yay clicked");
    console.log(test);
  }

  function render(state) {
    return `<div component='MainContent' class='maincontent' ${(onclick = function () {
      click("CLICKED ");
    })}>${state}
    <div>hello lol</div>
    ${
      MainContent.parent
        ? "<div></div>"
        : InsideMain({ first: 1, second: "second" })
    }
    </div>`;
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
    // console.log(`name is ${componentName}`);
    dom.updateDOM(componentRender, componentName);
  }
}

//the top level api that should be exposed to the user
function App() {
  //this is where compiler should be;
  // the combined fragments inside the compiler

  Build("root", Header, MainContent);
}
var dom;
function Build(rootID, ...args) {
  dom = virtualDOM();
  //takes in the array of elements from top to bottom
  //compiles everything to a DOM tree by calling the helper for each of the fragments
  args.forEach((component) => {
    component.parent = false;
    //parent prop changes after first render async
    setTimeout(() => {
      component.parent = true;
    }, 0);
  });

  var fragment = new DocumentFragment();
  args.forEach((component, idx) => {
    fragment.appendChild(ToDOM(component));
    //save its children nodes
    dom.saveNode(fragment.childNodes[idx], component.name);
  });

  dom.createDOM(fragment.cloneNode(true));
  //append to the root element
  document.getElementById(rootID).innerHTML = "";
  document.getElementById(rootID).appendChild(fragment);
}
//the virtualdomdom variable outside

App();
