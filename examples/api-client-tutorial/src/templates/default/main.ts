import { setupExample } from "./example";
import frontendsLogo from "/frontends-logo.svg";
import "./style.css";
import viteLogo from "/vite.svg";

const appElement = document?.querySelector("#app");
if (appElement) {
  appElement.innerHTML = `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://frontends.shopware.com" target="_blank">
        <img src="${frontendsLogo}" class="logo vanilla" alt="JavaScript logo" />
      </a>
      <h1>Hello Shopware!</h1>
    
    </div>
  `;
}

setupExample();
