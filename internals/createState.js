export function createState(val = undefined) {
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
    Promise.resolve().then(() => {
      stateStorage.setState = newVal;
    });
  }
  function getter() {
    return stateStorage.getState;
  }
  //must return the closured state and the updater
  return [getter, changer];
}
//needs a change listener with a custom eventemitter that calls virtualdom creator
