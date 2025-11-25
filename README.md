# Angular Micro Frontend Lab

A monorepo demonstrating **Micro Frontend (MFE)** architecture using Angular 20 and Native Federation. This project showcases how to build scalable applications by composing independent, deployable micro frontends.

## Overview

This repository contains a Pokemon-themed application split into multiple micro frontends:

- **Shell App** - Host application that loads and orchestrates remote micro frontends
- **Pokemon List** - Displays a list of Pokemon (Remote MFE)
- **Pokemon Details** - Shows detailed Pokemon information (Remote MFE)
- **Pokemon Types** - Manages Pokemon type information (Remote MFE)
- **Shared Libraries** - Common models, services, and UI components

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Shell Application                    │
│                   (Host - Port 4200)                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Pokemon    │  │   Pokemon    │  │   Pokemon    │   │
│  │     List     │  │   Details    │  │    Types     │   │
│  │ Remote: 4201 │  │ Remote: 4202 │  │ Remote: 4203 │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Shared Libraries                      │    │
│  │  • Models  • Services  • UI Components          │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Monorepo Setup

### What is a Monorepo?

A **monorepo** (monolithic repository) is a single repository that contains multiple projects, applications, and shared libraries. In the context of micro frontends, a monorepo allows you to:

- Manage all MFEs and shared code in one place
- Share common dependencies and configurations
- Maintain consistent code standards across all apps
- Simplify dependency management and versioning
- Enable atomic commits across multiple projects

### Why Use a Monorepo for MFE?

**Benefits:**

- **Centralized Dependency Management** - All apps use the same versions of Angular, TypeScript, and other libraries
- **Code Sharing Made Easy** - Shared libraries can be imported directly without publishing to npm
- **Simplified Development** - Run and test multiple MFEs together in one workspace
- **Unified CI/CD** - Build and deploy all or specific apps from a single pipeline
- **Better Refactoring** - Changes to shared code immediately reflect across all consuming apps
- **Single Source of Truth** - One repository, one set of tooling, one configuration

**Trade-offs:**

- Larger repository size
- Requires more initial setup
- Need clear boundaries between projects

---

### Creating the Monorepo Workspace

#### Step 1: Create Angular Workspace

Create a new Angular workspace without generating an initial application:

```bash
npx @angular/cli@latest new angular-mfe-lab --create-application=false
```

This creates:

- An empty workspace ready for multiple applications
- Shared `node_modules` for all projects
- Central `angular.json` configuration
- Common `tsconfig.json` and `package.json`

Navigate into the workspace:

```bash
cd angular-mfe-lab
```

---

### Creating the Host Application (Shell)

The Shell acts as the container that loads and orchestrates all remote micro frontends.

```bash
ng generate application shell --routing=true --style=scss
```

**What this creates:**

- `projects/shell/` - Host application directory
- Routing configuration enabled
- Standalone components (Angular 14+ modern approach)
- SCSS styling support

**Configuration:**

- Default port: `4200`
- Role: Host/Container application
- Loads remotes dynamically at runtime

---

### Creating Remote MFE Applications

Each remote MFE is an independent Angular application that can be developed, tested, and deployed separately.

#### Pokemon List MFE

```bash
ng generate application mfe-pokemon-list --routing --style=scss
```

**Purpose:** Display and manage Pokemon list functionality  
**Port:** `4201`  
**Exposes:** Pokemon list components and routes

#### Pokemon Details MFE

```bash
ng generate application mfe-pokemon-details --routing --style=scss
```

**Purpose:** Show detailed Pokemon information  
**Port:** `4202`  
**Exposes:** Pokemon detail components and routes

#### Pokemon Types MFE

```bash
ng generate application mfe-pokemon-types --routing --style=scss
```

**Purpose:** Manage Pokemon type information  
**Port:** `4203`  
**Exposes:** Pokemon type components and routes

---

### Workspace Structure After Monorepo Setup

After running these commands, your workspace structure will look like:

```
angular-mfe-lab/
├── projects/
│   ├── shell/                    # Host Application (Port 4200)
│   │   └── src/
│   │       ├── app/
│   │       ├── assets/
│   │       ├── index.html
│   │       └── main.ts
│   │
│   ├── mfe-pokemon-list/         # Remote MFE (Port 4201)
│   │   └── src/
│   │       ├── app/
│   │       ├── assets/
│   │       ├── index.html
│   │       └── main.ts
│   │
│   ├── mfe-pokemon-details/      # Remote MFE (Port 4202)
│   │   └── src/
│   │       ├── app/
│   │       ├── assets/
│   │       └── main.ts
│   │
│   └── mfe-pokemon-types/        # Remote MFE (Port 4203)
│       └── src/
│           ├── app/
│           ├── assets/
│           └── main.ts
│
├── libs/
│   └── shared/
│       ├── models/               # Shared interfaces & data structures
│       ├── services/             # Shared services
│       └── ui/                   # Shared UI components
│
├── angular.json                  # Workspace configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # Root TypeScript settings

```

