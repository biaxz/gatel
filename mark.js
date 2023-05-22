// Get the input and output elements
var markdownInput = document.getElementById("markdownInput");
var htmlOutput = document.getElementById("htmlOutput");
var preview = document.getElementById("preview");
// Create a new showdown converter
var converter = new showdown.Converter();

// Function to convert Markdown to HTML
function convertMarkdown() {
  var markdownText = markdownInput.value;
  var convertedHtml = converter.makeHtml(markdownText);
  htmlOutput.value = convertedHtml;
  preview.innerHTML = convertedHtml;
}

// Add event listeners to input elements
markdownInput.addEventListener("input", convertMarkdown);

// Call the function once to initialize the preview
convertMarkdown();
