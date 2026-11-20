
/* ==========================================================
   PRO CLIM — DIAGNOSTIC MULTIMARQUE
   Version 1 — Recherche défauts, diagnostic guidé et mesures
   ========================================================== */

(function () {
    "use strict";

    const MARQUES = [
        "Daikin",
        "Mitsubishi Electric",
        "Mitsubishi Heavy Industries",
        "Samsung",
        "Atlantic",
        "Fujitsu",
        "LG",
        "Panasonic",
        "Toshiba",
        "Hitachi",
        "Toshiba Carrier",
        "Autre"
    ];

    const TYPES = [
        "Split mural",
        "Multi-split",
        "Gainable",
        "Cassette",
        "Console",
        "DRV / VRV",
        "Pompe à chaleur",
        "Autre"
    ];

    const SYMPTOMES = [
        { value: "plus_de_froid", label: "Ne fait plus de froid" },
        { value: "plus_de_chauffage", label: "Ne fait plus de chauffage" },
        { value: "ne_demarre_pas", label: "Ne démarre pas" },
        { value: "s_arrete", label: "Démarre puis s'arrête" },
        { value: "soufflage_faible", label: "Soufflage faible" },
        { value: "givre", label: "Formation de givre" },
        { value: "bruit", label: "Bruit anormal" },
        { value: "fuite_eau", label: "Fuite d'eau" },
        { value: "autre", label: "Autre problème" }
    ];

    let diagnosticActif = false;
    let etapeDiagnostic = 0;
    let reponsesDiagnostic = [];

    const PARCOURS = {
        plus_de_froid: [
            {
                question: "L'unité intérieure souffle-t-elle de l'air ?",
                oui: "Contrôler la température de soufflage et poursuivre les vérifications.",
                non: "Contrôler l'alimentation, la commande, les sécurités et le ventilateur intérieur."
            },
            {
                question: "Le groupe extérieur fonctionne-t-il ?",
                oui: "Vérifier le fonctionnement du compresseur et du ventilateur extérieur.",
                non: "Contrôler l'alimentation du groupe, les protections, les commandes et les défauts enregistrés."
            },
            {
                question: "Le compresseur fonctionne-t-il réellement ?",
                oui: "Relever les pressions, les températures des tuyauteries et les conditions de fonctionnement.",
                non: "Contrôler les autorisations de démarrage, les sécurités, les sondes et la commande inverter."
            },
            {
                question: "Le débit d'air intérieur est-il correct ?",
                oui: "Contrôler les températures et les paramètres frigorifiques en fonctionnement stabilisé.",
                non: "Contrôler les filtres, la batterie, le ventilateur et les obstacles au passage d'air."
            }
        ],

        plus_de_chauffage: [
            {
                question: "L'unité intérieure souffle-t-elle de l'air ?",
                oui: "Relever la température de reprise et la température de soufflage.",
                non: "Contrôler la commande, les sécurités et le ventilateur intérieur."
            },
            {
                question: "Le groupe extérieur fonctionne-t-il ?",
                oui: "Vérifier le compresseur, le ventilateur et le cycle de fonctionnement.",
                non: "Contrôler l'alimentation, les sécurités et les défauts de commande."
            },
            {
                question: "Le groupe extérieur est-il fortement givré ?",
                oui: "Vérifier les conditions extérieures, le dégivrage, les sondes et les échanges thermiques.",
                non: "Relever les pressions et températures après stabilisation."
            }
        ],

        ne_demarre_pas: [
            {
                question: "L'appareil est-il alimenté électriquement ?",
                oui: "Contrôler la commande, les codes défauts et les autorisations de fonctionnement.",
                non: "Faire contrôler l'alimentation, le disjoncteur et les protections électriques."
            },
            {
                question: "Un code défaut est-il affiché ?",
                oui: "Saisir le code dans la recherche multimarque pour identifier la documentation à consulter.",
                non: "Contrôler la télécommande, les liaisons, les sécurités et les cartes de commande."
            }
        ],

        s_arrete: [
            {
                question: "L'arrêt se produit-il après quelques minutes ?",
                oui: "Noter le délai exact et relever le code défaut éventuel.",
                non: "Préciser si l'arrêt est immédiat ou aléatoire."
            },
            {
                question: "Un code défaut apparaît-il après l'arrêt ?",
                oui: "Relever le code, la marque et la référence exacte de l'appareil.",
                non: "Contrôler les sécurités, les sondes et les conditions de fonctionnement."
            }
        ],

        soufflage_faible: [
            {
                question: "Les filtres sont-ils propres ?",
                oui: "Contrôler la batterie et la vitesse du ventilateur.",
                non: "Nettoyer les filtres puis contrôler à nouveau le débit d'air."
            },
            {
                question: "Le ventilateur tourne-t-il normalement ?",
                oui: "Contrôler l'encrassement de la batterie et les obstacles au soufflage.",
                non: "Contrôler le moteur, sa commande et les connexions."
            }
        ],

        givre: [
            {
                question: "Le givre se forme-t-il sur l'unité intérieure ?",
                oui: "Contrôler le débit d'air, les filtres, la batterie et les conditions de fonctionnement.",
                non: "Si le givre est sur le groupe extérieur, vérifier le mode, les conditions extérieures et le cycle de dégivrage."
            },
            {
                question: "Le débit d'air est-il correct ?",
                oui: "Relever les températures et les paramètres frigorifiques.",
                non: "Contrôler les filtres, la batterie et le ventilateur."
            }
        ],

        bruit: [
            {
                question: "Le bruit provient-il de l'unité intérieure ?",
                oui: "Contrôler le ventilateur, les fixations, les vibrations et l'écoulement des condensats.",
                non: "Contrôler le ventilateur extérieur, les fixations et les vibrations du groupe."
            }
        ],

        fuite_eau: [
            {
                question: "L'eau provient-elle de l'unité intérieure ?",
                oui: "Contrôler le bac à condensats, la pente, l'évacuation et la pompe éventuelle.",
                non: "Localiser précisément l'origine avant toute intervention."
            },
            {
                question: "L'évacuation des condensats est-elle libre ?",
                oui: "Contrôler le bac, les raccordements et l'isolation des tuyauteries.",
                non: "Déboucher et vérifier la pente ainsi que le fonctionnement de la pompe."
            }
        ],

        autre: [
            {
                question: "Un code défaut est-il présent ?",
                oui: "Saisir la marque, la référence et le code dans la recherche multimarque.",
                non: "Décrire précisément le symptôme et les conditions dans lesquelles il apparaît."
            }
        ]
    };

    function echapper(texte) {
        return String(texte ?? "").replace(/[&<>"']/g, function (caractere) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[caractere];
        });
    }

    function champ(id, label, type = "text", placeholder = "") {
        return `
            <label class="pcdiag-label" for="${id}">${label}</label>
            <input class="pcdiag-input" id="${id}" type="${type}"
                placeholder="${placeholder}" autocomplete="off">
        `;
    }

    function selectHTML(id, label, options, premier) {
        return `
            <label class="pcdiag-label" for="${id}">${label}</label>
            <select class="pcdiag-input" id="${id}">
                <option value="">${premier}</option>
                ${options.map(option => `
                    <option value="${echapper(option)}">${echapper(option)}</option>
                `).join("")}
            </select>
        `;
    }

    function bouton(id, texte, couleur = "principal") {
        return `<button type="button" class="pcdiag-btn pcdiag-${couleur}" id="${id}">${texte}</button>`;
    }

    function ajouterStyles() {
        if (document.getElementById("pcdiag-styles")) return;

        const style = document.createElement("style");
        style.id = "pcdiag-styles";
        style.textContent = `
            #pcDiagApp { color: inherit; width: 100%; }
            #pcDiagApp * { box-sizing: border-box; }
            .pcdiag-card {
                background: var(--card-bg, #fff);
                border: 1px solid rgba(100,100,100,.2);
                border-radius: 14px;
                padding: 16px;
                margin: 14px 0;
            }
            .pcdiag-title { font-size: 19px; font-weight: 700; margin: 0 0 8px; }
            .pcdiag-subtitle { font-size: 14px; opacity: .75; margin: 0 0 14px; }
            .pcdiag-label { display:block; font-weight:600; font-size:14px; margin:12px 0 6px; }
            .pcdiag-input {
                display:block; width:100%; min-height:44px; padding:10px 12px;
                border:1px solid #aaa; border-radius:9px; background:transparent;
                color:inherit; font:inherit;
            }
            .pcdiag-btn {
                display:block; width:100%; border:0; border-radius:10px;
                padding:13px 14px; margin-top:12px; font-size:15px;
                font-weight:700; cursor:pointer;
            }
            .pcdiag-principal { background:#0D47A1; color:white; }
            .pcdiag-secondaire { background:#e8eef8; color:#0D47A1; }
            .pcdiag-resultat {
                padding:13px; border-radius:10px; margin-top:12px;
                background:rgba(13,71,161,.08); line-height:1.5;
            }
            .pcdiag-warning {
                padding:12px; border-left:4px solid #d58a00;
                background:rgba(213,138,0,.09); border-radius:7px;
                font-size:13px; line-height:1.5; margin-top:12px;
            }
            .pcdiag-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
            .pcdiag-small { font-size:12px; opacity:.7; }
            .pcdiag-link { display:inline-block; margin-top:12px; color:#1565c0; font-weight:700; }
            .pcdiag-separateur { border:0; border-top:1px solid rgba(120,120,120,.2); margin:18px 0; }
            @media(max-width:380px) { .pcdiag-grid { grid-template-columns:1fr; } }
        `;
        document.head.appendChild(style);
    }

    function afficherInterface() {
        const page = document.getElementById("pageDiagnostic");
        if (!page) {
            console.error("Pro Clim : pageDiagnostic introuvable.");
            return;
        }

        ajouterStyles();

        let app = document.getElementById("pcDiagApp");
        if (!app) {
            app = document.createElement("div");
            app.id = "pcDiagApp";
            page.innerHTML = "";
            page.appendChild(app);
        }

        app.innerHTML = `
            <div class="pcdiag-card">
                <h2 class="pcdiag-title">🔧 Diagnostic intelligent CVC</h2>
                <p class="pcdiag-subtitle">
                    Recherche de défauts multimarque et aide au dépannage terrain.
                </p>

                ${selectHTML("pcDiagMarque", "Fabricant", MARQUES, "Choisir une marque")}
                ${selectHTML("pcDiagType", "Type d'installation", TYPES, "Choisir un appareil")}
                ${champ("pcDiagModele", "Référence / modèle", "text", "Ex. : RXM... / PUZ...")}
                ${champ("pcDiagCode", "Code erreur", "text", "Ex. : code affiché sur l'appareil")}

                <label class="pcdiag-label" for="pcDiagPhoto">
                    Photo de l'afficheur ou de la plaque signalétique (facultatif)
                </label>
                <input class="pcdiag-input" id="pcDiagPhoto" type="file" accept="image/*" capture="environment">
                <p class="pcdiag-small" id="pcDiagPhotoNom">Aucune photo sélectionnée.</p>

                ${bouton("pcDiagRechercher", "Rechercher le code défaut")}
                <div id="pcDiagCodeResultat" aria-live="polite"></div>
            </div>

            <div class="pcdiag-card">
                <h2 class="pcdiag-title">🧭 Diagnostic guidé</h2>
                <p class="pcdiag-subtitle">
                    Décris le symptôme pour suivre les contrôles étape par étape.
                </p>
                ${selectHTML("pcDiagSymptome", "Symptôme constaté", SYMPTOMES.map(s => s.label), "Choisir un symptôme")}
                ${bouton("pcDiagDemarrer", "Démarrer le diagnostic")}
                <div id="pcDiagParcours" aria-live="polite"></div>
            </div>

            <div class="pcdiag-card">
                <h2 class="pcdiag-title">📏 Relevé des mesures</h2>
                <p class="pcdiag-subtitle">
                    Enregistre les conditions de fonctionnement et les mesures terrain.
                </p>

                <div class="pcdiag-grid">
                    ${champ("pcDiagFluide", "Fluide frigorigène", "text", "Ex. : R32")}
                    ${champ("pcDiagMode", "Mode de fonctionnement", "text", "Froid / chaud")}
                    ${champ("pcDiagExt", "Température extérieure (°C)", "number", "Ex. : 32")}
                    ${champ("pcDiagReprise", "Température reprise (°C)", "number", "Ex. : 27")}
                    ${champ("pcDiagSoufflage", "Température soufflage (°C)", "number", "Ex. : 12")}
                    ${champ("pcDiagBP", "Basse pression (bar)", "number", "Ex. : 8")}
                    ${champ("pcDiagHP", "Haute pression (bar)", "number", "Ex. : 24")}
                    ${champ("pcDiagAspiration", "Température tuyau gaz (°C)", "number", "Ex. : 14")}
                    ${champ("pcDiagLiquide", "Température tuyau liquide (°C)", "number", "Ex. : 35")}
                    ${champ("pcDiagIntensite", "Intensité mesurée (A)", "number", "Ex. : 5.2")}
                </div>

                <label class="pcdiag-label" for="pcDiagNotes">Observations complémentaires</label>
                <textarea class="pcdiag-input" id="pcDiagNotes" rows="3"
                    placeholder="Conditions, comportement, observations..."></textarea>

                ${bouton("pcDiagEnregistrerMesures", "Enregistrer et analyser les mesures")}
                <div id="pcDiagMesuresResultat" aria-live="polite"></div>
            </div>
        `;

        connecterEvenements();
    }

    function valeur(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function rechercherCode() {
        const marque = valeur("pcDiagMarque");
        const modele = valeur("pcDiagModele");
        const code = valeur("pcDiagCode");
        const type = valeur("pcDiagType");
        const resultat = document.getElementById("pcDiagCodeResultat");

        if (!marque || !code) {
            resultat.innerHTML = `
                <div class="pcdiag-warning">
                    Sélectionne au minimum une marque et renseigne le code défaut.
                </div>`;
            return;
        }

        const recherche = [
            marque,
            type,
            modele,
            "code erreur",
            code,
            "notice technique PDF"
        ].filter(Boolean).join(" ");

        const url = "https://www.google.com/search?q=" + encodeURIComponent(recherche);

        resultat.innerHTML = `
            <div class="pcdiag-resultat">
                <strong>Recherche documentaire lancée pour :</strong><br>
                Fabricant : ${echapper(marque)}<br>
                ${modele ? "Modèle : " + echapper(modele) + "<br>" : ""}
                Code : ${echapper(code)}

                <div class="pcdiag-warning">
                    Le code n'est pas encore présent dans la base de défauts vérifiés de Pro Clim.
                    Aucune signification ne sera inventée.
                    Vérifie que la documentation correspond exactement à la référence et à la génération de l'appareil.
                </div>

                <a class="pcdiag-link" href="${url}" target="_blank" rel="noopener noreferrer">
                    🔎 Rechercher la documentation et le code
                </a>
            </div>
        `;
    }

    function demarrerDiagnostic() {
        const symptomeLabel = valeur("pcDiagSymptome");
        const symptome = SYMPTOMES.find(s => s.label === symptomeLabel);

        const zone = document.getElementById("pcDiagParcours");

        if (!symptome) {
            zone.innerHTML = `<div class="pcdiag-warning">Choisis d'abord le symptôme constaté.</div>`;
            return;
        }

        const parcours = PARCOURS[symptome.value] || PARCOURS.autre;
        diagnosticActif = true;
        etapeDiagnostic = 0;
        reponsesDiagnostic = [];

        afficherEtape(parcours);
    }

    function afficherEtape(parcours) {
        const zone = document.getElementById("pcDiagParcours");

        if (!diagnosticActif || etapeDiagnostic >= parcours.length) {
            afficherFinDiagnostic();
            return;
        }

        const etape = parcours[etapeDiagnostic];

        zone.innerHTML = `
            <div class="pcdiag-resultat">
                <strong>Étape ${etapeDiagnostic + 1} / ${parcours.length}</strong>
                <p>${echapper(etape.question)}</p>
                <div class="pcdiag-grid">
                    <button type="button" class="pcdiag-btn pcdiag-principal" id="pcDiagOui">Oui</button>
                    <button type="button" class="pcdiag-btn pcdiag-secondaire" id="pcDiagNon">Non</button>
                </div>
                <button type="button" class="pcdiag-btn pcdiag-secondaire" id="pcDiagArreter">Arrêter le diagnostic</button>
            </div>
        `;

        document.getElementById("pcDiagOui").addEventListener("click", () => repondre(true, parcours));
        document.getElementById("pcDiagNon").addEventListener("click", () => repondre(false, parcours));
        document.getElementById("pcDiagArreter").addEventListener("click", () => {
            diagnosticActif = false;
            zone.innerHTML = `<div class="pcdiag-resultat">Diagnostic interrompu.</div>`;
        });
    }

    function repondre(oui, parcours) {
        const etape = parcours[etapeDiagnostic];

        reponsesDiagnostic.push({
            question: etape.question,
            reponse: oui ? "Oui" : "Non",
            conseil: oui ? etape.oui : etape.non
        });

        etapeDiagnostic++;

        if (etapeDiagnostic < parcours.length) {
            afficherEtape(parcours);
        } else {
            afficherFinDiagnostic();
        }
    }

    function afficherFinDiagnostic() {
        diagnosticActif = false;

        const zone = document.getElementById("pcDiagParcours");

        zone.innerHTML = `
            <div class="pcdiag-resultat">
                <strong>Compte rendu du parcours</strong>
                ${reponsesDiagnostic.map((r, i) => `
                    <p>
                        <strong>${i + 1}. ${echapper(r.question)}</strong><br>
                        Réponse : ${echapper(r.reponse)}<br>
                        <span>${echapper(r.conseil)}</span>
                    </p>
                `).join("")}
                <div class="pcdiag-warning">
                    Ces indications orientent les contrôles mais ne constituent pas une conclusion de panne.
                    Confirme chaque hypothèse par des mesures adaptées et la documentation constructeur.
                </div>
                <button type="button" class="pcdiag-btn pcdiag-principal" id="pcDiagRecommencer">
                    Recommencer
                </button>
            </div>
        `;

        document.getElementById("pcDiagRecommencer").addEventListener("click", demarrerDiagnostic);
    }

    function enregistrerMesures() {
        const ids = [
            "pcDiagFluide", "pcDiagMode", "pcDiagExt", "pcDiagReprise",
            "pcDiagSoufflage", "pcDiagBP", "pcDiagHP", "pcDiagAspiration",
            "pcDiagLiquide", "pcDiagIntensite", "pcDiagNotes"
        ];

        const mesures = {};
        ids.forEach(id => mesures[id] = valeur(id));

        const zone = document.getElementById("pcDiagMesuresResultat");
        const reprise = parseFloat(mesures.pcDiagReprise);
        const soufflage = parseFloat(mesures.pcDiagSoufflage);

        let analyse = "";

        if (Number.isFinite(reprise) && Number.isFinite(soufflage)) {
            const delta = reprise - soufflage;
            analyse += `
                <p><strong>Écart reprise / soufflage :</strong> ${delta.toFixed(1)} °C</p>
                <p class="pcdiag-small">
                    Écart calculé à partir des deux températures saisies.
                    Son interprétation dépend du mode, du débit d'air, de la charge thermique et de la stabilisation.
                </p>
            `;
        } else {
            analyse += `<p>Renseigne les températures de reprise et de soufflage pour calculer leur écart.</p>`;
        }

        const champsRenseignes = Object.values(mesures).filter(v => v !== "").length;

        zone.innerHTML = `
            <div class="pcdiag-resultat">
                <strong>Relevé enregistré dans cette session.</strong>
                <p>${champsRenseignes} champ(s) renseigné(s).</p>
                ${analyse}
                <div class="pcdiag-warning">
                    Les pressions seules ne permettent pas de conclure à un manque de fluide ou à une restriction.
                    Pour calculer la surchauffe et le sous-refroidissement, il faut convertir les pressions en températures
                    de saturation avec les bonnes tables pression/température du fluide et tenir compte du glide
                    des mélanges. Cette version ne fait pas encore ce calcul.
                </div>
                <p class="pcdiag-small">
                    Les valeurs ne sont pas encore synchronisées ni conservées après fermeture de la page.
                </p>
            </div>
        `;

        console.log("Pro Clim — Relevé de mesures :", mesures);
    }

    function connecterEvenements() {
        document.getElementById("pcDiagRechercher")
            .addEventListener("click", rechercherCode);

        document.getElementById("pcDiagDemarrer")
            .addEventListener("click", demarrerDiagnostic);

        document.getElementById("pcDiagEnregistrerMesures")
            .addEventListener("click", enregistrerMesures);

        document.getElementById("pcDiagPhoto")
            .addEventListener("change", function () {
                const fichier = this.files && this.files[0];
                document.getElementById("pcDiagPhotoNom").textContent =
                    fichier ? "Photo sélectionnée : " + fichier.name : "Aucune photo sélectionnée.";
            });
    }

    function initialiser() {
        afficherInterface();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiser);
    } else {
        initialiser();
    }

})();
