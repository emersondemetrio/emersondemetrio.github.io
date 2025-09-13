# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is Emerson's personal website (emerson.run), built as a React single-page application featuring:
- Personal portfolio and social links
- Interactive "labs" - experimental web applications and tools
- A terminal-like UI design theme
- GitHub Pages deployment

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI with custom dark theme
- **Routing**: React Router with hash-based routing (`HashRouter`)
- **Build Tool**: Vite
- **State Management**: Zustand (for specific features like Twitter store)
- **Deployment**: GitHub Pages via GitHub Actions

## Common Commands

### Development
```bash
# Start development server with CSS generation
npm run dev

# Generate CSS (Tailwind compilation)
npm run css
# or watch mode
npm run css:w

# Type checking
npm run type:check
```

### Code Quality
```bash
# Lint with ESLint (max 4 warnings allowed)
npm run lint

# Format code with Deno
npm run format:fix
```

### Build & Deploy
```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Deploy to GitHub Pages (manual)
npm run deploy
```

### Custom CLI
```bash
# Create new page component
npm run cli:new:page
# or directly
npm run cli page [page-name] [description]
```

## Architecture & Structure

### Application Structure
- **Hash-based routing** for GitHub Pages compatibility
- **Layout**: Grid-based with header/main/footer structure
- **Pages**: Feature-complete mini-applications in `/labs/*` routes
- **Components**: Reusable UI components with terminal aesthetic

### Key Directories
- `src/pages/`: Individual page components (home, about, labs, etc.)
- `src/components/`: Reusable UI components
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions
- `scripts/`: CLI tools for development workflow

### Route Organization
- **Home routes**: `/`, `/about`, `/resume`, `/blog`, `/dev`
- **Labs routes**: `/labs/*` - Interactive experiments and tools
- **Legacy redirects**: Old experiment paths redirect to new `/labs/*` structure

### Component Patterns
- **Terminal UI**: Components follow terminal-like design (header/content/footer)
- **Page wrapper**: Most pages use the `Page` component for consistent layout
- **Type safety**: Strong TypeScript typing throughout, especially for external APIs

### State Management
- **Zustand**: Used selectively (e.g., Twitter store for dev daily feature)
- **React hooks**: Custom hooks for API calls, caching, and complex logic
- **Local state**: Most components use React's built-in state management

### Styling System
- **Custom DaisyUI theme**: "emerson.run" theme with dark color palette
- **Tailwind utilities**: Extensive use of utility classes
- **CSS generation**: Separate build step for Tailwind compilation
- **Responsive design**: Mobile-first approach with `use-is-mobile` hook

### External Integrations
- **Weather API**: Requires `VITE_WEATHER_API_KEY` environment variable
- **Currency conversion**: Multiple provider support (Wise, Google)
- **Background removal**: Client-side image processing
- **GitHub linking**: Direct source code links in experiments

### Development Workflow
- **Page generation**: CLI script creates new pages with consistent structure
- **Path aliases**: `@/` for src, `@/components/` and `@/pages/` for specific directories
- **Hot reload**: Vite provides fast development experience
- **Type checking**: Strict TypeScript configuration with path resolution

### Deployment Pipeline
- **GitHub Actions**: Automated deployment on main branch pushes
- **Environment variables**: Weather API key injected during build
- **Asset optimization**: Vite handles bundling and optimization
- **GitHub Pages**: Static hosting with custom domain (emerson.run)

## Testing Notes

This project doesn't currently include automated tests. When adding tests, consider:
- Component testing for interactive labs
- API integration tests for weather/currency features  
- E2E tests for routing and navigation

## Development Tips

- Use the CLI to generate new pages for consistency
- Follow the terminal UI pattern for new components
- Add new labs to the `experiments` array in `constants.ts`
- Maintain TypeScript strict mode compliance
- Consider mobile experience with responsive design
