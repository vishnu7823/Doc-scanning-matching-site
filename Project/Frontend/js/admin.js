document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("http://localhost:8000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    
    const userStatsTable = document.getElementById("userStats");
    data.userStats.forEach(user => {
        userStatsTable.innerHTML += `<tr>
            <td>${user.username}</td>
            <td>${user.total_scans}</td>
            <td>${user.credits}</td>
        </tr>`;
    });

    const creditRequestsTable = document.getElementById("creditRequests");
    data.creditRequests.forEach(request => {
        creditRequestsTable.innerHTML += `<tr>
            <td>${request.username}</td>
            <td>${request.amount}</td>
            <td>${request.status}</td>
            <td>
                <button onclick="processCredit(${request.id}, 'approved')">Approve</button>
                <button onclick="processCredit(${request.id}, 'denied')">Deny</button>
            </td>
        </tr>`;
    });
});

async function processCredit(requestId, status) {
    const response = await fetch("http://localhost:8000/api/credits/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status })
    });
    if (response.ok) {
        alert(`Request ${status}`);
        location.reload();
    } else {
        alert("Failed to process request");
    }
}