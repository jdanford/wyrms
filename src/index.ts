import { App } from "./app";
import { BACKGROUND_COLOR } from "./colors";
import "./styles/index.scss";

document.body.style.backgroundColor = BACKGROUND_COLOR.css();

document.addEventListener("DOMContentLoaded", () => {
    const canvasElement = document.createElement("canvas");
    document.body.appendChild(canvasElement);
    new App(canvasElement);
});