---

Run each application to verify:

```bash
# Test shell app
ng serve shell

# Test remote MFEs (in separate terminals)
ng serve mfe-pokemon-list
ng serve mfe-pokemon-details
ng serve mfe-pokemon-types
```

---

### Next Steps

Now that your monorepo is set up with the host and remote applications, you can proceed to:

1. **Configure Native Federation** - Set up module federation for dynamic loading
2. **Create Shared Libraries** - Build common models, services, and UI components
3. **Configure Routes** - Set up navigation between MFEs
4. **Implement Features** - Build your Pokemon app functionality

**Continue to the [Native Federation Setup](#native-federation-setup) section below.**

---

## Native Federation Setup

This project uses **@angular-architects/native-federation** for module federation, enabling dynamic loading of micro frontends at runtime.

### Installation

Install the Native Federation plugin:

```bash
npm install @angular-architects/native-federation --save-dev
```

### Shell Application (Host)

The Shell:

- Acts as the container application
- Dynamically loads remote micro frontends at runtime
- Shares common dependencies to avoid duplication
- Runs on port **4200**

#### Initialize Shell with Native Federation

```bash
ng g @angular-architects/native-federation:init --project shell --port 4200 --type host
```

This creates:

- `federation.config.js` - Federation configuration
- Host runtime bootstrap setup
- Shared mappings configuration

#### Create Federation Manifest

For Angular 19+, create `shell/public/federation.manifest.json`:

```json
{
  "mfe-pokemon-list": "http://localhost:4201/remoteEntry.json",
  "mfe-pokemon-details": "http://localhost:4202/remoteEntry.json",
  "mfe-pokemon-types": "http://localhost:4203/remoteEntry.json"
}
```

#### Update Shell's main.ts

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/federation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
```

**Note**: It can be available in shell/src/main.ts as well

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'mfe-pokemon-list': 'http://localhost:4201/remoteEntry.json',
  'mfe-pokemon-details': 'http://localhost:4202/remoteEntry.json',
  'mfe-pokemon-types': 'http://localhost:4203/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));

```

For Each app, `bootstrap.ts file` will be created under `shell/src/bootstrap.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Remote Applications (MFEs)

Each micro frontend:

- Runs independently on its own port (4201, 4202, 4203)
- Exposes components via federation config
- Can be developed and deployed separately
- Shares dependencies with the shell and other remotes

#### Pokemon List MFE (port 4201)

```bash
ng g @angular-architects/native-federation:init --project mfe-pokemon-list --port 4201 --type remote
```

Configure exposures in `mfe-pokemon-list/federation.config.js`:

```javascript
exposes: {
  './Component': './src/app/app.component.ts',
  './Routes': './src/app/app.routes.ts'
}
```

#### Pokemon Details MFE (port 4202)

```bash
ng g @angular-architects/native-federation:init --project mfe-pokemon-details --port 4202 --type remote
```

Configure exposures in `mfe-pokemon-details/federation.config.js`:

```javascript
exposes: {
  './Component': './src/app/app.component.ts',
  './Routes': './src/app/app.routes.ts'
}
```

#### Pokemon Types MFE (port 4203)

```bash
ng g @angular-architects/native-federation:init --project mfe-pokemon-types --port 4203 --type remote
```

Configure exposures in `mfe-pokemon-types/federation.config.js`:

```javascript
exposes: {
  './Component': './src/app/app.component.ts',
  './Routes': './src/app/app.routes.ts'
}
```

### Shared Libraries

The monorepo includes three shared libraries under the namespace `@pokemon-mfe/shared/*`:

- **models** - Data models and interfaces
- **services** - Common services and utilities
- **ui** - Reusable UI components

#### Generate Shared Libraries

Go to root dir: cd angular-mfe-lab

```bash
ng g library models --directory=shared --prefix=pokemon-mfe
ng g library services --directory=shared --prefix=pokemon-mfe
ng g library ui --directory=shared --prefix=pokemon-mfe
```

#### Configure as Shared Singletons

Add to **each app's** `federation.config.js` (Shell + all Remotes):

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  // ... other config
  
  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true, 
      requiredVersion: 'auto' 
    }),
    
    '@pokemon-mfe/shared/models': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    },
    '@pokemon-mfe/shared/services': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    },
    '@pokemon-mfe/shared/ui': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    }
  }
});
```

This ensures:

- No duplication of code
- Single instance of services across all MFEs
- Reusable UI components
- Consistent interfaces/models

### Loading Remotes in the Shell

Configure routes in `shell/src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'pokemon-list',
    loadChildren: () =>
      loadRemoteModule('mfe-pokemon-list', './Routes')
        .then(m => m.routes)
  },
  {
    path: 'pokemon-details',
    loadChildren: () =>
      loadRemoteModule('mfe-pokemon-details', './Routes')
        .then(m => m.routes)
  },
  {
    path: 'pokemon-types',
    loadChildren: () =>
      loadRemoteModule('mfe-pokemon-types', './Routes')
        .then(m => m.routes)
  },
  {
    path: '',
    redirectTo: 'pokemon-list',
    pathMatch: 'full'
  }
];
```

---

## Workspace Structure after Native Federation Setup

```
angular-mfe-lab/
├── projects/
│   ├── shell/                        # Host application
│   │   ├── public/
│   │   │   └── federation.manifest.json  # Remote endpoints
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── main.ts               # Federation init
│   │   │   └── bootstrap.ts          # App bootstrap
│   │   └── federation.config.js      # Federation config
│   │
│   ├── mfe-pokemon-list/             # Remote MFE
│   │   ├── src/
│   │   │   ├── app/
│   │   │   └── main.ts
        |   └── bootstrap.ts          # App bootstrap
│   │   └── federation.config.js      # Exposes components
│   │
│   ├── mfe-pokemon-details/          # Remote MFE
│   │   ├── src/
│   │   └── federation.config.js
│   │
│   ├── mfe-pokemon-types/            # Remote MFE
│   │   ├── src/
│   │   └── federation.config.js
│   │
│   └── libs/
│       └── shared/                   # Shared libraries
│           ├── models/
│           │   ├── src/
│           │       ├── lib/
│           │       └── index.ts
│           │    
│           ├── services/
│           │   └── ...
│           └── ui/
│               └── ...
│
├── angular.json                      # Workspace configuration
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## Development Environment Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Angular CLI 20.3.0

### Package Installation

```bash
# Install dependencies
npm install

# Build shared libraries (required before running apps)
npm run build:libs
```

### Running the Applications

#### Option 1: Run All Applications

Start the shell and all remote MFEs in separate terminals:

```bash
# Terminal 1 - Shell app
ng serve shell

# Terminal 2 - Pokemon List
ng serve mfe-pokemon-list

# Terminal 3 - Pokemon Details
ng serve mfe-pokemon-details

# Terminal 4 - Pokemon Types
ng serve mfe-pokemon-types
```

#### Option 2: Run with Concurrent Commands

Add to root `package.json`:

```json
{
  "scripts": {
    "start:shell": "ng serve shell --port 4200",
    "start:list": "ng serve mfe-pokemon-list --port 4201",
    "start:details": "ng serve mfe-pokemon-details --port 4202",
    "start:types": "ng serve mfe-pokemon-types --port 4203",
    "start:all": "concurrently \"npm:start:shell\" \"npm:start:list\" \"npm:start:details\" \"npm:start:types\""
  }
}
```

Then run:

```bash
npm run start:all
```

#### Option 3: Run Specific Applications

```bash
# Run shell only
ng serve shell

# Run specific remote
ng serve mfe-pokemon-list
```

### Access the Applications

- **Shell Application**: http://localhost:4200
- **Pokemon List (Standalone)**: http://localhost:4201
- **Pokemon Details (Standalone)**: http://localhost:4202
- **Pokemon Types (Standalone)**: http://localhost:4203

---

## Building for Production

### Build Order Matters!

```bash
# 1. Build shared libraries first
npm run build:libs
# or individually:
ng build shared-models
ng build shared-services
ng build shared-ui

# 2. Build remote MFEs
npm run build:mfes
# or individually:
ng build mfe-pokemon-list
ng build mfe-pokemon-details
ng build mfe-pokemon-types

# 3. Build shell application last
npm run build:shell
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests for specific project
ng test shell
ng test mfe-pokemon-list
ng test shared-services
```

---

## Key Technologies

- **Angular 20** - Modern Angular framework
- **Native Federation** - Module Federation for Angular
- **TypeScript** - Type-safe development
- **SCSS** - Styling
- **Standalone Components** - Modern Angular architecture
- **Signals** - Reactive state management

---

## Troubleshooting

### Port Already in Use

- Check the port numbers properly

### Remote Not Loading

- Check that remote MFE is running
- Verify `federation.manifest.json` URLs are correct
- Check browser console for CORS errors
- Ensure `exposes` in remote's `federation.config.js` is correct

### Shared Library Not Working

- Ensure library is built before apps
- Check `singleton: true` in all `federation.config.js`
- Verify import paths match library names in `tsconfig.base.json`

### Federation Manifest Not Found (Angular 19+)

- Ensure `federation.manifest.json` is in `shell/public/` folder
- Check `angular.json` includes public folder in assets
- Verify path in `main.ts` is `/federation.manifest.json`

---

## Learn More

- [Angular Documentation](https://angular.dev)
- [Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Micro Frontend Architecture](https://micro-frontends.org)
- [Module Federation](https://module-federation.io/)

---

## License

MIT

---

**Happy Micro Frontend Development!**
