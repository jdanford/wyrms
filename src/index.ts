import { App } from "./app";
import { BACKGROUND_COLOR } from "./colors";

import "./styles/index.scss";

document.body.style.backgroundColor = BACKGROUND_COLOR.css();

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    new App(canvas);
});
