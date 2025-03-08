const API_URL= "http://localhost:8000/api/credits";

//fetch pending request

async function fetchCreditRequests() {
    const response = await fetch(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer your_admin_token` }
    });

    const data = await response.json();
    const tableBody = document.querySelector("#creditRequests tbody");
    tableBody.innerHTML = "";

    data.requests.forEach(request => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.user_id}</td>
            <td>${request.amount}</td>
            <td>
                <button onclick="processRequest(${request.id}, 'approved')">Approve</button>
                <button onclick="processRequest(${request.id}, 'denied')">Deny</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

//approve/deny function

async function processRequest(requestId, status) {
    const response = await fetch(`${API_URL}/process`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer your_admin_token`
        },
        body: JSON.stringify({ requestId, status })
    });

    const data = await response.json();
    alert(data.message);
    fetchCreditRequests(); 
}


//manually update user credits
async function updateCredits() {
    const userId = document.getElementById("userId").value;
    const creditAmount = document.getElementById("creditAmount").value;

    if (!userId || !creditAmount) {
        alert("Please enter user ID and credit amount.");
        return;
    }

    const response = await fetch(`${API_URL}/process`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer your_admin_token`
        },
        body: JSON.stringify({ requestId: userId, status: "approved", amount: creditAmount })
    });

    const data = await response.json();
    document.getElementById("updateMessage").innerText = data.message;
}



window.onload = fetchCreditRequests;