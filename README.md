# Hotel App: React + Express + PostgreSQL

```
frontend/   React (Vite) app: your original UI, now connected to the API
backend/    Express REST API, PostgreSQL via native SQL (pg), images saved on disk
```

## 1. Requirements
- Node.js 20.11 or newer
- PostgreSQL running locally

## 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env        # then edit DB_PASSWORD (and other values) for your PostgreSQL
```
Create the database once (either way):
```bash
createdb hotel_db
# or:  psql -U postgres -c "CREATE DATABASE hotel_db;"
```
Create the table and (optionally) load the 8 sample hotels:
```bash
npm run db:init
npm run db:seed      # optional
npm run dev          # API on http://localhost:5000
```

## 3. Frontend setup
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```
Vite proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra config is needed in development.
For a production build, copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL.

## 4. REST API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST   | `/api/hotels` | Add a hotel (multipart/form-data, optional `image` file) |
| GET    | `/api/hotels` | Fetch hotels with search, filters and pagination |
| GET    | `/api/hotels/:id` | Fetch one hotel |
| PUT    | `/api/hotels/:id` | Update a hotel (send only the fields to change; a new `image` replaces the old one) |
| DELETE | `/api/hotels/:id` | Delete a hotel (and its image file) |
| GET    | `/api/hotels/locations` | Distinct locations (fills the location dropdown) |

### Fields
`title` (required, `hotelName` also accepted), `price` (required), `description`, `latitude`, `longitude`, `location`, `image` (file: jpeg/png/webp/gif, max 5 MB).

### GET /api/hotels query params
| Param | Example | Meaning |
|-------|---------|---------|
| `search` | `sea` | Matches title, description or location (case-insensitive) |
| `location` | `Chennai` | Exact location (case-insensitive) |
| `minPrice` / `maxPrice` | `2000` / `4000` | Price range per night |
| `sort` | `newest` (default), `oldest`, `price_asc`, `price_desc`, `name` | Ordering |
| `page` / `limit` | `2` / `4` | Pagination (limit max 50, default 10) |

Response:
```json
{
  "data": [{ "id": 1, "title": "Hotel 1", "description": "...", "price": 2500,
             "latitude": 28.6139, "longitude": 77.209, "location": "Delhi",
             "image": "/uploads/1727999999999-uuid.jpg",
             "created_at": "...", "updated_at": "..." }],
  "pagination": { "page": 1, "limit": 4, "total": 8, "totalPages": 2, "hasNext": true, "hasPrev": false }
}
```

### Images
Uploaded files are written to `backend/uploads/` with a random name. Only the path (`/uploads/<file>`) is stored in the `image_path` column, and files are served at `GET /uploads/<file>`. Replacing or deleting a hotel removes its old image file.

### Example
```bash
curl -X POST http://localhost:5000/api/hotels \
  -F title="Sea View" -F price=5100 -F location=Chennai \
  -F latitude=13.08 -F longitude=80.27 -F image=@photo.jpg

curl "http://localhost:5000/api/hotels?search=sea&maxPrice=6000&page=1&limit=4"
```

## 5. What changed in the frontend
- `src/api/hotels.js`, `src/hooks/useHotels.js`: API client and data-loading hook (new)
- **Home**: hotels, search and pagination now come from the server. The Hero filters (name, location, max price) and the navbar search (press Enter) update the URL (`/?search=...`)
- **Add Hotel**: sends `FormData` (with the image) to `POST /api/hotels`; new optional **Location** field
- **Update Hotel / Delete Hotel**: list from the API, save via `PUT`, remove via `DELETE`
- `vite.config.js`: dev proxy to the backend
- Fixed the import `./Component/FormPage/Form` to `./Component/Formpage/Form` to match the real folder name (the old path fails on Linux/macOS)
