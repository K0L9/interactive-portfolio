import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

export class TextObject {
  constructor({ textContent, targetObject, onTextClick, index }) {
    // add label object
    var text = document.createElement("div");
    text.className = "label";
    text.style.color = "#FFFFFF";
    text.textContent = textContent;
    text.style.backgroundColor = "transparent";
    text.style.paddingBottom = "50px";
    // text.addEventListener("click", (event) => onTextClick(index));

    var label = new CSS2DObject(text);
    label.position.y = 1;
    targetObject.add(label);
  }
}
