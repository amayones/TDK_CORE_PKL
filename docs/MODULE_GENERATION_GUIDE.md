# Module Generation Guide

## Command: `make:module`

Usage:
```bash
php artisan make:module {name}
```

Examples:
- `php artisan make:module inventory`
- `php artisan make:module finance-report`

---

## Files Created (11 files total)
Backend (7): Migration, Model, Repository, Service, Controller, Requests (Store/Update), Route
Frontend (3): Service, Page, Modal
Registry (1): Updated `moduleRegistry.js`

---

## Name Conversion

| Input | Module Key | Studly Name | Table Name | Camel Name |
|-------|-----------|-------------|------------|------------|
| `inventory` | `inventory` | `Inventory` | `inventories` | `inventory` |
| `finance-report` | `finance-report` | `FinanceReport` | `finance_reports` | `financeReport` |

---

## Questions Asked

1. **Run migration now?** (default: yes) - Runs `php artisan migrate --force`
2. **Run npm build now?** (default: yes) - Runs `npm run build`
3. **Create menu record?** (default: yes) - Asks: menu name, icon, route path, parent ID, sort order

---

## After make:module - What You MUST Do

1. Edit migration - Add required columns
2. Edit Form Requests - Update validation rules
3. Edit Service - Update createItem/updateItem logic
4. Edit Page component - Customize table columns
5. Edit Modal component - Customize form fields
6. Set menu access - Via Menu Access Management UI

---

## Key Patterns

- Service layer: uses `AuditLog::record()`
- Controller: returns JSON via `$this->success()`
- Frontend service: returns `response.data.data`
- Routes: uses `menu.access:{moduleKey},can_{action}`
- Modal: handles 422 validation errors
