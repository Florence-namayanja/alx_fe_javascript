let quotes = [];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Load Quotes from Local Storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];
    saveQuotes(); // Save default quotes on first load
  }
}

// Save Quotes to Local Storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show Random Quote
function showRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
  // Save the last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Add New Quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  alert("Quote added successfully!");

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Create the form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  document.body.appendChild(formContainer);
}

// Export Quotes to JSON File
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import Quotes from JSON File
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Failed to import file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Restore last viewed quote from sessionStorage
function restoreLastViewedQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><em>- ${quote.category}</em></p>
    `;
  } else {
    showRandomQuote();
  }
}

// Add import/export buttons
function createImportExportControls() {
  const container = document.createElement('div');

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Quotes to JSON';
  exportBtn.addEventListener('click', exportToJsonFile);

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.addEventListener('change', importFromJsonFile);

  container.appendChild(exportBtn);
  container.appendChild(importInput);
  document.body.appendChild(container);
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);

// Init
loadQuotes();
createAddQuoteForm();
createImportExportControls();
restoreLastViewedQuote();
