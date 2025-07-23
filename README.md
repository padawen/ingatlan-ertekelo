# Ingatlanértékelő Alkalmazás

Ez egy teljes körű Next.js alkalmazás, amelyet ingatlanok kezelésére és ügyfél visszajelzések gyűjtésére terveztek. Az alkalmazás Supabase-t használ adatbázisként és hitelesítéshez.

## 🚀 Funkciók

### 🔐 Hitelesítés
- **`/login`**: Email/jelszó alapú bejelentkezés Supabase-zel
- **`/admin`**: Védett adminisztrációs felület csak hitelesített felhasználóknak

### 👩‍💼 Admin Dashboard (`/admin`)
- **Ingatlan kezelés**: Új ingatlanok létrehozása (helyszín, ár, DH link)
- **Egyedi hash generálás**: nanoid használatával minden ingatlanhoz
- **Ingatlan lista**: Táblázatos megjelenítés a hozzáadott ingatlanokkal
- **Link másolás**: 
  - Mutatás űrlap link: `/form/mutatas/[hash]`
  - Értékelés űrlap link: `/form/ertekeles/[hash]`
- **Válaszok megtekintése**: Beküldött űrlapok száma és részletei

### 📄 Űrlapok

#### `/form/igenyfelmeres` (Önálló)
- Nyilvános űrlap, nem kapcsolódik konkrét ingatlanhoz
- A `teszt.html` dizájnja alapján készült
- Személyes tapasztalatok, család/ingatlan igények, pénzügyi információk

#### `/form/mutatas/[hash]` (Ingatlan-specifikus)
- Ingatlan mutatás utáni visszajelzés
- Általános elégedettség, döntési információk, kapcsolatfelvétel

#### `/form/ertekeles/[hash]` (Ingatlan-specifikus)
- Részletes ingatlan és szolgáltatás értékelés
- Jövőbeli tervek, ajánlások, fejlesztési javaslatok

## 🛠 Technológiai Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Adatbázis**: Supabase
- **Hitelesítés**: Supabase Auth
- **ID generálás**: nanoid
- **TypeScript**: Teljes típus támogatás

## 📦 Telepítés

### 1. Projekt klónozása
\`\`\`bash
git clone <repository-url>
cd rita-dunahouse-app
\`\`\`

### 2. Függőségek telepítése
\`\`\`bash
npm install
\`\`\`

### 3. Supabase projekt beállítása

1. Hozzon létre új projektet a [Supabase Dashboard-on](https://app.supabase.com)
2. Másolja az API URL-t és anon kulcsot
3. Hozza létre a `.env.local` fájlt:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Adatbázis séma létrehozása

1. Nyissa meg a Supabase Dashboard → SQL Editor
2. Másolja és futtassa a `supabase-setup.sql` tartalmát

### 5. Admin felhasználó létrehozása

1. Supabase Dashboard → Authentication → Users
2. Hozzon létre új felhasználót email/jelszó kombinációval
3. Ez lesz az admin hozzáférés

### 6. Alkalmazás indítása
\`\`\`bash
npm run dev
\`\`\`

Az alkalmazás elérhető lesz: `http://localhost:3000`

## 🐳 Docker Telepítés

### Docker Compose használatával (Ajánlott)

1. **Klónozza a repository-t:**
```bash
git clone <repository-url>
cd ingatlanertekelo-app
```

2. **Környezeti változók beállítása:**
```bash
# Hozzon létre .env fájlt a gyökér könyvtárban
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Docker Compose indítása:**
```bash
docker-compose up -d
```

4. **Ellenőrzés:**
```bash
docker-compose ps
```

### Manuális Docker használat

1. **Build:**
```bash
docker build -t ingatlanertekelo .
```

2. **Futtatás:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key \
  ingatlanertekelo
```

### Szerver telepítés

**Ubuntu/Debian szerveren:**

