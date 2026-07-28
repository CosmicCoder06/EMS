# Employee Management System

## Project Title
Employee Management System - Interactive Application (Phase 3, 4 & 5)

## Project Overview
This project is a fully functional, interactive, client-side Employee Management System built using semantic HTML5, Vanilla CSS, and JavaScript. It allows users to register, view, search, filter, and delete employee records dynamically.

It implements local state management with a native JavaScript Array of Objects, leverages local storage for data persistence, and features real-time search/filtering behavior.

## Technologies Used
- **HTML5**: Semantic elements (`header`, `footer`, `section`, `article`, `table`, `thead`, `tbody`)
- **CSS3**: Variables, CSS Grid, Flexbox, Transitions, Media Queries
- **JavaScript (ES6+)**: DOM Manipulation (`getElementById`, `querySelector`, `addEventListener`), Local Storage API, Array Methods (`push`, `filter`, `splice`, `forEach`, `findIndex`)

## Features
- **Register Employees**: Interactive registration form that captures Name, Email, Department, Position, and Salary.
- **Form Input Validation**: Uses native browser attributes and custom logic checks before saving records.
- **Dynamic Table Population**: Automatically formats, builds, and updates row components in real-time as data changes.
- **Delete Records**: Removes employee records from the active list (utilizing JavaScript `splice` and syncing the data).
- **Instant Search & Filter**: Real-time filtering based on Name query (substring match) and Department dropdown filter (utilizing JavaScript `filter`).
- **Local Storage Persistence**: Saves data on changes and loads existing employee lists automatically upon page refresh.
- **Mobile Responsive**: Scalable columns, flexible layouts, and scrollable data tables on narrow mobile screens.

## Folder Structure
```text
Employee-Management-System/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── images/
└── data/
```

## Installation & Setup Instructions
1. Download or clone this project folder.
2. Open `index.html` in a web browser.
3. Use the registration form to add employees, verify real-time search, test row deletions, and refresh the browser page to check that data persists.
4. Open the browser console (F12) to verify that there are no runtime warnings or scripting errors.

## Screenshots
*(Screenshots can be added here during final evaluation submission)*

## Future Improvements
- Integrate backend database storage (Node.js, Express, MongoDB) for server-side persistence.
- Implement employee profile image uploads.
- Add page pagination and dashboard statistics cards (Average Salary, Department Counts).

## Author Information
- **Name**: Student (ayush-68789)
- **Course**: JOVAC CodroidHub Advanced MERN
