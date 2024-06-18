import { routeWholeHtml, showError, validateEmail } from "./utils.js";

window.routeWholeHtml = routeWholeHtml;
window.promptForCodeAndSend = promptForCodeAndSend;
window.showError = showError;

export async function registerUser() {
  const formData = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password1: document.getElementById("password1").value,
    password2: document.getElementById("password2").value,
  };
  //check if email is valid
  if (!validateEmail(formData.email)) {
    await showError("invalid-email");
    return;
  }
  // Check if passwords match
  if (formData.password1 !== formData.password2) {
    await showError("passwords-not-match");
    return;
  }
  // Make API call
  fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        response
          .text()
          .then(async (text) => {
            await showError(text);
          })
          .catch(async (error) => {
            await showError("error-occurred");
          });
        const registrationForm = document.getElementById("registrationForm");
        if (registrationForm) {
          registrationForm.classList.add("shake");
          registrationForm.addEventListener("animationend", () => {
            registrationForm.classList.remove("shake");
          });
        }
      } else {
        routeWholeHtml("index.html");
      }
    })
    .finally(() => {
      document.getElementById("registrationForm").reset();
    });
}

export async function loginUser() {
  const formData = {
    username: document.getElementById("loginUsername").value,
    password: document.getElementById("loginPassword").value,
  };
  // Make API call

  await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      if (!response.ok) {
        response.text().then(async (text) => {
          await showError(`error-occurred`);
        });
        const loginForm = document.getElementById("loginForm");
        loginForm.classList.add("shake");
        loginForm.addEventListener("animationend", () => {
          loginForm.classList.remove("shake");
        });
      } else if (response.status === 202) {
        const code = window.prompt("Enter the code sent to your email");
        const ephemeral = await response.text();
        await fetch("/auth/login/confirm2FA", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ephemeral_token: ephemeral, code: code }),
        })
          .then(async (response) => {
            if (!response.ok) {
              await showError(`error-try-again`);
            } else {
              routeWholeHtml("index.html");
            }
          })
          .catch((error) => {
            console.error("Error fetching configuration in loginUser:", error);
          });
      } else {
        routeWholeHtml("index.html");
      }
    })
    .finally(() => {
      document.getElementById("loginForm").reset();
    });
}

export async function authenticateWith42() {
  await fetch("/auth/auth_42")
    .then(async (response) => {
      response.json().then(async (data) => {
        window.open(data.url, "_blank");
      });
    })
    .catch((error) => {
      console.error(
        "Error fetching configuration in authenticateWith42:",
        error,
      );
    });
}

export async function promptForCodeAndSend(ephemeral) {
  const code = window.prompt("Enter the code sent to your email");
  await fetch("/auth/login/confirm2FA", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ephemeral_token: ephemeral, code: code }),
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.body) {
          return response.json().then((data) => {
            // showError(data.error);
          });
        }
        await showError(`error-try-again`);
      } else {
        routeWholeHtml("index.html");
      }
    })
    .catch((error) => {
      console.error(
        "Error fetching configuration in promptForCodeAndSend:",
        error,
      );
    });
}
