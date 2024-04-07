import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const NavMenu = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("keydown", onButtonClick);

    return cleanup;
  }, []);
  const cleanup = () => {
    window.removeEventListener("keydown", onButtonClick);
  };
  const onButtonClick = (event: any) => {
    switch (event.code) {
      case "Escape":
        turnBack();
        break;
      default:
        break;
    }
  };
  const turnBack = () => {
    navigate("/");
  };
  return (
    <div className="project-container">
      <p onClick={turnBack}>ESC to turn back</p>
      <Outlet></Outlet>
    </div>
  );
};

export default NavMenu;
