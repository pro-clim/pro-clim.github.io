
/* ==========================================================
   PRO CLIM — ASSISTANT CHANTIER
   Module indépendant du diagnostic
   Version 1.0
   ========================================================== */

(() => {
    "use strict";

    const STORAGE_KEY = "proclim_assistant_chantier_v1";

    const $ = id => document.getElementById(id);

    const state = {
        marque: "",
        modele: "",
        installation: "",
        fluide: "",
        historique: []
    };

    function charger() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            Object.assign(state, saved);
        } catch (e) {
            console.warn("Assistant chantier : données non récupérées.");
        }
    }

    function sauvegarder() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn("Assistant chantier : sauvegarde impossible.");
        }
    }

    function creerInterface() {
        const main = document.querySelector("main");
        const accueil = document.querySelector("#pageAccueil .quick-grid");

        if (!main || !accueil || $("pageAssistantChantier")) return;

        // Accès depuis l'accueil
        const card = document.createElement("button");
        card.type = "button";
        card.id = "btnAccueilChantier";
        card.className = "quick-card";
        card.innerHTML = `
            <span>🏗️</span>
            <strong>Assistant chantier</strong>
            <small>Aide technique et installation</small>
        `;
        accueil.appendChild(card);

        // Nouvelle page
        const page = document.createElement("section");
        page.id = "pageAssistantChantier";
        page.className = "page";

        page.innerHTML = `
            <div class="page-title">
                <button type="button"
                        id="chantierRetour"
                        class="btn-back">←</button>
                <div>
                    <span>ASSISTANCE TERRAIN</span>
                    <h2>Assistant chantier</h2>
                </div>
            </div>

            <div class="card">
                <span class="step-icon">🏗️</span>
                <h3>Ton équipement</h3>
                <p class="step-description">
                    Renseigne le matériel pour obtenir des réponses
                    adaptées à ton installation.
                </p>

                <div class="field">
                    <label for="chantierMarque">Marque</label>
                    <select id="chantierMarque">
                        <option value="">Sélectionner une marque</option>
                        <option>Daikin</option>
                        <option>Mitsubishi Electric</option>
                        <option>Mitsubishi Heavy Industries</option>
                        <option>Samsung</option>
                        <option>Atlantic / Fujitsu</option>
                        <option>LG</option>
                        <option>Panasonic</option>
                        <option>Toshiba</option>
                        <option>Hitachi</option>
                        <option>Midea</option>
                        <option>Gree</option>
                        <option>Haier</option>
                        <option>Autre</option>
                    </select>
                </div>

                <div class="field">
                    <label for="chantierModele">Référence exacte du matériel</label>
                    <input id="chantierModele"
                           type="text"
                           placeholder="Ex. FTXM35A / RXM35A">
                </div>

                <div class="field">
                    <label for="chantierInstallation">Type d'installation</label>
                    <select id="chantierInstallation">
                        <option value="">Sélectionner</option>
                        <option>Split mural</option>
                        <option>Multi-split</option>
                        <option>Cassette</option>
                        <option>Gainable</option>
                        <option>Console</option>
                        <option>Plafonnier</option>
                        <option>DRV / VRV</option>
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

                <button type="button"
                        id="chantierEnregistrer"
                        class="btn-primary">
                    💾 Enregistrer mon équipement
                </button>

                <p id="chantierStatut"
                   class="step-description"
                   aria-live="polite"></p>
            </div>

            <div class="card">
                <span class="step-icon">💬</span>
                <h3>Quelle est ta question ?</h3>
                <p class="step-description">
                    Pose ta question comme tu le ferais à un collègue.
                </p>

                <div class="chantier-exemples">
                    <button type="button" class="chantier-exemple"
                        data-question="Quelle est la portée d'air de cette cassette ?">
                        🌬️ Portée d'air d'une cassette
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quelle distance respecter entre deux Refnet ?">
                        🔧 Distance entre deux Refnet
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quelle longueur maximale de tuyauterie est autorisée ?">
                        📏 Longueur de tuyauterie
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quelle hauteur de relevage pour la pompe à condensats ?">
                        💧 Pompe à condensats
                    </button>
                    <button type="button" class="chantier-exemple"
                        data-question="Quelle section de câble et quelle protection électrique prévoir ?">
                        ⚡ Alimentation électrique
                    </button>
                </div>

                <div class="field">
                    <label for="chantierQuestion">Ta question</label>
                    <textarea id="chantierQuestion"
                              rows="4"
                              placeholder="Ex. Quelle distance entre deux Refnet sur cette installation ?"></textarea>
                </div>

                <button type="button"
                        id="chantierDemander"
                        class="btn-primary">
                    🔎 Analyser ma question
                </button>
            </div>

            <div id="chantierReponse"
                 class="card"
                 aria-live="polite"
                 hidden>
            </div>

            <div class="card">
                <h3>Dernières questions</h3>
                <div id="chantierHistorique">
                    <p class="step-description">Aucune question enregistrée.</p>
                </div>
                <button type="button"
                        id="chantierEffacerHistorique"
                        class="btn-secondary">
                    Effacer l'historique
                </button>
            </div>
        `;

        main.appendChild(page);

        // Le routeur doit aussi connaître cette nouvelle page.
        if (typeof ROUTER !== "undefined") {
            ROUTER.pages = document.querySelectorAll(".page");
        }

        injecterStyles();
        connecterEvenements();
        afficherEquipement();
        afficherHistorique();
    }

    function injecterStyles() {
        if ($("styleAssistantChantier")) return;

        const style = document.createElement("style");
        style.id = "styleAssistantChantier";

        style.textContent = `
            #pageAssistantChantier .chantier-exemples {
                display: grid;
                gap: 9px;
                margin: 15px 0;
            }

            #pageAssistantChantier .chantier-exemple {
                width: 100%;
                padding: 13px;
                border: 1px solid #d6e0ed;
                border-radius: 10px;
                background: #f4f7fb;
                color: #17365d;
                text-align: left;
                font-size: 14px;
            }

            #pageAssistantChantier .chantier-reponse {
                border-left: 4px solid #0D47A1;
                padding: 12px;
                background: #f3f7fc;
                border-radius: 8px;
                line-height: 1.55;
                white-space: pre-line;
            }

            #pageAssistantChantier .chantier-alerte {
                margin-top: 12px;
                padding: 12px;
                background: #fff4df;
                border-radius: 8px;
                color: #754b00;
                line-height: 1.5;
            }

            #pageAssistantChantier .chantier-historique-item {
                padding: 10px 0;
                border-bottom: 1px solid #e2e8f0;
                font-size: 14px;
            }

            #pageAssistantChantier [hidden] {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    function connecterEvenements() {
        $("btnAccueilChantier")?.addEventListener("click", ouvrir);
        $("chantierRetour")?.addEventListener("click", () => afficherPage("pageAccueil"));

        $("chantierEnregistrer")?.addEventListener("click", enregistrerEquipement);
        $("chantierDemander")?.addEventListener("click", analyserQuestion);

        $("chantierEffacerHistorique")?.addEventListener("click", () => {
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

    function afficherPage(id) {
        if (typeof ROUTER !== "undefined") {
            ROUTER.afficher(id);
        } else {
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            $(id)?.classList.add("active");
        }

        window.scrollTo(0, 0);
    }

    function ouvrir() {
        afficherPage("pageAssistantChantier");
    }

    function afficherEquipement() {
        $("chantierMarque").value = state.marque || "";
        $("chantierModele").value = state.modele || "";
        $("chantierInstallation").value = state.installation || "";
        $("chantierFluide").value = state.fluide || "";
    }

    function enregistrerEquipement() {
        state.marque = $("chantierMarque").value.trim();
        state.modele = $("chantierModele").value.trim();
        state.installation = $("chantierInstallation").value;
        state.fluide = $("chantierFluide").value;

        sauvegarder();

        $("chantierStatut").textContent =
            "Équipement enregistré. Il sera conservé pour tes prochaines questions.";
    }

    function analyserQuestion() {
        const question = $("chantierQuestion").value.trim();

        if (!question) {
            afficherReponse(
                "Écris d'abord ta question.",
                "Il me faut une question technique pour commencer."
            );
            return;
        }

        enregistrerEquipementSilencieux();

        const q = normaliser(question);
        const equipement = obtenirEquipement();
        const analyse = identifierSujet(q);

        const resultat = construireReponse(analyse, equipement);

        const entree = {
            question,
            sujet: analyse.titre,
            date: new Date().toLocaleString("fr-FR")
        };

        state.historique.unshift(entree);
        state.historique = state.historique.slice(0, 8);

        sauvegarder();
        afficherHistorique();
        afficherReponse(analyse.titre, resultat);
    }

    function enregistrerEquipementSilencieux() {
        state.marque = $("chantierMarque").value.trim();
        state.modele = $("chantierModele").value.trim();
        state.installation = $("chantierInstallation").value;
        state.fluide = $("chantierFluide").value;
        sauvegarder();
    }

    function obtenirEquipement() {
        return {
            marque: state.marque || "Non renseignée",
            modele: state.modele || "Non renseigné",
            installation: state.installation || "Non renseignée",
            fluide: state.fluide || "Non renseigné"
        };
    }

    function normaliser(texte) {
        return texte
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function identifierSujet(q) {
        if (/refnet|ref joint|raccord de derivation|derivation frigorifique/.test(q)) {
            return { id: "refnet", titre: "Distance entre Refnet" };
        }

        if (/portee d air|portee air|soufflage|jet d air|cassette/.test(q)) {
            return { id: "air", titre: "Portée d'air et soufflage" };
        }

        if (/condensat|relevage|pompe a condensat|evacuation eau/.test(q)) {
            return { id: "condensats", titre: "Évacuation des condensats" };
        }

        if (/longueur|tuyauterie|liaison frigorifique|denivele|denivele/.test(q)) {
            return { id: "tuyauterie", titre: "Tuyauteries frigorifiques" };
        }

        if (/cable|cablage|section|disjoncteur|protection electrique|alimentation/.test(q)) {
            return { id: "electrique", titre: "Alimentation électrique" };
        }

        if (/degagement|distance|espace|aspiration|soufflage groupe|ventilation groupe/.test(q)) {
            return { id: "degagement", titre: "Dégagements et ventilation" };
        }

        if (/fluide|charge|appoint|complement de charge|gramme/.test(q)) {
            return { id: "charge", titre: "Charge en fluide frigorigène" };
        }

        return { id: "autre", titre: "Question technique générale" };
    }

    function construireReponse(sujet, e) {
        const materiel = `
Matériel renseigné :
- Marque : ${e.marque}
- Référence : ${e.modele}
- Installation : ${e.installation}
- Fluide : ${e.fluide}
`;

        const reponses = {
            refnet: `
Pour déterminer l'espacement entre deux Refnet, il faut vérifier le schéma de tuyauterie et les prescriptions du fabricant.

Les points à contrôler :
1. La référence exacte du kit de dérivation.
2. Le diamètre des tubes en amont et en aval.
3. La position et l'orientation des dérivations.
4. Les longueurs droites exigées avant et après le raccord.
5. Les prescriptions propres à la gamme DRV/VRV.

Je ne donne pas de distance chiffrée sans la notice correspondant à cette installation.
`,

            air: `
La portée d'air d'une cassette dépend notamment :
1. De la référence exacte de la cassette.
2. De la hauteur de pose.
3. Du débit d'air et de la vitesse de ventilation.
4. De la position des volets de soufflage.
5. De la température et de la configuration du local.

Il n'existe pas une portée universelle valable pour toutes les cassettes.

Il faut retrouver les données de portée ou de diffusion dans la fiche technique du modèle exact.
`,

            condensats: `
Pour vérifier une évacuation de condensats, il faut connaître :
1. Le modèle de l'unité intérieure.
2. Si l'évacuation fonctionne par gravité ou par pompe.
3. La hauteur verticale à relever.
4. La longueur et le cheminement du tuyau.
5. Le diamètre et la pente prescrits.
6. La hauteur de relevage maximale de la pompe, si elle est intégrée ou externe.

Ne dépasse pas les limites de relevage indiquées par le fabricant.
`,

            tuyauterie: `
Les longueurs admissibles dépendent du couple unité intérieure / unité extérieure et du type d'installation.

À vérifier dans la notice :
1. Longueur maximale totale.
2. Longueur maximale par branche.
3. Dénivelé maximal entre unités.
4. Longueur minimale éventuelle.
5. Diamètres des tubes.
6. Charge complémentaire par mètre et conditions de calcul.

Une valeur provenant d'une autre gamme ne doit pas être réutilisée.
`,

            electrique: `
La section de câble et la protection doivent être déterminées à partir de la documentation électrique du modèle et des conditions réelles de pose.

À relever :
1. Alimentation monophasée ou triphasée.
2. Intensité maximale et courant admissible indiqués par le fabricant.
3. Protection préconisée.
4. Section minimale et maximale des conducteurs.
5. Longueur de câble et mode de pose.
6. Schéma de raccordement de l'installation.

Ne dimensionne pas une protection uniquement à partir de la puissance frigorifique.
`,

            degagement: `
Les dégagements nécessaires dépendent du modèle et de la configuration de pose.

Il faut contrôler :
1. Les distances arrière et latérales.
2. L'espace libre devant le soufflage.
3. Le risque de recirculation d'air.
4. L'accessibilité pour l'entretien.
5. Les obstacles et les sources de chaleur.
6. Les prescriptions de la notice d'installation.
`,

            charge: `
La charge de fluide ne se déduit pas uniquement de la puissance de la machine.

Il faut connaître :
1. La référence complète des unités.
2. La charge d'usine.
3. La longueur de liaison prise en compte en usine.
4. La longueur réelle et les diamètres.
5. Le complément de charge prescrit par le fabricant.
6. Les éventuelles règles particulières aux installations multi ou DRV.

La charge doit être déterminée avec la procédure et les données de la notice correspondante.
`,

            autre: `
Je n'ai pas encore de procédure vérifiée correspondant précisément à cette question dans ma base locale.

Pour éviter une réponse approximative, précise le matériel concerné, sa référence exacte et le contexte de ton intervention.
`
        };

        const texte = reponses[sujet.id] || reponses.autre;

        return materiel + "\n" + texte + `
À vérifier : documentation officielle correspondant à la référence exacte.
`;
    }

    function afficherReponse(titre, contenu) {
        const zone = $("chantierReponse");
        zone.hidden = false;

        zone.innerHTML = `
            <h3>📋 ${echapper(titre)}</h3>
            <div class="chantier-reponse">${echapper(contenu)}</div>
            <div class="chantier-alerte">
                <strong>⚠️ Niveau de vérification</strong><br>
                Cette première version fournit une orientation technique.
                Les valeurs chiffrées et les prescriptions doivent être
                confirmées dans la notice constructeur du modèle exact.
                Aucune valeur fabricant n'est inventée.
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

    function echapper(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    charger();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", creerInterface);
    } else {
        creerInterface();
    }

})();

