export function virtualDOM() {
  var currentDOM;
  var ChildComponents = [];
  function createDOM(element) {
    var el = document.createElement("div");
    el.appendChild(element);
    //runs during first render
    currentDOM = currentDOM === undefined && el;
  }
  function saveNode(componentFragment, componentName) {
    //saves all rendered component's children that are themselves components

    let childrenArr = Array.from(componentFragment.children);
    let componentChildren = childrenArr.filter((child) => {
      return child.hasAttribute("component");
    });
    ChildComponents.push({ name: componentName, children: componentChildren });
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
      //re-insert children to the updated dom
      foundChild.children.forEach((child) => {
        updatedComponent.insertBefore(child, emptyChild);
      });
      updatedComponent.removeChild(emptyChild);
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
