/* ======================================================
   PRO CLIM - VISITE CHANTIER
   VERSION 4.0 - Rapport client professionnel
   Remplacement complet de js/visite-chantier.js
   ====================================================== */

(() => {
    "use strict";

    const $ = id => document.getElementById(id);
    let numeroPiece = 0;

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        })[c]);
    }

    function lire(id) {
        return $(id) ? String($(id).value || "").trim() : "";
    }

    function nombre(id) {
        const valeur = lire(id).replace(/\s/g, "").replace(",", ".");
        const resultat = Number(valeur);
        return Number.isFinite(resultat) && resultat > 0 ? resultat : 0;
    }

    function euros(valeur) {
        return Number(valeur || 0).toLocaleString("fr-FR", {
            style: "currency", currency: "EUR", maximumFractionDigits: 2
        });
    }

    function styles() {
        if ($("pcVisiteStyles")) return;
        const style = document.createElement("style");
        style.id = "pcVisiteStyles";
        style.textContent = `
            #btnVisiteChantier{width:100%;padding:16px;border:1px solid #dbe3ed;border-radius:12px;background:#fff;color:#0D47A1;font-size:16px;font-weight:800;text-align:left;cursor:pointer}
            #btnVisiteChantier small{display:block;color:#64748b;font-weight:400;margin-top:5px}
            #visiteOverlay,#vcApercu{display:none;position:fixed;inset:0;z-index:99990;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#eef2f7;padding:12px}
            #visiteOverlay.vc-visible,#vcApercu.vc-visible{display:block}
            .vc-container{max-width:720px;margin:auto;padding-bottom:35px}
            .vc-header{background:linear-gradient(135deg,#101b35,#0D47A1);color:#fff;padding:22px;border-radius:15px;margin-bottom:14px;box-shadow:0 8px 22px #0b1c3a22}
            .vc-header h2{margin:0 0 5px;font-size:22px}.vc-header p{margin:0;font-size:13px;color:#dbeafe}
            .vc-card{background:#fff;border:1px solid #e3e9f1;border-radius:13px;padding:16px;margin-bottom:13px;box-shadow:0 3px 12px #0b1c3a08}
            .vc-card h3{color:#0D47A1;margin:0 0 14px;font-size:16px}
            .vc-field{display:block;margin-bottom:12px;font-size:13px;font-weight:700;color:#334155}
            .vc-field input,.vc-field textarea,.vc-field select{display:block;box-sizing:border-box;width:100%;margin-top:5px;padding:11px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;font-size:15px;color:#172033}
            .vc-field textarea{min-height:75px}.vc-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
            .vc-piece{border:1px solid #dbe3ed;border-radius:10px;padding:12px;margin-bottom:10px}.vc-piece h4{color:#0D47A1;margin:0 0 10px}.vc-piece-result{font-size:12px;color:#475569;margin:5px 0 10px}
            .vc-button{display:block;width:100%;padding:14px;margin-top:8px;border:0;border-radius:9px;font-size:15px;font-weight:800;cursor:pointer}
            .vc-primary{background:#0D47A1;color:#fff}.vc-secondary{background:#e8f0fe;color:#0D47A1}.vc-danger{background:#fee2e2;color:#991b1b;font-size:12px}
            .vc-total{background:#eff6ff;padding:12px;border-radius:9px;color:#0D47A1;font-weight:800}
            .vc-preview-bar{max-width:850px;margin:0 auto 12px;background:#fff;padding:12px;border-radius:10px}
            .vc-document{box-sizing:border-box;max-width:850px;margin:0 auto 25px;padding:38px;background:#fff;color:#172033;font:13px/1.55 Arial,sans-serif;box-shadow:0 8px 28px #0b1c3a12}
            .vc-cover{background:linear-gradient(135deg,#101b35,#0D47A1);color:#fff;padding:27px;border-radius:12px;margin-bottom:25px;min-height:155px;display:flex;flex-direction:column;justify-content:space-between}
            .vc-cover img{display:block;max-width:175px;max-height:58px;object-fit:contain;object-position:left center;margin-bottom:18px}
            .vc-cover h1{color:#fff;font-size:25px;letter-spacing:.3px;margin:0}.vc-cover p{color:#dbeafe;margin:5px 0 0}
            .vc-cover-meta{margin-top:20px;padding-top:12px;border-top:1px solid #ffffff55;font-size:12px;color:#fff}
            .vc-document h2{color:#0D47A1;font-size:15px;letter-spacing:.4px;text-transform:uppercase;border-bottom:2px solid #dbeafe;padding-bottom:7px;margin:24px 0 10px;break-after:avoid}
            .vc-document p{overflow-wrap:anywhere;margin:7px 0}.vc-doc-line{padding:7px 0;border-bottom:1px solid #edf0f4;overflow-wrap:anywhere}.vc-doc-label{font-weight:700;color:#64748b}
            .vc-doc-room{border:1px solid #dbe3ed;border-radius:9px;padding:12px;margin:9px 0;break-inside:avoid}.vc-doc-room strong{color:#0D47A1}
            .vc-doc-total{background:#101b35;color:#fff;padding:16px;border-radius:9px;font-size:18px;font-weight:800;text-align:right;margin-top:12px;break-inside:avoid}
            .vc-finance{width:100%;border-collapse:collapse;margin-top:8px}.vc-finance td{padding:10px 8px;border-bottom:1px solid #e5eaf1}.vc-finance td:last-child{text-align:right;font-weight:700;white-space:nowrap}
            .vc-doc-footer{margin-top:30px;border-top:1px solid #dbe3ed;padding-top:12px;color:#64748b;font-size:10px;display:flex;justify-content:space-between;gap:10px}
            @media(max-width:520px){.vc-document{padding:20px}.vc-grid{grid-template-columns:1fr 1fr}}
            @media print{@page{size:A4;margin:13mm}body *{visibility:hidden!important}#vcApercu,#vcApercu *{visibility:visible!important}#vcApercu{display:block!important;position:absolute!important;inset:0!important;padding:0!important;overflow:visible!important;background:#fff!important}.vc-preview-bar{display:none!important}#vcDocument{display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;box-shadow:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.vc-cover{break-inside:avoid}}
        `;
        document.head.appendChild(style);
    }

    function interfaceVisite() {
        if (!$('visiteOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'visiteOverlay';
            overlay.innerHTML = `
                <div class="vc-container">
                    <div class="vc-header"><h2>🏠 Visite chantier</h2><p>Préparation et compte rendu de visite technique</p></div>
                    <section class="vc-card"><h3>1. Informations client</h3>
                        <label class="vc-field">Client<input id="vcClient" placeholder="Nom du client"></label>
                        <label class="vc-field">Adresse<input id="vcAdresse" placeholder="Adresse du chantier"></label>
                        <div class="vc-grid"><label class="vc-field">Téléphone<input id="vcTelephone" type="tel"></label><label class="vc-field">Date<input id="vcDate" type="date"></label></div>
                        <label class="vc-field">Projet<input id="vcProjet" placeholder="Ex. : Climatisation salon"></label>
                    </section>
                    <section class="vc-card"><h3>2. Installation envisagée</h3>
                        <label class="vc-field">Type<select id="vcType"><option value="">À définir</option><option>Split mural</option><option>Multi-split</option><option>Gainable</option><option>Autre</option></select></label>
                        <div class="vc-grid"><label class="vc-field">Marque<input id="vcMarque" placeholder="Facultatif"></label><label class="vc-field">Modèle<input id="vcModele" placeholder="Facultatif"></label></div>
                        <label class="vc-field">Puissance<input id="vcPuissance" placeholder="Ex. : 3,5 kW"></label>
                    </section>
                    <section class="vc-card"><h3>3. Pièces et dimensions</h3><div id="vcListePieces"></div><button type="button" class="vc-button vc-secondary" id="vcAjouterPiece">＋ Ajouter une pièce</button></section>
                    <section class="vc-card"><h3>4. Accès et contraintes techniques</h3>
                        <label class="vc-field">Accès et emplacement<textarea id="vcAcces" placeholder="Ex. : 5e étage sans ascenseur"></textarea></label>
                        <label class="vc-field">Alimentation électrique<textarea id="vcElectricite" placeholder="Informations électriques"></textarea></label>
                        <label class="vc-field">Percements et passages<textarea id="vcPercements"></textarea></label>
                        <label class="vc-field">Autres contraintes<textarea id="vcContraintes"></textarea></label>
                    </section>
                    <section class="vc-card"><h3>5. Gestion des condensats</h3>
                        <label class="vc-field">Évacuation<select id="vcCondensats"><option value="">Non renseigné</option><option>Évacuation gravitaire</option><option>Pompe de relevage</option><option>À confirmer</option></select></label>
                        <label class="vc-field">Point d'évacuation<input id="vcPointEvacuation"></label>
                        <div class="vc-grid"><label class="vc-field">Matériel (€)<input id="vcCoutMateriel" type="number" min="0" step="0.01"></label><label class="vc-field">Pose (€)<input id="vcCoutPose" type="number" min="0" step="0.01"></label></div>
                        <div class="vc-total" id="vcTotalCondensats">Total : 0,00 €</div>
                    </section>
                    <section class="vc-card"><h3>6. Proposition financière</h3><p style="font-size:12px;color:#64748b;margin-top:-5px">Renseigne les montants destinés au client. Le détail du rapport restera volontairement simple.</p><button type="button" class="vc-button vc-secondary" id="vcAccederBudgetPro">Ouvrir le formulaire Budget Pro</button>
                        <label class="vc-field">Prix des appareils de climatisation (€ TTC)<input id="vcPrixAppareils" type="number" min="0" step="0.01" placeholder="0,00"></label>
                        <label class="vc-field">Consommables (€ TTC)<input id="vcPrixConsommables" type="number" min="0" step="0.01" placeholder="0,00"></label>
                        <label class="vc-field">Électricité / fournitures électriques (€ TTC)<input id="vcPrixElectricite" type="number" min="0" step="0.01" placeholder="0,00"></label>
                        <label class="vc-field">Mise en service (€ TTC)<input id="vcPrixMiseService" type="number" min="0" step="0.01" placeholder="0,00"></label>
                        <div class="vc-total" id="vcPrixFinal">Prix final TTC : 0,00 €</div>
                    </section>
                    <section class="vc-card"><h3>7. Observations</h3><label class="vc-field">Notes complémentaires<textarea id="vcNotes"></textarea></label></section>
                    <button type="button" class="vc-button vc-primary" id="vcCreerPDF">📄 Créer le rapport PDF</button>
                    <button type="button" class="vc-button vc-secondary" id="vcFermer">Fermer la visite</button>
                </div>`;
            document.body.appendChild(overlay);
        }
        if (!$('vcApercu')) {
            const preview = document.createElement('div');
            preview.id = 'vcApercu';
            preview.innerHTML = `<div class="vc-preview-bar"><p>Vérifie ton rapport, puis lance l'impression. Sur iPhone, utilise le partage pour enregistrer le PDF dans Fichiers.</p><button type="button" class="vc-button vc-primary" id="vcImprimer">🖨️ Imprimer / Enregistrer en PDF</button><button type="button" class="vc-button vc-secondary" id="vcRetour">Retour à la visite</button></div><article class="vc-document" id="vcDocument"></article>`;
            document.body.appendChild(preview);
        }
        if (!$('vcDate').value) $('vcDate').value = new Date().toISOString().slice(0, 10);
        if (!$('vcListePieces').children.length) {
            let rooms = [];
            try { if (window.PROCLIM?.getRooms) rooms = window.PROCLIM.getRooms() || []; } catch (e) { console.warn(e); }
            if (rooms.length) rooms.forEach(room => ajouterPiece(room)); else ajouterPiece();
        }
    }

    function ajouterPiece(room = {}) {
        numeroPiece++;
        const bloc = document.createElement('div');
        bloc.className = 'vc-piece';
        bloc.innerHTML = `
            <h4>Pièce ${numeroPiece}</h4>
            <label class="vc-field">Nom de la pièce<input class="vc-nom" placeholder="Ex. : Salon" value="${escapeHTML(room.nom || '')}"></label>
            <div class="vc-grid">
                <label class="vc-field">Longueur (m)<input class="vc-longueur" type="number" min="0" step="0.01" value="${escapeHTML(room.longueur || '')}"></label>
                <label class="vc-field">Largeur (m)<input class="vc-largeur" type="number" min="0" step="0.01" value="${escapeHTML(room.largeur || '')}"></label>
                <label class="vc-field">Hauteur (m)<input class="vc-hauteur" type="number" min="0" step="0.01" value="${escapeHTML(room.hauteur || '')}"></label>
            </div>
            <div class="vc-piece-result">Surface : — | Volume : —</div>
            <label class="vc-field">Observation<textarea class="vc-observation"></textarea></label>
            <button type="button" class="vc-button vc-danger vcSupprimer">Supprimer cette pièce</button>`;
        $('vcListePieces').appendChild(bloc);
        bloc.querySelectorAll('input').forEach(input => input.addEventListener('input', () => calculerPiece(bloc)));
        calculerPiece(bloc);
    }

    function calculerPiece(bloc) {
        const l = Number(bloc.querySelector('.vc-longueur').value) || 0;
        const w = Number(bloc.querySelector('.vc-largeur').value) || 0;
        const h = Number(bloc.querySelector('.vc-hauteur').value) || 0;
        const surface = l && w ? l * w : 0;
        const volume = surface && h ? surface * h : 0;
        bloc.querySelector('.vc-piece-result').textContent = `Surface : ${surface ? surface.toFixed(1) + ' m²' : '—'} | Volume : ${volume ? volume.toFixed(1) + ' m³' : '—'}`;
    }

    function piecesVisite() {
        return Array.from(document.querySelectorAll('#vcListePieces .vc-piece')).map(bloc => {
            const l = Number(bloc.querySelector('.vc-longueur').value) || 0;
            const w = Number(bloc.querySelector('.vc-largeur').value) || 0;
            const h = Number(bloc.querySelector('.vc-hauteur').value) || 0;
            const surface = l && w ? l * w : 0;
            return { nom: bloc.querySelector('.vc-nom').value.trim(), longueur: l, largeur: w, hauteur: h, surface, volume: surface && h ? surface * h : 0, observation: bloc.querySelector('.vc-observation').value.trim() };
        }).filter(p => p.nom || p.longueur || p.largeur || p.hauteur || p.observation);
    }

    function ligne(label, value) {
        if (value === '' || value === null || value === undefined) return '';
        return `<div class="vc-doc-line"><span class="vc-doc-label">${escapeHTML(label)} :</span> ${escapeHTML(value)}</div>`;
    }

    function blocTexte(titre, texte) {
        if (!texte) return '';
        return `<h2>${escapeHTML(titre)}</h2><p>${escapeHTML(texte).replace(/\n/g, '<br>')}</p>`;
    }

    function creerApercu() {
        try {
            const date = lire('vcDate') ? lire('vcDate').split('-').reverse().join('/') : '';
            const logo = 'assets/logo-pro-clim-transparent.png.png?v=2';
            let html = `
                <div class="vc-cover">
                    <div><img src="${logo}" alt="Pro Clim" onerror="this.style.display='none'"><h1>RAPPORT DE VISITE TECHNIQUE</h1><p>Étude • diagnostic • préparation de l'installation</p></div>
                    <div class="vc-cover-meta"><strong>${escapeHTML(lire('vcProjet') || 'Projet de climatisation')}</strong><br>${escapeHTML(lire('vcClient') || 'Client non renseigné')} ${lire('vcAdresse') ? '— ' + escapeHTML(lire('vcAdresse')) : ''}<br>${date ? 'Visite du ' + escapeHTML(date) : ''}</div>
                </div>
                <h2>Informations client</h2>
                ${ligne('Client', lire('vcClient'))}${ligne('Adresse du chantier', lire('vcAdresse'))}${ligne('Téléphone', lire('vcTelephone'))}${ligne('Date de visite', date)}${ligne('Projet', lire('vcProjet'))}
                <h2>Solution technique envisagée</h2>
                ${ligne('Type d’installation', lire('vcType'))}${ligne('Marque', lire('vcMarque'))}${ligne('Modèle', lire('vcModele'))}${ligne('Puissance', lire('vcPuissance'))}`;

            const rooms = piecesVisite();
            if (rooms.length) {
                html += '<h2>Pièces et caractéristiques</h2>';
                rooms.forEach((p, i) => {
                    html += `<div class="vc-doc-room"><strong>${escapeHTML(p.nom || 'Pièce ' + (i + 1))}</strong>
                        ${p.longueur ? `<p>Longueur : ${p.longueur} m</p>` : ''}${p.largeur ? `<p>Largeur : ${p.largeur} m</p>` : ''}${p.hauteur ? `<p>Hauteur : ${p.hauteur} m</p>` : ''}${p.surface ? `<p>Surface : ${p.surface.toFixed(1)} m²</p>` : ''}${p.volume ? `<p>Volume : ${p.volume.toFixed(1)} m³</p>` : ''}${p.observation ? `<p><strong>Observation :</strong> ${escapeHTML(p.observation).replace(/\n/g, '<br>')}</p>` : ''}</div>`;
                });
            }
            html += blocTexte('Accès et emplacement', lire('vcAcces'));
            html += blocTexte('Alimentation électrique', lire('vcElectricite'));
            html += blocTexte('Percements et passages', lire('vcPercements'));
            html += blocTexte('Contraintes particulières', lire('vcContraintes'));

            const condensats = lire('vcCondensats');
            const point = lire('vcPointEvacuation');
            const coutCondensats = nombre('vcCoutMateriel') + nombre('vcCoutPose');
            if (condensats || point || coutCondensats) {
                html += '<h2>Gestion des condensats</h2>' + ligne('Mode d’évacuation', condensats) + ligne('Point d’évacuation', point);
                if (nombre('vcCoutMateriel')) html += ligne('Matériel condensats', euros(nombre('vcCoutMateriel')));
                if (nombre('vcCoutPose')) html += ligne('Pose condensats', euros(nombre('vcCoutPose')));
                if (coutCondensats) html += ligne('Total estimatif condensats', euros(coutCondensats));
            }

            const postes = [
                ['Appareils de climatisation', nombre('vcPrixAppareils')],
                ['Consommables', nombre('vcPrixConsommables')],
                ['Électricité / fournitures électriques', nombre('vcPrixElectricite')],
                ['Mise en service', nombre('vcPrixMiseService')]
            ];
            const postesRenseignes = postes.filter(p => p[1] > 0);
            const total = postesRenseignes.reduce((s, p) => s + p[1], 0);
            if (postesRenseignes.length) {
                html += '<h2>Proposition financière</h2><p>Montants exprimés toutes taxes comprises (TTC).</p><table class="vc-finance"><tbody>';
                postesRenseignes.forEach(p => { html += `<tr><td>${escapeHTML(p[0])}</td><td>${euros(p[1])}</td></tr>`; });
                html += `</tbody></table><div class="vc-doc-total">PRIX FINAL TTC&nbsp;&nbsp; ${euros(total)}</div>`;
            }
            html += blocTexte('Observations et recommandations', lire('vcNotes'));
            html += `<div class="vc-doc-footer"><span><strong>PRO CLIM</strong> — Assistant du technicien CVC<br>Étude • diagnostic • formation</span><span>Rapport de visite technique<br>Document généré avec Pro Clim</span></div>`;
            $('vcDocument').innerHTML = html;
            $('vcApercu').classList.add('vc-visible');
        } catch (erreur) {
            console.error('Pro Clim - Erreur création rapport :', erreur);
            alert('Impossible de créer le rapport : ' + erreur.message);
        }
    }

    function actualiserTotaux() {
        const condensats = nombre('vcCoutMateriel') + nombre('vcCoutPose');
        if ($('vcTotalCondensats')) $('vcTotalCondensats').textContent = 'Total : ' + euros(condensats);
        const total = nombre('vcPrixAppareils') + nombre('vcPrixConsommables') + nombre('vcPrixElectricite') + nombre('vcPrixMiseService');
        if ($('vcPrixFinal')) $('vcPrixFinal').textContent = 'Prix final TTC : ' + euros(total);
    }

    function imprimer() {
        try {
            if (!$('vcDocument').innerHTML.trim()) { alert('L’aperçu est vide. Crée d’abord le rapport.'); return; }
            window.print();
        } catch (erreur) { alert('Erreur d’impression : ' + erreur.message); }
    }

    function ouvrir() {
        $('vcApercu').classList.remove('vc-visible');
        $('visiteOverlay').classList.add('vc-visible');
    }

    function fermer() {
        $('visiteOverlay').classList.remove('vc-visible');
        $('vcApercu').classList.remove('vc-visible');
    }

    function initialiser() {
        styles();
        interfaceVisite();
        const zone = document.querySelector('#pageAccueil .quick-grid');
        if (zone && !$('btnVisiteChantier')) {
            const bouton = document.createElement('button');
            bouton.id = 'btnVisiteChantier';
            bouton.type = 'button';
            bouton.innerHTML = '🏠 Visite chantier<small>Préparer un rapport client professionnel</small>';
            zone.appendChild(bouton);
        }
        actualiserTotaux();
    }

    document.addEventListener('click', event => {
        const cible = event.target.closest('button');
        if (!cible) return;
        switch (cible.id) {
            case 'btnVisiteChantier': ouvrir(); break;
            case 'vcAjouterPiece': ajouterPiece(); break;
            case 'vcCreerPDF': creerApercu(); break;
            case 'vcImprimer': imprimer(); break;
            case 'vcRetour': $('vcApercu').classList.remove('vc-visible'); break;
            case 'vcFermer': fermer(); break;
            case 'vcAccederBudgetPro': {
                const budget = $('budgetProClim');
                if (budget) {
                    $('visiteOverlay').classList.remove('vc-visible');
                    budget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    alert('Le formulaire Budget Pro n’est pas encore disponible. Lance d’abord une étude pour afficher le budget.');
                }
                break;
            }
            default:
                if (cible.classList.contains('vcSupprimer')) {
                    cible.closest('.vc-piece').remove();
                    document.querySelectorAll('#vcListePieces .vc-piece h4').forEach((titre, i) => titre.textContent = 'Pièce ' + (i + 1));
                }
        }
    });

    document.addEventListener('input', event => {
        if (event.target.matches('#vcCoutMateriel,#vcCoutPose,#vcPrixAppareils,#vcPrixConsommables,#vcPrixElectricite,#vcPrixMiseService')) actualiserTotaux();
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiser);
    else initialiser();
})();
