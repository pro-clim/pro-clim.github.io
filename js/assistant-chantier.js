
/* ==========================================================
   PRO CLIM — ASSISTANT CHANTIER V3
   Moteur documentaire constructeur
   Daikin : première fiche VRV 5-S vérifiée
   ========================================================== */

(() => {
    "use strict";

    const STORAGE = "proclim_assistant_chantier_v2";
    const $ = id => document.getElementById(id);

    const state = {
        marque: "",
        gamme: "",
        modele: "",
        accessoire: "",
        installation: "",
        fluide: "",
        historique: []
    };

    /* ======================================================
       BASE DOCUMENTAIRE
       Une fiche doit toujours avoir une source vérifiable.
    ====================================================== */

    const DOCUMENTS = [

        {
            id: "daikin-vrv5s-refnet-2024",

            marque: "Daikin",

            gammes: ["VRV 5 S"],

            modeles: [
                "RXYSA4A7V1B",
                "RXYSA5A7V1B",
                "RXYSA6A7V1B",
                "RXYSA4A7Y1B",
                "RXYSA5A7Y1B",
                "RXYSA6A7Y1B"
            ],

            famille: "RXYSA4~6A7V/Y1B",

            sujet: "refnet",

            mots: [
                "refnet",
                "joint refnet",
                "collecteur refnet",
                "derivation frigorifique"
            ],

            valeur:
                "Aucune distance minimale générale entre deux Refnet n'est chiffrée dans la section consultée.",

            conditions:
                "Le guide indique que le montage du kit de dérivation doit suivre le manuel d'installation livré avec le kit. Le joint Refnet peut être monté avec une ramification horizontale ou verticale. Le collecteur Refnet doit être monté avec une ramification horizontale.",

            source:
                "Daikin — Guide de référence installateur et utilisateur VRV 5-S",

            reference:
                "4P600330-1F — édition 2024.10",

            page:
                "Page 91 — section 18.2.8",

            url:
                "https://www.daikin.eu/content/dam/document-library/Installer-reference-guide/ac/vrv/rxysa-av1/RXYSA%284.5.6%29A%28V.Y%291_Installer.User%20reference%20guide_4PEN600330-1F_English.pdf",

            statut: "partiel"
        }

    ];

    /* ======================================================
       SUJETS TECHNIQUES
    ====================================================== */

    const SUJETS = [
        {
            id: "refnet",
            titre: "Dérivations frigorifiques / Refnet",
            mots: [
                "refnet",
                "ref joint",
                "derivation",
                "derivation frigorifique",
                "joint frigorifique",
                "raccord de derivation",
                "collecteur"
            ]
        },
        {
            id: "tuyauterie",
            titre: "Tuyauteries frigorifiques",
            mots: [
                "tuyauterie",
                "longueur de tube",
                "longueur frigorifique",
                "denivele",
                "diametre tube",
                "liaison frigorifique"
            ]
        },
        {
            id: "cassette",
            titre: "Cassette et diffusion d'air",
            mots: [
                "cassette",
                "portee d air",
                "portee air",
                "soufflage",
                "diffusion d air",
                "jet d air"
            ]
        },
        {
            id: "condensats",
            titre: "Évacuation des condensats",
            mots: [
                "condensat",
                "pompe de relevage",
                "relevage",
                "evacuation eau",
                "pente evacuation"
            ]
        },
        {
            id: "electrique",
            titre: "Alimentation électrique",
            mots: [
                "cable",
                "section",
                "disjoncteur",
                "protection electrique",
                "alimentation",
                "intensite",
                "raccordement electrique"
            ]
        },
        {
            id: "degagement",
            titre: "Dégagements et ventilation",
            mots: [
                "degagement",
                "distance",
                "espace",
                "aspiration",
                "soufflage groupe",
                "recirculation"
            ]
        },
        {
            id: "charge",
            titre: "Charge en fluide frigorigène",
            mots: [
                "charge",
                "fluide",
                "appoint",
                "complement de charge",
                "gramme",
                "recharge"
            ]
        },
        {
            id: "mise_en_service",
            titre: "Mise en service",
            mots: [
                "mise en service",
                "tirage au vide",
                "vacuum",
                "epreuve",
                "azote",
                "pression essai"
            ]
        },
        {
            id: "adressage",
            titre: "Adressage et communication",
            mots: [
                "adressage",
                "adresse",
                "communication",
                "bus",
                "transmission",
                "liaison de communication"
            ]
        },
        {
            id: "debit",
            titre: "Débit d'air et gainable",
            mots: [
                "debit d air",
                "debit air",
                "pression statique",
                "gaine",
                "bouche",
                "perte de charge"
            ]
        }
    ];

    /* ======================================================
       MARQUES ET GAMMES
    ====================================================== */

    const MARQUES = {
        "Daikin": [
            "Monosplit",
            "Multisplit",
            "Sky Air",
            "VRV IV",
            "VRV IV+",
            "VRV 5",
            "VRV 5 S",
            "VRV 5 Heat Recovery",
            "Autre / à préciser"
        ],

        "Mitsubishi Electric": [
            "M Series",
            "Multi-split",
            "Mr Slim",
            "City Multi",
            "City Multi R2",
            "City Multi Y",
            "Autre / à préciser"
        ],

        "Mitsubishi Heavy Industries": [
            "Mono-split",
            "Multi-split",
            "KX / VRF",
            "Autre / à préciser"
        ],

        "Samsung": [
            "Mono-split",
            "Multi-split",
            "DVM",
            "Autre / à préciser"
        ],

        "Toshiba": [
            "Mono-split",
            "Multi-split",
            "SMMS",
            "Autre / à préciser"
        ],

        "Panasonic": [
            "Mono-split",
            "Multi-split",
            "ECOi",
            "Autre / à préciser"
        ],

        "Atlantic / Fujitsu": [
            "Mono-split",
            "Multi-split",
            "VRF",
            "Autre / à préciser"
        ],

        "LG": [
            "Mono-split",
            "Multi-split",
            "Multi V",
            "Autre / à préciser"
        ],

        "Hitachi": [
            "Mono-split",
            "Multi-split",
            "Set Free",
            "Autre / à préciser"
        ],

        "Midea": [
            "Mono-split",
            "Multi-split",
            "VRF",
            "Autre / à préciser"
        ],

        "Gree": [
            "Mono-split",
            "Multi-split",
            "GMV",
            "Autre / à préciser"
        ],

        "Haier": [
            "Mono-split",
            "Multi-split",
            "MRV",
            "Autre / à préciser"
        ],

        "Autre": [
            "Autre / à préciser"
        ]
    };

    /* ======================================================
       OUTILS
    ====================================================== */

    function normaliser(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[’']/g, " ")
            .replace(/[^a-z0-9\s/-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function echapper(value) {
        return String(value ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c]);
    }

    function charger() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE) || "{}"
            );

            Object.assign(state, saved);

            if (!Array.isArray(state.historique)) {
                state.historique = [];
            }

        } catch (e) {
            console.warn("Pro Clim : sauvegarde non lisible.");
        }
    }

    function sauvegarder() {
        try {
            localStorage.setItem(
                STORAGE,
                JSON.stringify(state)
            );
        } catch (e) {
            console.warn("Pro Clim : sauvegarde impossible.");
        }
    }

    /* ======================================================
       CRÉATION DE L'INTERFACE
    ====================================================== */

    function creerInterface() {

        const main = document.querySelector("main");
        const accueil = document.querySelector(
            "#pageAccueil .quick-grid"
        );

        if (!main || !accueil) {
            console.warn(
                "Assistant chantier : accueil introuvable."
            );
            return;
        }

        if ($("pageAssistantChantier")) return;

        const card = document.createElement("button");

        card.type = "button";
        card.id = "btnAccueilChantier";
        card.className = "quick-card";

        card.innerHTML = `
            <span>🏗️</span>
            <strong>Assistant chantier</strong>
            <small>Documentation et aide technique</small>
        `;

        accueil.appendChild(card);

        const page = document.createElement("section");

        page.id = "pageAssistantChantier";
        page.className = "page";

        page.innerHTML = `
            <div class="page-title">
                <button type="button" id="chantierRetour"
                    class="btn-back">←</button>
                <div>
                    <span>PRO CLIM • TERRAIN</span>
                    <h2>Assistant chantier</h2>
                </div>
            </div>

            <div class="card">
                <h3>🔧 Identification du matériel</h3>

                <p class="step-description">
                    Renseigne le matériel pour identifier
                    la documentation constructeur adaptée.
                </p>

                <div class="field">
                    <label for="chantierMarque">Constructeur</label>
                    <select id="chantierMarque">
                        <option value="">Choisir une marque</option>
                        ${Object.keys(MARQUES).map(m =>
                            `<option value="${echapper(m)}">${echapper(m)}</option>`
                        ).join("")}
                    </select>
                </div>

                <div class="field">
                    <label for="chantierGamme">Gamme / famille</label>
                    <select id="chantierGamme">
                        <option value="">Choisir d'abord une marque</option>
                    </select>
                </div>

                <div class="field">
                    <label for="chantierModele">
                        Référence exacte
                    </label>
                    <input id="chantierModele"
                        placeholder="Ex. RXYSA4A7V1B / PUHY...">
                </div>

                <div class="field">
                    <label for="chantierAccessoire">
                        Accessoire concerné
                    </label>
                    <input id="chantierAccessoire"
                        placeholder="Ex. KHRQ22M20T / REFNET...">
                </div>

                <div class="field">
                    <label for="chantierInstallation">
                        Type d'installation
                    </label>
                    <select id="chantierInstallation">
                        <option value="">Non renseigné</option>
                        <option>Monosplit</option>
                        <option>Multisplit</option>
                        <option>Gainable</option>
                        <option>Cassette</option>
                        <option>Console</option>
                        <option>Plafonnier</option>
                        <option>DRV / VRF</option>
                        <option>PAC air/eau</option>
                        <option>Autre</option>
                    </select>
                </div>

                <div class="field">
                    <label for="chantierFluide">
                        Fluide frigorigène
                    </label>
                    <select id="chantierFluide">
                        <option value="">Non renseigné</option>
                        <option>R32</option>
                        <option>R410A</option>
                        <option>R454B</option>
                        <option>R290</option>
                        <option>Autre</option>
                    </select>
                </div>

                <button type="button" id="chantierEnregistrer"
                    class="btn-primary">
                    💾 Enregistrer le matériel
                </button>

                <p id="chantierStatut"
                    class="step-description"
                    aria-live="polite"></p>
            </div>

            <div class="card">
                <h3>💬 Question technique</h3>

                <p class="step-description">
                    Pose ta question comme sur le chantier.
                </p>

                <div class="chantier-exemples">

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle distance respecter entre deux Refnet ?">
                        🔩 Distance entre deux Refnet
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle est la longueur maximale de tuyauterie ?">
                        📏 Longueur des liaisons frigorifiques
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle est la portée d'air de cette cassette ?">
                        🌬️ Portée d'air d'une cassette
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle hauteur maximale pour le relevage des condensats ?">
                        💧 Relevage des condensats
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle section de câble et quelle protection électrique ?">
                        ⚡ Section et protection électrique
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle est la charge complémentaire de fluide ?">
                        ❄️ Complément de charge
                    </button>

                    <button type="button" class="chantier-exemple"
                        data-question="Quelle procédure pour la mise en service ?">
                        🧰 Mise en service
                    </button>

                </div>

                <div class="field">
                    <label for="chantierQuestion">Ta question</label>
                    <textarea id="chantierQuestion" rows="4"
                        placeholder="Écris ta question technique..."></textarea>
                </div>

                <button type="button" id="chantierDemander"
                    class="btn-primary">
                    🔎 Analyser la question
                </button>
            </div>

            <div class="card" id="chantierReponse"
                hidden aria-live="polite"></div>

            <div class="card">
                <h3>🕘 Historique</h3>
                <div id="chantierHistorique"></div>

                <button type="button"
                    id="chantierEffacerHistorique"
                    class="btn-secondary">
                    Effacer l'historique
                </button>
            </div>
        `;

        main.appendChild(page);

        if (typeof ROUTER !== "undefined") {
            ROUTER.pages = document.querySelectorAll(".page");
        }

        injecterStyles();
        connecterEvenements();
        restaurerChamps();
        afficherHistorique();
    }

    /* ======================================================
       STYLE
    ====================================================== */

    function injecterStyles() {

        if ($("styleAssistantChantier")) return;

        const style = document.createElement("style");

        style.id = "styleAssistantChantier";

        style.textContent = `
            #pageAssistantChantier .chantier-exemples {
                display:grid;
                gap:8px;
                margin:14px 0;
            }

            #pageAssistantChantier .chantier-exemple {
                width:100%;
                padding:13px;
                border:1px solid #d6e0ed;
                border-radius:10px;
                background:#f4f7fb;
                color:#17365d;
                text-align:left;
                font-size:14px;
            }

            #pageAssistantChantier .chantier-resultat {
                padding:14px;
                border-left:4px solid #0D47A1;
                background:#f3f7fc;
                border-radius:8px;
                line-height:1.6;
                white-space:pre-line;
            }

            #pageAssistantChantier .chantier-alerte {
                padding:12px;
                margin-top:12px;
                background:#fff4df;
                color:#754b00;
                border-radius:8px;
                line-height:1.5;
            }

            #pageAssistantChantier .chantier-ok {
                padding:12px;
                margin-top:12px;
                background:#eaf7ef;
                color:#155b32;
                border-radius:8px;
                line-height:1.5;
            }

            #pageAssistantChantier .chantier-source {
                display:block;
                margin-top:14px;
                padding:12px;
                background:#eef4fb;
                border-radius:8px;
                color:#0D47A1;
                font-weight:600;
                text-decoration:none;
            }

            #pageAssistantChantier .chantier-historique-item {
                padding:10px 0;
                border-bottom:1px solid #e2e8f0;
                font-size:14px;
            }

            #pageAssistantChantier [hidden] {
                display:none !important;
            }
        `;

        document.head.appendChild(style);
    }

    /* ======================================================
       ÉVÉNEMENTS
    ====================================================== */

    function connecterEvenements() {

        $("btnAccueilChantier").addEventListener(
            "click",
            ouvrir
        );

        $("chantierRetour").addEventListener(
            "click",
            () => afficherPage("pageAccueil")
        );

        $("chantierMarque").addEventListener(
            "change",
            () => changerMarque(true)
        );

        $("chantierEnregistrer").addEventListener(
            "click",
            enregistrerMateriel
        );

        $("chantierDemander").addEventListener(
            "click",
            analyserQuestion
        );

        $("chantierEffacerHistorique").addEventListener(
            "click",
            () => {
                state.historique = [];
                sauvegarder();
                afficherHistorique();
            }
        );

        document.querySelectorAll(
            ".chantier-exemple"
        ).forEach(button => {

            button.addEventListener("click", () => {
                $("chantierQuestion").value =
                    button.dataset.question || "";

                $("chantierQuestion").focus();
            });

        });
    }

    /* ======================================================
       GAMMES
    ====================================================== */

    function changerMarque(reinitialiserGamme = true) {

        const marque = $("chantierMarque").value;
        const select = $("chantierGamme");

        select.innerHTML =
            `<option value="">Choisir une gamme</option>`;

        (MARQUES[marque] || []).forEach(gamme => {

            const option = document.createElement("option");

            option.value = gamme;
            option.textContent = gamme;

            select.appendChild(option);
        });

        state.marque = marque;

        if (reinitialiserGamme) {
            state.gamme = "";
        }

        sauvegarder();
    }

    function restaurerChamps() {

        $("chantierMarque").value = state.marque || "";

        changerMarque(false);

        $("chantierGamme").value = state.gamme || "";

        $("chantierModele").value = state.modele || "";

        $("chantierAccessoire").value =
            state.accessoire || "";

        $("chantierInstallation").value =
            state.installation || "";

        $("chantierFluide").value =
            state.fluide || "";
    }

    function lireMateriel() {

        return {
            marque: $("chantierMarque").value,
            gamme: $("chantierGamme").value,
            modele: $("chantierModele").value.trim(),
            accessoire: $("chantierAccessoire").value.trim(),
            installation: $("chantierInstallation").value,
            fluide: $("chantierFluide").value
        };
    }

    function enregistrerMateriel() {

        Object.assign(state, lireMateriel());

        sauvegarder();

        $("chantierStatut").textContent =
            "Matériel enregistré. Tu pourras le retrouver lors de ta prochaine visite.";
    }

    /* ======================================================
       NAVIGATION
    ====================================================== */

    function ouvrir() {
        afficherPage("pageAssistantChantier");
    }

    function afficherPage(id) {

        if (typeof ROUTER !== "undefined") {

            ROUTER.afficher(id);

        } else {

            document.querySelectorAll(".page").forEach(p => {
                p.classList.remove("active");
            });

            $(id)?.classList.add("active");
        }

        window.scrollTo(0, 0);
    }

    /* ======================================================
       IDENTIFICATION DU SUJET
    ====================================================== */

    function identifierSujet(question) {

        const q = normaliser(question);

        for (const sujet of SUJETS) {

            if (
                sujet.mots.some(mot =>
                    q.includes(normaliser(mot))
                )
            ) {
                return sujet;
            }
        }

        return {
            id: "autre",
            titre: "Question technique générale",
            mots: []
        };
    }

    /* ======================================================
       RECHERCHE DOCUMENTAIRE
    ====================================================== */

    function chercherDocument(sujet, materiel) {

        const marque = normaliser(materiel.marque);
        const gamme = normaliser(materiel.gamme);
        const modele = normaliser(materiel.modele);

        return DOCUMENTS.find(doc => {

            const marqueOK =
                normaliser(doc.marque) === marque;

            const gammeOK =
                doc.gammes.some(g =>
                    normaliser(g) === gamme
                );

            const modeleOK =
                doc.modeles.some(ref =>
                    modele === normaliser(ref) ||
                    (
                        modele.length >= 5 &&
                        normaliser(ref).startsWith(modele)
                    )
                );

            return (
                marqueOK &&
                gammeOK &&
                modeleOK &&
                doc.sujet === sujet.id &&
                doc.valeur &&
                doc.source &&
                doc.page &&
                doc.url
            );

        }) || null;
    }

    /* ======================================================
       ANALYSE
    ====================================================== */

    function analyserQuestion() {

        const question =
            $("chantierQuestion").value.trim();

        if (!question) {

            afficherResultat(
                "Question manquante",
                "Écris ta question technique avant de lancer l'analyse.",
                null
            );

            return;
        }

        Object.assign(state, lireMateriel());

        sauvegarder();

        const sujet = identifierSujet(question);
        const materiel = lireMateriel();

        const document = chercherDocument(
            sujet,
            materiel
        );

        state.historique.unshift({
            question,
            sujet: sujet.titre,
            date: new Date().toLocaleString("fr-FR")
        });

        state.historique =
            state.historique.slice(0, 10);

        sauvegarder();

        afficherHistorique();

        if (document) {

            afficherResultat(
                "Documentation constructeur trouvée",
                `
SUJET :
${sujet.titre}

INFORMATION CONSTRUCTEUR :
${document.valeur}

PRESCRIPTIONS :
${document.conditions}

MATÉRIEL CONCERNÉ :
${document.famille}

SOURCE :
${document.source}

RÉFÉRENCE DOCUMENT :
${document.reference}

PAGE :
${document.page}

IMPORTANT :
Cette fiche ne fournit pas de distance minimale chiffrée entre deux Refnet.
Pour une prescription dimensionnelle ou une distance spécifique au kit,
il faut consulter la notice du kit de dérivation exact.
                `,
                document
            );

            return;
        }

        const manque = [];

        if (!materiel.marque) {
            manque.push("la marque");
        }

        if (!materiel.gamme) {
            manque.push("la gamme exacte");
        }

        if (!materiel.modele) {
            manque.push("la référence du matériel");
        }

        let texte = `
SUJET IDENTIFIÉ :
${sujet.titre}

MATÉRIEL :
- Constructeur : ${materiel.marque || "Non renseigné"}
- Gamme : ${materiel.gamme || "Non renseignée"}
- Référence : ${materiel.modele || "Non renseignée"}
- Accessoire : ${materiel.accessoire || "Non renseigné"}
- Installation : ${materiel.installation || "Non renseignée"}
- Fluide : ${materiel.fluide || "Non renseigné"}

`;

        if (manque.length) {

            texte +=
                "Informations manquantes : " +
                manque.join(", ") + ".";

        } else {

            texte +=
                "Le matériel est renseigné, mais aucune fiche constructeur vérifiée correspondant exactement à cette configuration n'est encore intégrée dans Pro Clim.";
        }

        texte += `

Je préfère ne pas fournir de valeur approximative.
Une notice correspondant au modèle et à l'accessoire exacts est nécessaire.
`;

        afficherResultat(
            "Documentation à compléter",
            texte,
            null
        );
    }

    /* ======================================================
       AFFICHAGE DU RÉSULTAT
    ====================================================== */

    function afficherResultat(titre, texte, document) {

        const zone = $("chantierReponse");

        zone.hidden = false;

        const verifie = !!document;

        zone.innerHTML = `
            <h3>
                ${verifie ? "📗" : "📋"}
                ${echapper(titre)}
            </h3>

            <div class="chantier-resultat">
                ${echapper(texte)}
            </div>

            <div class="${verifie ? "chantier-ok" : "chantier-alerte"}">
                <strong>
                    ${verifie
                        ? "Source constructeur identifiée"
                        : "Valeur non vérifiée"}
                </strong>

                <p>
                    ${verifie
                        ? "La fiche est issue d'une documentation constructeur. Vérifie toujours que la configuration réelle correspond à son domaine d'application."
                        : "Aucune valeur fabricant n'est inventée. Une documentation adaptée au modèle exact est nécessaire."}
                </p>
            </div>

            ${verifie ? `
                <a class="chantier-source"
                    href="${echapper(document.url)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    📄 Ouvrir la notice constructeur
                </a>
            ` : ""}
        `;

        zone.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* ======================================================
       HISTORIQUE
    ====================================================== */

    function afficherHistorique() {

        const zone = $("chantierHistorique");

        if (!zone) return;

        if (!state.historique.length) {

            zone.innerHTML =
                `<p class="step-description">Aucune question enregistrée.</p>`;

            return;
        }

        zone.innerHTML = state.historique.map(item => `

            <div class="chantier-historique-item">

                <strong>
                    ${echapper(item.question)}
                </strong>

                <br>

                <small>
                    ${echapper(item.sujet)}
                    — ${echapper(item.date)}
                </small>

            </div>

        `).join("");
    }

    /* ======================================================
       DÉMARRAGE
    ====================================================== */

    charger();

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            creerInterface
        );

    } else {

        creerInterface();
    }

})();
