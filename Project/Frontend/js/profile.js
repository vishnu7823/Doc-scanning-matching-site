const token = localStorage.getItem("token");
fetch("http://localhost:8000/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` }
}).then(res => res.json()).then(data => {
    document.getElementById("username").innerText = data.username;
    document.getElementById("role").innerText = data.role;
    document.getElementById("credits").innerText = data.credits;
});
