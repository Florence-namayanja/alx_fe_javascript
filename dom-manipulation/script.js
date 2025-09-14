// script.js

// Utility function to create elements
function createElement(tag, text = "") {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  return el;
}

// Fetch posts from mock API
function fetchPosts() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched posts:", data);

      const list = document.getElementById("post-list");
      if (!list) return;

      list.innerHTML = ""; // clear old data
      data.slice(0, 5).forEach((post) => {
        const li = createElement("li", post.title);
        list.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

// Create a new post with POST
function createPost() {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "New Post",
      body: "This is a test post",
      userId: 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post created:", data);
      const result = document.getElementById("result");
      if (result) {
        result.textContent = `Created: ${data.title}`;
      }
    })
    .catch((error) => console.error("Error creating post:", error));
}

// Sync quotes to mock API
function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quote: "This is a sample quote to sync",
      author: "Student",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Quotes synced:", data);
      const syncResult = document.getElementById("sync-result");
      if (syncResult) {
        syncResult.textContent = `Synced quote: "${data.quote}" by ${data.author}`;
      }
    })
    .catch((error) => console.error("Error syncing quotes:", error));
}

// Hook functions to buttons (if they exist in HTML)
document.addEventListener("DOMContentLoaded", () => {
  const fetchBtn = document.getElementById("fetch-btn");
  const createBtn = document.getElementById("create-btn");
  const syncBtn = document.getElementById("sync-btn");

  if (fetchBtn) fetchBtn.addEventListener("click", fetchPosts);
  if (createBtn) createBtn.addEventListener("click", createPost);
  if (syncBtn) syncBtn.addEventListener("click", syncQuotes);
});
