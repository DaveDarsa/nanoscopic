import { Nano } from "./index.js";
var { Build, createState, BindListener, Route } = Nano();

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
  function ClickListener(e) {
    console.log("ehqwoeih");
    console.log(e);
    var a = "hello";
    const b = 123 * 221;
  }

  function render(state) {
    return `<div component='Header' class='header' onTouch=${BindListener(
      ClickListener
    )} >Hello ${state} <a href="#" linkto=/about>Link here</a> </div>`;
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
  setTimeout(() => {
    changerandom("inside UPDATE ONE");
  }, 1500);
  setTimeout(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => changerandom(json.title));
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

  function click() {
    changeContent("Yeah not main anymore");
    console.log("the function that clicks");
  }

  function render(state) {
    return `<div component='MainContent' onTouch=${BindListener(
      click
    )} class='maincontent'>${state}
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
function About() {
  return `<div component='About' class='about'><a href="#" linkto='/'>Go back to main</a></div> `;
}

//without router
// Build("root", Header, MainContent, About);

// //with router
Build("root", Route("/", [Header, MainContent]), Route("/about", [About]));
