# API Documentation

Base URL: `/api/v1`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/logout` | Logout |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset password |

## Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | - | List published products |
| GET | `/products/:slug` | - | Get product by slug |
| GET | `/products/admin` | product:read | List all products (admin) |
| POST | `/products` | product:create | Create product |
| PATCH | `/products/:id` | product:update | Update product |
| PATCH | `/products/:id/status` | product:publish | Update product status |
| DELETE | `/products/:id` | product:delete | Delete product |

## Categories, Cart, Orders, etc.

See route files in `server/src/routes/` for complete endpoint lists.
