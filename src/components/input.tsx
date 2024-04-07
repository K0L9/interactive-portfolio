import { useEffect, useState } from "react";

const MyInput = () => {
  useEffect(() => {
    console.log("render input");
  });

  const [text, setText] = useState<string>("");
  const changeText = (event: any) => {
    setText(event.target.value);
  };
  return (
    <>
      <input type="text" onChange={changeText} />
    </>
  );
};

export default MyInput;
