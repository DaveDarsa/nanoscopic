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
    console.log(currentDOM.childNodes);
  }

  function updateDOM() {
    //compare and update dom
    console.log("comparing here");
  }

  return {
    createDOM,
    updateDOM,
  };
}
