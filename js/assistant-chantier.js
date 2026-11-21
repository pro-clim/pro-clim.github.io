
/* ==========================================================
   PRO CLIM — ASSISTANT CHANTIER V6
   Menu déroulant des références constructeur
   Daikin VRV 5-S — RXYSA4~6A7V/Y1B
   Recherche documentaire + accessoires Refnet
   ========================================================== */

(() => {
    "use strict";

    const STORAGE = "proclim_assistant_chantier_v2";
    const $ = id => document.getElementById(id);
    const MANUEL = "__manuel__";

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
       BASE DOCUMENTAIRE CONSTRUCTEUR
    ====================================================== */

    const DOCUMENTS = [
        {
            id: "daikin-vrv5s-refnet-rxysa-2024",
            marque: "Daikin",
            gammes: ["VRV 5 S", "VRV 5"],
            modeles: [
                "RXYSA4A7V1B",
                "RXYSA5A7V1B",
                "RXYSA6A7V1B",
                "RXYSA4A7Y1B",
                "RXYSA5A7Y1B",
                "RXYSA6A7Y1B"
            ],
            prefixe: "RXYSA",
            famille: "RXYSA4~6A7V/Y1B",
            sujet: "refnet",
            accessoires: [
                "KHRQ22M20TA",
                "KHRQ22M29H"
            ],
            valeur:
                "Le manuel Daikin donne les critères de sélection des kits Refnet selon la puissance de l'unité extérieure et l'indice de capacité des unités intérieures raccordées en aval.",
            prescriptions: [
                {
                    titre: "Premier Refnet depuis l'unité extérieure",
                    condition: "Groupe extérieur de 4 à 6 HP",
                    kit: "KHRQ22M20TA"
                },
                {
                    titre: "Autres dérivations Refnet",
                    condition: "Indice de capacité total des unités intérieures en aval inférieur à 182",
                    kit: "KHRQ22M20TA"
                },
                {
                    titre: "Collecteur Refnet",
                    condition: "Indice de capacité total des unités intérieures raccordées sous le collecteur inférieur à 182",
                    kit: "KHRQ22M29H"
                }
            ],
            conditions:
                "Le manuel précise qu'un maximum de 8 embranchements peut être raccordé à un collecteur Refnet. Les critères de sélection doivent être appliqués à la configuration réelle du réseau.",
            nonDocumente:
                "La page 27 ne donne aucune distance minimale chiffrée entre deux kits Refnet. Elle traite de la sélection des kits, pas de leur espacement. Ne pas déduire une distance à partir des critères de capacité.",
            source:
                "Daikin — Manuel d'installation et d'utilisation VRV 5-S",
            reference:
                "4PFR600329-1F — édition 2024.10",
            page:
                "Page 27 — section 14.1.5",
            url:
                "https://www.daikin.eu/content/dam/document-library/installation-manuals/rxysa/RXYSA%284.5.6%29A%28V.Y%291_Installation.Operation%20manual_4PFR600329-1F_French.pdf",
            statut: "document constructeur identifié"
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
                "refnet", "ref net", "ref joint",
                "derivation", "derivation frigorifique",
                "joint frigorifique", "raccord de derivation",
                "collecteur", "embranchement frigorifique",
                "distance entre deux refnet",
                "distance entre 2 refnet",
                "espacement refnet", "refnet et coude"
            ]
        },
        {
            id: "tuyauterie",
            titre: "Tuyauteries frigorifiques",
            mots: [
                "tuyauterie", "longueur de tube",
                "longueur frigorifique", "denivele",
                "diametre tube", "liaison frigorifique"
            ]
        },
        {
            id: "cassette",
            titre: "Cassette et diffusion d'air",
            mots: [
                "cassette", "portee d air", "portee air",
                "soufflage", "diffusion d air", "jet d air"
            ]
        },
        {
            id: "condensats",
            titre: "Évacuation des condensats",
            mots: [
                "condensat", "pompe de relevage",
                "relevage", "evacuation eau", "pente evacuation"
            ]
        },
        {
            id: "electrique",
            titre: "Alimentation électrique",
            mots: [
                "cable", "section", "disjoncteur",
                "protection electrique", "alimentation",
                "intensite", "raccordement electrique"
            ]
        },
        {
            id: "degagement",
            titre: "Dégagements et ventilation",
            mots: [
                "degagement", "distance", "espace",
                "aspiration", "soufflage groupe", "recirculation"
            ]
        },
        {
            id: "charge",
            titre: "Charge en fluide frigorigène",
            mots: [
                "charge", "fluide", "appoint",
                "complement de charge", "gramme", "recharge"
            ]
        },
        {
            id: "mise_en_service",
            titre: "Mise en service",
            mots: [
                "mise en service", "tirage au vide",
                "vacuum", "epreuve", "azote", "pression essai"
            ]
        },
        {
            id: "adressage",
            titre: "Adressage et communication",
            mots: [
                "adressage", "adresse", "communication",
                "bus", "transmission", "liaison de communication"
            ]
        },
        {
            id: "debit",
            titre: "Débit d'air et gainable",
            mots: [
                "debit d air", "debit air",
                "pression statique", "gaine",
                "bouche", "perte de charge"
            ]
        }
    ];

    /* ======================================================
       MARQUES ET GAMMES
    ====================================================== */

    const MARQUES = {
        "Daikin": [
            "Monosplit", "Multisplit", "Sky Air",
            "VRV IV", "VRV IV+", "VRV 5",
            "VRV 5 S", "VRV 5 Heat Recovery",
            "Autre / à préciser"
        ],
        "Mitsubishi Electric": [
            "M Series", "Multi-split", "Mr Slim",
            "City Multi", "City Multi R2", "City Multi Y",
            "Autre / à préciser"
        ],
        "Mitsubishi Heavy Industries": [
            "Mono-split", "Multi-split", "KX / VRF",
            "Autre / à préciser"
        ],
        "Samsung": [
            "Mono-split", "Multi-split", "DVM",
            "Autre / à préciser"
        ],
        "Toshiba": [
            "Mono-split", "Multi-split", "SMMS",
            "Autre / à préciser"
        ],
        "Panasonic": [
            "Mono-split", "Multi-split", "ECOi",
            "Autre / à préciser"
        ],
        "Atlantic / Fujitsu": [
            "Mono-split", "Multi-split", "VRF",
            "Autre / à préciser"
        ],
        "LG": [
            "Mono-split", "Multi-split", "Multi V",
            "Autre / à préciser"
        ],
        "Hitachi": [
            "Mono-split", "Multi-split", "Set Free",
            "Autre / à préciser"
        ],
        "Midea": [
            "Mono-split", "Multi-split", "VRF",
            "Autre / à préciser"
        ],
        "Gree": [
            "Mono-split", "Multi-split", "GMV",
            "Autre / à préciser"
        ],
        "Haier": [
            "Mono-split", "Multi-split", "MRV",
            "Autre / à préciser"
        ],
        "Autre": ["Autre / à préciser"]
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

    function codeNormalise(value) {
        return normaliser(value).replace(/[^a-z0-9]/g, "");
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
       RÉFÉRENCES DISPONIBLES POUR LA GAMME
    ====================================================== */

    function referencesDisponibles(marque, gamme) {
        const refs = [];

        DOCUMENTS.forEach(doc => {
            const marqueOK =
                normaliser(doc.marque) === normaliser(marque);

            const gammeOK =
                doc.gammes.some(g =>
                    normaliser(g) === normaliser(gamme)
                );

            if (marqueOK && gammeOK) {
                doc.modeles.forEach(ref => {
                    if (!refs.includes(ref)) refs.push(ref);
                });
            }
        });

        return refs;
    }

    function actualiserReferences(valeurSouhaitee = "") {
        const select = $("chantierModele");
        const saisie = $("chantierModeleManuel");
        const marque = $("chantierMarque").value;
        const gamme = $("chantierGamme").value;

        if (!select || !saisie) return;

        const refs = referencesDisponibles(marque, gamme);

        select.innerHTML =
            `<option value="">Choisir une référence</option>`;

        refs.forEach(ref => {
            const option = document.createElement("option");
            option.value = ref;
            option.textContent = ref;
            select.appendChild(option);
        });

        const optionManuelle = document.createElement("option");
        optionManuelle.value = MANUEL;
        optionManuelle.textContent =
            refs.length
                ? "Autre référence — saisie manuelle"
                : "Référence non répertoriée — saisie manuelle";

        select.appendChild(optionManuelle);

        const valeur = String(valeurSouhaitee || "").trim();
        const correspondance = refs.find(ref =>
            codeNormalise(ref) === codeNormalise(valeur)
        );

        if (correspondance) {
            select.value = correspondance;
            saisie.value = "";
            saisie.hidden = true;
        } else if (valeur) {
            select.value = MANUEL;
            saisie.value = valeur;
            saisie.hidden = false;
        } else {
            select.value = "";
            saisie.value = "";
            saisie.hidden = true;
        }
    }

    function gererChoixReference() {
        const select = $("chantierModele");
        const saisie = $("chantierModeleManuel");

        if (select.value === MANUEL) {
            saisie.hidden = false;
            saisie.focus();
        } else {
            saisie.hidden = true;
            saisie.value = "";
        }

        sauvegarderDepuisChamps();
    }

    function sauvegarderDepuisChamps() {
        if (!$("chantierMarque")) return;
        Object.assign(state, lireMateriel());
        sauvegarder();
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
            console.warn("Assistant chantier : accueil introuvable.");
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
                        Référence du groupe ou de l'unité
                    </label>
                    <select id="chantierModele">
                        <option value="">Choisir d'abord une gamme</option>
                    </select>

                    <input id="chantierModeleManuel"
                        placeholder="Saisir la référence exacte"
                        hidden>
                    <small class="step-description">
                        Les références proposées dépendent de la documentation
                        intégrée dans Pro Clim. Les autres modèles restent
                        saisissables manuellement.
                    </small>
                </div>

                <div class="field">
                    <label for="chantierAccessoire">
                        Accessoire concerné
                    </label>
                    <input id="chantierAccessoire"
                        placeholder="Ex. KHRQ22M20TA / KHRQ22M29H">
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
                        data-question="Quelle distance respecter entre un Refnet et un coude ?">
                        📐 Distance entre Refnet et coude
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quel kit Refnet choisir pour le premier branchement ?">
                        🔧 Choix du premier kit Refnet
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quel kit choisir pour les autres dérivations Refnet ?">
                        🔩 Choix des autres dérivations
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quel collecteur Refnet choisir ?">
                        🔀 Choix du collecteur Refnet
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
            #pageAssistantChantier .chantier-prescription {
                padding:12px;
                margin:10px 0;
                background:#f3f7fc;
                border-radius:8px;
                border-left:3px solid #0D47A1;
                line-height:1.6;
                white-space:pre-line;
            }
            #pageAssistantChantier .chantier-prescription strong {
                display:block;
                margin-bottom:5px;
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
        $("btnAccueilChantier").addEventListener("click", ouvrir);

        $("chantierRetour").addEventListener("click", () =>
            afficherPage("pageAccueil")
        );

        $("chantierMarque").addEventListener("change", () =>
            changerMarque(true)
        );

        $("chantierGamme").addEventListener("change", () => {
            state.gamme = $("chantierGamme").value;
            actualiserReferences("");
            sauvegarderDepuisChamps();
        });

        $("chantierModele").addEventListener(
            "change",
            gererChoixReference
        );

        $("chantierModeleManuel").addEventListener(
            "input",
            sauvegarderDepuisChamps
        );

        [
            "chantierAccessoire",
            "chantierInstallation",
            "chantierFluide"
        ].forEach(id => {
            $(id).addEventListener("change", sauvegarderDepuisChamps);
            $(id).addEventListener("input", sauvegarderDepuisChamps);
        });

        $("chantierEnregistrer").addEventListener(
            "click",
            enregistrerMateriel
        );

        $("chantierDemander").addEventListener(
            "click",
            analyserQuestion
        );

        $("chantierEffacerHistorique").addEventListener("click", () => {
            state.historique = [];
            sauvegarder();
            afficherHistorique();
        });

        document.querySelectorAll(".chantier-exemple").forEach(button => {
            button.addEventListener("click", () => {
                $("chantierQuestion").value =
                    button.dataset.question || "";
                $("chantierQuestion").focus();
            });
        });
    }

    /* ======================================================
       MARQUES ET GAMMES
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
            state.modele = "";
        }

        actualiserReferences(
            reinitialiserGamme ? "" : state.modele
        );

        sauvegarderDepuisChamps();
    }

    function restaurerChamps() {
        $("chantierMarque").value = state.marque || "";

        changerMarque(false);

        $("chantierGamme").value = state.gamme || "";

        actualiserReferences(state.modele || "");

        $("chantierAccessoire").value =
            state.accessoire || "";

        $("chantierInstallation").value =
            state.installation || "";

        $("chantierFluide").value =
            state.fluide || "";
    }

    function lireMateriel() {
        const choix = $("chantierModele").value;

        const modele = choix === MANUEL
            ? $("chantierModeleManuel").value.trim()
            : choix;

        return {
            marque: $("chantierMarque").value,
            gamme: $("chantierGamme").value,
            modele,
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
            if (sujet.mots.some(mot =>
                q.includes(normaliser(mot))
            )) {
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

        let modele = codeNormalise(materiel.modele);

        // Tolérance à la saisie raccourcie « Rysa »
        if (modele === "rysa") modele = "rxysa";

        return DOCUMENTS.find(doc => {
            const marqueOK =
                normaliser(doc.marque) === marque;

            const gammeOK =
                doc.gammes.some(g =>
                    normaliser(g) === gamme
                );

            const modeleExact =
                doc.modeles.some(ref =>
                    modele === codeNormalise(ref)
                );

            const prefixe = codeNormalise(doc.prefixe);

            const modeleFamille =
                modele.length >= 5 &&
                (
                    prefixe.startsWith(modele) ||
                    modele.startsWith(prefixe)
                );

            return marqueOK &&
                gammeOK &&
                (modeleExact || modeleFamille) &&
                doc.sujet === sujet.id;
        }) || null;
    }

    function identifierAccessoire(accessoire, doc) {
        const code = codeNormalise(accessoire);

        if (!code) {
            return {
                renseigne: false,
                reconnu: false,
                code: ""
            };
        }

        const trouve = doc.accessoires.find(ref =>
            codeNormalise(ref) === code
        );

        return {
            renseigne: true,
            reconnu: !!trouve,
            code: trouve || accessoire
        };
    }

    /* ======================================================
       CONSTRUCTION DE LA FICHE REFNET
    ====================================================== */

    function construireFicheRefnet(doc, materiel) {
        const accessoire = identifierAccessoire(
            materiel.accessoire,
            doc
        );

        const lignes = [];

        lignes.push("SUJET :");
        lignes.push("Dérivations frigorifiques / Refnet");
        lignes.push("");
        lignes.push("MATÉRIEL IDENTIFIÉ :");
        lignes.push("Constructeur : " + doc.marque);
        lignes.push("Gamme : VRV 5-S");
        lignes.push("Famille constructeur : " + doc.famille);
        lignes.push(
            "Référence saisie : " +
            (materiel.modele || "Non renseignée")
        );
        lignes.push("");
        lignes.push("SÉLECTION DES KITS REFNET :");
        lignes.push("");

        doc.prescriptions.forEach(item => {
            lignes.push(item.titre);
            lignes.push("Condition : " + item.condition);
            lignes.push("Kit : " + item.kit);
            lignes.push("");
        });

        lignes.push("AUTRE PRESCRIPTION :");
        lignes.push(doc.conditions);
        lignes.push("");
        lignes.push("DISTANCE ENTRE DEUX REFNET :");
        lignes.push(doc.nonDocumente);
        lignes.push("");
        lignes.push("SOURCE CONSTRUCTEUR :");
        lignes.push(doc.source);
        lignes.push("Référence : " + doc.reference);
        lignes.push("Page : " + doc.page);

        const niveau = doc.modeles.some(ref =>
            codeNormalise(ref) === codeNormalise(materiel.modele)
        ) ? "exact" : "famille";

        return {
            texte: lignes.join("\n"),
            accessoire,
            niveau
        };
    }

    /* ======================================================
       ANALYSE DE LA QUESTION
    ====================================================== */

    function analyserQuestion() {
        const question = $("chantierQuestion").value.trim();

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

        const documentTechnique = chercherDocument(
            sujet,
            materiel
        );

        state.historique.unshift({
            question,
            sujet: sujet.titre,
            date: new Date().toLocaleString("fr-FR")
        });

        state.historique = state.historique.slice(0, 10);

        sauvegarder();
        afficherHistorique();

        if (documentTechnique && sujet.id === "refnet") {
            const fiche = construireFicheRefnet(
                documentTechnique,
                materiel
            );

            afficherReponseRefnet(
                question,
                documentTechnique,
                fiche,
                materiel
            );
            return;
        }

        if (documentTechnique) {
            afficherResultat(
                "Documentation constructeur trouvée",
                documentTechnique.valeur,
                documentTechnique
            );
            return;
        }

        const manque = [];

        if (!materiel.marque) manque.push("la marque");
        if (!materiel.gamme) manque.push("la gamme exacte");
        if (!materiel.modele) manque.push("la référence du matériel");

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
                "Pour identifier la bonne documentation, il manque : " +
                manque.join(", ") + ".";
        } else {
            texte +=
                "Le matériel est identifié, mais aucune fiche constructeur vérifiée correspondant à cette configuration n'est encore intégrée dans Pro Clim.";
        }

        texte += `

Aucune valeur technique ne sera inventée.
Une documentation correspondant à la référence et à la configuration réelles est nécessaire.
`;

        afficherResultat(
            "Documentation à compléter",
            texte,
            null
        );
    }

    /* ======================================================
       RÉPONSE CIBLÉE — REFNET
    ====================================================== */

    function afficherReponseRefnet(question, doc, fiche, materiel) {
        const q = normaliser(question);
        const zone = $("chantierReponse");

        const distanceDemandee =
            q.includes("distance") ||
            q.includes("espacement") ||
            q.includes("eloignement") ||
            q.includes("entre deux refnet") ||
            q.includes("entre 2 refnet");

        const coudeDemande =
            q.includes("coude") ||
            q.includes("virage") ||
            q.includes("coud");

        const premierRefnet =
            q.includes("premier") ||
            q.includes("premiere") ||
            q.includes("groupe exterieur");

        const collecteurDemande =
            q.includes("collecteur") ||
            q.includes("header");

        const autresDerivations =
            q.includes("autres derivations") ||
            q.includes("autre derivation") ||
            q.includes("autres refnet");

        const accessoire = fiche.accessoire;

        let titre = "Réponse technique — Refnet";
        let reponse = "";
        let details = "";
        let vigilance = "";
        let niveau = "";

        if (distanceDemandee && !coudeDemande) {
            titre = "Distance entre deux Refnet";

            reponse = `
PRÉVOIR AU MINIMUM 1 MÈTRE ENTRE DEUX REFNET.

Cette valeur correspond à une préconisation technique Daikin retrouvée dans une documentation distincte.

Sur le chantier :
- Mesurer la distance entre les deux dérivations.
- Prévoir 1 m minimum entre deux Refnet.
- Éviter de rapprocher excessivement les raccords.
- Respecter l'orientation et la géométrie de montage prescrites pour les kits.
`;

            details = `
VALIDATION DOCUMENTAIRE :

Le manuel Daikin VRV 5-S RXYSA 4PFR600329-1F, édition 2024.10, page 27, traite de la sélection des kits Refnet.

Cette page ne donne pas de distance minimale chiffrée entre deux Refnet.

La valeur de 1 m provient d'une documentation technique Daikin distincte. Elle constitue une préconisation générale retrouvée, et non une prescription confirmée dans le manuel RXYSA cité ci-dessus.
`;

            niveau =
                "Préconisation technique retrouvée — confirmation modèle à obtenir";

            vigilance = `
Pour un chantier VRV 5-S RXYSA, conserve cette valeur comme préconisation de pose, mais vérifie la documentation technique Daikin applicable à ton installation si tu dois justifier une conformité constructeur.
`;
        } else if (coudeDemande) {
            titre = "Distance entre Refnet et coude";

            reponse = `
PRÉVOIR AU MINIMUM 50 CM ENTRE UN REFNET ET UN COUDE.

Cette valeur correspond à une préconisation technique Daikin retrouvée dans une documentation distincte.

Sur le chantier :
- Mesurer entre le raccord Refnet et le coude.
- Éviter un changement de direction immédiatement après la dérivation.
- Garder une longueur droite suffisante pour réaliser une installation propre.
`;

            details = `
La valeur de 50 cm est issue d'une documentation technique Daikin distincte du manuel RXYSA 4PFR600329-1F.

Elle n'est pas confirmée comme prescription spécifique à la gamme VRV 5-S dans la page 27 du manuel étudié.
`;

            niveau =
                "Préconisation technique retrouvée — portée exacte à confirmer";

            vigilance = `
Ne présente pas cette valeur comme une exigence chiffrée du manuel RXYSA sans confirmation documentaire complémentaire.
`;
        } else if (premierRefnet) {
            titre = "Choix du premier Refnet";

            reponse = `
POUR LE PREMIER REFNET APRÈS LE GROUPE EXTÉRIEUR :

KHRQ22M20TA

Condition constructeur :
groupe extérieur de 4 à 6 HP, selon le tableau de sélection intégré.
`;

            details = `
Source : Daikin VRV 5-S RXYSA, manuel 4PFR600329-1F, édition 2024.10, page 27, section 14.1.5.
`;

            niveau =
                "Prescription présente dans la documentation constructeur intégrée";

            vigilance = `
Cette sélection concerne le premier branchement côté groupe extérieur. Elle ne doit pas être confondue avec le choix des dérivations suivantes. Confirme la référence complète du groupe et la configuration du réseau.
`;
        } else if (collecteurDemande) {
            titre = "Choix du collecteur Refnet";

            reponse = `
COLLECTEUR REFNET :

KHRQ22M29H

Condition constructeur :
indice de capacité total des unités intérieures raccordées en aval inférieur à 182.

Le manuel indique également un maximum de 8 embranchements raccordés à un collecteur.
`;

            details = `
Source : Daikin VRV 5-S RXYSA, manuel 4PFR600329-1F, édition 2024.10, page 27, section 14.1.5.
`;

            niveau =
                "Prescription présente dans la documentation constructeur intégrée";

            vigilance = `
Il faut additionner les indices de capacité des unités intérieures raccordées en aval du collecteur. Ne confonds pas cet indice avec la puissance électrique ou la puissance en kW.
`;
        } else if (autresDerivations) {
            titre = "Choix des autres dérivations Refnet";

            reponse = `
AUTRES DÉRIVATIONS APRÈS LE PREMIER BRANCHEMENT :

KHRQ22M20TA

Condition constructeur :
indice de capacité total des unités intérieures raccordées en aval inférieur à 182.
`;

            details = `
Source : Daikin VRV 5-S RXYSA, manuel 4PFR600329-1F, édition 2024.10, page 27, section 14.1.5.
`;

            niveau =
                "Prescription présente dans la documentation constructeur intégrée";

            vigilance = `
Le choix dépend de l'indice de capacité total des unités situées après la dérivation concernée. Il faut donc connaître la composition réelle du réseau.
`;
        } else {
            titre = "Documentation Refnet Daikin";

            reponse = `
Le matériel correspond à la famille Daikin VRV 5-S RXYSA.

La documentation intégrée permet de retrouver les références des kits Refnet et leurs conditions de sélection.

Pour répondre précisément à ta question, il faut identifier le point recherché : sélection du kit, espacement, orientation, collecteur ou implantation.
`;

            details = fiche.texte;
            niveau = "Documentation constructeur identifiée";

            vigilance = `
Ne pas appliquer automatiquement une prescription issue d'une autre gamme VRV.
`;
        }

        const accessoireTexte = accessoire.renseigne
            ? accessoire.reconnu
                ? `Accessoire saisi : ${accessoire.code} — référence présente dans la fiche documentaire.`
                : `Accessoire saisi : ${accessoire.code} — référence non reconnue dans cette fiche.`
            : "Aucun accessoire renseigné.";

        zone.hidden = false;

        zone.innerHTML = `
            <h3>📗 ${echapper(titre)}</h3>

            <div class="chantier-ok">
                <strong>Réponse chantier</strong>
                <div class="chantier-resultat">
                    ${echapper(reponse)}
                </div>
            </div>

            <div class="chantier-prescription">
                <strong>🔎 Niveau de validation</strong>
                ${echapper(niveau)}
            </div>

            <div class="chantier-prescription">
                <strong>📋 Matériel identifié</strong>
                Constructeur : ${echapper(doc.marque)}<br>
                Gamme : ${echapper(materiel.gamme || "VRV 5-S")}<br>
                Famille : ${echapper(doc.famille)}<br>
                Référence : ${echapper(materiel.modele || "À confirmer")}<br>
                ${echapper(accessoireTexte)}
            </div>

            <div class="chantier-prescription">
                <strong>📚 Origine de l'information</strong>
                ${echapper(details)}
            </div>

            <div class="chantier-alerte">
                <strong>⚠️ À retenir sur le chantier</strong>
                ${echapper(vigilance)}
            </div>

            <a class="chantier-source"
                href="${echapper(doc.url)}"
                target="_blank"
                rel="noopener noreferrer">
                📄 Ouvrir le manuel officiel Daikin VRV 5-S
            </a>
        `;

        zone.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* ======================================================
       AFFICHAGE GÉNÉRAL DU RÉSULTAT
    ====================================================== */

    function afficherResultat(titre, texte, doc) {
        const zone = $("chantierReponse");
        zone.hidden = false;

        const verifie = !!doc;

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
                    href="${echapper(doc.url)}"
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
                <strong>${echapper(item.question)}</strong>
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
