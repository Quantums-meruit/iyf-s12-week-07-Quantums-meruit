# Week 7 Daily Challenges

This folder contains the five practical challenges from IYF Weekend Academy Season 12, Week 7. Open index.html with a local development server to try them.

| Day | Challenge | What to practise |
|---|---|---|
| 1 | Theme Persistence | Save a light/dark theme preference and restore it on page load. |
| 2 | Recent Searches | Keep the five latest searches, remove duplicates, and reuse a previous search from the dropdown. |
| 3 | Form Auto-Save | Save a draft every five seconds, restore it after refresh, and clear it after submission. |
| 4 | Refactor Challenge | Validate input, separate responsibilities, use named constants, and handle errors. |
| 5 | Code Review | Review the Week 6 Weather Dashboard and record evidence-based findings. |

The browser stores each challenge's practice data locally. It is not sent to a server.

## Day 5 — Weather Dashboard review notes

I inspected the Week 6 Weather Dashboard source in the Week 6 repository.

### What is working well

- The weather request checks response status and gives specific messages for a missing city (404) and an invalid API key (401).
- The dashboard shows a loading state and uses a finally block so the loading indicator is hidden after success or failure.
- Request errors are caught and presented to the user rather than being left as unhandled promise rejections.
- Recent-search data is parsed inside try/catch, and malformed storage data falls back to an empty list.
- Recent searches are de-duplicated case-insensitively and limited to five entries.
- The history list uses event delegation, and city names are inserted with textContent rather than interpreted as HTML.
- The README explains that a key injected into a static frontend is still visible to visitors, even when GitHub Actions Secrets are used to keep it out of the repository.

### Improvements I would make

1. Validate the shape of the weather response before reading nested properties such as weather[0], sys.country, main, and wind. A partial or unexpected response could otherwise cause a TypeError.
2. Consider preventing an older, slower request from replacing the result of a newer city search. An AbortController or request identifier could handle this race condition.
3. Use replaceChildren() instead of assigning an empty string to innerHTML when clearing the recent-search list. The current code inserts city labels with textContent, so this is not an observed injection vulnerability; replaceChildren() makes the intention clearer.
4. Keep a storage warning separate from the main weather error message. A successful weather result should remain clearly successful even if the browser cannot save search history.
5. Extract and test small pure functions for formatting weather data and managing recent searches. The current dashboard is mostly contained in one script and has no automated tests in this repository.

The checklist on the challenge page is a worksheet. Check each item after reviewing it, and add any further observations from your own testing.
