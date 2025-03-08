const token = localStorage.getItem("token");

document.getElementById("uploadForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("document");
    const formData = new FormData();
    formData.append("document", fileInput.files[0]);  // Ensure correct key name

    try {
        const response = await fetch("http://localhost:8000/api/documents/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert("File uploaded successfully!");

            // Refresh past scans and credits
            fetchPastScans();
            fetchUserProfile();
        } else {
            alert("Upload failed: " + data.message);
        }
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Error uploading document.");
    }
});

// Function to fetch past scans
async function fetchPastScans() {
    const response = await fetch("http://localhost:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    const scanHistory = document.getElementById("scanHistory");
    scanHistory.innerHTML = "";
    data.pastScans.forEach(scan => {
        scanHistory.innerHTML += `<li>${scan.filename} (Scanned on: ${scan.date})</li>`;
    });
}

// Function to fetch user profile & update credits
async function fetchUserProfile() {
    const response = await fetch("http://localhost:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    document.getElementById("username").innerText = data.username;
    document.getElementById("role").innerText = data.role;
    document.getElementById("credits").innerText = data.credits;
}
