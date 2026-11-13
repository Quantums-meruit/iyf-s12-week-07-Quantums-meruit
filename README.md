# Week 7: JavaScript Best Practices

## Author

- **Name:** Joseph Kinyanjui
- **GitHub:** [@Quantums-meruit](https://github.com/Quantums-meruit)
- **Date:** November 13, 2026

## Project Description

This is my Week 7 project for IYF Weekend Academy Season 12. I used my Week 5 To-Do List as the starting point and worked on improving its structure, persistence, readability, and testability.

The main project is a To-Do List built with modular JavaScript. It saves tasks and the selected filter in the browser and uses a central state module to keep the interface updated. I also included the Lesson 13 Shopping Cart mini-project and a page containing the five Week 7 daily challenges.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES modules)
- Browser localStorage
- Node.js and npm
- Node.js built-in test runner (`node:test`)
- ESLint 9
- Prettier
- Git and GitHub
- GitHub Actions
- GitHub Pages

## Features

### To-Do List

- Add tasks and trim unnecessary spaces from task text.
- Mark tasks as completed or active.
- Edit a task by double-clicking its text. Press **Enter** to save or **Escape** to cancel.
- Delete individual tasks or clear all completed tasks.
- Filter the list to show all, active, or completed tasks.
- Display the number of unfinished tasks and an empty-state message.
- Save tasks and the selected filter in browser localStorage, then restore them after a refresh.
- Use event delegation for task actions.

### Shopping Cart

- Browse a sample product catalogue with prices in Kenyan shillings.
- Add products to the cart.
- Increase or decrease quantities and remove individual products.
- See the item count and subtotal update when the cart changes.
- Clear the cart and keep cart contents after refreshing the page.

This is a learning project, not a real store. It does not process payments or place orders.

### Daily Challenges

The Daily Challenges page contains the five exercises from the Week 7 guide:

1. **Theme Persistence** — switch between light and dark themes and save the preference.
2. **Recent Searches** — save the five latest searches, remove duplicates, and reuse a previous search.
3. **Form Auto-Save** — save a draft every five seconds, restore it after a refresh, and clear it after submission.
4. **Refactor Challenge** — validate order data, calculate totals, use named constants, and handle invalid input.
5. **Code Review** — inspect my Week 6 Weather Dashboard and record review notes.

Challenge data is stored locally in the browser. It is not sent to a server.

## How to Run

You need Node.js 22 or 24 and npm for the quality tools and tests.

1. Clone the repository:

   ```bash
   git clone https://github.com/Quantums-meruit/iyf-s12-week-07-Quantums-meruit.git
   cd iyf-s12-week-07-Quantums-meruit
   ```

2. Install the development dependencies:

   ```bash
   npm install
   ```

3. Start a local server from the project folder. For example, use the VS Code Live Server extension and open `index.html`.

   The project uses JavaScript modules, so serve it over HTTP rather than opening it directly through a `file://` URL.

4. Open `cart/index.html` or `daily-challenges/index.html` to explore the other exercises.

5. Run the checks when needed:

   ```bash
   npm test
   npm run lint
   npm run format:check
   ```

## Lessons Learned

The biggest lesson for me this week was that a project becomes easier to work with when each file has a clear responsibility. In my original To-Do List, task data, browser storage, event handling, and DOM updates lived together. Separating those responsibilities helped me understand how the different parts of an application communicate.

I learned why pure functions are useful. A function that receives an array and returns a new array can be tested without opening a browser or creating DOM elements. This made it possible to use Node's test runner to check task behaviour and edge cases.

Working with localStorage helped me understand that browser storage keeps strings, so arrays and objects need JSON serialization and parsing. I also practised loading saved values safely when storage is empty or contains invalid JSON.

The observer pattern gave me a way to keep the interface in sync with central state. When the task list or filter changes, the state module notifies the UI to render the latest data.

I also learned to use ESLint to catch code-quality problems, Prettier to keep formatting consistent, and automated tests to check that changes do not break existing task logic.

## Challenges Faced

- **Splitting the original application:** deciding what belongs in task logic, state, storage, rendering, and the entry-point file took careful thought. I worked through this by giving each module one main responsibility.
- **Keeping modules connected:** I had to make sure exported function names and imported names matched exactly. Checking the browser console and running tests helped me find mistakes.
- **Testing pure functions:** I needed to check both the returned result and whether the original array was left unchanged.
- **Preserving the original interface:** JavaScript-generated elements need CSS class names that match the stylesheet. A mismatch can make correct JavaScript look broken.
- **Handling persistence:** saved JSON can be missing or invalid, so loading functions need safe fallbacks.
- **Maintaining code quality:** ESLint and Prettier solve different problems, so I learned to run both instead of treating one as a replacement for the other.

## Collaboration

I worked with Magdalene Wanyeki as my Week 7 partner. The review activity I completed is linked below. We did not use a shared repository.

- **Team / partner:** Magdalene Wanyeki ([GitHub profile](https://github.com/MagdaleneWanyeki))
- **Shared repo:** Not applicable — no shared repository was used.
- **PR I opened:** Not provided.
- **PR I reviewed:** [Week 7 PR #1 in Ndush-gif's repository — review](https://github.com/Ndush-gif/iyf-s12-week-07-Ndush-gif/pull/1#pullrequestreview-5897680525)

The original implementation work for this project is recorded separately in [Week 7 implementation PR #1](https://github.com/Quantums-meruit/iyf-s12-week-07-Quantums-meruit/pull/1), which was merged into `main`.

## Live Demo

[View my Week 7 project on GitHub Pages](https://quantums-meruit.github.io/iyf-s12-week-07-Quantums-meruit/)

The home page links to the To-Do List, Shopping Cart, and Daily Challenges.

## Project Structure

| File or folder | Responsibility |
|---|---|
| `index.html` | To-Do List page structure |
| `styles.css` | Main To-Do List styling |
| `js/app.js` | Connects events, task logic, state, and rendering |
| `js/state.js` | Holds central application state and notifies subscribers |
| `js/storage.js` | Saves and loads tasks and the selected filter |
| `js/todo-logic.js` | Pure functions for adding, editing, filtering, toggling, deleting, counting, and clearing tasks |
| `js/ui.js` | Renders tasks and updates the interface |
| `tests/todo-logic.test.js` | Automated tests for pure task functions |
| `cart/` | Shopping Cart mini-project |
| `daily-challenges/` | Five interactive Week 7 exercises |
| `.github/workflows/` | Automated quality checks and GitHub Pages deployment |
| `eslint.config.js` | ESLint 9 flat configuration |
| `.prettierrc` | Shared formatting rules |
| `.gitignore` | Excludes `node_modules` and other generated/local files |

## Testing and Quality Checks

I used Node's built-in test runner, which is an accepted alternative to Vitest in the Week 7 guide.

- Run `npm test` to run the automated tests.
- Run `npm run lint` to check JavaScript with ESLint.
- Run `npm run format:check` to check formatting with Prettier.
- Run `npm run format` to format the project when needed.

The latest GitHub Actions quality run passed all 13 tests and ESLint. The tests cover filtering, active-task counting, toggling, deleting, adding, clearing completed tasks, editing, empty input, missing IDs, and preserving the original array.

## Deployment

The repository includes a GitHub Actions workflow for GitHub Pages. It runs tests and ESLint before deploying the static site. The deployed site is available through the Live Demo link above.
