import { AUTH_API, DOCS_API } from "./config.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchUserProfile();
  await fetchPastScans();
});

export async function fetchUserProfile() {
  try {
    const response = await fetch(`${AUTH_API}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("username").innerText = data.username;
      document.getElementById("role").innerText = data.role;
      document.getElementById("credits").innerText = data.credits;
    } else {
      alert("Failed to fetch profile");
    }
  } catch (error) {
    alert("Error fetching profile.");
  }
}

export async function fetchPastScans() {
  try {
    const response = await fetch(`${DOCS_API}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    const scanHistory = document.getElementById("scanHistory");
    scanHistory.innerHTML = "";

    if (response.ok && data.scans?.length > 0) {
      data.scans.forEach((scan) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${scan.filename} (ID: ${scan.id})`;
        scanHistory.appendChild(listItem);
      });
    } else {
      scanHistory.innerHTML = "<li>No past scans found.</li>";
    }
  } catch (error) {
    console.error("Error fetching past scans:", error);
    document.getElementById("scanHistory").innerHTML =
      "<li>Error loading scans.</li>";
  }
}
