#!/usr/bin/env bash
# ============================================================================
# HUMAN REC — Optimisation des médias (vidéo hero + logos clients)
# ============================================================================
# Usage : bash optimize-media.sh
#
# Pré-requis (à installer avant si manquant) :
#   brew install ffmpeg webp libavif
#
# Ce script :
#   1. Ré-encode videos/chero-bg.mp4 en H.264 plus léger + variante WebM (VP9)
#   2. Convertit chaque logo client PNG en WebP (qualité 82) et AVIF (qualité 60)
#
# Les fichiers originaux sont SAUVEGARDÉS dans .backup/ avant traitement.
# ============================================================================

set -euo pipefail
cd "$(dirname "$0")"

BACKUP_DIR=".backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR/videos" "$BACKUP_DIR/images/clients"

log() { printf "\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()  { printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
err() { printf "\033[1;31m✗ %s\033[0m\n" "$*" >&2; }

# ---------------------------------------------------------------------------
# 1. Vidéo hero
# ---------------------------------------------------------------------------
HERO_SRC="videos/chero-bg.mp4"

if [[ ! -f "$HERO_SRC" ]]; then
    err "Vidéo hero introuvable : $HERO_SRC"
    exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
    err "ffmpeg manquant. Installe avec : brew install ffmpeg"
    exit 1
fi

log "Sauvegarde de la vidéo hero originale"
cp "$HERO_SRC" "$BACKUP_DIR/videos/"

log "Ré-encodage MP4 (H.264, scale 1280, CRF 32, sans audio)"
ffmpeg -y -hide_banner -loglevel error \
    -i "$BACKUP_DIR/videos/chero-bg.mp4" \
    -vf "scale=1280:-2" \
    -c:v libx264 -preset slow -crf 32 \
    -profile:v high -level 4.0 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "videos/chero-bg.mp4"
ok "videos/chero-bg.mp4 → $(du -h videos/chero-bg.mp4 | cut -f1)"

log "Encodage WebM AV1 (libsvtav1, CRF 40)"
ffmpeg -y -hide_banner -loglevel error \
    -i "$BACKUP_DIR/videos/chero-bg.mp4" \
    -vf "scale=1280:-2" \
    -c:v libsvtav1 -crf 40 -preset 6 \
    -pix_fmt yuv420p -an \
    -f webm \
    "videos/chero-bg.webm"
ok "videos/chero-bg.webm → $(du -h videos/chero-bg.webm | cut -f1)"

# ---------------------------------------------------------------------------
# 2. Logos clients : PNG → WebP + AVIF
# ---------------------------------------------------------------------------
CLIENT_DIR="images/clients"
LOGOS=(
    "deliceshow-logo.png"
    "gop-logo.png"
    "alp-logo.png"
    "caron-alain-logo.png"
    "afc-logo.png"
    "lamaizon-logo.png"
)

if ! command -v cwebp >/dev/null 2>&1; then
    err "cwebp manquant. Installe avec : brew install webp"
    exit 1
fi

if ! command -v avifenc >/dev/null 2>&1; then
    err "avifenc manquant. Installe avec : brew install libavif"
    exit 1
fi

for logo in "${LOGOS[@]}"; do
    src="$CLIENT_DIR/$logo"
    if [[ ! -f "$src" ]]; then
        err "Logo introuvable : $src — passé"
        continue
    fi

    base="${logo%.png}"
    cp "$src" "$BACKUP_DIR/$src"

    log "WebP $logo"
    cwebp -quiet -q 82 -m 6 -mt "$src" -o "$CLIENT_DIR/$base.webp"

    log "AVIF $logo"
    avifenc --min 0 --max 60 -j 4 --speed 4 "$src" "$CLIENT_DIR/$base.avif" >/dev/null

    orig=$(du -h "$src" | cut -f1)
    webp=$(du -h "$CLIENT_DIR/$base.webp" | cut -f1)
    avif=$(du -h "$CLIENT_DIR/$base.avif" | cut -f1)
    ok "$logo : PNG $orig → WebP $webp / AVIF $avif"
done

echo
ok "Optimisation terminée. Sauvegardes : $BACKUP_DIR/"
echo "   Vérifie le rendu localement avant de pousser sur Netlify."
