const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCreditRequests();
    await fetchUserAnalytics();
});

async function fetchCreditRequests() {
    try {
        const response = await fetch("http://localhost:8000/api/credits/balance", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (!data.request || data.request.length === 0) {  // Fix: Check correct key "request"
            document.getElementById("creditRequests").innerHTML = "<tr><td colspan='4'>No pending requests</td></tr>";
            return;
        }

        const creditRequests = document.getElementById("creditRequests");
        creditRequests.innerHTML = "";
        data.request.forEach(request => {  // Fix: Use correct key "request"
            creditRequests.innerHTML += `
                <tr>
                    <td>${request.user_id}</td>
                    <td>${request.amount}</td>
                    <td>${request.status}</td>
                    <td>
                        ${request.status === "pending" ? `
                            <button onclick="processCredit(${request.id}, 'approved')">Approve</button>
                            <button onclick="processCredit(${request.id}, 'denied')" class="deny">Deny</button>
                        ` : "Processed"}
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
        const response = await fetch("http://localhost:8000/api/admin/analytics", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const text = await response.text(); // Read raw response for debugging
        console.log("User Analytics API Response (Raw):", text);

        const data = JSON.parse(text); // Convert to JSON
        console.log("User Analytics API Response (Parsed):", data);

        // Ensure the expected structure exists
        if (!data.userStats || data.userStats.length === 0) {  
            document.getElementById("userStats").innerHTML = "<tr><td colspan='3'>No user data available</td></tr>";
            return;
        }

        const userStats = document.getElementById("userStats");
        userStats.innerHTML = "";
        data.userStats.forEach(user => {
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
    const response = await fetch("http://localhost:8000/api/credits/process", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, status })
    });
    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        await fetchCreditRequests();
    } else {
        alert("Failed to process request");
    }
}
