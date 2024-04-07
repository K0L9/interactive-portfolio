import { useEffect, useState } from "react";
import { FocusStatus } from "./animatedBook";

export interface IMainHudProps {
  state: FocusStatus;
}

const MainHud = ({ state }: IMainHudProps) => {
  const [mainInstruction, setMainInstruction] = useState<string>("");

  useEffect(() => {
    if (state === FocusStatus.NON) {
      setMainInstruction("Click arrows to move");
    }
    console.log(state);
  }, []);

  return (
    <>
      <p className="main-nav-text">{mainInstruction}</p>
    </>
  );
};

export default MainHud;
