// Function to populate voice select dropdown
function populateVoiceSelect() {
  const voiceSelect = document.getElementById("voice-select");
  const tts = window.speechSynthesis;

  function updateVoices() {
    const voices = tts.getVoices();

    voices.forEach(function(voice, index) {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = voice.name;
      voiceSelect.appendChild(option);
    });
  }

  if (tts.onvoiceschanged !== undefined) {
    tts.onvoiceschanged = updateVoices;
  }

  updateVoices();
}

// Event listener when Convert to Audio button is clicked
document.getElementById("convert-btn").addEventListener("click", function(event) {
  event.preventDefault();
  const pdfFile = document.getElementById("pdf-file").files[0];

  // Check if a file was selected
  if (!pdfFile) {
    alert("Please select a PDF file");
    return;
  }

  // Check if the selected file is a valid PDF file
  if (pdfFile.type !== "application/pdf") {
    alert("Please select a valid PDF file");
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    const pdfData = new Uint8Array(reader.result);
    pdfjsLib.getDocument(pdfData)
      .promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
          page.getTextContent({ normalizeWhitespace: false })
            .then(function(text) {
              const pdfText = text.items.map(item => item.str).join("");
              const voiceSelect = document.getElementById("voice-select");
              const selectedVoiceIndex = voiceSelect.value;
              const tts = window.speechSynthesis;
              const utterance = new SpeechSynthesisUtterance(pdfText);
              const voices = tts.getVoices();
              utterance.voice = voices[selectedVoiceIndex];
              utterance.rate = 0.4;
              utterance.pitch = 1;
              utterance.word = " ";

              // Create Play button
              const playBtn = document.createElement("button");
              playBtn.textContent = "Play";
              playBtn.addEventListener("click", function() {
                tts.speak(utterance);
              });

              // Append Play button to the form
              const form = document.querySelector("form");
              form.appendChild(playBtn);
            });
        });
      })
      .catch(function(error) {
        console.log(error);
        alert("Error converting PDF to text");
      });
  };
  reader.readAsArrayBuffer(pdfFile);
});

// Event listener when the page has finished loading
window.addEventListener("load", function() {
  populateVoiceSelect();
});
