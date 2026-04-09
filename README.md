# WriteSpace Blog

A modern, lightweight blogging platform built with Angular 17+ and TypeScript. WriteSpace allows users to create, edit, and manage blog posts with a clean, intuitive interface. All data is persisted locally using the browser's localStorage API.

## Tech Stack

- **Framework:** Angular 17+
- **Language:** TypeScript
- **Styling:** CSS
- **Storage:** localStorage (browser-based persistence)
- **Build Tool:** Angular CLI

## Features

- Create, read, update, and delete blog posts
- Rich text content editing
- Post listing with search and filter capabilities
- Responsive design for mobile and desktop
- Client-side data persistence with localStorage
- Standalone components architecture
- Lazy-loaded routes for optimal performance
- Reactive forms with validation

## Folder Structure

```
writespace-blog/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── post-card/
│   │   │   └── confirm-dialog/
│   │   ├── pages/               # Route-level page components
│   │   │   ├── home/
│   │   │   ├── post-list/
│   │   │   ├── post-detail/
│   │   │   ├── post-editor/
│   │   │   └── not-found/
│   │   ├── services/            # Application services
│   │   │   ├── blog.service.ts
│   │   │   └── storage.service.ts
│   │   ├── models/              # TypeScript interfaces and types
│   │   │   └── post.model.ts
│   │   ├── guards/              # Route guards
│   │   │   └── unsaved-changes.guard.ts
│   │   ├── pipes/               # Custom Angular pipes
│   │   │   ├── truncate.pipe.ts
│   │   │   └── reading-time.pipe.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.routes.ts
│   ├── assets/                  # Static assets (images, icons)
│   ├── environments/            # Environment configuration
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css               # Global styles
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vercel.json
└── README.md
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd writespace-blog
npm install
```

### Development Server

Start the local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you modify any source files.

### Build

Build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory. The production build uses ahead-of-time (AOT) compilation and tree-shaking for optimal bundle size.

### Running Tests

Execute unit tests via Karma:

```bash
ng test
```

## Deployment

### Vercel

This project is configured for deployment on Vercel.

1. **Install the Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Configure `vercel.json`** in the project root:

   ```json
   {
     "version": 2,
     "buildCommand": "ng build",
     "outputDirectory": "dist/writespace-blog/browser",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

3. **Deploy via CLI**:

   ```bash
   vercel --prod
   ```

4. **Deploy via Vercel Dashboard**:
   - Import the repository on [vercel.com](https://vercel.com)
   - Vercel will auto-detect the Angular framework
   - Set the output directory to `dist/writespace-blog/browser`
   - Click **Deploy**

> **Note:** The `rewrites` configuration ensures that Angular's client-side routing works correctly. All routes are redirected to `index.html` so the Angular Router can handle navigation.

## Usage Guide

### Creating a Post

1. Click the **"New Post"** button from the home page or navigation bar.
2. Fill in the post title, summary, and content using the editor form.
3. Click **"Publish"** to save the post.

### Editing a Post

1. Navigate to the post you want to edit.
2. Click the **"Edit"** button on the post detail page.
3. Modify the content as needed.
4. Click **"Save Changes"** to update the post.

### Deleting a Post

1. Navigate to the post you want to delete.
2. Click the **"Delete"** button.
3. Confirm the deletion in the dialog prompt.

### Browsing Posts

- The home page displays all published posts sorted by date.
- Use the search bar to filter posts by title or content.
- Click on any post card to view the full post detail.

## Data Persistence

WriteSpace uses the browser's `localStorage` API for data persistence. This means:

- All posts are stored locally in your browser.
- Data persists across page refreshes and browser sessions.
- Clearing browser data will remove all stored posts.
- Data is not synced across devices or browsers.

## License

**Private** — All rights reserved. This project is proprietary and not licensed for public use, distribution, or modification.