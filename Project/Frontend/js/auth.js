import { AUTH_API } from "./config.js";

// Add debugging
console.log("AUTH_API:", AUTH_API);

// Enhanced login handler with timeout
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  console.log("Attempting login for:", username);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.log("Login request timed out");
  }, 10000); // 10 second timeout

  try {
    console.log("Sending login request to:", `${AUTH_API}/login`);
    
    const response = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log("Login response status:", response.status);
    console.log("Login response headers:", response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login response data:", data);

    if (response.ok && data.token) {
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
    clearTimeout(timeoutId);
    console.error("Login error:", err);
    
    if (err.name === 'AbortError') {
      alert("Request timed out. Please try again.");
    } else if (err.message.includes('Failed to fetch')) {
      alert("Network error. Check if backend is running.");
    } else {
      alert("Network error. Please try again later.");
    }
  }
});

// Enhanced register handler with timeout
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  console.log("Attempting registration for:", username);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.log("Register request timed out");
  }, 10000); // 10 second timeout

  try {
    console.log("Sending register request to:", `${AUTH_API}/register`);
    
    const response = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log("Register response status:", response.status);
    console.log("Register response headers:", response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Register response data:", data);

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.error("Register error:", err);
    
    if (err.name === 'AbortError') {
      alert("Request timed out. Please try again.");
    } else if (err.message.includes('Failed to fetch')) {
      alert("Network error. Check if backend is running.");
    } else {
      alert("Network error. Please try again later.");
    }
  }
});
