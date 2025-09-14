// script.js

// Fetch posts from server
function fetchPosts() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched posts:", data);
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

// Post a new quote to server
function postQuote(quote, author) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quote: quote,
      author: author,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Posted quote:", data);
    })
    .catch((error) => console.error("Error posting quote:", error));
}

// Sync quotes with server
function syncQuotes() {
  // Example: post a test quote
  postQuote("This is a synced quote", "Student");
}

// Run automatically when page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  syncQuotes();
});
