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

const InsideMain = (props) => {
  //run only during initialization
  const [randomstuff, changerandom] = createState(
    "boo",
    render,
    InsideMain.name
  );
  console.log("still called...");
  setTimeout(() => {
    changerandom("inside UPDATE ONE");
  }, 1500);
  setTimeout(() => {
    changerandom("YET AGAIN WITH THE UPDATE");
  }, 2500);

  //only invoke render after function's subsequent calls
  function render(state) {
    return `<div component='InsideMain' class='inside'>${props.first} and ${props.second} ${state}</div>`;
  }
  return render(randomstuff());
};

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
  setTimeout(() => {
    changeContent("Something updated");
  }, 10000);
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
var ChildComponents = [];
//emitter
//event emitter that triggers during state change and forces "virtual dom" creation and comparison
function emitter(eventType, componentRender, componentName) {
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
function virtualDOM() {
  var currentDOM;

  function createDOM(element) {
    var el = document.createElement("div");
    el.appendChild(element);
    //runs during first render
    currentDOM = currentDOM === undefined && el;
  }
  function saveNode(componentFragment, componentName) {
    //saves all rendered component's children that are themselves components
    let childName;
    let childrenArr = Array.from(componentFragment.children);
    let componentChildren = childrenArr.filter((child) => {
      if (child.hasAttribute("component")) {
        childName = child.getAttribute("component");
      }
      return child.hasAttribute("component");
    });
    ChildComponents.push({
      name: componentName,
      children: { name: childName, component: componentChildren },
    });
  }
  function updateDOM(componentRender, componentName) {
    console.log("updating");
    // //new render
    console.log(componentRender.childNodes, componentName);

    let updatedComponent = componentRender.childNodes[0];
    //find children in the array with same name as componentName
    let foundChild = ChildComponents.find((children) => {
      return children.name === componentName;
    });
    //runs and modifies the updated content IF it had children on first render
    if (foundChild) {
      //find the empty child
      let emptyChild = Array.from(updatedComponent.children).find((child) => {
        return child.innerHTML === "";
      });
      if (emptyChild) {
        //re-insert children to the updated dom
        foundChild.children.component.forEach((child) => {
          updatedComponent.insertBefore(child, emptyChild);
        });
        updatedComponent.removeChild(emptyChild);
      }
    }
    document.querySelector(`[component=${componentName}]`).innerHTML =
      updatedComponent.innerHTML;
  }

  return {
    createDOM,
    updateDOM,
    saveNode,
  };
}
function createState(val = undefined, renderFunc, componentName) {
  //this is the state
  var stateStorage = {
    state: val,
  };
  Object.defineProperty(stateStorage, "getState", {
    get() {
      return stateStorage.state;
    },
    enumerable: false,
    configurable: false,
  });
  Object.defineProperty(stateStorage, "setState", {
    set(newVal) {
      this.state = newVal;
    },
    enumerable: false,
    configurable: false,
  });

  function changer(newVal) {
    let prevValue = getter();
    Promise.resolve()
      .then(() => {
        stateStorage.setState = newVal;
      })
      .then(() => {
        if (newVal !== prevValue) {
          let updated = ToDOM(renderFunc(newVal));
          emitter("change", updated, componentName);
          //making sure stored child is updated and stored again;
          let matched = ChildComponents.find((child) => {
            return child.children.name === componentName;
          });
          if (matched) {
            matched.children.component[0] = updated.childNodes[0];
          }
        }
      });
  }
  function getter() {
    return stateStorage.getState;
  }
  //must return the closured state and the updater
  return [getter, changer];
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
