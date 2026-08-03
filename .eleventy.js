const pluginRss = require("@11ty/eleventy-plugin-rss");
const { execFileSync } = require("child_process");
const fs = require("fs");

// ==========================================================================
// lastmod : date du dernier commit git d'un fichier (cache en memoire).
// Un lastmod faux pousse Google a ignorer le champ pour tout le site,
// donc on le derive de git plutot que de le coder en dur.
// Repli : date de modification du fichier, puis date du build.
// ==========================================================================
const _lastmodCache = new Map();
function gitLastMod(filePath) {
    if (_lastmodCache.has(filePath)) return _lastmodCache.get(filePath);
    let date = null;
    try {
        if (fs.existsSync(filePath)) {
            const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", filePath], {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
            }).trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(out)) date = out;
        }
    } catch (e) {
        // git indisponible (clone superficiel, etc.) : on passe au repli
    }
    if (!date && fs.existsSync(filePath)) {
        try { date = fs.statSync(filePath).mtime.toISOString().slice(0, 10); } catch (e) { }
    }
    if (!date) date = new Date().toISOString().slice(0, 10);
    _lastmodCache.set(filePath, date);
    return date;
}

module.exports = function (eleventyConfig) {

    // Renvoie la date de derniere modif reelle d'un fichier source.
    // Usage dans un template : {{ "services/index.html" | lastmod }}
    eleventyConfig.addFilter("lastmod", (filePath) => gitLastMod(filePath));

    // ==========================================================================
    // PLUGINS
    // ==========================================================================
    eleventyConfig.addPlugin(pluginRss);

    // ==========================================================================
    // PASSTHROUGH — copie tel quel le site existant + assets
    // ==========================================================================
    eleventyConfig.addPassthroughCopy("*.html");
    eleventyConfig.addPassthroughCopy("services");
    eleventyConfig.addPassthroughCopy("projets");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("videos");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("favicons");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("*.css");
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("*.txt");
    eleventyConfig.addPassthroughCopy("*.json");
    eleventyConfig.addPassthroughCopy("_redirects");
    eleventyConfig.addPassthroughCopy("_headers");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("video-sitemap.xml");

    // ==========================================================================
    // TEMPLATES — uniquement les .md et .njk sont traités
    // ==========================================================================
    eleventyConfig.setTemplateFormats(["md", "njk"]);

    // Exclusions explicites
    eleventyConfig.ignores.add("README.md");
    eleventyConfig.ignores.add("node_modules");
    eleventyConfig.ignores.add("_site");
    eleventyConfig.ignores.add(".git");
    eleventyConfig.ignores.add("backup"); // pages mises en suspens, hors site (non deployees)

    // ==========================================================================
    // FILTRES — utilitaires pour les templates
    // ==========================================================================

    // Date au format français long
    eleventyConfig.addFilter("dateFR", (date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric", month: "long", day: "numeric"
        });
    });

    // Date ISO 8601 (pour Schema.org datePublished)
    eleventyConfig.addFilter("dateISO", (date) => {
        return new Date(date).toISOString();
    });

    // Slugify FR-friendly
    eleventyConfig.addFilter("slugFR", (str) => {
        return String(str).toLowerCase()
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    });

    // Temps de lecture estimé (220 mots/min)
    eleventyConfig.addFilter("readingTime", (content) => {
        const text = String(content || "").replace(/<[^>]+>/g, "");
        const words = text.split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.round(words / 220));
    });

    // Extrait propre (strip HTML, longueur fixe)
    eleventyConfig.addFilter("excerpt", (content, limit) => {
        const text = String(content || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        const lim = limit || 160;
        return text.length > lim ? text.substring(0, lim).trim() + "…" : text;
    });

    // JSON-stringify safe pour Schema.org inline
    eleventyConfig.addFilter("jsonStringify", (data) => {
        return JSON.stringify(data).replace(/</g, "\\u003c");
    });

    // ==========================================================================
    // COLLECTIONS — organisation des articles
    // ==========================================================================

    // Tous les articles publiés
    eleventyConfig.addCollection("posts", (collectionApi) => {
        return collectionApi.getFilteredByGlob("content/blog/*.md")
            .filter(p => !p.data.draft)
            .sort((a, b) => b.date - a.date);
    });

    // Par catégorie (utilisé sur les pages catégorie)
    const categoriesMap = {
        "film_publicitaire": "Film publicitaire",
        "video_promotionnelle": "Vidéo Promotionnelle",
        "captation_evenementielle": "Captation événementielle",
        "photographie": "Photographie",
        "general": "Général"
    };

    Object.entries(categoriesMap).forEach(([key, label]) => {
        eleventyConfig.addCollection(`posts_${key}`, (collectionApi) => {
            return collectionApi.getFilteredByGlob("content/blog/*.md")
                .filter(p => !p.data.draft && p.data.category === label)
                .sort((a, b) => b.date - a.date);
        });
    });

    // ==========================================================================
    // CONFIG FINALE
    // ==========================================================================
    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_layouts",
            data: "_data"
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        markdownItOptions: {
            html: true,
            linkify: true,
            typographer: false
        }
    };
};
