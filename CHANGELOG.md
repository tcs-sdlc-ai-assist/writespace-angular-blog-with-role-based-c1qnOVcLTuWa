# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page**: Welcome page showcasing recent blog posts with a clean, modern layout accessible to all visitors.
- **Authentication System**: Full login and registration flow with form validation, error handling, and session management.
- **Role-Based Access Control**: Two distinct roles (admin and user) with route guards protecting restricted areas of the application.
- **Blog CRUD Operations**: Complete create, read, update, and delete functionality for blog posts with rich text content support.
- **Admin Dashboard**: Dedicated dashboard for administrators featuring site statistics, recent activity overview, and quick-action controls.
- **User Management**: Admin-only interface for viewing, editing, and managing registered users and their assigned roles.
- **Avatar System**: User avatar selection and display throughout the application, including profile pages and blog post author sections.
- **localStorage Persistence with Seeding**: Client-side data persistence using localStorage with automatic seeding of default users, roles, and sample blog posts on first launch.
- **Responsive CSS UI**: Fully responsive user interface built with custom CSS, optimized for desktop, tablet, and mobile screen sizes.
- **Vercel Deployment**: Production-ready deployment configuration for Vercel with proper build settings and routing support for the Angular single-page application.