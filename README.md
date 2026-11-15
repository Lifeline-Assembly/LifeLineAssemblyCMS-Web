# Lifeline-Fe (Church Management System)

A comprehensive frontend application for the Lifeline Church Management System, built with React, TypeScript, and Vite. This application serves as the interface for administrators, pastors, and members to manage church activities, membership, and content.

## 🚀 Features

### 🔐 Authentication
-   **Secure Login**: Role-based access control for Admins, Pastors, and Members.
-   **Registration**: New member sign-up flow.

### 📊 Dashboard
-   **Admin Dashboard**: Overview of church statistics (growth, attendance, donations).
-   **Member Management**: View, search, verify, and manage church members.
-   **Pastor Management**: Manage pastor assignments and details.

### 📝 Content Management
-   **Events**: Create and manage church events.
-   **Sermons**: Upload and categorize sermons.
-   **Blogs**: Publish articles and updates.

## 🛠️ Tech Stack

-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: React Context API (`AuthContext`, `ToastContext`)
-   **Routing**: React Router (inferred)
-   **Icons**: React Icons (`react-icons`)

## 📂 File Structure

```
src/
├── api/                    # API integration and service calls
│   ├── admin-dashboard-apis.ts
│   ├── auth-api.tsx
│   └── landing-page-services.ts
├── assets/                 # Static assets (images, svgs)
├── components/             # Reusable UI components
│   ├── buttons/
│   ├── dashboard-components/
│   ├── inputs/
│   ├── landing-components/
│   ├── modals/
│   ├── settings/
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoadingModal.tsx
│   ├── StatCard.tsx
│   └── ...
├── constants/              # App constants and type definitions
│   ├── app-logic.ts
│   └── basic-types.ts
├── contexts/               # React Context providers
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── hooks/                  # Custom React hooks
│   └── useAuth.ts
├── layouts/                # Page layouts
│   ├── DashboardLayout.tsx
│   └── LandingLayout.tsx
├── pages/                  # Application pages
│   ├── auth-pages/
│   ├── dashboard-pages/    # (MembersPage, PastorsPage, etc.)
│   ├── landing-pages/
│   └── ErrorPage.tsx
├── App.tsx                 # Main application component
├── main.tsx                # Entry point
└── index.css               # Global styles (Tailwind directives)
```

## 🚦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies**
    ```bash
    yarn install
    ```

3.  **Run the development server**
    ```bash
    yarn dev
    ```

4.  **Build for production**
    ```bash
    yarn build
    ```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
