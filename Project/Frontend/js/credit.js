document.getElementById("creditRequestForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("creditAmount").value;
    const response = await fetch("http://localhost:8000/api/credits/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (response.ok) {
        alert("Credit request submitted successfully!");
        location.reload();
    } else {
        alert("Failed to request credits");
    }
});