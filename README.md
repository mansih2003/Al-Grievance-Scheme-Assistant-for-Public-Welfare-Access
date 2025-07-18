# Public Welfare Scheme Assistant - India

A secure, inclusive, and AI-powered web application for Indian citizens to discover, apply for, and track public welfare schemes.

## Project Overview

The Public Welfare Scheme Assistant is designed to simplify access to government welfare schemes for Indian citizens. It provides personalized scheme recommendations, streamlined applications, and AI-powered assistance.

## Features

- **User Authentication:** Secure login with email, OTP, and biometric capabilities
- **Personalized Scheme Discovery:** Find relevant schemes based on user profiles
- **Online Application System:** Apply for schemes and track application status
- **AI-Powered Assistance:** Get guidance and support through an intelligent chatbot
- **Multilingual Support:** Access information in multiple Indian languages
- **Grievance Redressal:** File and track complaints or issues

## Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend & Authentication:** Supabase
- **AI Integration:** Google Gemini 1.5 Pro (future implementation)
- **Database:** PostgreSQL (via Supabase)
- **State Management:** Zustand
- **Form Handling:** Formik with Yup validation
- **Localization:** i18next
- **API Integration:** OGD India API, MyGov India API (future implementation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Supabase account

### Setup Instructions

1. Clone the repository
   ```
   git clone <repository-url>
   cd public-welfare-scheme-assistant
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Connect to Supabase
   - Create a new Supabase project
   - Click the "Connect to Supabase" button in the interface
   - Run the migration script in `supabase/migrations/` to set up the database schema

4. Start the development server
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Additional environment variables for future integrations:
```
VITE_GOOGLE_API_KEY=
VITE_GOOGLE_GEMINI_KEY=
VITE_OGD_INDIA_API_KEY=
```

## Project Structure

- `src/`: Source code
  - `components/`: Reusable UI components
  - `pages/`: Page components for different routes
  - `lib/`: Utility functions and API clients
  - `stores/`: State management with Zustand
  - `types/`: TypeScript type definitions
  - `locales/`: Translation files for multiple languages
- `supabase/`: Supabase configuration and migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.#   A l - G r i e v a n c e - S c h e m e - A s s i s t a n t - f o r - P u b l i c - W e l f a r e - A c c e s s 
 
 
