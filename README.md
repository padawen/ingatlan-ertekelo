# Ingatlanértékelő App

Next.js alkalmazás ingatlan értékelési űrlapokhoz Supabase backend-del.

## 🚀 Gyors Start

```bash
# Klónozás
git clone <repo-url>
cd ingatlan-ertekelo

# Függőségek
npm install

# Environment setup
cp .env.example .env.local
# Töltsd ki a Supabase kulcsokat

# Indítás
npm run dev
```

## 🐳 Docker

```bash
# Environment változók beállítása
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env

# Build & Run
docker-compose up -d
```

## 📱 Használat

- **Admin**: `/login` → `/admin` 
- **Formok**: `/form/igenyfelmeres`, `/form/mutatas/[hash]`, `/form/ertekeles/[hash]`

## 🔧 Tech Stack

- Next.js 14 + TypeScript
- Supabase (Auth + DB)
- Tailwind CSS
- Docker

---
**Production Ready** ✅ 