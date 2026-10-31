
/* ======================================================
   PRO CLIM - VISITE CHANTIER
   VERSION 3.0 - PDF avec aperçu intégré
   ====================================================== */

(() => {
    "use strict";

    const $ = id => document.getElementById(id);

    let numeroPiece = 0;

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c]);
    }

    function lire(id) {
        return $(id) ? $(id).value.trim() : "";
    }

    function nombre(id) {
        return Number((lire(id) || "0").replace(",", ".")) || 0;
    }

    function euros(n) {
        return Number(n).toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
    }

    function styles() {
        if ($("pcVisiteStyles")) return;

        const style = document.createElement("style");
        style.id = "pcVisiteStyles";
        style.textContent = `
            #btnVisiteChantier {
                width:100%; padding:16px; border:1px solid #dbe3ed;
                border-radius:12px; background:white; color:#0D47A1;
                font-size:16px; font-weight:bold; text-align:left;
                cursor:pointer;
            }
            #btnVisiteChantier small {
                display:block; color:#64748b; font-weight:normal;
                margin-top:5px;
            }
            #visiteOverlay, #vcApercu {
                display:none; position:fixed; inset:0; z-index:99990;
                overflow-y:auto; -webkit-overflow-scrolling:touch;
                background:#f1f5f9; padding:12px;
            }
            #visiteOverlay.vc-visible, #vcApercu.vc-visible {
                display:block;
            }
            .vc-container {max-width:700px;margin:auto;padding-bottom:35px}
            .vc-header {
                background:#0D47A1;color:white;padding:20px;
                border-radius:13px;margin-bottom:14px;
            }
            .vc-header h2 {margin:0 0 5px}
            .vc-header p {margin:0;font-size:13px}
            .vc-card {
                background:white;border-radius:12px;padding:15px;
                margin-bottom:13px;
            }
            .vc-card h3 {color:#0D47A1;margin:0 0 13px;font-size:16px}
            .vc-field {
                display:block;margin-bottom:12px;font-size:13px;
                font-weight:600;color:#334155;
            }
            .vc-field input,.vc-field textarea,.vc-field select {
                display:block;box-sizing:border-box;width:100%;
                margin-top:5px;padding:11px;border:1px solid #cbd5e1;
                border-radius:8px;background:white;font-size:15px;
                color:#172033;
            }
            .vc-field textarea {min-height:75px}
            .vc-grid {display:grid;grid-template-columns:1fr 1fr;gap:9px}
            .vc-piece {
                border:1px solid #dbe3ed;border-radius:10px;
                padding:12px;margin-bottom:10px;
            }
            .vc-piece h4 {color:#0D47A1;margin:0 0 10px}
            .vc-piece-result {font-size:12px;color:#475569;margin:5px 0 10px}
            .vc-button {
                display:block;width:100%;padding:14px;margin-top:8px;
                border:0;border-radius:9px;font-size:15px;
                font-weight:bold;cursor:pointer;
            }
            .vc-primary {background:#0D47A1;color:white}
            .vc-secondary {background:#e8f0fe;color:#0D47A1}
            .vc-danger {background:#fee2e2;color:#991b1b;font-size:12px}
            .vc-total {background:#eff6ff;padding:11px;border-radius:8px;color:#0D47A1;font-weight:bold}
            .vc-preview-bar {
                max-width:800px;margin:0 auto 12px;background:white;
                padding:12px;border-radius:10px;
            }
            .vc-document {
                box-sizing:border-box;max-width:800px;margin:0 auto 25px;
                padding:30px;background:white;color:#172033;
                font:13px/1.5 Arial,sans-serif;
            }
            .vc-document h1 {color:#0D47A1;margin:0}
            .vc-document h2 {
                color:#0D47A1;font-size:16px;
                border-bottom:1px solid #dbe3ed;
                padding-bottom:5px;margin-top:22px;
            }
            .vc-document p {overflow-wrap:anywhere}
            .vc-doc-line {padding:6px 0;border-bottom:1px solid #edf0f4}
            .vc-doc-label {font-weight:bold;color:#64748b}
            .vc-doc-room {
                border:1px solid #dbe3ed;border-radius:8px;
                padding:10px;margin:9px 0;break-inside:avoid;
            }
            .vc-doc-total {
                background:#eff6ff;padding:12px;border-radius:8px;
                color:#0D47A1;font-weight:bold;
            }
            .vc-doc-footer {
                margin-top:25px;border-top:1px solid #dbe3ed;
                padding-top:10px;color:#64748b;font-size:10px;
            }
            @media print {
                @page {size:A4;margin:15mm}
                body * {visibility:hidden!important}
                #vcApercu,#vcApercu * {visibility:visible!important}
                #vcApercu {
                    display:block!important;position:absolute!important;
                    inset:0!important;padding:0!important;
                    overflow:visible!important;background:white!important;
                }
                .vc-preview-bar {display:none!important}
                #vcDocument {
                    display:block!important;width:100%!important;
                    max-width:none!important;margin:0!important;
                    padding:0!important;box-shadow:none!important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function interfaceVisite() {
        if (!$("visiteOverlay")) {
            const overlay = document.createElement("div");
            overlay.id = "visiteOverlay";
            overlay.innerHTML = `
                <div class="vc-container">
                    <div class="vc-header">
                        <h2>🏠 Visite chantier</h2>
                        <p>Préparation et compte rendu de visite</p>
                    </div>

                    <section class="vc-card">
                        <h3>Informations client</h3>
                        <label class="vc-field">Client
                            <input id="vcClient" placeholder="Nom du client">
                        </label>
                        <label class="vc-field">Adresse
                            <input id="vcAdresse" placeholder="Adresse du chantier">
                        </label>
                        <div class="vc-grid">
                            <label class="vc-field">Téléphone
                                <input id="vcTelephone" type="tel">
                            </label>
                            <label class="vc-field">Date
                                <input id="vcDate" type="date">
                            </label>
                        </div>
                        <label class="vc-field">Projet
                            <input id="vcProjet" placeholder="Ex. : Climatisation salon">
                        </label>
                    </section>

                    <section class="vc-card">
                        <h3>Installation envisagée</h3>
                        <label class="vc-field">Type
                            <select id="vcType">
                                <option value="">À définir</option>
                                <option>Split mural</option>
                                <option>Multi-split</option>
                                <option>Gainable</option>
                                <option>Autre</option>
                            </select>
                        </label>
                        <div class="vc-grid">
                            <label class="vc-field">Marque
                                <input id="vcMarque" placeholder="Facultatif">
                            </label>
                            <label class="vc-field">Modèle
                                <input id="vcModele" placeholder="Facultatif">
                            </label>
                        </div>
                        <label class="vc-field">Puissance
                            <input id="vcPuissance" placeholder="Ex. : 3,5 kW">
                        </label>
                    </section>

                    <section class="vc-card">
                        <h3>Pièces et dimensions</h3>
                        <div id="vcListePieces"></div>
                        <button type="button" class="vc-button vc-secondary"
                            id="vcAjouterPiece">+ Ajouter une pièce</button>
                    </section>

                    <section class="vc-card">
                        <h3>Accès et contraintes</h3>
                        <label class="vc-field">Accès et emplacement
                            <textarea id="vcAcces" placeholder="Ex. : 5e étage sans ascenseur"></textarea>
                        </label>
                        <label class="vc-field">Alimentation électrique
                            <textarea id="vcElectricite" placeholder="Informations électriques"></textarea>
                        </label>
                        <label class="vc-field">Percements et passages
                            <textarea id="vcPercements"></textarea>
                        </label>
                        <label class="vc-field">Autres contraintes
                            <textarea id="vcContraintes"></textarea>
                        </label>
                    </section>

                    <section class="vc-card">
                        <h3>Gestion des condensats</h3>
                        <label class="vc-field">Évacuation
                            <select id="vcCondensats">
                                <option value="">Non renseigné</option>
                                <option>Évacuation gravitaire</option>
                                <option>Pompe de relevage</option>
                                <option>À confirmer</option>
                            </select>
                        </label>
                        <label class="vc-field">Point d'évacuation
                            <input id="vcPointEvacuation">
                        </label>
                        <div class="vc-grid">
                            <label class="vc-field">Matériel (€)
                                <input id="vcCoutMateriel" type="number" min="0" step="0.01">
                            </label>
                            <label class="vc-field">Pose (€)
                                <input id="vcCoutPose" type="number" min="0" step="0.01">
                            </label>
                        </div>
                        <div class="vc-total" id="vcTotalCondensats">Total : 0,00 €</div>
                    </section>

                    <section class="vc-card">
                        <h3>Notes complémentaires</h3>
                        <label class="vc-field">Observations
                            <textarea id="vcNotes"></textarea>
                        </label>
                    </section>

                    <button type="button" class="vc-button vc-primary"
                        id="vcCreerPDF">📄 Créer le PDF</button>
                    <button type="button" class="vc-button vc-secondary"
                        id="vcFermer">Fermer la visite</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        if (!$("vcApercu")) {
            const preview = document.createElement("div");
            preview.id = "vcApercu";
            preview.innerHTML = `
                <div class="vc-preview-bar">
                    <p>Vérifie ton dossier, puis lance l'impression.
                    Sur iPhone, utilise le partage pour enregistrer le PDF.</p>
                    <button type="button" class="vc-button vc-primary"
                        id="vcImprimer">🖨️ Imprimer / Enregistrer en PDF</button>
                    <button type="button" class="vc-button vc-secondary"
                        id="vcRetour">Retour à la visite</button>
                </div>
                <article class="vc-document" id="vcDocument"></article>
            `;
            document.body.appendChild(preview);
        }

        if (!$("vcDate").value) {
            $("vcDate").value = new Date().toISOString().slice(0, 10);
        }

        if (!$("vcListePieces").children.length) {
            let rooms = [];
            try {
                if (window.PROCLIM?.getRooms) rooms = window.PROCLIM.getRooms() || [];
            } catch (e) {
                console.warn(e);
            }

            if (rooms.length) {
                rooms.forEach(room => ajouterPiece(room));
            } else {
                ajouterPiece();
            }
        }
    }

    function ajouterPiece(room = {}) {
        numeroPiece++;

        const bloc = document.createElement("div");
        bloc.className = "vc-piece";

        bloc.innerHTML = `
            <h4>Pièce ${numeroPiece}</h4>
            <label class="vc-field">Nom de la pièce
                <input class="vc-nom" placeholder="Ex. : Salon"
                    value="${escapeHTML(room.nom || "")}">
            </label>
            <div class="vc-grid">
                <label class="vc-field">Longueur (m)
                    <input class="vc-longueur" type="number" min="0" step="0.01"
                        value="${escapeHTML(room.longueur || "")}">
                </label>
                <label class="vc-field">Largeur (m)
                    <input class="vc-largeur" type="number" min="0" step="0.01"
                        value="${escapeHTML(room.largeur || "")}">
                </label>
                <label class="vc-field">Hauteur (m)
                    <input class="vc-hauteur" type="number" min="0" step="0.01"
                        value="${escapeHTML(room.hauteur || "")}">
                </label>
            </div>
            <div class="vc-piece-result">Surface : — | Volume : —</div>
            <label class="vc-field">Observation
                <textarea class="vc-observation"></textarea>
            </label>
            <button type="button" class="vc-button vc-danger vcSupprimer">
                Supprimer cette pièce
            </button>
        `;

        $("vcListePieces").appendChild(bloc);

        bloc.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => calculerPiece(bloc));
        });

        calculerPiece(bloc);
    }

    function calculerPiece(bloc) {
        const l = Number(bloc.querySelector(".vc-longueur").value) || 0;
        const w = Number(bloc.querySelector(".vc-largeur").value) || 0;
        const h = Number(bloc.querySelector(".vc-hauteur").value) || 0;
        const surface = l && w ? l * w : 0;
        const volume = surface && h ? surface * h : 0;

        bloc.querySelector(".vc-piece-result").textContent =
            `Surface : ${surface ? surface.toFixed(1) + " m²" : "—"} | ` +
            `Volume : ${volume ? volume.toFixed(1) + " m³" : "—"}`;
    }

    function piecesVisite() {
        return Array.from(document.querySelectorAll("#vcListePieces .vc-piece"))
            .map(bloc => {
                const l = Number(bloc.querySelector(".vc-longueur").value) || 0;
                const w = Number(bloc.querySelector(".vc-largeur").value) || 0;
                const h = Number(bloc.querySelector(".vc-hauteur").value) || 0;
                const surface = l && w ? l * w : 0;

                return {
                    nom: bloc.querySelector(".vc-nom").value.trim(),
                    longueur: l,
                    largeur: w,
                    hauteur: h,
                    surface,
                    volume: surface && h ? surface * h : 0,
                    observation: bloc.querySelector(".vc-observation").value.trim()
                };
            })
            .filter(p => p.nom || p.longueur || p.largeur || p.hauteur || p.observation);
    }

    function ligne(label, value) {
        if (!value) return "";
        return `<div class="vc-doc-line"><span class="vc-doc-label">${escapeHTML(label)} :</span> ${escapeHTML(value)}</div>`;
    }

    function blocTexte(titre, texte) {
        if (!texte) return "";
        return `<h2>${escapeHTML(titre)}</h2><p>${escapeHTML(texte).replace(/\n/g, "<br>")}</p>`;
    }

    function creerApercu() {
        try {
            let html = `
                <h1>❄️ Pro Clim</h1>
                <p>Compte rendu de visite chantier</p>
                <h2>Informations client</h2>
                ${ligne("Client", lire("vcClient"))}
                ${ligne("Adresse", lire("vcAdresse"))}
                ${ligne("Téléphone", lire("vcTelephone"))}
                ${ligne("Date", lire("vcDate") ? lire("vcDate").split("-").reverse().join("/") : "")}
                ${ligne("Projet", lire("vcProjet"))}

                <h2>Installation envisagée</h2>
                ${ligne("Type", lire("vcType"))}
                ${ligne("Marque", lire("vcMarque"))}
                ${ligne("Modèle", lire("vcModele"))}
                ${ligne("Puissance", lire("vcPuissance"))}
            `;

            const rooms = piecesVisite();

            if (rooms.length) {
                html += "<h2>Pièces et dimensions</h2>";

                rooms.forEach((p, i) => {
                    html += `
                        <div class="vc-doc-room">
                            <strong>${escapeHTML(p.nom || "Pièce " + (i + 1))}</strong>
                            ${p.longueur ? `<p>Longueur : ${p.longueur} m</p>` : ""}
                            ${p.largeur ? `<p>Largeur : ${p.largeur} m</p>` : ""}
                            ${p.hauteur ? `<p>Hauteur : ${p.hauteur} m</p>` : ""}
                            ${p.surface ? `<p>Surface : ${p.surface.toFixed(1)} m²</p>` : ""}
                            ${p.volume ? `<p>Volume : ${p.volume.toFixed(1)} m³</p>` : ""}
                            ${p.observation ? `<p>Observation : ${escapeHTML(p.observation).replace(/\n/g, "<br>")}</p>` : ""}
                        </div>
                    `;
                });
            }

            html += blocTexte("Accès et emplacement", lire("vcAcces"));
            html += blocTexte("Alimentation électrique", lire("vcElectricite"));
            html += blocTexte("Percements et passages", lire("vcPercements"));
            html += blocTexte("Autres contraintes", lire("vcContraintes"));

            const condensats = lire("vcCondensats");
            const point = lire("vcPointEvacuation");
            const materiel = nombre("vcCoutMateriel");
            const pose = nombre("vcCoutPose");

            if (condensats || point || materiel || pose) {
                html += "<h2>Gestion des condensats</h2>";
                html += ligne("Évacuation", condensats);
                html += ligne("Point d'évacuation", point);
                if (materiel) html += ligne("Matériel", euros(materiel));
                if (pose) html += ligne("Pose", euros(pose));
                if (materiel + pose) {
                    html += `<p class="vc-doc-total">Total estimé : ${euros(materiel + pose)}</p>`;
                }
            }

            html += blocTexte("Notes complémentaires", lire("vcNotes"));

            html += `
                <div class="vc-doc-footer">
                    Document établi avec Pro Clim — Assistant du technicien CVC.
                    <br>Les estimations sont basées sur les informations recueillies lors de la visite.
                </div>
            `;

            $("vcDocument").innerHTML = html;
            $("vcApercu").classList.add("vc-visible");

        } catch (erreur) {
            console.error("Pro Clim - Erreur création PDF :", erreur);
            alert("Impossible de créer l'aperçu : " + erreur.message);
        }
    }

    function imprimer() {
        try {
            if (!$("vcDocument").innerHTML.trim()) {
                alert("L'aperçu est vide. Crée d'abord le dossier.");
                return;
            }
            window.print();
        } catch (erreur) {
            alert("Erreur d'impression : " + erreur.message);
        }
    }

    function ouvrir() {
        $("vcApercu").classList.remove("vc-visible");
        $("visiteOverlay").classList.add("vc-visible");
    }

    function fermer() {
        $("visiteOverlay").classList.remove("vc-visible");
        $("vcApercu").classList.remove("vc-visible");
    }

    function initialiser() {
        styles();
        interfaceVisite();

        const zone = document.querySelector("#pageAccueil .quick-grid");

        if (zone && !$("btnVisiteChantier")) {
            const bouton = document.createElement("button");
            bouton.id = "btnVisiteChantier";
            bouton.type = "button";
            bouton.innerHTML = `🏠 Visite chantier<small>Préparer un dossier client</small>`;
            zone.appendChild(bouton);
        }
    }

    /* Gestion centralisée des clics :
       les boutons restent fonctionnels même si l'interface
       est déjà présente dans la page. */

    document.addEventListener("click", event => {
        const cible = event.target.closest("button");
        if (!cible) return;

        switch (cible.id) {
            case "btnVisiteChantier":
                ouvrir();
                break;

            case "vcAjouterPiece":
                ajouterPiece();
                break;

            case "vcCreerPDF":
                creerApercu();
                break;

            case "vcImprimer":
                imprimer();
                break;

            case "vcRetour":
                $("vcApercu").classList.remove("vc-visible");
                break;

            case "vcFermer":
                fermer();
                break;

            default:
                if (cible.classList.contains("vcSupprimer")) {
                    cible.closest(".vc-piece").remove();
                    document.querySelectorAll("#vcListePieces .vc-piece h4")
                        .forEach((titre, i) => titre.textContent = "Pièce " + (i + 1));
                }
        }
    });

    document.addEventListener("input", event => {
        if (event.target.id === "vcCoutMateriel" ||
            event.target.id === "vcCoutPose") {
            const total = nombre("vcCoutMateriel") + nombre("vcCoutPose");
            $("vcTotalCondensats").textContent = "Total : " + euros(total);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiser);
    } else {
        initialiser();
    }

})();
