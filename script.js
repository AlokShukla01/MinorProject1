async function analyzeText() {
    const inputText = document.getElementById("inputText").value;

    if (!inputText.trim()) {
        alert("⚠️ Please enter some text first.");
        return;
    }

    // Show loader
    document.getElementById("loader").style.display = "block";
    document.getElementById("resultBox").style.display = "none";

    try {
        // Replace with your backend ML API
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: inputText })
        });

        const data = await response.json();

        // Hide loader
        document.getElementById("loader").style.display = "none";
        document.getElementById("resultBox").style.display = "block";

        // Update label
        const resultLabel = document.getElementById("resultLabel");
        resultLabel.innerText = `Prediction: ${data.label} (Confidence: ${data.confidence}%)`;

        // Gauge animation
        const gaugeCircle = document.getElementById("gaugeCircle");
        const confidenceText = document.getElementById("confidenceText");
        let confidence = data.confidence;
        let offset = 440 - (440 * confidence) / 100;
        gaugeCircle.style.strokeDashoffset = offset;
        confidenceText.innerText = `${confidence}%`;

        // Change color based on label
        gaugeCircle.style.stroke = data.label.toLowerCase() === "ai" ? "#dc3545" : "#28a745";
        confidenceText.style.color = gaugeCircle.style.stroke;

        // History
        const historyList = document.getElementById("historyList");
        const li = document.createElement("li");
        const textSnippet = inputText.substring(0, 40) + (inputText.length > 40 ? "..." : "");
        li.innerHTML = `<span>"${textSnippet}"</span> <span class="badge ${data.label.toLowerCase()}">${data.label}</span>`;
        historyList.prepend(li);

    } catch (error) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("resultLabel").innerText = "❌ Error connecting to server.";
        console.error(error);
    }
}

/* Tab switcher */
function showTab(tabId) {
    document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(sec => sec.classList.remove("active"));
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
}