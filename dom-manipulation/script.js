// Quotes array - initialize from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Inspiration exists, but it has to find you working.", category: "Inspiration" },
];

// Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatus = document.getElementById('syncStatus');

let currentFilter = localStorage.getItem('currentFilter') || 'all';

// Show a random quote filtered by category
function showRandomQuote() {
  const filteredQuotes = currentFilter === 'all' ? quotes : quotes.filter(q => q.category === currentFilter);
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available in this category.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown dynamically from quotes array
function populateCategories() {
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = currentFilter;
}

// Add a new quote from user input
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert('Please enter both quote text and category.');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  // Update UI
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  populateCategories();
  filterQuotes();
  alert('Quote added successfully!');
}

// Filter quotes based on selected category and show a random quote
function filterQuotes() {
  currentFilter = categoryFilter.value;
  localStorage.setItem('currentFilter', currentFilter);
  showRandomQuote();
}

// JSON Export
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Syncing with server (Mock API: JSONPlaceholder) ---

async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  // Map first 5 posts into "quotes"
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

async function syncWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    if (JSON.stringify(quotes) !== JSON.stringify(serverQuotes)) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncStatus.textContent = 'Data synced with server. Local data updated.';
    } else {
      syncStatus.textContent = 'Data is up to date with server.';
    }
  } catch (error) {
    syncStatus.textContent = 'Error syncing data with server.';
    console.error(error);
  }

  setTimeout(() => {
    syncStatus.textContent = '';
  }, 5000);
}

// --- Event Listeners ---
newQuoteBtn.addEventListener('click', showRandomQuote);
document.querySelector('button[onclick="addQuote()"]').addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

const manualSyncBtn = document.getElementById('manualSyncBtn');
if (manualSyncBtn) {
  manualSyncBtn.addEventListener('click', syncWithServer);
}

// --- Initial load ---
populateCategories();
filterQuotes();
syncWithServer();
setInterval(syncWithServer, 30000);
