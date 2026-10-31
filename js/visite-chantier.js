
/* ==========================================
   PRO CLIM — VISITE CHANTIER
   Module indépendant
   Version 1.0
========================================== */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", initialiser);

    function initialiser() {
        const accueil = document.getElementById("pageAccueil");

        if (!accueil) {
            console.error("Pro Clim : page d'accueil introuvable.");
            return;
        }

        // Évite une double installation du module.
        if (document.getElementById("btnVisiteChantier")) return;

        ajouterStyles();
        creerAccesAccueil();
        creerInterface();
    }

    function ajouterStyles() {
        const style = document.createElement("style");
        style.id = "styleVisiteChantier";

        style.textContent = `
            #btnVisiteChantier {
                cursor: pointer;
                border: 1px solid #dce5f1;
                text-align: left;
            }

            #visiteOverlay {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: none;
                overflow-y: auto;
                background: #f3f6fa;
                padding: 14px;
                padding-bottom: 35px;
            }

            #visiteOverlay.active { display: block; }

            .vc-container {
                max-width: 700px;
                margin: 0 auto;
            }

            .vc-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 18px;
            }

            .vc-header h2 {
                margin: 0;
                color: #0d47a1;
                font-size: 22px;
            }

            .vc-card {
                background: white;
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,.05);
            }

            .vc-card h3 {
                margin: 0 0 14px;
                color: #0d47a1;
                font-size: 17px;
            }

            .vc-field { margin-bottom: 13px; }

            .vc-field label {
                display: block;
                font-weight: 600;
                margin-bottom: 6px;
                font-size: 14px;
            }

            .vc-field input,
            .vc-field select,
            .vc-field textarea {
                width: 100%;
                box-sizing: border-box;
                padding: 12px;
                border: 1px solid #ccd5e0;
                border-radius: 9px;
                background: white;
                color: #263238;
                font-size: 16px;
            }

            .vc-field textarea {
                min-height: 85px;
                resize: vertical;
            }

            .vc-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .vc-room {
                border: 1px solid #dce5f1;
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 10px;
            }

            .vc-room strong {
                display: block;
                margin-bottom: 9px;
                color: #0d47a1;
            }

            .vc-button {
                display: block;
                width: 100%;
                border: 0;
                border-radius: 10px;
                padding: 14px;
                margin-top: 10px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
            }

            .vc-primary {
                background: #0d47a1;
                color: white;
            }

            .vc-secondary {
                background: #e7edf5;
                color: #17365f;
            }

            .vc-close {
                border: 0;
                border-radius: 9px;
                padding: 10px 13px;
                background: #e7edf5;
                color: #17365f;
                font-weight: 700;
                cursor: pointer;
            }

            .vc-note {
                color: #64748b;
                font-size: 13px;
                line-height: 1.5;
            }

            .vc-total {
                padding: 12px;
                background: #eef4fc;
                border-radius: 9px;
                font-weight: 700;
                color: #0d47a1;
            }

            @media(max-width:380px) {
                .vc-grid { grid-template-columns: 1fr; }
            }
        `;

        document.head.appendChild(style);
    }

    function creerAccesAccueil() {
        const grille = document.querySelector("#pageAccueil .quick-grid");

        if (!grille) {
            console.warn("Pro Clim : grille d'accueil introuvable.");
            return;
        }

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.id = "btnVisiteChantier";
        bouton.className = "quick-card";

        bouton.innerHTML = `
            <span style="font-size:25px">🏗️</span>
            <strong>Visite chantier</strong>
            <small>Préparation et dossier client</small>
        `;

        bouton.addEventListener("click", ouvrir);
        grille.appendChild(bouton);
    }

    function creerInterface() {
        const overlay = document.createElement("div");
        overlay.id = "visiteOverlay";

        overlay.innerHTML = `
            <div class="vc-container">

                <div class="vc-header">
                    <h2>🏗️ Visite chantier</h2>
                    <button type="button" class="vc-close" id="vcFermer">
                        Fermer ✕
                    </button>
                </div>

                <div class="vc-card">
                    <h3>👤 Informations du projet</h3>

                    <div class="vc-field">
                        <label for="vcClient">Nom du client</label>
                        <input id="vcClient" type="text" placeholder="Nom / Société">
                    </div>

                    <div class="vc-field">
                        <label for="vcAdresse">Adresse du chantier</label>
                        <input id="vcAdresse" type="text" placeholder="Adresse complète">
                    </div>

                    <div class="vc-grid">
                        <div class="vc-field">
                            <label for="vcTelephone">Téléphone</label>
                            <input id="vcTelephone" type="tel" placeholder="Téléphone">
                        </div>

                        <div class="vc-field">
                            <label for="vcDate">Date de visite</label>
                            <input id="vcDate" type="date">
                        </div>
                    </div>

                    <div class="vc-field">
                        <label for="vcProjet">Objet du projet</label>
                        <input id="vcProjet" type="text"
                               placeholder="Ex : Climatisation maison">
                    </div>
                </div>

                <div class="vc-card">
                    <h3>❄️ Installation envisagée</h3>

                    <div class="vc-field">
                        <label for="vcType">Type d'installation</label>
                        <select id="vcType">
                            <option value="">Non défini</option>
                            <option value="Split mural">Split mural</option>
                            <option value="Multi-split">Multi-split</option>
                            <option value="Gainable">Gainable</option>
                            <option value="À définir">À définir sur chantier</option>
                        </select>
                    </div>

                    <div class="vc-field">
                        <label for="vcMarque">Marque envisagée (facultatif)</label>
                        <input id="vcMarque" type="text"
                               placeholder="À compléter si connue">
                    </div>

                    <div class="vc-field">
                        <label for="vcModele">Modèle / Référence (facultatif)</label>
                        <input id="vcModele" type="text"
                               placeholder="Référence matériel">
                    </div>

                    <div class="vc-field">
                        <label for="vcPuissance">Puissance envisagée (facultatif)</label>
                        <input id="vcPuissance" type="text"
                               placeholder="Ex : 3,5 kW">
                    </div>

                    <p class="vc-note">
                        Les informations de l'étude Pro Clim seront reprises
                        automatiquement dans le dossier lorsqu'elles existent.
                    </p>
                </div>

                <div class="vc-card">
                    <h3>📐 Pièces et observations</h3>

                    <div id="vcPieces">
                        <p class="vc-note">
                            Aucune pièce récupérée depuis l'étude pour le moment.
                            Tu peux tout de même ajouter tes observations ci-dessous.
                        </p>
                    </div>

                    <div class="vc-field">
                        <label for="vcObservations">Observations générales</label>
                        <textarea id="vcObservations"
                            placeholder="Configuration du logement, accès, attentes du client..."></textarea>
                    </div>
                </div>

                <div class="vc-card">
                    <h3>🧰 Contraintes du chantier</h3>

                    <div class="vc-field">
                        <label for="vcAcces">Accès et emplacement</label>
                        <textarea id="vcAcces"
                            placeholder="Accès extérieur, hauteur, nacelle, passage des liaisons..."></textarea>
                    </div>

                    <div class="vc-field">
                        <label for="vcElectricite">Alimentation électrique</label>
                        <textarea id="vcElectricite"
                            placeholder="Tableau, protection, alimentation disponible..."></textarea>
                    </div>

                    <div class="vc-field">
                        <label for="vcPercements">Percements et passages</label>
                        <textarea id="vcPercements"
                            placeholder="Murs, dalles, gaines techniques, cheminement..."></textarea>
                    </div>

                    <div class="vc-field">
                        <label for="vcAutres">Autres contraintes</label>
                        <textarea id="vcAutres"
                            placeholder="Voisinage, copropriété, esthétique, bruit..."></textarea>
                    </div>
                </div>

                <div class="vc-card">
                    <h3>💧 Gestion des condensats</h3>

                    <div class="vc-field">
                        <label for="vcCondensats">Évacuation envisagée</label>
                        <select id="vcCondensats">
                            <option value="">Non renseignée</option>
                            <option value="Gravité">Évacuation gravitaire</option>
                            <option value="Pompe de relevage">Pompe de relevage</option>
                            <option value="À confirmer">À confirmer sur chantier</option>
                        </select>
                    </div>

                    <div class="vc-field">
                        <label for="vcPointEvacuation">Point d'évacuation</label>
                        <input id="vcPointEvacuation" type="text"
                               placeholder="Ex : évacuation salle de bain">
                    </div>

                    <div class="vc-field">
                        <label for="vcAccessibilite">Accessibilité / cheminement</label>
                        <textarea id="vcAccessibilite"
                            placeholder="Distance, pente, passage, possibilité de raccordement..."></textarea>
                    </div>

                    <div class="vc-grid">
                        <div class="vc-field">
                            <label for="vcCoutPompe">Coût pompe (€)</label>
                            <input id="vcCoutPompe" type="number"
                                   min="0" step="0.01" inputmode="decimal"
                                   placeholder="0">
                        </div>

                        <div class="vc-field">
                            <label for="vcCoutPose">Coût pose / matériel (€)</label>
                            <input id="vcCoutPose" type="number"
                                   min="0" step="0.01" inputmode="decimal"
                                   placeholder="0">
                        </div>
                    </div>

                    <div class="vc-total" id="vcTotalCondensats">
                        Coût complémentaire : 0,00 €
                    </div>
                </div>

                <div class="vc-card">
                    <h3>📝 Notes complémentaires</h3>

                    <div class="vc-field">
                        <label for="vcNotes">Notes libres</label>
                        <textarea id="vcNotes"
                            placeholder="Informations utiles pour préparer le devis et l'intervention..."></textarea>
                    </div>
                </div>

                <div class="vc-card">
                    <h3>📄 Dossier client</h3>
                    <p class="vc-note">
                        Le dossier reprendra les informations renseignées,
                        les résultats de l'étude disponibles et le budget
                        estimatif s'il a été calculé.
                    </p>

                    <button type="button" class="vc-button vc-primary"
                            id="vcCreerPDF">
                        📄 Créer le PDF
                    </button>

                    <button type="button" class="vc-button vc-secondary"
                            id="vcFermerBas">
                        Fermer la visite
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById("vcFermer").addEventListener("click", fermer);
        document.getElementById("vcFermerBas").addEventListener("click", fermer);
        document.getElementById("vcCreerPDF").addEventListener("click", creerPDF);

        ["vcCoutPompe", "vcCoutPose"].forEach(id => {
            document.getElementById(id).addEventListener("input", actualiserTotal);
        });

        document.getElementById("vcDate").value =
            new Date().toISOString().slice(0, 10);
    }

    function ouvrir() {
        const overlay = document.getElementById("visiteOverlay");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";

        recupererPiecesEtude();
        recupererTypeInstallation();
    }

    function fermer() {
        document.getElementById("visiteOverlay").classList.remove("active");
        document.body.style.overflow = "";
    }

    function recupererTypeInstallation() {
        const type = window.PROCLIM?.getTypeInstallation?.();

        const correspondance = {
            split: "Split mural",
            multisplit: "Multi-split",
            gainable: "Gainable"
        };

        const champ = document.getElementById("vcType");

        if (type && correspondance[type] && !champ.value) {
            champ.value = correspondance[type];
        }
    }

    function recupererPiecesEtude() {
        const conteneur = document.getElementById("vcPieces");
        const pieces = window.PROCLIM?.getRooms?.() || [];

        if (!pieces.length) return;

        conteneur.innerHTML = "";

        pieces.forEach((piece, index) => {
            const bloc = document.createElement("div");
            bloc.className = "vc-room";

            const titre = document.createElement("strong");
            titre.textContent = piece.nom || `Pièce ${index + 1}`;
            bloc.appendChild(titre);

            const dimensions = document.createElement("p");
            dimensions.textContent =
                `${piece.longueur} m × ${piece.largeur} m × ${piece.hauteur} m`;
            bloc.appendChild(dimensions);

            const surface = Number(piece.longueur) * Number(piece.largeur);
            const volume = surface * Number(piece.hauteur);

            const detail = document.createElement("p");
            detail.className = "vc-note";
            detail.textContent =
                `Surface : ${surface.toFixed(1)} m² — Volume : ${volume.toFixed(1)} m³`;
            bloc.appendChild(detail);

            const label = document.createElement("label");
            label.textContent = "Observation pour cette pièce";

            const textarea = document.createElement("textarea");
            textarea.className = "vc-note-piece";
            textarea.dataset.nom = piece.nom || `Pièce ${index + 1}`;
            textarea.placeholder = "Emplacement, contraintes, remarques...";
            textarea.style.width = "100%";
            textarea.style.boxSizing = "border-box";
            textarea.style.marginTop = "7px";
            textarea.style.padding = "10px";
            textarea.style.border = "1px solid #ccd5e0";
            textarea.style.borderRadius = "8px";
            textarea.style.fontSize = "15px";

            bloc.appendChild(label);
            bloc.appendChild(textarea);
            conteneur.appendChild(bloc);
        });
    }

    function valeur(id) {
        return document.getElementById(id)?.value?.trim() || "";
    }

    function montant(id) {
        const n = Number(valeur(id).replace(",", "."));
        return Number.isFinite(n) && n > 0 ? n : 0;
    }

    function actualiserTotal() {
        const total = montant("vcCoutPompe") + montant("vcCoutPose");

        document.getElementById("vcTotalCondensats").textContent =
            `Coût complémentaire : ${total.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} €`;
    }

    function lireEtude() {
        const lire = id =>
            document.getElementById(id)?.textContent?.trim() || "";

        return {
            surface: lire("resSurface"),
            volume: lire("resVolume"),
            puissance: lire("resPuissance"),
            debit: lire("resDebit"),
            bouches: lire("resBouches"),
            diametre: lire("resDiametre"),
            solution: lire("resSplit") || lire("resGainable"),
            commentaires: lire("commentaires")
        };
    }

    function lireBudget() {
        const ids = [
            "budgetTotalHeures",
            "budgetCoutMainOeuvre",
            "budgetCoutBase",
            "budgetPrixHT",
            "budgetMontantTVA",
            "budgetPrixTTC"
        ];

        const resultat = {};

        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.textContent.trim()) {
                resultat[id] = element.textContent.trim();
            }
        });

        return resultat;
    }

    function creerPDF() {
        const etude = lireEtude();
        const budget = lireBudget();

        const observationsPieces = Array.from(
            document.querySelectorAll(".vc-note-piece")
        ).map(champ => ({
            nom: champ.dataset.nom,
            note: champ.value.trim()
        })).filter(piece => piece.note);

        const coutCondensats =
            montant("vcCoutPompe") + montant("vcCoutPose");

        const donnees = {
            client: valeur("vcClient"),
            adresse: valeur("vcAdresse"),
            telephone: valeur("vcTelephone"),
            date: valeur("vcDate"),
            projet: valeur("vcProjet"),
            type: valeur("vcType"),
            marque: valeur("vcMarque"),
            modele: valeur("vcModele"),
            puissance: valeur("vcPuissance"),
            observations: valeur("vcObservations"),
            acces: valeur("vcAcces"),
            electricite: valeur("vcElectricite"),
            percements: valeur("vcPercements"),
            autres: valeur("vcAutres"),
            condensats: valeur("vcCondensats"),
            pointEvacuation: valeur("vcPointEvacuation"),
            accessibilite: valeur("vcAccessibilite"),
            coutPompe: montant("vcCoutPompe"),
            coutPose: montant("vcCoutPose"),
            coutCondensats,
            notes: valeur("vcNotes"),
            observationsPieces,
            etude,
            budget
        };

        const html = construireDocument(donnees);

        const fenetre = window.open("", "_blank");

        if (!fenetre) {
            alert(
                "Le navigateur a bloqué l'ouverture du dossier. " +
                "Autorise les fenêtres contextuelles puis réessaie."
            );
            return;
        }

        fenetre.document.open();
        fenetre.document.write(html);
        fenetre.document.close();
    }

    function echapper(texte) {
        return String(texte ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caractere]);
    }

    function ligne(titre, contenu) {
        if (!contenu) return "";
        return `<p><strong>${echapper(titre)} :</strong> ${echapper(contenu)}</p>`;
    }

    function bloc(titre, contenu) {
        if (!contenu) return "";
        return `
            <section>
                <h2>${echapper(titre)}</h2>
                <p>${echapper(contenu).replace(/\n/g, "<br>")}</p>
            </section>
        `;
    }

    function construireDocument(d) {
        const e = d.etude;
        const b = d.budget;

        const pieces = d.observationsPieces.map(piece => `
            <p><strong>${echapper(piece.nom)} :</strong>
            ${echapper(piece.note)}</p>
        `).join("");

        const detailsEtude = [
            ligne("Surface", e.surface),
            ligne("Volume", e.volume),
            ligne("Puissance estimée", e.puissance),
            ligne("Solution calculée", e.solution),
            ligne("Débit", e.debit),
            ligne("Nombre de bouches", e.bouches),
            ligne("Diamètre", e.diametre)
        ].join("");

        const detailsBudget = [
            ligne("Temps total", b.budgetTotalHeures),
            ligne("Main-d'œuvre", b.budgetCoutMainOeuvre),
            ligne("Coût de base", b.budgetCoutBase),
            ligne("Prix HT", b.budgetPrixHT),
            ligne("TVA", b.budgetMontantTVA),
            ligne("Prix TTC estimatif", b.budgetPrixTTC)
        ].join("");

        const condensats = [
            ligne("Évacuation", d.condensats),
            ligne("Point d'évacuation", d.pointEvacuation),
            ligne("Accessibilité", d.accessibilite),
            ligne("Coût pompe", d.coutPompe ? `${d.coutPompe.toFixed(2)} €` : ""),
            ligne("Pose / matériel", d.coutPose ? `${d.coutPose.toFixed(2)} €` : ""),
            ligne("Total complémentaire", d.coutCondensats
                ? `${d.coutCondensats.toFixed(2)} €` : "")
        ].join("");

        const date = d.date
            ? new Date(`${d.date}T12:00:00`).toLocaleDateString("fr-FR")
            : "";

        return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dossier visite chantier — Pro Clim</title>
<style>
    * { box-sizing: border-box; }
    body {
        font-family: Arial, sans-serif;
        color: #243247;
        margin: 0;
        padding: 25px;
        line-height: 1.5;
    }
    header {
        border-bottom: 4px solid #0d47a1;
        padding-bottom: 15px;
        margin-bottom: 25px;
    }
    h1 { color: #0d47a1; margin: 0; font-size: 27px; }
    header p { margin: 5px 0 0; color: #64748b; }
    h2 {
        color: #0d47a1;
        font-size: 17px;
        border-bottom: 1px solid #dce5f1;
        padding-bottom: 6px;
        margin-top: 25px;
    }
    section { page-break-inside: avoid; }
    .intro {
        background: #f1f5fb;
        padding: 14px;
        border-radius: 8px;
    }
    p { margin: 7px 0; }
    .footer {
        border-top: 1px solid #dce5f1;
        margin-top: 35px;
        padding-top: 10px;
        color: #64748b;
        font-size: 11px;
    }
    .actions {
        max-width: 700px;
        margin: 0 auto 20px;
        display: flex;
        gap: 10px;
    }
    .actions button {
        flex: 1;
        border: 0;
        border-radius: 8px;
        padding: 13px;
        background: #0d47a1;
        color: white;
        font-size: 15px;
        font-weight: bold;
    }
    @media print {
        body { padding: 0; }
        .actions { display: none; }
    }
</style>
</head>
<body>

<div class="actions">
    <button onclick="window.print()">Imprimer / Enregistrer en PDF</button>
</div>

<header>
    <h1>PRO CLIM</h1>
    <p>Assistant du technicien CVC</p>
    <h2>Dossier de visite chantier</h2>
</header>

<div class="intro">
    ${ligne("Client", d.client)}
    ${ligne("Adresse", d.adresse)}
    ${ligne("Téléphone", d.telephone)}
    ${ligne("Date de visite", date)}
    ${ligne("Projet", d.projet)}
</div>

<section>
    <h2>Installation envisagée</h2>
    ${ligne("Type", d.type)}
    ${ligne("Marque", d.marque)}
    ${ligne("Modèle", d.modele)}
    ${ligne("Puissance indiquée", d.puissance)}
</section>

${detailsEtude ? `<section><h2>Résultats de l'étude Pro Clim</h2>${detailsEtude}</section>` : ""}

${pieces ? `<section><h2>Observations par pièce</h2>${pieces}</section>` : ""}

${bloc("Observations générales", d.observations)}
${bloc("Accès et emplacement", d.acces)}
${bloc("Alimentation électrique", d.electricite)}
${bloc("Percements et passages", d.percements)}
${bloc("Autres contraintes", d.autres)}

${condensats ? `<section><h2>Gestion des condensats</h2>${condensats}</section>` : ""}

${detailsBudget ? `<section><h2>Budget Pro — Estimation disponible</h2>${detailsBudget}</section>` : ""}

${bloc("Notes complémentaires", d.notes)}

${e.commentaires ? bloc("Commentaires de l'étude", e.commentaires) : ""}

<div class="footer">
    Document préparé avec Pro Clim — Assistant du technicien CVC.<br>
    Les puissances et montants présentés sont des éléments d'étude et d'estimation,
    à confirmer selon les caractéristiques réelles du chantier et le matériel retenu.
</div>

</body>
</html>`;
    }

})();
