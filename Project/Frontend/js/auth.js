import { AUTH_API } from "./config.js";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            if (data.role && data.role.toLowerCase() === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "user-dashboard.html";
            }
        } else {
            alert(data.message || "Login failed. Please try again.");
        }
    } catch (err) {
        alert("Network error. Please try again later.");
    }
});

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${AUTH_API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Please login.");
            window.location.href = "index.html";
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (err) {
        alert("Network error. Please try again later.");
    }
});
