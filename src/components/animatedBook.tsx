import { useEffect, useState } from "react";
//@ts-ignore
import MyScene from "../threejs/main.js";
import { useNavigate } from "react-router-dom";
import MainHud from "./mainHud.js";

export enum FocusStatus {
  NON = "NON",
  FOCUSED = "FOCUSED",
}

const Book = () => {
  const navigate = useNavigate();
  const [focusStatus, setFocusStatus] = useState<FocusStatus>(FocusStatus.NON);

  const changeFocusState = (newState: FocusStatus) => {
    console.log("changeFocusState RENDER BOOK", newState);
    setFocusStatus(newState);
  };

  const handleNavigate = (url: string) => {
    navigate(url, { replace: true });
  };

  useEffect(() => {
    console.log("render useEffect BOOK");
    MyScene.getInstance(handleNavigate, changeFocusState);
  }, [focusStatus]);

  return (
    <>
      <div className="hood">
        <MainHud state={focusStatus} />
      </div>
    </>
  );
};

export default Book;
