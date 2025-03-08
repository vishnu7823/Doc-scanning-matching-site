const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchUserProfile();
    await fetchPastScans();
});

async function fetchUserProfile() {
    const response = await fetch("http://localhost:8000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById("username").innerText = data.username;
        document.getElementById("role").innerText = data.role;
        document.getElementById("credits").innerText = data.credits;
    } else {
        alert("Failed to fetch profile");
    }
}

// ✅ Keep only ONE version of fetchPastScans()
async function fetchPastScans() {
    const response = await fetch("http://localhost:8000/api/documents/history", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    const scanHistory = document.getElementById("scanHistory");
    scanHistory.innerHTML = ""; // Clear previous scans

    if (response.ok && data.scans.length > 0) {
        data.scans.forEach(scan => {
            const listItem = document.createElement("li");
            listItem.textContent = `${scan.filename} (ID: ${scan.id})`;
            scanHistory.appendChild(listItem);
        });
    } else {
        scanHistory.innerHTML = "<li>No past scans found.</li>";
    }
}