1. **Docker telepítése:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Docker Compose telepítése:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Alkalmazás telepítése:**
```bash
git clone <repository-url>
cd ingatlanertekelo-app
cp .env.local.example .env
# Szerkessze a .env fájlt a valódi értékekkel
docker-compose up -d
```

Az alkalmazás elérhető lesz: `http://your-server-ip:3000`

## 🗄 Adatbázis Séma

### `properties` tábla
| Mező | Típus | Leírás |
|------|-------|---------|
| id | UUID | Elsődleges kulcs |
| location | TEXT | Ingatlan helyszíne |
| price | INTEGER | Ingatlan ára (Ft) |
| dhLink | TEXT | DunaHouse link |
| hash | TEXT | Egyedi azonosító (nanoid) |
| createdBy | TEXT | Létrehozó email címe |
| createdAt | TIMESTAMP | Létrehozás dátuma |

### `form_responses` tábla
| Mező | Típus | Leírás |
|------|-------|---------|
| id | UUID | Elsődleges kulcs |
| formType | TEXT | 'igenyfelmeres', 'mutatas', 'ertekeles' |
| propertyHash | TEXT | Ingatlan hash (nullable) |
| answers | JSONB | Űrlap válaszok JSON formátumban |
| submittedAt | TIMESTAMP | Beküldés dátuma |

## 🔒 Biztonsági Szabályok (RLS)

### Properties tábla
- **Olvasás/Írás/Módosítás/Törlés**: Csak hitelesített felhasználók

### Form_responses tábla
- **Olvasás/Módosítás/Törlés**: Csak hitelesített felhasználók
- **Írás**: Bárki (nyilvános űrlapok miatt)

## 🎯 Használat

### Admin felhasználóként:
1. Jelentkezzen be a `/login` oldalon
2. Adjon hozzá új ingatlanokat az admin felületen
3. Másolja a generált form linkeket
4. Ossza meg az ügyfelekkel a megfelelő linkeket
5. Tekintse meg a beérkezett válaszokat

### Ügyfélként:
1. Töltse ki az igényfelmérő űrlapot: `/form/igenyfelmeres`
2. Értékelje a mutatást: `/form/mutatas/[hash]`
3. Adjon átfogó értékelést: `/form/ertekeles/[hash]`

## 🌐 URL Struktúra

- `/` → Átirányítás az igényfelmérő űrlapra
- `/login` → Admin bejelentkezés
- `/admin` → Admin dashboard (védett)
- `/form/igenyfelmeres` → Önálló igényfelmérő űrlap
- `/form/mutatas/[hash]` → Mutatás értékelő űrlap
- `/form/ertekeles/[hash]` → Részletes értékelő űrlap

## 🎨 Dizájn

Az alkalmazás a `teszt.html` fájlban megadott dizajnt követi:
- **Színpaletta**: Kék-arany kombináció
- **Tipográfia**: Playfair Display (címek) + Raleway (szöveg)
- **Reszponzív**: Teljes mobil és asztali támogatás
- **Interaktivitás**: Smooth animációk és átmenetek

## 📱 Mobil Támogatás

Az alkalmazás teljesen reszponzív és minden eszközön optimálisan működik:
- Mobil telefonok (320px+)
- Tablet-ek (768px+)
- Asztali számítógépek (1024px+)

## 🔧 Fejlesztés

### Új funkció hozzáadása:
1. Módosítsa az adatbázis sémát szükség esetén
2. Frissítse a TypeScript típusokat
3. Implementálja az UI komponenseket
4. Tesztelje a funkcionalitást

### Stílus módosítások:
- A `app/globals.css` tartalmazza az egyedi CSS szabályokat
- A `tailwind.config.js` tartalmazza a színek és egyéb beállítások konfigurációját

## 📞 Támogatás

Ha kérdése van az alkalmazással kapcsolatban, kérjük lépjen kapcsolatba a fejlesztő csapattal.

---

**Verzió**: 1.0.0  
**Utolsó frissítés**: 2024 