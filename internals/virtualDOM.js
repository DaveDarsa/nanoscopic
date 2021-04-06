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

  function updateDOM(component) {
    //compare and update dom
    console.log(`component is ${component}`);

    let found = Array.from(currentDOM.childNodes);
    //find by attribute
    let element = found.find((children) => {
      return children.getAttribute("component") === component;
    });
    console.log(element);

    console.log("comparing here");
  }

  return {
    createDOM,
    updateDOM,
  };
}
