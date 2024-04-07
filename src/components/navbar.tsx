import { Link } from "react-router-dom";

const NavigationBar = (childer: ChildNode) => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/bibika"></Link>
          </li>
          <li>Contact form</li>
        </ul>
      </nav>
    </>
  );
};

export default NavigationBar;
