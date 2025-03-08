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

async function fetchPastScans() {
    const response = await fetch("http://localhost:8000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    const scanHistory = document.getElementById("scanHistory");
    scanHistory.innerHTML = "";
    data.pastScans.forEach(scan => {
        scanHistory.innerHTML += `<li>${scan.filename} (Scanned on: ${scan.date})</li>`;
    });
}

document.getElementById("uploadForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("document");
    const formData = new FormData();
    formData.append("document", fileInput.files[0]);

    const response = await fetch("http://localhost:8000/api/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        alert("File uploaded successfully!");
        await fetchUserProfile(); // ✅ Fetch updated credits after upload
        await fetchPastScans();
    } else {
        alert("Upload failed: " + data.message);
    }
})


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

