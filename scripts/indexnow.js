// ── IndexNow : notifie Bing (et Yandex, Seznam...) des URLs du site ──────────
// Lance automatiquement apres chaque build de production sur Netlify.
// Google ne supporte PAS IndexNow : il continue de passer par le sitemap.
//
// Lancement manuel possible : node scripts/indexnow.js
// Forcer hors production : INDEXNOW_FORCE=1 node scripts/indexnow.js

const fs = require('fs');
const path = require('path');

const HOST = 'humanrec.fr';
const KEY = 'c6b34b09992eee23b1dd2ba4ddce32ae';
const SITEMAP = path.join(__dirname, '..', '_site', 'sitemap.xml');

// N'envoie QUE sur un build de production Netlify (CONTEXT=production).
// Les builds locaux et les deploy previews sont ignores, pour ne pas
// notifier Bing a chaque build de developpement.
const ctx = process.env.CONTEXT; // "production" | "deploy-preview" | "branch-deploy" | undefined en local
const forced = process.env.INDEXNOW_FORCE === '1';
if (!forced && ctx !== 'production') {
    console.log(`[indexnow] contexte "${ctx || 'local'}" : envoi ignore (production uniquement)`);
    process.exit(0);
}

if (!fs.existsSync(SITEMAP)) {
    console.log('[indexnow] sitemap introuvable, envoi ignore');
    process.exit(0);
}

const xml = fs.readFileSync(SITEMAP, 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].trim())
    .filter(u => u.startsWith(`https://${HOST}/`));

if (urlList.length === 0) {
    console.log('[indexnow] aucune URL trouvee, envoi ignore');
    process.exit(0);
}

const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
};

fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
})
    .then(res => {
        if (res.status === 200 || res.status === 202) {
            console.log(`[indexnow] OK (${res.status}) : ${urlList.length} URLs notifiees a Bing`);
        } else {
            // Non bloquant : on ne fait jamais echouer le deploiement pour ca
            console.warn(`[indexnow] reponse inattendue (${res.status}), ignoree`);
        }
    })
    .catch(err => {
        console.warn('[indexnow] echec reseau, ignore :', err.message);
    });
