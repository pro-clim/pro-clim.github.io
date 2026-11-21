
/* ==========================================================
   PRO CLIM — ASSISTANT CHANTIER V2
   Moteur documentaire multi-marques
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
       Une fiche ne devient exploitable que si elle possède
       une valeur, une configuration et une source vérifiées.
    ====================================================== */

    const DOCUMENTS = [];

    /*
      FORMAT POUR AJOUTER UNE FUTURE FICHE :

      {
        id: "daikin-vrv-exemple",
        marque: "Daikin",
        gamme: "VRV 5",
        modele: "Référence exacte",
        sujet: "refnet",
        mots: ["refnet", "derivation"],
        valeur: "Valeur vérifiée",
        conditions: "Conditions précises",
        source: "Nom du manuel constructeur",
        page: "Page du document",
        url: "Lien officiel"
      }

      Ne jamais ajouter une valeur sans notice vérifiée.
    */

    const SUJETS = [
        {
            id: "refnet",
            titre: "Dérivations frigorifiques / Refnet",
            mots: ["refnet", "ref joint", "derivation", "derivation frigorifique", "joint frigorifique", "raccord de derivation"]
        },
        {
            id: "tuyauterie",
            titre: "Tuyauteries frigorifiques",
            mots: ["tuyauterie", "longueur de tube", "longueur frigorifique", "denivele", "diametre tube", "liaison frigorifique"]
        },
        {
            id: "cassette",
            titre: "Cassette et diffusion d'air",
            mots: ["cassette", "portee d air", "portee air", "soufflage", "diffusion d air", "jet d air"]
        },
        {
            id: "condensats",
            titre: "Évacuation des condensats",
            mots: ["condensat", "pompe de relevage", "relevage", "evacuation eau", "pente evacuation"]
        },
        {
            id: "electrique",
            titre: "Alimentation électrique",
            mots: ["cable", "section", "disjoncteur", "protection electrique", "alimentation", "intensite", "raccordement electrique"]
        },
        {
            id: "degagement",
            titre: "Dégagements et ventilation",
            mots: ["degagement", "distance", "espace", "aspiration", "soufflage groupe", "recirculation"]
        },
        {
            id: "charge",
            titre: "Charge en fluide frigorigène",
            mots: ["charge", "fluide", "appoint", "complement de charge", "gramme", "recharge"]
        },
        {
            id: "mise_en_service",
            titre: "Mise en service",
            mots: ["mise en service", "tirage au vide", "vacuum", "epreuve", "azote", "pression essai"]
        },
        {
            id: "adressage",
            titre: "Adressage et communication",
            mots: ["adressage", "adresse", "communication", "bus", "transmission", "liaison de communication"]
        },
        {
            id: "debit",
            titre: "Débit d'air et gainable",
            mots: ["debit d air", "debit air", "pression statique", "gaine", "bouche", "perte de charge"]
        }
    ];

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
            const saved = JSON.parse(localStorage.getItem(STORAGE) || "{}");
            Object.assign(state, saved);
        } catch (e) {
            console.warn("Pro Clim : sauvegarde Assistant non lisible.");
        }
    }

    function sauvegarder() {
        try {
            localStorage.setItem(STORAGE, JSON.stringify(state));
        } catch (e) {
            console.warn("Pro Clim : sauvegarde impossible.");
        }
    }

    /* ======================================================
       CRÉATION DE L'INTERFACE
    ====================================================== */

    function creerInterface() {
        const main = document.querySelector("main");
        const accueil = document.querySelector("#pageAccueil .quick-grid");

        if (!main || !accueil) {
            console.warn("Assistant chantier : zone d'accueil introuvable.");
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
                    Renseigne le matériel concerné pour éviter
                    les erreurs de gamme et de génération.
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
                    <label for="chantierModele">Référence exacte</label>
                    <input id="chantierModele"
                           placeholder="Ex. RXYQ... / PUHY... / FTXM...">
                </div>

                <div class="field">
                    <label for="chantierAccessoire">Accessoire concerné</label>
                    <input id="chantierAccessoire"
                           placeholder="Ex. REFNET, kit de dérivation...">
                </div>

                <div class="field">
                    <label for="chantierInstallation">Type d'installation</label>
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
                    <label for="chantierFluide">Fluide frigorigène</label>
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
                <p id="chantierStatut" class="step-description"
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
                        placeholder="Ex. Quelle distance entre deux Refnet sur cette installation ?"></textarea>
                </div>

                <button type="button" id="chantierDemander"
                        class="btn-primary">
                    🔎 Analyser la question
                </button>
            </div>

            <div class="card" id="chantierReponse" hidden
                 aria-live="polite"></div>

            <div class="card">
                <h3>🕘 Historique</h3>
                <div id="chantierHistorique"></div>
                <button type="button" id="chantierEffacerHistorique"
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
                line-height:1.55;
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
        $("btnAccueilChantier").addEventListener("click", ouvrir);
        $("chantierRetour").addEventListener("click", () => afficherPage("pageAccueil"));

        $("chantierMarque").addEventListener("change", changerMarque);

        $("chantierEnregistrer").addEventListener("click", enregistrerMateriel);
        $("chantierDemander").addEventListener("click", analyserQuestion);

        $("chantierEffacerHistorique").addEventListener("click", () => {
            state.historique = [];
            sauvegarder();
            afficherHistorique();
        });

        document.querySelectorAll(".chantier-exemple").forEach(button => {
            button.addEventListener("click", () => {
                $("chantierQuestion").value = button.dataset.question || "";
                $("chantierQuestion").focus();
            });
        });
    }

    function changerMarque() {
        const marque = $("chantierMarque").value;
        const select = $("chantierGamme");

        select.innerHTML = `<option value="">Choisir une gamme</option>`;

        (MARQUES[marque] || []).forEach(gamme => {
            const option = document.createElement("option");
            option.value = gamme;
            option.textContent = gamme;
            select.appendChild(option);
        });

        state.marque = marque;
        state.gamme = "";
        sauvegarder();
    }

    function restaurerChamps() {
        $("chantierMarque").value = state.marque || "";
        changerMarque();

        $("chantierGamme").value = state.gamme || "";
        $("chantierModele").value = state.modele || "";
        $("chantierAccessoire").value = state.accessoire || "";
        $("chantierInstallation").value = state.installation || "";
        $("chantierFluide").value = state.fluide || "";
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

    function ouvrir() {
        afficherPage("pageAssistantChantier");
    }

    function afficherPage(id) {
        if (typeof ROUTER !== "undefined") {
            ROUTER.afficher(id);
        } else {
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            $(id)?.classList.add("active");
        }
        window.scrollTo(0, 0);
    }

    /* ======================================================
       ANALYSE DE LA QUESTION
    ====================================================== */

    function identifierSujet(question) {
        const q = normaliser(question);

        for (const sujet of SUJETS) {
            if (sujet.mots.some(mot => q.includes(normaliser(mot)))) {
                return sujet;
            }
        }

        return {
            id: "autre",
            titre: "Question technique générale"
        };
    }

    function chercherDocument(sujet, materiel) {
        const marque = normaliser(materiel.marque);
        const gamme = normaliser(materiel.gamme);
        const modele = normaliser(materiel.modele);

        return DOCUMENTS.find(doc => {
            return normaliser(doc.marque) === marque &&
                normaliser(doc.gamme) === gamme &&
                normaliser(doc.modele) === modele &&
                doc.sujet === sujet.id &&
                doc.valeur &&
                doc.source &&
                doc.page;
        }) || null;
    }

    function analyserQuestion() {
        const question = $("chantierQuestion").value.trim();

        if (!question) {
            afficherResultat(
                "Question manquante",
                "Écris ta question technique avant de lancer l'analyse.",
                false
            );
            return;
        }

        Object.assign(state, lireMateriel());
        sauvegarder();

        const sujet = identifierSujet(question);
        const materiel = lireMateriel();
        const document = chercherDocument(sujet, materiel);

        let titre;
        let texte;
        let verifie = false;

        if (document) {
            titre = "Prescription constructeur trouvée";
            texte = `
VALEUR : ${document.valeur}

CONDITIONS D'APPLICATION :
${document.conditions || "Voir la notice constructeur."}

SOURCE :
${document.source}

PAGE :
${document.page}
`;
            verifie = true;
        } else {
            const manque = [];

            if (!materiel.marque) manque.push("la marque");
            if (!materiel.gamme) manque.push("la gamme exacte");
            if (!materiel.modele) manque.push("la référence du matériel");

            titre = "Documentation à vérifier";

            texte = `
Sujet identifié : ${sujet.titre}

Matériel :
- Constructeur : ${materiel.marque || "Non renseigné"}
- Gamme : ${materiel.gamme || "Non renseignée"}
- Référence : ${materiel.modele || "Non renseignée"}
- Accessoire : ${materiel.accessoire || "Non renseigné"}
- Installation : ${materiel.installation || "Non renseignée"}
- Fluide : ${materiel.fluide || "Non renseigné"}

${manque.length
    ? "Pour poursuivre, il me manque : " + manque.join(", ") + "."
    : "Le matériel est identifié, mais aucune fiche constructeur vérifiée correspondant exactement à cette configuration n'est encore intégrée dans la base Pro Clim."}

Je préfère te demander une précision plutôt que de te donner une valeur approximative.
`;
        }

        state.historique.unshift({
            question,
            sujet: sujet.titre,
            date: new Date().toLocaleString("fr-FR")
        });

        state.historique = state.historique.slice(0, 10);
        sauvegarder();

        afficherHistorique();
        afficherResultat(titre, texte, verifie);
    }

    /* ======================================================
       AFFICHAGE DES RÉSULTATS
    ====================================================== */

    function afficherResultat(titre, texte, verifie) {
        const zone = $("chantierReponse");
        zone.hidden = false;

        zone.innerHTML = `
            <h3>${verifie ? "📗" : "📋"} ${echapper(titre)}</h3>
            <div class="chantier-resultat">${echapper(texte)}</div>
            <div class="${verifie ? "chantier-ok" : "chantier-alerte"}">
                <strong>${verifie
                    ? "Source constructeur identifiée"
                    : "⚠️ Valeur non vérifiée"}</strong><br>
                ${verifie
                    ? "Vérifie que les conditions réelles du chantier correspondent bien à cette fiche."
                    : "Aucune valeur fabricant n'est inventée. Une notice correspondant au modèle exact est nécessaire pour valider la prescription."}
            </div>
        `;

        zone.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function afficherHistorique() {
        const zone = $("chantierHistorique");
        if (!zone) return;

        if (!state.historique.length) {
            zone.innerHTML = `<p class="step-description">Aucune question enregistrée.</p>`;
            return;
        }

        zone.innerHTML = state.historique.map(item => `
            <div class="chantier-historique-item">
                <strong>${echapper(item.question)}</strong><br>
                <small>${echapper(item.sujet)} — ${echapper(item.date)}</small>
            </div>
        `).join("");
    }

    /* ======================================================
       DÉMARRAGE
    ====================================================== */

    charger();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", creerInterface);
    } else {
        creerInterface();
    }

})();
