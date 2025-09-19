import { CREDITS_API } from "./config.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.getElementById("creditRequestForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = document.getElementById("creditAmount").value;

  try {
    const response = await fetch(`${CREDITS_API}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Credit request submitted successfully!");
      window.location.href = "user-dashboard.html";
    } else {
      alert("Request failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    alert("Network error. Please try again later.");
  }
});
