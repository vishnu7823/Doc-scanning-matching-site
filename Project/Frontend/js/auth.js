//function for user authentication

const API_BASE_URL = "https://doc-scanning-matching-site.onrender.com/api/auth";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        console.log("Role received:", data.role); // Debugging

        // Redirect based on role
        if (data.role && data.role.toLowerCase() === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "user-dashboard.html";
        }
    } else {
        alert(data.message);
    }
});


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "index.html";
    } else {
        alert(data.message);
    }
});
