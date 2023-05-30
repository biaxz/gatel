const audioPlayer = document.getElementById("audio-player");
let audioSource;

function convertTextToAudio(text) {
  const voiceSelect = document.getElementById("voice-select");
  const selectedVoiceIndex = voiceSelect.value;
  const tts = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = tts.getVoices();
  utterance.voice = voices[selectedVoiceIndex];
  utterance.rate = 0.4;
  utterance.pitch = 1;
  utterance.word = " ";

  tts.speak(utterance);

  utterance.onstart = function() {
    audioPlayer.pause();
    audioPlayer.src = "";
  }

  utterance.onend = function() {
    audioPlayer.src = audioSource;
    audioPlayer.play();
  }
}

document.getElementById("convert-btn").addEventListener("click", function (event) {
  event.preventDefault();
  const pdfFile = document.getElementById("pdf-file").files[0];
  const textInput = document.getElementById("text-input").value.trim();

  // Check if a PDF file or text input is provided
  if (!pdfFile && !textInput) {
    alert("Please select a PDF file or enter text");
    return;
  }

  let textToConvert = "";

  if (pdfFile) {
    // Check if the selected file is a valid PDF file
    if (pdfFile.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const pdfData = new Uint8Array(reader.result);
      pdfjsLib.getDocument(pdfData)
        .promise.then(function (pdf) {
          const numPages = pdf.numPages;
          let currentPage = 1;

          function extractTextFromPage(page) {
            return page.getTextContent().then(function (textContent) {
              const pageText = textContent.items.map(function (item) {
                return item.str;
              }).join(" ");

              textToConvert += pageText + " ";

              if (currentPage < numPages) {
                currentPage++;
                return pdf.getPage(currentPage).then(extractTextFromPage);
              } else {
                convertTextToAudio(textToConvert);
              }
            });
          }

          pdf.getPage(currentPage).then(extractTextFromPage);
        })
        .catch(function (error) {
          console.log(error);
          alert("Error converting PDF to text");
        });
    };
    reader.readAsArrayBuffer(pdfFile);
  } else {
    textToConvert = textInput;
    convertTextToAudio(textToConvert);
  }
});

// Function to populate voice options
function populateVoiceSelect() {
  const voiceSelect = document.getElementById("voice-select");
  const tts = window.speechSynthesis;
  const voices = tts.getVoices();

  voices.forEach(function (voice, index) {
    const option = document.createElement("option");
    option.textContent = voice.name;
    option.value = index;
    voiceSelect.appendChild(option);
  });
}

// Event listener when the page has finished loading
window.addEventListener("load", function () {
  populateVoiceSelect();
});
