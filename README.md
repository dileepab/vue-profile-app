# Vue.js Profile Application

This project is a modern, responsive web application built to fulfill the requirements of the "Slicing v4 Exercise". It includes user authentication (Login/Register), profile viewing, and profile editing functionalities.

**Live Demo:** <https://dileepab.github.io/vue-profile-app/>

---

## Features

* **User Authentication**: Secure login and registration pages with form validation.
* **Persistent Login**: A "Keep me logged in" option that uses a 1-year browser cookie for persistent sessions.
* **Session-Only Login**: Standard login uses `sessionStorage` and expires when the browser tab is closed.
* **Profile Management**: A multi-tab interface for viewing and editing user profile information.
    * **Basic Details**: Includes user avatar, name, and email.
    * **Additional Details**: Address, contact info, and marital status.
    * **Spouse Details**: A conditional tab that only appears if the user's marital status is "Married".
    * **Personal Preferences**: Hobbies, interests, and favorite media.
* **Responsive Design**: The application is fully responsive and provides an optimal user experience on desktop, tablet, and mobile devices.
* **Modular Architecture**: The codebase is organized into reusable components and layouts for better maintainability and scalability.

---

## Technology Stack

This project was built using a modern web development stack:

* **Framework**: [Vue.js](https://vuejs.org/) (v3 with Composition API)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Routing**: [Vue Router](https://router.vuejs.org/)
* **UI Component Library**: [PrimeVue](https://primevue.org/)
* **Form Validation**: [VeeValidate](https://vee-validate.logaretm.com/v4/) & [Yup](https://github.com/jquense/yup)
* **Deployment**: [GitHub Pages](https://pages.github.com/)

---

## Project Setup

To run this project on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone git@github.com:dileepab/vue-profile-app.git
cd vue-profile-app
```

### 2. Install dependencies

This will install all the necessary packages, including Vue, PrimeVue, and VeeValidate.

```bash
npm install
```

### 3. Run the development server

This command will start the Vite development server, typically on `http://localhost:5173/vue-profile-app/`.

```bash
npm run dev
```

### 4. Build for production

To create a production-ready build of the application in the `dist` folder.

```bash
npm run build
```

### 5. Deploy to GitHub Pages

To deploy the application, run the custom `deploy` script. This will build the project and push the `dist` folder to the `gh-pages` branch.

```bash
npm run deploy
```

---

## Project Structure

The source code is organized into the following main directories:

* `/src/assets`: Contains global stylesheets.
* `/src/components`: Contains small, reusable components (e.g., `ProfileAvatar.vue`).
* `/src/layouts`: Contains layout components that provide a common structure for pages (e.g., `ProfileLayout.vue`).
* `/src/router`: Contains the Vue Router configuration and navigation guards.
* `/src/services`: Contains the mock API service for data fetching.
* `/src/views`: Contains the main page components of the application (e.g., `Login.vue`, `ProfileView.vue`).
