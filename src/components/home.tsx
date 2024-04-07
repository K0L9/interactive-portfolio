import { useEffect, useState } from "react";
import MyInput from "./input";

const Home = () => {
  useEffect(() => {
    console.log("render home");
  });
  const [text, setText] = useState<string>("");
  const changeText = (event: any) => {
    setText(event.target.value);
  };

  return (
    <>
      <h1>Mykola Koval</h1>
      <h2>
        Junior fullstack developer <small>.NET + React</small>
      </h2>

      <p>
        <span id="welcome-span">Hey there!</span> Welcome to Kolya's digital
        playground – a place where enthusiasm for code, endless curiosity, and a
        sprinkle of humor blend to create something special. As a junior
        developer, I might not have brewed gallons of coffee into code yet, but
        every line I write is a step towards mastery. Here, you'll find my
        journey, projects, and the occasional fun mishap (because, let's be
        honest, what's coding without a few unexpected 'features'?). Dive in and
        let's explore the possibilities together – it's going to be a ride
        filled with learning, creativity, and a bit of geeky fun!
      </p>

      <ul>
        <li>
          .NET
          <small>C# | EF Core | Web API (Asp.NET Core) | SignalR | WPF </small>
        </li>
        <li>
          Web
          <small>HTML | CSS | JS | TS | React | Redux | SASS | ThreeJS </small>
        </li>
        <li>PostgreSQL | MSSQL</li>
        <li>Git | Linux</li>
        <li>Scrum | Kanban</li>
        <li>DRY | SOLID</li>
        <li>Clean architecture | MVVM | MVC</li>
      </ul>
      <h4>Contacts</h4>
      <nav>
        <ul>
          <li>
            <a href="https://www.linkedin.com/in/kolya-koval-b12455229/">
              My linkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/K0L9">My github</a>
          </li>
          <li>
            <a href="https://koval-portfolio.weebly.com/">Portfolio</a>
          </li>
        </ul>
      </nav>
      <MyInput />
      <input type="text" onChange={changeText} />
    </>
  );
};

export default Home;
