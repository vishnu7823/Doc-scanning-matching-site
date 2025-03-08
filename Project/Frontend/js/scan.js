document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }

    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("document");
    const matchResults = document.getElementById("matchResults");

    // ✅ Prevent duplicate event listeners
    uploadForm?.removeEventListener("submit", handleFileUpload);
    uploadForm?.addEventListener("submit", handleFileUpload);

    async function handleFileUpload(e) {
        e.preventDefault();

        if (!fileInput.files.length) {
            alert("Please select a file to upload.");
            return;
        }

        matchResults.innerHTML = "<p>Uploading & Scanning... Please wait.</p>";

        const formData = new FormData();
        formData.append("document", fileInput.files[0]); // ✅ Ensure field name matches multer config

        try {
            // **Step 1: Upload Document**
            const uploadResponse = await fetch("http://localhost:8000/api/documents/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                console.error("Upload Error:", uploadData);
                alert("Upload failed: " + uploadData.message);
                matchResults.innerHTML = "";
                return;
            }

            alert("File uploaded successfully!");
            console.log("Uploaded Document ID:", uploadData.id);

            // **Step 2: Call AI Matching API**
            const documentId = uploadData.id;
            const matchResponse = await fetch(`http://localhost:8000/api/documents/match/${documentId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            const matchData = await matchResponse.json();
            console.log("Full Matching Results:", matchData); // ✅ Log Full Response

            // ✅ Handle AI Response Correctly
            if (!matchResponse.ok || !matchData.matches) {
                alert("No similar documents found.");
                matchResults.innerHTML = "<p>No matching documents found.</p>";
                return;
            }

            // **Step 3: Extract AI Response and Display Matching Results**
            matchResults.innerHTML = "<h3>Matching Documents</h3>";

            let aiResponse = "";

            if (Array.isArray(matchData.matches)) {
                // If matches is an array, extract text
                aiResponse = matchData.matches.map(match => `<li>${match}</li>`).join("");
            } else if (matchData.matches?.parts) {
                // If matches contains AI response parts, extract text
                aiResponse = matchData.matches.parts.map(part => `<li>${part.text}</li>`).join("");
            } else if (typeof matchData.matches === "string") {
                // If matches is a string
                aiResponse = `<li>${matchData.matches}</li>`;
            } else {
                aiResponse = "<li>No valid response from AI</li>";
            }

            matchResults.innerHTML += `<ul>${aiResponse}</ul>`;

        } catch (error) {
            console.error("Unexpected Error in scan.js:", error);
            alert("An unexpected error occurred. Please try again.");
            matchResults.innerHTML = "";
        }
    }
});
