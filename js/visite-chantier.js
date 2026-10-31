
/* =========================================================
   PRO CLIM — VISITE CHANTIER
   Version 2.0 — Aperçu PDF intégré, sans fenêtre secondaire
   ========================================================= */

(() => {
    "use strict";

    const ID_STYLE = "proclim-visite-style";
    const ID_OVERLAY = "visiteOverlay";

    let pieces = [];
    let numeroPiece = 0;
    let dossierHTML = "";

    const $ = (id) => document.getElementById(id);

    function echapper(texte) {
        return String(texte ?? "").replace(/[&<>"']/g, (caractere) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caractere]);
    }

    function valeur(id) {
        const element = $(id);
        return element ? element.value.trim() : "";
    }

    function nombre(id) {
        const element = $(id);
        if (!element) return 0;
        return Number(String(element.value).replace(",", ".")) || 0;
    }

    function euros(valeur) {
        const n = Number(valeur);
        if (!Number.isFinite(n)) return "";
        return n.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
    }

    function dateDuJour() {
        const maintenant = new Date();
        return [
            maintenant.getFullYear(),
            String(maintenant.getMonth() + 1).padStart(2, "0"),
            String(maintenant.getDate()).padStart(2, "0")
        ].join("-");
    }

    function dateFr(date) {
        if (!date) return "";
        const morceaux = date.split("-");
        if (morceaux.length !== 3) return date;
        return `${morceaux[2]}/${morceaux[1]}/${morceaux[0]}`;
    }

    function ajouterStyles() {
        if ($(ID_STYLE)) return;

        const style = document.createElement("style");
        style.id = ID_STYLE;

        style.textContent = `
            #btnVisiteChantier {
                width: 100%;
                min-height: 76px;
                border: 1px solid rgba(13,71,161,.18);
                border-radius: 14px;
                background: #fff;
                color: #0D47A1;
                font-size: 16px;
                font-weight: 700;
                padding: 14px;
                cursor: pointer;
                text-align: left;
            }

            #btnVisiteChantier small {
                display: block;
                margin-top: 5px;
                color: #64748b;
                font-size: 12px;
                font-weight: 400;
            }

            #visiteOverlay {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 99990;
                background: #f1f5f9;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                padding: 14px;
            }

            #visiteOverlay.vc-visible {
                display: block;
            }

            .vc-container {
                width: 100%;
                max-width: 700px;
                margin: 0 auto;
                padding-bottom: 35px;
            }

            .vc-header {
                background: #0D47A1;
                color: white;
                padding: 19px;
                border-radius: 14px;
                margin-bottom: 15px;
            }

            .vc-header h2 {
                margin: 0 0 5px;
                font-size: 21px;
            }

            .vc-header p {
                margin: 0;
                font-size: 13px;
                opacity: .9;
            }

            .vc-card {
                background: white;
                border-radius: 13px;
                padding: 16px;
                margin-bottom: 13px;
                box-shadow: 0 2px 8px rgba(0,0,0,.045);
            }

            .vc-card h3 {
                color: #0D47A1;
                font-size: 16px;
                margin: 0 0 13px;
            }

            .vc-field {
                display: block;
                margin-bottom: 12px;
                color: #334155;
                font-size: 13px;
                font-weight: 600;
            }

            .vc-field input,
            .vc-field select,
            .vc-field textarea {
                display: block;
                box-sizing: border-box;
                width: 100%;
                margin-top: 6px;
                padding: 11px;
                border: 1px solid #cbd5e1;
                border-radius: 9px;
                background: white;
                color: #0f172a;
                font: inherit;
                font-size: 15px;
            }

            .vc-field textarea {
                min-height: 75px;
                resize: vertical;
            }

            .vc-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .vc-piece {
                border: 1px solid #dbe3ed;
                border-radius: 11px;
                padding: 12px;
                margin-bottom: 12px;
                background: #fbfdff;
            }

            .vc-piece h4 {
                margin: 0 0 10px;
                color: #0D47A1;
                font-size: 14px;
            }

            .vc-piece-result {
                color: #475569;
                font-size: 12px;
                margin: 5px 0 10px;
            }

            .vc-button {
                width: 100%;
                border: 0;
                border-radius: 10px;
                padding: 14px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                margin-top: 8px;
            }

            .vc-primary {
                color: white;
                background: #0D47A1;
            }

            .vc-secondary {
                color: #0D47A1;
                background: #e8f0fe;
            }

            .vc-danger {
                color: #b91c1c;
                background: #fee2e2;
                padding: 8px;
                font-size: 12px;
            }

            .vc-total {
                padding: 11px;
                border-radius: 9px;
                background: #eff6ff;
                color: #0D47A1;
                font-weight: 700;
                margin-top: 10px;
            }

            #vcApercu {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100000;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                background: #e2e8f0;
                padding: 12px;
            }

            #vcApercu.vc-visible {
                display: block;
            }

            .vc-preview-bar {
                max-width: 800px;
                margin: 0 auto 12px;
                padding: 12px;
                border-radius: 12px;
                background: white;
                box-shadow: 0 2px 8px rgba(0,0,0,.08);
            }

            .vc-preview-bar p {
                margin: 0 0 8px;
                font-size: 13px;
                color: #475569;
            }

            .vc-document {
                box-sizing: border-box;
                max-width: 800px;
                margin: 0 auto 25px;
                padding: 35px;
                background: white;
                color: #172033;
                font-family: Arial, sans-serif;
                font-size: 13px;
                line-height: 1.5;
                box-shadow: 0 2px 12px rgba(0,0,0,.08);
            }

            .vc-document h1 {
                color: #0D47A1;
                font-size: 25px;
                margin: 0;
            }

            .vc-document h2 {
                color: #0D47A1;
                font-size: 16px;
                border-bottom: 1px solid #dbe3ed;
                padding-bottom: 5px;
                margin: 23px 0 10px;
            }

            .vc-document p {
                margin: 5px 0;
                overflow-wrap: anywhere;
            }

            .vc-document .vc-doc-subtitle {
                color: #64748b;
                margin-top: 4px;
            }

            .vc-document .vc-doc-line {
                padding: 7px 0;
                border-bottom: 1px solid #edf0f4;
            }

            .vc-document .vc-doc-label {
                color: #64748b;
                font-weight: 600;
            }

            .vc-document .vc-doc-room {
                border: 1px solid #dbe3ed;
                border-radius: 8px;
                padding: 10px;
                margin: 9px 0;
                break-inside: avoid;
            }

            .vc-document .vc-doc-total {
                background: #eff6ff;
                padding: 12px;
                border-radius: 8px;
                font-weight: 700;
                color: #0D47A1;
                margin-top: 10px;
            }

            .vc-document .vc-doc-footer {
                margin-top: 30px;
                padding-top: 10px;
                border-top: 1px solid #dbe3ed;
                color: #64748b;
                font-size: 10px;
            }

            @media (max-width: 480px) {
                .vc-grid {
                    grid-template-columns: 1fr 1fr;
                }
                .vc-document {
                    padding: 20px;
                }
            }

            @media print {
                @page {
                    size: A4;
                    margin: 15mm;
                }

                body * {
                    visibility: hidden !important;
                }

                #vcApercu,
                #vcApercu * {
                    visibility: visible !important;
                }

                #vcApercu {
                    display: block !important;
                    position: absolute !important;
                    inset: 0 !important;
                    overflow: visible !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                }

                #vcApercu .vc-preview-bar {
                    display: none !important;
                }

                #vcDocument {
                    display: block !important;
                    visibility: visible !important;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }

                .vc-document h2,
                .vc-document .vc-doc-room {
                    break-after: avoid;
                }

                .vc-document .vc-doc-room {
                    break-inside: avoid;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function creerInterface() {
        if ($(ID_OVERLAY)) return;

        const overlay = document.createElement("div");
        overlay.id = ID_OVERLAY;

        overlay.innerHTML = `
            <div class="vc-container">
                <div class="vc-header">
                    <h2>🏠 Visite chantier</h2>
                    <p>Préparation et compte rendu de visite client</p>
                </div>

                <section class="vc-card">
                    <h3>Informations client</h3>

                    <label class="vc-field">Nom du client
                        <input id="vcClient" type="text" placeholder="Nom / Société">
                    </label>

                    <label class="vc-field">Adresse du chantier
                        <input id="vcAdresse" type="text" placeholder="Adresse complète">
                    </label>

                    <div class="vc-grid">
                        <label class="vc-field">Téléphone
                            <input id="vcTelephone" type="tel" placeholder="Téléphone">
                        </label>
                        <label class="vc-field">Date de visite
                            <input id="vcDate" type="date">
                        </label>
                    </div>

                    <label class="vc-field">Projet
                        <input id="vcProjet" type="text" placeholder="Ex. : Climatisation salon">
                    </label>
                </section>

                <section class="vc-card">
                    <h3>Installation envisagée</h3>

                    <label class="vc-field">Type d'installation
                        <select id="vcType">
                            <option value="">À définir</option>
                            <option value="Split mural">Split mural</option>
                            <option value="Multi-split">Multi-split</option>
                            <option value="Gainable">Gainable</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </label>

                    <div class="vc-grid">
                        <label class="vc-field">Marque
                            <input id="vcMarque" type="text" placeholder="Facultatif">
                        </label>
                        <label class="vc-field">Modèle
                            <input id="vcModele" type="text" placeholder="Facultatif">
                        </label>
                    </div>

                    <label class="vc-field">Puissance envisagée
                        <input id="vcPuissance" type="text" placeholder="Ex. : 3,5 kW">
                    </label>
                </section>

                <section class="vc-card">
                    <h3>Pièces et dimensions</h3>
                    <p style="font-size:12px;color:#64748b;margin-top:-5px">
                        Renseigne les dimensions si elles sont disponibles.
                        Les surfaces et volumes sont calculés automatiquement.
                    </p>

                    <div id="vcListePieces"></div>

                    <button type="button" class="vc-button vc-secondary" id="vcAjouterPiece">
                        + Ajouter une pièce
                    </button>
                </section>

                <section class="vc-card">
                    <h3>Accès et contraintes du chantier</h3>

                    <label class="vc-field">Accès et emplacement
                        <textarea id="vcAcces" placeholder="Ex. : 5e étage sans ascenseur..."></textarea>
                    </label>

                    <label class="vc-field">Alimentation électrique
                        <textarea id="vcElectricite" placeholder="Ex. : Tableau électrique à remplacer..."></textarea>
                    </label>

                    <label class="vc-field">Percements et passages
                        <textarea id="vcPercements" placeholder="Ex. : Passage en façade, traversée de mur..."></textarea>
                    </label>

                    <label class="vc-field">Autres contraintes
                        <textarea id="vcContraintes" placeholder="Observations complémentaires..."></textarea>
                    </label>
                </section>

                <section class="vc-card">
                    <h3>Gestion des condensats</h3>

                    <label class="vc-field">Évacuation
                        <select id="vcCondensats">
                            <option value="">Non renseigné</option>
                            <option value="Évacuation gravitaire">Évacuation gravitaire</option>
                            <option value="Pompe de relevage">Pompe de relevage</option>
                            <option value="À confirmer">À confirmer</option>
                        </select>
                    </label>

                    <label class="vc-field">Point d'évacuation
                        <input id="vcPointEvacuation" type="text" placeholder="Ex. : Évacuation eaux usées">
                    </label>

                    <div class="vc-grid">
                        <label class="vc-field">Coût matériel (€)
                            <input id="vcCoutMateriel" type="number" min="0" step="0.01" placeholder="0">
                        </label>
                        <label class="vc-field">Coût pose (€)
                            <input id="vcCoutPose" type="number" min="0" step="0.01" placeholder="0">
                        </label>
                    </div>

                    <div class="vc-total" id="vcTotalCondensats">
                        Total condensats : 0,00 €
                    </div>
                </section>

                <section class="vc-card">
                    <h3>Notes complémentaires</h3>
                    <label class="vc-field">Observations
                        <textarea id="vcNotes" placeholder="Notes libres sur le chantier..."></textarea>
                    </label>
                </section>

                <button type="button" class="vc-button vc-primary" id="vcCreerPDF">
                    📄 Créer le PDF
                </button>

                <button type="button" class="vc-button vc-secondary" id="vcFermer">
                    Fermer la visite
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        const apercu = document.createElement("div");
        apercu.id = "vcApercu";
        apercu.innerHTML = `
            <div class="vc-preview-bar">
                <p>
                    Vérifie ton dossier avant de lancer l'impression.
                    Sur iPhone, tu pourras ensuite utiliser le partage
                    pour enregistrer le document en PDF.
                </p>
                <button type="button" class="vc-button vc-primary" id="vcImprimer">
                    🖨️ Imprimer / Enregistrer en PDF
                </button>
                <button type="button" class="vc-button vc-secondary" id="vcRetour">
                    Retour à la visite
                </button>
            </div>
            <article class="vc-document" id="vcDocument"></article>
        `;

        document.body.appendChild(apercu);

        $("vcDate").value = dateDuJour();

        $("vcAjouterPiece").addEventListener("click", ajouterPiece);
        $("vcFermer").addEventListener("click", fermer);
        $("vcCreerPDF").addEventListener("click", creerApercu);
        $("vcImprimer").addEventListener("click", imprimer);
        $("vcRetour").addEventListener("click", () => {
            apercu.classList.remove("vc-visible");
        });

        $("vcCoutMateriel").addEventListener("input", actualiserTotal);
        $("vcCoutPose").addEventListener("input", actualiserTotal);

        ajouterPieceDepuisEtude();
    }

    function ajouterPieceDepuisEtude() {
        let piecesExistantes = [];

        try {
            if (window.PROCLIM && typeof window.PROCLIM.getRooms === "function") {
                piecesExistantes = window.PROCLIM.getRooms() || [];
            }
        } catch (erreur) {
            console.warn("Pro Clim : lecture des pièces impossible.", erreur);
        }

        if (piecesExistantes.length) {
            piecesExistantes.forEach((piece) => {
                ajouterPiece({
                    nom: piece.nom || "",
                    longueur: piece.longueur || "",
                    largeur: piece.largeur || "",
                    hauteur: piece.hauteur || ""
                });
            });
        } else {
            ajouterPiece();
        }
    }

    function ajouterPiece(donnees = {}) {
        numeroPiece++;

        const id = numeroPiece;
        const conteneur = document.createElement("div");
        conteneur.className = "vc-piece";
        conteneur.dataset.pieceId = id;

        conteneur.innerHTML = `
            <h4>Pièce ${id}</h4>

            <label class="vc-field">Nom de la pièce
                <input class="vc-nom-piece" type="text"
                    placeholder="Ex. : Salon"
                    value="${echapper(donnees.nom || "")}">
            </label>

            <div class="vc-grid">
                <label class="vc-field">Longueur (m)
                    <input class="vc-longueur" type="number" min="0" step="0.01"
                        placeholder="0"
                        value="${echapper(donnees.longueur || "")}">
                </label>

                <label class="vc-field">Largeur (m)
                    <input class="vc-largeur" type="number" min="0" step="0.01"
                        placeholder="0"
                        value="${echapper(donnees.largeur || "")}">
                </label>

                <label class="vc-field">Hauteur (m)
                    <input class="vc-hauteur" type="number" min="0" step="0.01"
                        placeholder="2,50"
                        value="${echapper(donnees.hauteur || "")}">
                </label>
            </div>

            <div class="vc-piece-result">Surface : — | Volume : —</div>

            <label class="vc-field">Observation sur cette pièce
                <textarea class="vc-observation"
                    placeholder="Emplacement, contraintes, remarques..."></textarea>
            </label>

            <button type="button" class="vc-button vc-danger vc-supprimer-piece">
                Supprimer cette pièce
            </button>
        `;

        $("vcListePieces").appendChild(conteneur);

        conteneur.querySelectorAll("input").forEach((champ) => {
            champ.addEventListener("input", () => calculerPiece(conteneur));
        });

        conteneur.querySelector(".vc-supprimer-piece").addEventListener("click", () => {
            conteneur.remove();
            renumeroterPieces();
        });

        calculerPiece(conteneur);
    }

    function calculerPiece(element) {
        const longueur = Number(element.querySelector(".vc-longueur").value) || 0;
        const largeur = Number(element.querySelector(".vc-largeur").value) || 0;
        const hauteur = Number(element.querySelector(".vc-hauteur").value) || 0;

        const surface = longueur > 0 && largeur > 0 ? longueur * largeur : 0;
        const volume = surface > 0 && hauteur > 0 ? surface * hauteur : 0;

        const resultat = element.querySelector(".vc-piece-result");

        resultat.textContent =
            `Surface : ${surface ? surface.toFixed(1) + " m²" : "—"} | ` +
            `Volume : ${volume ? volume.toFixed(1) + " m³" : "—"}`;
    }

    function renumeroterPieces() {
        document.querySelectorAll("#vcListePieces .vc-piece").forEach((element, index) => {
            element.querySelector("h4").textContent = `Pièce ${index + 1}`;
        });
    }

    function lirePieces() {
        return Array.from(document.querySelectorAll("#vcListePieces .vc-piece"))
            .map((element) => {
                const longueur = Number(element.querySelector(".vc-longueur").value) || 0;
                const largeur = Number(element.querySelector(".vc-largeur").value) || 0;
                const hauteur = Number(element.querySelector(".vc-hauteur").value) || 0;

                const surface = longueur > 0 && largeur > 0
                    ? longueur * largeur : 0;

                const volume = surface > 0 && hauteur > 0
                    ? surface * hauteur : 0;

                return {
                    nom: element.querySelector(".vc-nom-piece").value.trim(),
                    longueur,
                    largeur,
                    hauteur,
                    surface,
                    volume,
                    observation: element.querySelector(".vc-observation").value.trim()
                };
            })
            .filter((piece) =>
                piece.nom || piece.longueur || piece.largeur ||
                piece.hauteur || piece.observation
            );
    }

    function actualiserTotal() {
        const total = nombre("vcCoutMateriel") + nombre("vcCoutPose");
        $("vcTotalCondensats").textContent =
            `Total condensats : ${euros(total)}`;
    }

    function lireEtude() {
        const resultats = [];

        const correspondances = [
            ["Surface", ["surfaceTotale", "resultatSurface", "surface"]],
            ["Volume", ["volumeTotal", "resultatVolume", "volume"]],
            ["Puissance", ["puissanceTotale", "resultatPuissance", "puissance"]],
            ["Solution", ["solutionRecommandee", "resultatSolution", "solution"]],
            ["Débit", ["debitTotal", "resultatDebit", "debit"]],
            ["Nombre de bouches", ["nombreBouches", "resultatBouches"]],
            ["Diamètre", ["diametreGaine", "resultatDiametre"]]
        ];

        correspondances.forEach(([label, ids]) => {
            for (const id of ids) {
                const element = $(id);
                if (element && element.textContent.trim()) {
                    const texte = element.textContent.trim();
                    if (texte !== "—" && texte !== "-") {
                        resultats.push({ label, valeur: texte });
                        break;
                    }
                }
            }
        });

        return resultats;
    }

    function lireBudget() {
        const correspondances = [
            ["Temps estimé", "budgetTotalHeures"],
            ["Main-d'œuvre", "budgetCoutMainOeuvre"],
            ["Coût de base", "budgetCoutBase"],
            ["Prix HT", "budgetPrixHT"],
            ["TVA", "budgetMontantTVA"],
            ["Prix TTC", "budgetPrixTTC"]
        ];

        return correspondances
            .map(([label, id]) => {
                const element = $(id);
                return {
                    label,
                    valeur: element ? element.textContent.trim() : ""
                };
            })
            .filter((item) =>
                item.valeur &&
                item.valeur !== "—" &&
                item.valeur !== "-"
            );
    }

    function ligneDocument(label, texte) {
        if (!texte) return "";
        return `
            <div class="vc-doc-line">
                <span class="vc-doc-label">${echapper(label)} :</span>
                ${echapper(texte)}
            </div>
        `;
    }

    function blocTexte(titre, contenu) {
        if (!contenu) return "";
        return `
            <h2>${echapper(titre)}</h2>
            <p>${echapper(contenu).replace(/\n/g, "<br>")}</p>
        `;
    }

    function creerApercu() {
        const client = valeur("vcClient");
        const adresse = valeur("vcAdresse");
        const telephone = valeur("vcTelephone");
        const projet = valeur("vcProjet");
        const date = dateFr(valeur("vcDate"));
        const type = valeur("vcType");
        const marque = valeur("vcMarque");
        const modele = valeur("vcModele");
        const puissance = valeur("vcPuissance");

        const piecesVisite = lirePieces();
        const etude = lireEtude();
        const budget = lireBudget();

        const condensats = valeur("vcCondensats");
        const pointEvacuation = valeur("vcPointEvacuation");
        const coutMateriel = nombre("vcCoutMateriel");
        const coutPose = nombre("vcCoutPose");
        const totalCondensats = coutMateriel + coutPose;

        let html = `
            <h1>❄️ Pro Clim</h1>
            <p class="vc-doc-subtitle">Compte rendu de visite chantier</p>

            <h2>Informations du projet</h2>
            ${ligneDocument("Client", client)}
            ${ligneDocument("Adresse", adresse)}
            ${ligneDocument("Téléphone", telephone)}
            ${ligneDocument("Date de visite", date)}
            ${ligneDocument("Projet", projet)}

            <h2>Installation envisagée</h2>
            ${ligneDocument("Type", type)}
            ${ligneDocument("Marque", marque)}
            ${ligneDocument("Modèle", modele)}
            ${ligneDocument("Puissance", puissance)}
        `;

        if (piecesVisite.length) {
            html += `<h2>Pièces et dimensions</h2>`;

            piecesVisite.forEach((piece, index) => {
                const nom = piece.nom || `Pièce ${index + 1}`;

                html += `
                    <div class="vc-doc-room">
                        <strong>${echapper(nom)}</strong>
                        ${piece.longueur ? `<p>Longueur : ${piece.longueur} m</p>` : ""}
                        ${piece.largeur ? `<p>Largeur : ${piece.largeur} m</p>` : ""}
                        ${piece.hauteur ? `<p>Hauteur : ${piece.hauteur} m</p>` : ""}
                        ${piece.surface ? `<p>Surface : ${piece.surface.toFixed(1)} m²</p>` : ""}
                        ${piece.volume ? `<p>Volume : ${piece.volume.toFixed(1)} m³</p>` : ""}
                        ${piece.observation ? `<p><strong>Observation :</strong><br>${echapper(piece.observation).replace(/\n/g, "<br>")}</p>` : ""}
                    </div>
                `;
            });
        }

        html += blocTexte("Accès et emplacement", valeur("vcAcces"));
        html += blocTexte("Alimentation électrique", valeur("vcElectricite"));
        html += blocTexte("Percements et passages", valeur("vcPercements"));
        html += blocTexte("Autres contraintes", valeur("vcContraintes"));

        if (condensats || pointEvacuation || coutMateriel || coutPose) {
            html += `<h2>Gestion des condensats</h2>`;
            html += ligneDocument("Évacuation", condensats);
            html += ligneDocument("Point d'évacuation", pointEvacuation);

            if (coutMateriel) {
                html += ligneDocument("Coût matériel", euros(coutMateriel));
            }

            if (coutPose) {
                html += ligneDocument("Coût pose", euros(coutPose));
            }

            if (totalCondensats > 0) {
                html += `
                    <div class="vc-doc-total">
                        Total estimé condensats : ${echapper(euros(totalCondensats))}
                    </div>
                `;
            }
        }

        if (etude.length) {
            html += `<h2>Résultats de l'étude Pro Clim</h2>`;
            etude.forEach((item) => {
                html += ligneDocument(item.label, item.valeur);
            });
        }

        if (budget.length) {
            html += `<h2>Estimation Budget Pro</h2>`;
            budget.forEach((item) => {
                html += ligneDocument(item.label, item.valeur);
            });
        }

        html += blocTexte("Notes complémentaires", valeur("vcNotes"));

        html += `
            <div class="vc-doc-footer">
                Document établi avec Pro Clim — Assistant du technicien CVC.
                <br>
                Les informations et estimations présentées sont basées
                sur les éléments recueillis lors de la visite.
            </div>
        `;

        dossierHTML = html;
        $("vcDocument").innerHTML = html;
        $("vcApercu").classList.add("vc-visible");
    }

    function imprimer() {
        if (!dossierHTML) {
            alert("Crée d'abord l'aperçu du dossier.");
            return;
        }

        if (typeof window.print !== "function") {
            alert(
                "L'impression n'est pas disponible dans cette fenêtre. " +
                "Ouvre Pro Clim dans Safari pour imprimer le dossier."
            );
            return;
        }

        window.print();
    }

    function ouvrir() {
        $("vcApercu").classList.remove("vc-visible");
        $(ID_OVERLAY).classList.add("vc-visible");
    }

    function fermer() {
        $(ID_OVERLAY).classList.remove("vc-visible");
        $("vcApercu").classList.remove("vc-visible");
    }

    function ajouterBoutonAccueil() {
        if ($("btnVisiteChantier")) return;

        const zone = document.querySelector("#pageAccueil .quick-grid");

        if (!zone) {
            console.warn("Pro Clim : zone des raccourcis introuvable.");
            return;
        }

        const bouton = document.createElement("button");
        bouton.id = "btnVisiteChantier";
        bouton.type = "button";
        bouton.innerHTML = `
            🏠 Visite chantier
            <small>Préparer un dossier client</small>
        `;

        bouton.addEventListener("click", ouvrir);
        zone.appendChild(bouton);
    }

    function initialiser() {
        ajouterStyles();
        creerInterface();
        ajouterBoutonAccueil();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiser);
    } else {
        initialiser();
    }

})();
