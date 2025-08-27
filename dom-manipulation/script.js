// Grab the dropdown
const categoryFilter = document.getElementById('categoryFilter');

// ⬇️ Populate unique categories into the filter dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  // Set last selected filter from localStorage
  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // Apply the filter immediately
  }
}

// ⬇️ Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory); // Save preference

  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Pick a random quote from the filtered list
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `
      <blockquote>"${quote.text}"</blockquote>
      <p><em>- ${quote.category}</em></p>
    `;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  } else {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
  }
}

// 🆕 Update addQuote() to refresh the category dropdown
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
  populateCategories(); // 🆕 Update filter options

  alert("Quote added successfully!");

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

const syncStatus = document.getElementById('syncStatus');

async function fetchServerQuotes() {
  // Simulated server quotes
  const serverQuotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Inspiration exists, but it has to find you working.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "New server quote added!", category: "Motivation" }
  ];
  return serverQuotes;
}

async function syncWithServer() {
  try {
    const serverQuotes = await fetchServerQuotes();

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

// Start periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// Initial sync on load
syncWithServer();

// Optional manual sync button
const manualSyncBtn = document.getElementById('manualSyncBtn');
if (manualSyncBtn) {
  manualSyncBtn.addEventListener('click', () => {
    syncWithServer();
  });
}

