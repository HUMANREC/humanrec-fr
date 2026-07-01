const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

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
