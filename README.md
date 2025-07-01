# Frontend Mobilipiu

Vue.js frontend aplikacija za mobilipiu projekat.

## Pokretanje projekta

### 1. Instalacija dependencies
```bash
npm install
```

### 2. Konfiguracija backend konekcije

Kopiraj `.env.example` fajl u `.env`:
```bash
cp .env.example .env
```

Zatim otvori `.env` fajl i podesi URL-ove prema tome na kom portu ti radi backend-mobilipiu:

```env
# Ako backend radi na portu 8000 (default)
VITE_API_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000

# Ako backend radi na nekom drugom portu (npr. 3000)
# VITE_API_URL=http://localhost:3000/api
# VITE_BACKEND_URL=http://localhost:3000
```

### 3. Pokretanje development servera
```bash
npm run dev
```

Frontend će biti dostupan na: http://localhost:3001

## Funkcionalnosti

- **Javne stranice**: Početna, Proizvodi, O nama, Kontakt, Brendovi
- **Admin panel**: Login, Dashboard, Upravljanje proizvodima
- **API integracija**: Potpuno povezano sa backend-mobilipiu API-jem

## Tehnologije

- Vue.js 3
- Vue Router
- Axios (HTTP client)
- Tailwind CSS
- Vite (build tool)

## API Endpoints

Frontend komunicira sa backend-om preko sledećih endpoint-ova:
- `GET /api/products` - Lista proizvoda
- `GET /api/products/:id` - Detalji proizvoda
- `POST /api/products` - Dodavanje proizvoda (admin)
- `PUT /api/products/:id` - Ažuriranje proizvoda (admin)
- `DELETE /api/products/:id` - Brisanje proizvoda (admin)
- `GET /api/categories` - Lista kategorija
- `GET /api/brands` - Lista brendova
- `POST /api/contact` - Kontakt forma 