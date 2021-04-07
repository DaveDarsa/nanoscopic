//parser must be the top level api for combining the app into one nodelist representation for the dom - with its own "compiler"
//must have a change listener? to trigger virtual dom and current dom comparison then update by calling the compiler?
export function ToDOM(component) {
  var fragmentToRender =
    typeof component === "function" ? component() : component;
  //this is where the parsing shoud happen to a valid HTMLelement, gets appeneded to Build fragment and turned into root's child
  var range = document.createRange();
  var fragmentFromComponent = range.createContextualFragment(fragmentToRender);
  return fragmentFromComponent;
}
