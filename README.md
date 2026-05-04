# HUMAN REC — Site officiel + Blog

Site statique HTML + blog généré par Eleventy + CMS Decap. Hébergement Netlify.

## Architecture

```
HUMANREC/
├── *.html                          ← Pages racine (homepage, services, projets, etc.)
├── services/                       ← Pages services
├── projets/                        ← Pages études de cas
├── images/, videos/, js/, css/     ← Assets
├── _layouts/                       ← Templates Eleventy (Nunjucks)
├── _site/                          ← Build output (généré, ignoré par Git)
├── admin/                          ← Decap CMS interface
│   ├── index.html
│   └── config.yml
├── content/blog/                   ← Articles markdown (édités via Decap)
├── package.json                    ← Dépendances Eleventy
├── .eleventy.js                    ← Config Eleventy
├── netlify.toml                    ← Config build Netlify
├── sitemap.njk                     ← Sitemap dynamique
└── feed.njk                        ← RSS feed
```

## Workflow d'écriture (Sacha)

1. Aller sur `https://humanrec.fr/admin`
2. Se connecter (Netlify Identity)
3. Créer un nouvel article : remplir titre, slug, image header, méta description, contenu markdown
4. Cocher "Brouillon" tant qu'on travaille dessus
5. Quand prêt : décocher "Brouillon" → publier
6. Netlify rebuilde automatiquement en 2-3 min, l'article est en ligne

## Setup initial GitHub + Netlify (à faire une seule fois)

### 1. Créer le repo GitHub

- Aller sur [github.com/new](https://github.com/new)
- Nom : `humanrec-fr` (privé recommandé)
- **NE PAS** initialiser avec README/license (le repo local en a déjà)
- Créer

### 2. Pousser le code local

GitHub te donne deux commandes après création. Lance la deuxième dans le terminal :

```bash
cd /Users/preschesmisky/Desktop/HUMANREC
git remote add origin https://github.com/TON-USERNAME/humanrec-fr.git
git branch -M main
git push -u origin main
```

### 3. Connecter Netlify au repo

- Dashboard Netlify → ton site `humanrec.fr` → **Site settings** → **Build & deploy** → **Continuous deployment**
- Cliquer **Link site to Git**
- Choisir GitHub, autoriser, sélectionner `humanrec-fr`
- Branch : `main`
- Build command : `npm run build` (déjà dans `netlify.toml`)
- Publish directory : `_site` (déjà dans `netlify.toml`)
- Save

À partir de là, chaque `git push` redéploie automatiquement.

### 4. Activer Netlify Identity (pour le CMS)

- Dashboard Netlify → **Site settings** → **Identity** → **Enable Identity**
- Section **Registration** → **Invite only** (pas d'inscription publique)
- Section **External providers** : optionnel (laisse vide pour l'instant)
- Section **Services** → **Git Gateway** → **Enable Git Gateway**

### 5. T'inviter comme administrateur

- Dans **Identity** → **Invite users** → entrer `sacha.preschesmisky@gmail.com`
- Tu reçois un mail avec un lien d'activation
- Clique le lien, crée ton mot de passe
- Tu peux te connecter sur `https://humanrec.fr/admin`

## Commandes locales

```bash
# Installer les dépendances (1 fois)
npm install

# Développer en local (live reload sur localhost:8080)
npm run dev

# Build de production (vérifier avant commit)
npm run build

# Nettoyer le build
npm run clean
```

## Cadence éditoriale

- 2 articles par mois
- 4 catégories : Film publicitaire / Vidéo corporate / Captation événementielle / Photographie
- Tags libres : Guide, Tarifs, Coulisses, Étude de cas, etc.
- Image header obligatoire (1200x630 minimum, JPG ou WebP, < 300 KB)
- Auteur : HUMAN REC (collectif)

## SEO — points de vigilance par article

- Titre : 50-65 caractères, mot-clé principal en début
- Méta description : 120-160 caractères, qui donne envie de cliquer
- Slug : minuscules, tirets, sans accents, mots-clés
- Image alt : descriptive, contient le sujet de l'image
- Mot-clé principal : un seul par article (focus_keyword)
- Liens internes : au moins 2 vers pages services ou projets
- Structure : H1 (auto via titre), puis H2 / H3 hiérarchisés
