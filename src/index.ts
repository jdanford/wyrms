import { App } from "./app";
import "./styles/index.scss";

document.addEventListener("DOMContentLoaded", (_) => {
    const canvasElement = document.createElement("canvas");
    document.body.appendChild(canvasElement);
    new App(canvasElement);
});
