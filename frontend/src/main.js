import { loadHTML, routeWholeHtml } from "./utils.js";

let currentPage = null;
const routes = {
  "/": startPage,
  "/login": loginPage,
  "/home": homePage,
  "/friends": friendsPage,
  "/gameLobby": gameLobbyPage,
  "/profile": profilePage,
  "/settings": settingsPage,
  "/loginForm": loginFormPage,
  "/registerForm": registerFormPage,
  "/pongcpugame": pongcpugamePage,
  "/ponggame": ponggamePage,
  "/tictactoe": tictactoePage,
  "/tournament": tournamentPage,
};

export function navigate(path, addToHistory = true) {
  currentPage = path;
  const routeFunction = routes[currentPage];
  if (routeFunction) {
    routeFunction();
    if (addToHistory) {
      history.pushState({ path: currentPage }, "", currentPage);
    }
  } else {
    console.log(`No route found for ${path}`);
  }
}

async function startPage() {
  const authResponse = await fetch("/user/authenticated");
  const data = await authResponse.json();
  if (data.authenticated) {
    navigate("/home", false);
  } else {
    navigate("/login", false);
  }
}

function loginPage() {
  routeWholeHtml("login.html");
}

function homePage() {
  routeWholeHtml("home.html");
}

function friendsPage() {
  loadHTML("friends.html", "changingBody");
}

function settingsPage() {
  loadHTML("settings.html", "changingBody");
}

function gameLobbyPage() {
  loadHTML("gameLobby.html", "changingBody");
}

function profilePage() {
  loadHTML("profile.html", "changingBody");
}

function loginFormPage() {
  loadHTML("loginForm.html", "accessContainer");
}

function registerFormPage() {
  loadHTML("registerForm.html", "accessContainer");
}

function pongcpugamePage() {
  loadHTML("pongcpugame.html", "BODY");
}

function ponggamePage() {
  loadHTML("ponggame.html", "BODY");
}

function tictactoePage() {
  loadHTML("tictactoe.html", "BODY");
}

function tournamentPage() {
  loadHTML("tournament.html", "BODY");
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.path) {
    if (currentPage !== event.state.path) {
      navigate(event.state.path, false);
    }
  }
});

// Load the current page on startup
navigate("/", false);
