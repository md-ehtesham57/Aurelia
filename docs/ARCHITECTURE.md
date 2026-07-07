# Architecture Overview

## Data Flow

```
Client (React + Vite)
    │
    │ HTTP (axios / RTK Query)
    ▼
Server (Express.js)
    │
    ├── Middleware (auth, RBAC, rate-limit, validation)
    ├── Controllers (request handlers)
    ├── Services (business logic)
    └── Models (Mongoose schemas)
            │
            ▼
        MongoDB
```

## RBAC Flow

```
Request → authenticate (JWT verify) → requirePermission('x:y') → Controller
                                       │
                                       └── Checks user.role.permissions array
```

## Price Calculation

```
Product weight × GoldRateConfig.ratePerGram + Making Charges + GST = Final Price
```

All prices computed server-side. Admins maintain daily gold rates in the dashboard.
