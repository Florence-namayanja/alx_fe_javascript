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
