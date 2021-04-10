import { ToDOM } from "./internals/ToDOM.js";
export function Nano() {
  var ChildComponents = [];
  var dom;
  var routes = [];
  var listeners = [];
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
    if (eventType === "route") {
      Router();
    }
  }

  //dom creator and updater
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
  //state
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

  function LinkTo(path) {
    Promise.resolve()
      .then(() => {
        history.replaceState({}, "", `${path}`);
      })
      .then(() => {
        var event = new Event("popstate");
        window.dispatchEvent(event);
      });

    return;
  }

  function Route(path, ...componenets) {
    componenets.forEach((component) => {
      component.parent = false;
      //parent prop changes after first render async
      setTimeout(() => {
        component.parent = true;
      }, 0);
    });

    // create DOMified components and add it to the routes[] corresponding path components array;
    var nodes = [];
    componenets.forEach((component) => {
      nodes.push(ToDOM(component));
      console.warn("HOW MANY TIMES");
      console.warn(nodes);
    });
    routes.push({ path, component: nodes });
    return nodes;
  }
  function Router() {
    //render conditionally
    console.log(location.pathname);
  }

  function Build(rootID, ...args) {
    dom = virtualDOM();
    //for routing
    window.addEventListener("popstate", function (event) {
      emitter("route");
    });

    var fragment = new DocumentFragment();
    //conditional fragmenting. testing / for now
    // Array.from(args[0][0].children).forEach((child) => {
    //   fragment.appendChild(child);
    // });

    //takes in the array of elements from top to bottom
    //compiles everything to a DOM tree by calling the helper for each of the fragments

    args.forEach((component) => {
      component.parent = false;
      //parent prop changes after first render async
      setTimeout(() => {
        component.parent = true;
      }, 0);
    });
    args.forEach((component, idx) => {
      fragment.appendChild(ToDOM(component));
      //save its children nodes
      dom.saveNode(fragment.childNodes[idx], component.name);
    });

    dom.createDOM(fragment.cloneNode(true));

    //append the changeable fragment
    //append to the root element
    document.getElementById(rootID).innerHTML = "";
    document.getElementById(rootID).appendChild(fragment);

    //get the elements that will have a click listeer
    var clickElements = document.querySelectorAll("[onTouch]");
    //create and add a function as a listener/remove as attribute
    clickElements.forEach((clickItem) => {
      //index in the listeners array;
      var fnIdx = clickItem.getAttribute("onTouch");
      clickItem.removeAttribute("onTouch");
      clickItem.addEventListener("click", listeners[fnIdx].fn);
    });

    //find and add linkto listeners to elements
    var linkElems = document.querySelectorAll("[linkto]");
    console.log(linkElems);
    //find their linkto listeners;
    linkElems.forEach((linkItem) => {
      let where = linkItem.getAttribute("linkto");
      if (where)
        linkItem.addEventListener("click", (e) => {
          e.preventDefault();
          LinkTo(where);
        });
    });
  }
  //helper function for stringifying listener functions
  function BindListener(func) {
    // get the indexes of var/let/const/function declarations
    //properly space function declarations in the string;
    // function SpaceFnString(str, ...searchStrs) {
    //   var indices = [];
    //   var copyStr = str;
    //   var len = str.length;
    //   if (len == 0) return [];
    //   //find each given declaration index
    //   searchStrs.forEach((searchTerm) => {
    //     let startIndex = 0,
    //       index;
    //     let len = searchTerm.length;
    //     while ((index = str.indexOf(searchTerm, startIndex)) > -1) {
    //       indices.push({ index, length: len });
    //       startIndex = index + len;
    //     }
    //   });
    //   //sort indices ascending;
    //   indices.sort(function (a, b) {
    //     return a.index - b.index;
    //   });

    //   if (indices.length) {
    //     let incr = 0;
    //     //add spaces
    //     indices.forEach((char) => {
    //       copyStr =
    //         copyStr.slice(0, char.index + char.length + incr) +
    //         " " +
    //         copyStr.slice(char.index + char.length + incr);
    //       incr = incr + 1;
    //     });
    //   }

    //   return copyStr;
    // }

    // var funcstring = func.toString();
    // //remove all sorts of whitespaces in the stringified function
    // var fn = funcstring
    //   .slice(funcstring.indexOf("{") + 1, funcstring.lastIndexOf("}"))
    //   .replace(/\s+/g, "")
    //   .replace(/^\s/, "")
    //   .replace(/\s$/, "");
    // //add space after function declarations;
    // fn = SpaceFnString(fn, "var", "let", "const", "function");

    //woops instead of creating new function from a string
    //its better to just return internal listeners array position for the specific element
    var number = listeners.length;
    listeners.push({
      id: number,
      fn: func,
    });

    return number;
  }
  return {
    Build,
    createState,
    BindListener,
    Route,
  };
}

//usage
// var { Build, createState } = Nano();
// Build("root", Header, MainContent);
//gotta export build and statecreator
export default Nano;
