import { ADMIN_API, CREDITS_API } from "./config.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCreditRequests();
  await fetchUserAnalytics();
});

async function fetchCreditRequests() {
  try {
    const response = await fetch(`${CREDITS_API}/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.request || data.request.length === 0) {
      document.getElementById("creditRequests").innerHTML =
        "<tr><td colspan='4'>No pending requests</td></tr>";
      return;
    }

    const creditRequests = document.getElementById("creditRequests");
    creditRequests.innerHTML = "";
    data.request.forEach((request) => {
      creditRequests.innerHTML += `
        <tr>
          <td>${request.username}</td>
          <td>${request.amount}</td>
          <td>${request.status}</td>
          <td>
            ${
              request.status === "pending"
                ? `
                  <button onclick="processCredit(${request.id}, 'approved')">Approve</button>
                  <button onclick="processCredit(${request.id}, 'denied')" class="deny">Deny</button>
                `
                : "Processed"
            }
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error fetching credit requests:", error);
  }
}

async function fetchUserAnalytics() {
  try {
    const response = await fetch(`${ADMIN_API}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.userStats || data.userStats.length === 0) {
      document.getElementById("userStats").innerHTML =
        "<tr><td colspan='3'>No user data available</td></tr>";
      return;
    }

    const userStats = document.getElementById("userStats");
    userStats.innerHTML = "";
    data.userStats.forEach((user) => {
      userStats.innerHTML += `
        <tr>
          <td>${user.username}</td>
          <td>${user.total_scans || 0}</td>
          <td>${user.credits || 0}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
  }
}

async function processCredit(requestId, status) {
  try {
    const response = await fetch(`${CREDITS_API}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, status }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      await fetchCreditRequests();
    } else {
      alert("Failed to process request");
    }
  } catch (error) {
    console.error("Error processing credit:", error);
  }
}
