# AI Studio Application Rules: Hindustan Mattress Co.

This document outlines the core technologies and best practices for developing and maintaining the "Make My Mattress" application within the AI Studio environment.

## 1. Tech Stack Overview

*   **React**: The primary JavaScript library for building user interfaces.
*   **TypeScript**: Used for type safety, improving code quality and maintainability across the entire codebase.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling components with responsive and consistent designs.
*   **Vite**: The build tool used for a fast development experience and optimized production builds.
*   **Google Gemini API (`@google/genai`)**: Integrated for advanced AI capabilities, including the Sleep Consultant and Vision-based mattress analysis.
*   **React Router**: The standard library for declarative routing in React applications, managing navigation between different screens.
*   **shadcn/ui & Radix UI**: A collection of beautifully designed, accessible, and customizable UI components, built on Radix UI primitives.
*   **Lucide React**: A library providing a set of consistent and customizable SVG icons.

## 2. Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following rules when implementing features:

*   **UI Components**:
    *   **shadcn/ui**: Always prioritize using components from `shadcn/ui` for common UI elements (e.g., buttons, forms, dialogs, drawers). These are pre-installed and styled with Tailwind CSS.
    *   **Custom Components**: For unique UI elements not covered by `shadcn/ui`, create new, small, and focused React components.
*   **Styling**:
    *   **Tailwind CSS**: All styling must be done using Tailwind CSS utility classes. Avoid writing custom CSS files or inline styles unless absolutely necessary for dynamic calculations.
*   **Routing**:
    *   **React Router**: Manage all application navigation and routes using React Router. Keep route definitions centralized in `src/App.tsx`.
*   **AI Integration**:
    *   **`@google/genai`**: Use this package for all interactions with Google's Gemini models, including text generation (Sleep Consultant) and multimodal analysis (Vision Exchange).
*   **Icons**:
    *   **`lucide-react`**: Use icons from the `lucide-react` library for all graphical symbols within the UI.
*   **State Management**:
    *   **React Hooks**: Utilize React's built-in `useState`, `useReducer`, and `useContext` for managing component-level and application-wide state. Avoid external state management libraries unless explicitly approved for complex global state needs.
*   **Currency Formatting**:
    *   **`Intl.NumberFormat`**: Use the native `Intl.NumberFormat` API for all currency formatting to ensure localization and precision (e.g., `FinancialEngine.formatCurrency`).