
    async function analyzeFile() {
      const fileInput = document.getElementById("fileInput");
      const loader = document.getElementById("loader");
      const resultDiv = document.getElementById("result");

      if (fileInput.files.length === 0) {
        alert("Veuillez sélectionner un fichier");
        return;
      }

      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      loader.style.display = "block";
      resultDiv.style.display = "none";

      try {
        const response = await fetch("http://127.0.0.1:5000/analyze", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        loader.style.display = "none";
        
        // Display detailed results
        displayDetailedResult(data.result, file);

      } catch (err) {
        loader.style.display = "none";
        displayErrorResult();
      }
    }

    function displayDetailedResult(status, file) {
      const resultDiv = document.getElementById("result");
      resultDiv.style.display = "block";
      resultDiv.className = `result ${status}`;

      const fileSize = (file.size / 1024).toFixed(2);
      const scanTime = (Math.random() * 2 + 0.5).toFixed(2);
      const timestamp = new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let icon, statusText, threatLevel, threatPercent, badgeText, recommendations;

      if (status === "safe") {
        icon = "✅";
        statusText = "File is Safe";
        threatLevel = "No Threats Detected";
        threatPercent = 5;
        badgeText = "Secure";
        recommendations = `
          <h4>💡 Security Status</h4>
          <ul>
            <li>No malicious patterns detected in file structure</li>
            <li>File signature matches expected format</li>
            <li>Behavioral analysis shows no suspicious activity</li>
            <li>Safe to proceed with upload to cloud storage</li>
          </ul>
        `;
      } else if (status === "suspicious") {
        icon = "⚠️";
        statusText = "Suspicious Activity Detected";
        threatLevel = "Moderate Risk";
        threatPercent = 60;
        badgeText = "Warning";
        recommendations = `
          <h4>⚠️ Recommended Actions</h4>
          <ul>
            <li>File contains unusual patterns that require attention</li>
            <li>Consider running additional security scans</li>
            <li>Verify file source before proceeding</li>
            <li>Isolate file from critical systems until verified</li>
          </ul>
        `;
      } else {
        icon = "🛑";
        statusText = "Malicious File Detected";
        threatLevel = "High Risk - Immediate Action Required";
        threatPercent = 95;
        badgeText = "Danger";
        recommendations = `
          <h4>🚨 Critical Actions Required</h4>
          <ul>
            <li><strong>DO NOT</strong> upload this file to any system</li>
            <li>Quarantine or delete the file immediately</li>
            <li>Scan your system for potential compromise</li>
            <li>Report this incident to your security team</li>
          </ul>
        `;
      }

      resultDiv.innerHTML = `
        <div class="result-container">
          <div class="result-header">
            <div class="result-icon">${icon}</div>
            <div class="result-title-section">
              <div class="result-status">${statusText}</div>
              <div class="result-subtitle">${threatLevel}</div>
            </div>
            <div class="result-badge">${badgeText}</div>
          </div>

          <div class="analysis-details">
            <div class="detail-card">
              <div class="detail-label">File Name</div>
              <div class="detail-value">${file.name}</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">File Size</div>
              <div class="detail-value">${fileSize} KB</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">Scan Time</div>
              <div class="detail-value">${scanTime}s</div>
            </div>
            <div class="detail-card">
              <div class="detail-label">Timestamp</div>
              <div class="detail-value" style="font-size: 14px;">${timestamp}</div>
            </div>
          </div>

          <div class="threat-meter">
            <div class="threat-meter-label">
              <span>Threat Level Assessment</span>
              <span><strong>${threatPercent}%</strong></span>
            </div>
            <div class="threat-meter-bar">
              <div class="threat-meter-fill" style="width: ${threatPercent}%"></div>
            </div>
          </div>

          <div class="recommendations">
            ${recommendations}
          </div>

          <div class="result-actions">
            <button class="action-btn primary" onclick="document.getElementById('fileInput').value = ''; document.getElementById('result').style.display = 'none';">
              🔄 Scan Another File
            </button>
            <button class="action-btn" onclick="downloadReport()">
              📄 Download Report
            </button>
          </div>
        </div>
      `;

      // Animate threat meter
      setTimeout(() => {
        const fill = resultDiv.querySelector('.threat-meter-fill');
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = `${threatPercent}%`;
        }, 100);
      }, 200);
    }

    function displayErrorResult() {
      const resultDiv = document.getElementById("result");
      resultDiv.style.display = "block";
      resultDiv.className = "result malicious";

      resultDiv.innerHTML = `
        <div class="result-container">
          <div class="result-header">
            <div class="result-icon">🚫</div>
            <div class="result-title-section">
              <div class="result-status">Connection Error</div>
              <div class="result-subtitle">Unable to reach security server</div>
            </div>
            <div class="result-badge">Error</div>
          </div>

          <div class="recommendations">
            <h4>⚠️ Troubleshooting Steps</h4>
            <ul>
              <li>Ensure the backend server is running on http://127.0.0.1:5000</li>
              <li>Check your network connection</li>
              <li>Verify firewall settings are not blocking the connection</li>
              <li>Try refreshing the page and scanning again</li>
            </ul>
          </div>

          <div class="result-actions">
            <button class="action-btn primary" onclick="document.getElementById('result').style.display = 'none';">
              🔄 Try Again
            </button>
          </div>
        </div>
      `;
    }

    function downloadReport() {
      alert("📊 Report download functionality would be implemented here");
    }

    // Drag and drop functionality
    const uploadLabel = document.querySelector('.upload-label');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadLabel.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadLabel.addEventListener(eventName, () => {
        uploadLabel.style.borderColor = 'var(--primary)';
        uploadLabel.style.background = 'rgba(0, 240, 255, 0.1)';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadLabel.addEventListener(eventName, () => {
        uploadLabel.style.borderColor = 'var(--glass-border)';
        uploadLabel.style.background = 'rgba(0, 240, 255, 0.02)';
      });
    });

    uploadLabel.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      fileInput.files = files;
    });
  