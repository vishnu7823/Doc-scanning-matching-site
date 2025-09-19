import { DOCS_API } from "./config.js";
import { fetchUserProfile, fetchPastScans } from "./user.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("document");
  const matchResults = document.getElementById("matchResults");

  if (uploadForm) {
    uploadForm.addEventListener("submit", handleFileUpload, { once: true });
  }

  async function handleFileUpload(e) {
    e.preventDefault();

    if (!fileInput.files.length) {
      alert("Please select a file to upload.");
      return;
    }

    matchResults.innerHTML = "<p>Uploading & Scanning... Please wait.</p>";

    const formData = new FormData();
    formData.append("document", fileInput.files[0]);

    try {
      const uploadResponse = await fetch(`${DOCS_API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        alert("Upload failed: " + (uploadData.message || "Unknown error"));
        matchResults.innerHTML = "";
        return;
      }

      alert("File uploaded successfully!");
      await fetchUserProfile();
      await fetchPastScans();

      const documentId = uploadData.id;
      const matchResponse = await fetch(`${DOCS_API}/match/${documentId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchData = await matchResponse.json();

      if (!matchResponse.ok || !matchData.matches) {
        matchResults.innerHTML = "<p>No matching documents found.</p>";
        return;
      }

      matchResults.innerHTML = "<h3>Matching Documents</h3>";

      let aiResponse = "";
      if (Array.isArray(matchData.matches)) {
        aiResponse = matchData.matches.map((m) => `<li>${m}</li>`).join("");
      } else if (matchData.matches?.parts) {
        aiResponse = matchData.matches.parts.map((p) => `<li>${p.text}</li>`).join("");
      } else if (typeof matchData.matches === "string") {
        aiResponse = `<li>${matchData.matches}</li>`;
      } else {
        aiResponse = "<li>No valid response from AI</li>";
      }

      matchResults.innerHTML += `<ul>${aiResponse}</ul>`;
    } catch (error) {
      alert("Unexpected error occurred. Please try again.");
      matchResults.innerHTML = "";
    }
  }
});
