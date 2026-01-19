# Nifi Clone

This project is a web application built with Next.js, designed to simulate or clone functionalities similar to Nifi, utilizing React Flow for node-based visualizations.

## Tech Stack Used

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:**
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [HeroUI](https://heroui.com/) (formerly NextUI)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Visualization/Flow:** [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd nifi-clone
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```
   Or using pnpm:
   ```bash
   pnpm install
   ```

## How to run the application locally

1. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Additional Notes

- **Linting:** This project uses `eslint` for code quality. Run `npm run lint` to check for issues.
- **Building for Production:** To create a production build, run `npm run build`.
- **HeroUI:** Ensure you have the necessary setups for HeroUI if customizing the theme in `tailwind.config.ts`.
