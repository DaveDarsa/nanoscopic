import { ToDOM } from "./ToDOM.js";

export function virtualDOM() {
  var currentDOM;
  function createDOM(element) {
    var el = document.createElement("div");
    el.appendChild(element);
    //runs during first render
    currentDOM = currentDOM === undefined && el;
    //this is where comparison to the old dom happen
    let renderedDOM = document.getElementById("root");
    console.log(renderedDOM.childNodes);

    // console.log(el.innerHTML);
    //children of dom
    console.log(currentDOM.childNodes);
  }

  function updateDOM(componentRender, componentName) {
    //compare and update dom
    // console.log(`component is ${component}`);
    console.log(componentName);
    //new render
    console.log("new render");
    console.log(componentRender.textContent);

    let elemArray = Array.from(currentDOM.childNodes);
    //find by attribute
    let element = elemArray.find((children) => {
      return children.getAttribute("component") === componentName;
    });
    document.querySelector(`[component=${componentName}]`).innerHTML =
      componentRender.textContent;
    console.log("old render");
    //old render

    //replacing here

    // currentDOM.replaceChild(element, currentDOM.childNodes[0]);
    // let oldValue = element.innerHTML;
    // let newValue = ToDOM(component);
    //create a fragment and compare old innerhtml to new and if changed replace old with new in the nodelist

    // console.log("comparing here");
  }

  return {
    createDOM,
    updateDOM,
  };
}
