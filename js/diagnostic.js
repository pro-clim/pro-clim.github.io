
/* =====================================================
   PRO CLIM — MODULE DÉPANNAGE CVC V1
   Parcours guidés + relevé de mesures
   Fichier : js/diagnostic.js
===================================================== */

(() => {
    "use strict";

    const parcours = {
        plus_de_froid: {
            titre: "L'installation ne produit plus de froid",
            depart: "f1",
            questions: {
                f1: {
                    texte: "Le groupe extérieur démarre-t-il en demande de froid ?",
                    oui: "f2",
                    non: "r_commande"
                },
                f2: {
                    texte: "L'unité intérieure souffle-t-elle de l'air ?",
                    oui: "f3",
                    non: "r_unite_interieure"
                },
                f3: {
                    texte: "Le compresseur fonctionne-t-il réellement ?",
                    oui: "f4",
                    non: "r_compresseur"
                },
                f4: {
                    texte: "Les filtres et les échangeurs sont-ils propres et le débit d'air correct ?",
                    oui: "f5",
                    non: "r_debit_air"
                },
                f5: {
                    texte: "Les pressions et températures sont-elles cohérentes avec le fluide, le régime et les données constructeur ?",
                    oui: "r_regulation",
                    non: "f6"
                },
                f6: {
                    texte: "Observe-t-on du givre anormal sur la batterie ou la tuyauterie ?",
                    oui: "r_givre",
                    non: "r_circuit"
                }
            },
            resultats: {
                r_commande: {
                    titre: "Commande ou alimentation à contrôler",
                    pistes: [
                        "Absence de demande de froid ou mauvais réglage.",
                        "Alimentation électrique, protection ou connexion défectueuse.",
                        "Code défaut ou sécurité active.",
                        "Carte électronique ou communication à contrôler."
                    ],
                    actions: [
                        "Vérifier le mode froid, la consigne et les piles de la commande.",
                        "Relever les codes défaut avant toute remise à zéro.",
                        "Contrôler l'alimentation et les protections selon la procédure constructeur."
                    ]
                },
                r_unite_interieure: {
                    titre: "Unité intérieure : débit d'air insuffisant ou arrêt",
                    pistes: [
                        "Ventilateur intérieur bloqué ou défaillant.",
                        "Filtre ou batterie fortement encrassé.",
                        "Sonde, carte ou alimentation de l'unité intérieure."
                    ],
                    actions: [
                        "Contrôler le ventilateur et son alimentation.",
                        "Inspecter filtres, batterie et turbine.",
                        "Vérifier les sondes et les défauts mémorisés."
                    ]
                },
                r_compresseur: {
                    titre: "Groupe extérieur : compresseur non fonctionnel",
                    pistes: [
                        "Sécurité active ou temporisation de redémarrage.",
                        "Défaut de carte inverter ou de commande compresseur.",
                        "Défaut électrique, compresseur ou protection thermique."
                    ],
                    actions: [
                        "Lire les codes défaut et vérifier les conditions de fonctionnement.",
                        "Contrôler les alimentations et les connexions selon la documentation.",
                        "Sur inverter, suivre la procédure constructeur : ne pas supposer la présence d'un condensateur de démarrage."
                    ]
                },
                r_debit_air: {
                    titre: "Défaut probable de circulation d'air",
                    pistes: [
                        "Filtres ou échangeur encrassés.",
                        "Turbine ou ventilateur défectueux.",
                        "Reprise ou soufflage obstrué."
                    ],
                    actions: [
                        "Nettoyer les filtres et contrôler l'échangeur.",
                        "Vérifier la vitesse et le sens de rotation du ventilateur.",
                        "Contrôler les températures de reprise et de soufflage après remise en service."
                    ]
                },
                r_regulation: {
                    titre: "Piste régulation ou conditions de fonctionnement",
                    pistes: [
                        "Sonde de température imprécise ou mal positionnée.",
                        "Consigne, mode de fonctionnement ou régulation inadaptés.",
                        "Puissance demandée limitée par les conditions extérieures ou la régulation."
                    ],
                    actions: [
                        "Comparer les températures mesurées aux valeurs constructeur.",
                        "Contrôler les sondes et leur cohérence.",
                        "Vérifier les paramètres et l'historique des défauts."
                    ]
                },
                r_givre: {
                    titre: "Givrage anormal : circuit et échange thermique à examiner",
                    pistes: [
                        "Débit d'air insuffisant.",
                        "Détendeur ou organe de détente qui régule mal.",
                        "Charge de fluide potentiellement incorrecte.",
                        "Sonde ou régulation pouvant provoquer un fonctionnement anormal."
                    ],
                    actions: [
                        "Éliminer d'abord un défaut de débit d'air.",
                        "Relever BP, HP, températures et surchauffe/sous-refroidissement si les conditions le permettent.",
                        "Comparer les valeurs aux données constructeur avant toute conclusion sur la charge."
                    ]
                },
                r_circuit: {
                    titre: "Circuit frigorifique à approfondir",
                    pistes: [
                        "Détendeur ou organe de détente.",
                        "Filtre déshydrateur ou restriction éventuelle.",
                        "Charge de fluide incorrecte.",
                        "Vanne, sonde ou régulation."
                    ],
                    actions: [
                        "Relever les pressions et températures en régime stabilisé.",
                        "Calculer la surchauffe et le sous-refroidissement avec les bonnes références de fluide.",
                        "Comparer au tableau constructeur et rechercher une restriction éventuelle."
                    ]
                }
            }
        },

        plus_de_chaud: {
            titre: "L'installation ne produit plus de chaud",
            depart: "c1",
            questions: {
                c1: {
                    texte: "Le mode chauffage est-il bien sélectionné avec une consigne supérieure à la température ambiante ?",
                    oui: "c2",
                    non: "r_reglage"
                },
                c2: {
                    texte: "L'unité intérieure souffle-t-elle après le délai de préchauffage ?",
                    oui: "c3",
                    non: "c4"
                },
                c3: {
                    texte: "Le groupe extérieur fonctionne-t-il en chauffage ?",
                    oui: "c5",
                    non: "r_groupe_chauffage"
                },
                c4: {
                    texte: "Le groupe extérieur est-il en dégivrage ou en temporisation normale ?",
                    oui: "r_degivrage",
                    non: "r_unite_interieure"
                },
                c5: {
                    texte: "La batterie extérieure est-elle propre et le ventilateur fonctionne-t-il correctement hors dégivrage ?",
                    oui: "c6",
                    non: "r_echangeur"
                },
                c6: {
                    texte: "Les températures et pressions sont-elles cohérentes avec les données constructeur en chauffage ?",
                    oui: "r_regulation",
                    non: "r_circuit_chauffage"
                }
            },
            resultats: {
                r_reglage: {
                    titre: "Réglage ou commande à vérifier",
                    pistes: [
                        "Mode automatique ou froid sélectionné.",
                        "Consigne insuffisante.",
                        "Commande ou sonde d'ambiance incohérente."
                    ],
                    actions: [
                        "Sélectionner le mode chauffage (soleil).",
                        "Augmenter temporairement la consigne pour créer une demande.",
                        "Vérifier la sonde d'ambiance et les programmations."
                    ]
                },
                r_groupe_chauffage: {
                    titre: "Groupe extérieur ou inversion de cycle",
                    pistes: [
                        "Défaut de commande ou de communication.",
                        "Vanne 4 voies ou commande de vanne.",
                        "Sécurité ou défaut frigorifique."
                    ],
                    actions: [
                        "Lire les codes défaut.",
                        "Vérifier les conditions de demande et les sécurités.",
                        "Contrôler la commande de la vanne 4 voies selon la documentation."
                    ]
                },
                r_degivrage: {
                    titre: "Dégivrage ou temporisation possible",
                    pistes: [
                        "Un arrêt temporaire du ventilateur extérieur et du soufflage intérieur peut être normal pendant certaines phases.",
                        "Un dégivrage trop fréquent ou trop long peut révéler un problème."
                    ],
                    actions: [
                        "Observer la durée et la fréquence des cycles.",
                        "Vérifier l'évacuation des condensats et l'état de la batterie extérieure.",
                        "Comparer le fonctionnement à la documentation constructeur."
                    ]
                },
                r_unite_interieure: {
                    titre: "Unité intérieure à contrôler",
                    pistes: [
                        "Ventilateur intérieur ou son alimentation.",
                        "Sonde de batterie ou sonde d'ambiance.",
                        "Carte électronique ou communication."
                    ],
                    actions: [
                        "Contrôler le ventilateur et les connectiques.",
                        "Contrôler les sondes.",
                        "Relever les défauts affichés."
                    ]
                },
                r_echangeur: {
                    titre: "Échange thermique extérieur insuffisant",
                    pistes: [
                        "Batterie extérieure encrassée ou obstruée.",
                        "Ventilateur défectueux.",
                        "Givrage anormal ou circulation d'air perturbée."
                    ],
                    actions: [
                        "Inspecter et nettoyer la batterie selon les préconisations.",
                        "Vérifier le ventilateur et les dégagements autour du groupe.",
                        "Contrôler le comportement en dégivrage."
                    ]
                },
                r_circuit_chauffage: {
                    titre: "Circuit frigorifique ou régulation à approfondir",
                    pistes: [
                        "Vanne 4 voies ou organe de détente.",
                        "Charge de fluide ou restriction éventuelle.",
                        "Sondes ou régulation."
                    ],
                    actions: [
                        "Relever les pressions et températures en régime stabilisé.",
                        "Tenir compte du fonctionnement en chauffage et du fluide utilisé.",
                        "Comparer les résultats aux données constructeur."
                    ]
                }
            }
        },

        ne_demarre_pas: {
            titre: "L'installation ne démarre pas",
            depart: "d1",
            questions: {
                d1: {
                    texte: "L'afficheur ou les voyants de l'installation sont-ils allumés ?",
                    oui: "d2",
                    non: "d3"
                },
                d2: {
                    texte: "Un code défaut ou un voyant d'alarme est-il présent ?",
                    oui: "r_code",
                    non: "d4"
                },
                d3: {
                    texte: "La tension d'alimentation est-elle présente en amont de l'appareil ?",
                    oui: "r_alimentation_appareil",
                    non: "r_alimentation"
                },
                d4: {
                    texte: "La commande transmet-elle bien une demande de fonctionnement ?",
                    oui: "r_commande_interne",
                    non: "r_commande"
                }
            },
            resultats: {
                r_code: {
                    titre: "Défaut signalé par l'appareil",
                    pistes: [
                        "Mise en sécurité.",
                        "Défaut sonde, communication, ventilateur ou circuit frigorifique selon le code."
                    ],
                    actions: [
                        "Noter le code exact et le modèle de l'appareil.",
                        "Consulter la documentation constructeur.",
                        "Ne pas multiplier les réarmements sans identifier la cause."
                    ]
                },
                r_alimentation: {
                    titre: "Alimentation électrique absente",
                    pistes: [
                        "Protection déclenchée.",
                        "Défaut de circuit ou de raccordement en amont."
                    ],
                    actions: [
                        "Contrôler le tableau et les protections.",
                        "Vérifier le circuit d'alimentation conformément aux règles de sécurité.",
                        "Rechercher la cause d'un déclenchement avant réarmement."
                    ]
                },
                r_alimentation_appareil: {
                    titre: "Alimentation présente mais appareil éteint",
                    pistes: [
                        "Interrupteur ou sectionneur local.",
                        "Fusible, alimentation interne ou carte électronique.",
                        "Connexion ou neutre défectueux."
                    ],
                    actions: [
                        "Contrôler le sectionneur et les raccordements.",
                        "Effectuer les contrôles électriques hors tension lorsque nécessaire.",
                        "Suivre le schéma électrique constructeur."
                    ]
                },
                r_commande_interne: {
                    titre: "Commande reçue : vérifier les sécurités internes",
                    pistes: [
                        "Sécurité de fonctionnement active.",
                        "Temporisation ou défaut mémorisé.",
                        "Carte électronique ou composant interne."
                    ],
                    actions: [
                        "Relever les codes et l'historique.",
                        "Contrôler les sécurités et sondes suivant la documentation.",
                        "Vérifier les conditions autorisant le démarrage."
                    ]
                },
                r_commande: {
                    titre: "Commande ou communication à contrôler",
                    pistes: [
                        "Télécommande, thermostat ou programmation.",
                        "Liaison de communication.",
                        "Récepteur ou carte de commande."
                    ],
                    actions: [
                        "Vérifier les réglages et les piles si nécessaire.",
                        "Contrôler la liaison et les connexions.",
                        "Consulter les voyants de communication."
                    ]
                }
            }
        },

        fuite_eau: {
            titre: "Fuite d'eau sur l'installation",
            depart: "e1",
            questions: {
                e1: {
                    texte: "La fuite provient-elle de l'unité intérieure ?",
                    oui: "e2",
                    non: "e5"
                },
                e2: {
                    texte: "Le bac à condensats contient-il de l'eau en excès ?",
                    oui: "e3",
                    non: "r_fuite_interne"
                },
                e3: {
                    texte: "L'évacuation des condensats s'écoule-t-elle librement ?",
                    oui: "e4",
                    non: "r_evacu"
                },
                e4: {
                    texte: "L'unité est-elle correctement de niveau et le bac intact ?",
                    oui: "r_condensation",
                    non: "r_niveau"
                },
                e5: {
                    texte: "La fuite provient-elle du groupe extérieur ou de ses tuyauteries ?",
                    oui: "r_exterieur",
                    non: "r_origine"
                }
            },
            resultats: {
                r_fuite_interne: {
                    titre: "Origine interne à rechercher",
                    pistes: [
                        "Bac fissuré ou mal positionné.",
                        "Isolation de tuyauterie dégradée et condensation.",
                        "Débordement localisé."
                    ],
                    actions: [
                        "Inspecter le bac et ses raccords.",
                        "Contrôler l'isolation des liaisons frigorifiques.",
                        "Identifier précisément le liquide et son origine."
                    ]
                },
                r_evacu: {
                    titre: "Évacuation des condensats obstruée ou défaillante",
                    pistes: [
                        "Tuyau pincé, bouché ou en contre-pente.",
                        "Pompe de relevage en panne ou flotteur bloqué.",
                        "Raccord ou siphon obstrué."
                    ],
                    actions: [
                        "Contrôler le cheminement et la pente.",
                        "Nettoyer l'évacuation avec une méthode adaptée.",
                        "Tester la pompe et son flotteur si présent."
                    ]
                },
                r_condensation: {
                    titre: "Débordement ou condensation à localiser",
                    pistes: [
                        "Débit de condensats supérieur à l'évacuation.",
                        "Défaut d'étanchéité du bac ou d'un raccord.",
                        "Condensation sur une surface froide mal isolée."
                    ],
                    actions: [
                        "Faire un essai d'écoulement contrôlé.",
                        "Inspecter les raccords et l'isolation.",
                        "Vérifier l'absence de débordement en fonctionnement."
                    ]
                },
                r_niveau: {
                    titre: "Positionnement ou bac à corriger",
                    pistes: [
                        "Unité mal de niveau.",
                        "Bac déplacé, fissuré ou déformé."
                    ],
                    actions: [
                        "Contrôler la fixation et le niveau selon les prescriptions constructeur.",
                        "Inspecter le bac et ses raccordements."
                    ]
                },
                r_exterieur: {
                    titre: "Fuite côté groupe extérieur ou liaisons",
                    pistes: [
                        "Condensats de dégivrage en chauffage : écoulement parfois normal.",
                        "Condensation sur tuyauterie.",
                        "Fuite sur raccord ou circuit : à distinguer d'un écoulement d'eau."
                    ],
                    actions: [
                        "Identifier si le liquide est de l'eau ou une autre substance.",
                        "Contrôler l'écoulement de dégivrage.",
                        "Si suspicion de fuite de fluide frigorigène, appliquer la procédure réglementaire."
                    ]
                },
                r_origine: {
                    titre: "Origine de la fuite non identifiée",
                    pistes: [
                        "Évacuation, raccord, condensation ou fuite provenant d'un autre équipement."
                    ],
                    actions: [
                        "Sécher la zone et repérer le premier point d'apparition.",
                        "Suivre le cheminement de l'eau avant de conclure."
                    ]
                }
            }
        },

        bruit_anormal: {
            titre: "Bruit anormal sur l'installation",
            depart: "b1",
            questions: {
                b1: {
                    texte: "Le bruit provient-il de l'unité intérieure ?",
                    oui: "b2",
                    non: "b4"
                },
                b2: {
                    texte: "Le bruit apparaît-il principalement lorsque le ventilateur tourne ?",
                    oui: "r_ventilateur_interieur",
                    non: "b3"
                },
                b3: {
                    texte: "Le bruit ressemble-t-il à un écoulement ou à un sifflement de fluide ?",
                    oui: "r_ecoulement",
                    non: "r_vibration_interieure"
                },
                b4: {
                    texte: "Le bruit provient-il du groupe extérieur ?",
                    oui: "b5",
                    non: "r_origine_bruit"
                },
                b5: {
                    texte: "Le bruit est-il lié au ventilateur extérieur ?",
                    oui: "r_ventilateur_exterieur",
                    non: "r_compresseur_bruit"
                }
            },
            resultats: {
                r_ventilateur_interieur: {
                    titre: "Ventilateur intérieur à inspecter",
                    pistes: [
                        "Turbine encrassée ou déséquilibrée.",
                        "Corps étranger ou frottement.",
                        "Palier ou moteur."
                    ],
                    actions: [
                        "Mettre à l'arrêt avant inspection.",
                        "Contrôler la turbine, les fixations et les jeux.",
                        "Vérifier le moteur et ses supports."
                    ]
                },
                r_ecoulement: {
                    titre: "Bruit de circulation ou de détente",
                    pistes: [
                        "Écoulement de condensats.",
                        "Bruit de détente ou circulation frigorifique.",
                        "Vibration transmise par les tuyauteries."
                    ],
                    actions: [
                        "Localiser précisément le bruit et le moment d'apparition.",
                        "Contrôler l'évacuation des condensats.",
                        "Comparer le fonctionnement aux conditions normales du constructeur."
                    ]
                },
                r_vibration_interieure: {
                    titre: "Vibration ou pièce mécanique",
                    pistes: [
                        "Capot, filtre ou support mal fixé.",
                        "Tuyauterie en contact avec la carrosserie.",
                        "Pièce ou volet mobile."
                    ],
                    actions: [
                        "Contrôler les fixations et les capots.",
                        "Vérifier les contacts et supports.",
                        "Localiser le bruit sans approcher les pièces mobiles."
                    ]
                },
                r_ventilateur_exterieur: {
                    titre: "Ventilateur extérieur à contrôler",
                    pistes: [
                        "Hélice déséquilibrée ou endommagée.",
                        "Corps étranger ou frottement.",
                        "Moteur ou support."
                    ],
                    actions: [
                        "Arrêter l'installation avant inspection.",
                        "Contrôler l'hélice et les dégagements.",
                        "Vérifier les fixations et le moteur."
                    ]
                },
                r_compresseur_bruit: {
                    titre: "Compresseur ou transmission vibratoire",
                    pistes: [
                        "Silentblocs ou support détériorés.",
                        "Tuyauterie en contact avec le châssis.",
                        "Bruit mécanique du compresseur."
                    ],
                    actions: [
                        "Comparer le bruit aux conditions habituelles.",
                        "Contrôler les supports et les contacts de tuyauterie.",
                        "Relever les paramètres de fonctionnement et consulter le constructeur."
                    ]
                },
                r_origine_bruit: {
                    titre: "Origine du bruit à localiser",
                    pistes: [
                        "Bruit transmis par le bâtiment ou une tuyauterie.",
                        "Source extérieure à l'installation."
                    ],
                    actions: [
                        "Localiser le bruit unité par unité.",
                        "Comparer appareil à l'arrêt puis en fonctionnement, sans prendre de risque."
                    ]
                }
            }
        }
    };

    let symptomeActuel = null;
    let noeudActuel = null;
    let historique = [];

    const styles = `
    <style id="pcDiagStyles">
        #pageDiagnostic .pcd-wrap { display:flex; flex-direction:column; gap:16px; }
        #pageDiagnostic .pcd-intro { color:#607d8b; margin-top:0; }
        #pageDiagnostic .pcd-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        #pageDiagnostic .pcd-choice {
            border:1px solid #d8e1eb; background:#fff; color:#263238;
            border-radius:14px; padding:16px 12px; min-height:92px;
            text-align:left; font-size:15px; font-weight:700;
            box-shadow:0 3px 10px rgba(0,0,0,.04);
        }
        #pageDiagnostic .pcd-choice span { display:block; font-size:25px; margin-bottom:8px; }
        #pageDiagnostic .pcd-panel {
            background:#fff; border-radius:18px; padding:20px;
            box-shadow:0 5px 18px rgba(20,40,60,.06);
        }
        #pageDiagnostic .pcd-kicker {
            color:#0d47a1; font-size:12px; font-weight:800;
            text-transform:uppercase; letter-spacing:.7px;
        }
        #pageDiagnostic .pcd-question { font-size:21px; line-height:1.35; margin:12px 0 20px; color:#263238; }
        #pageDiagnostic .pcd-answer { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        #pageDiagnostic .pcd-btn {
            border:0; border-radius:12px; padding:15px 12px;
            font-size:16px; font-weight:800; min-height:52px;
        }
        #pageDiagnostic .pcd-yes { background:#e7f5ec; color:#176b37; }
        #pageDiagnostic .pcd-no { background:#fff0ed; color:#a33324; }
        #pageDiagnostic .pcd-secondary {
            background:#edf2f7; color:#263238; border:1px solid #dce4ed;
            border-radius:12px; padding:12px 15px; font-weight:700;
        }
        #pageDiagnostic .pcd-result-title { font-size:21px; line-height:1.3; margin:10px 0; }
        #pageDiagnostic .pcd-list { padding-left:20px; line-height:1.55; }
        #pageDiagnostic .pcd-warning {
            background:#fff5db; color:#795500; padding:14px;
            border-radius:12px; line-height:1.45; font-size:14px;
        }
        #pageDiagnostic .pcd-section-title { margin:0 0 10px; font-size:18px; }
        #pageDiagnostic .pcd-field { margin:12px 0; }
        #pageDiagnostic .pcd-field label { display:block; font-weight:700; margin-bottom:6px; font-size:14px; }
        #pageDiagnostic .pcd-field input, #pageDiagnostic .pcd-field select {
            width:100%; box-sizing:border-box; min-height:46px; padding:10px 12px;
            border:1px solid #cbd5df; border-radius:10px; background:#fff;
            color:#263238; font-size:16px;
        }
        #pageDiagnostic .pcd-measure-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        #pageDiagnostic .pcd-small { font-size:13px; color:#607d8b; line-height:1.45; }
        #pageDiagnostic .pcd-measure-output {
            margin-top:12px; padding:12px; background:#edf4fb;
            border-radius:12px; line-height:1.6; white-space:pre-line;
        }
        #pageDiagnostic .pcd-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:16px; }
        #pageDiagnostic .pcd-actions button { flex:1; }
        @media(max-width:380px) {
            #pageDiagnostic .pcd-grid, #pageDiagnostic .pcd-measure-grid { grid-template-columns:1fr; }
        }
    </style>`;

    function echapper(texte) {
        return String(texte).replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[caractere]);
    }

    function afficherBase() {
        const page = document.getElementById("pageDiagnostic");
        if (!page) return;

        page.innerHTML = `
            <div class="pcd-wrap">
                <div class="card">
                    <span class="step-icon">🛠️</span>
                    <h2>Dépannage CVC</h2>
                    <p class="pcd-intro">
                        Sélectionne le symptôme constaté pour suivre
                        un parcours de diagnostic guidé.
                    </p>
                </div>

                <div class="pcd-panel">
                    <div class="pcd-kicker">Choisir un symptôme</div>
                    <div class="pcd-grid" style="margin-top:14px">
                        <button class="pcd-choice" data-symptome="plus_de_froid">
                            <span>❄️</span>Plus de froid
                        </button>
                        <button class="pcd-choice" data-symptome="plus_de_chaud">
                            <span>🔥</span>Plus de chaud
                        </button>
                        <button class="pcd-choice" data-symptome="ne_demarre_pas">
                            <span>⚡</span>Ne démarre pas
                        </button>
                        <button class="pcd-choice" data-symptome="fuite_eau">
                            <span>💧</span>Fuite d'eau
                        </button>
                        <button class="pcd-choice" data-symptome="bruit_anormal">
                            <span>🔊</span>Bruit anormal
                        </button>
                    </div>
                </div>

                <div id="pcdZoneParcours"></div>

                <div class="pcd-panel">
                    <h3 class="pcd-section-title">🌡️ Relevé des mesures</h3>
                    <p class="pcd-small">
                        Saisis les valeurs relevées sur site. Les mesures sont
                        conservées uniquement pendant cette session.
                    </p>

                    <div class="pcd-field">
                        <label for="pcdFluide">Fluide frigorigène</label>
                        <select id="pcdFluide">
                            <option value="">Non renseigné</option>
                            <option>R32</option>
                            <option>R410A</option>
                            <option>R454B</option>
                            <option>R407C</option>
                            <option>R134a</option>
                            <option>R290</option>
                            <option>Autre / à préciser</option>
                        </select>
                    </div>

                    <div class="pcd-measure-grid">
                        <div class="pcd-field">
                            <label for="pcdBP">BP (bar)</label>
                            <input id="pcdBP" type="number" step="0.01" inputmode="decimal" placeholder="Ex. 8.2">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdHP">HP (bar)</label>
                            <input id="pcdHP" type="number" step="0.01" inputmode="decimal" placeholder="Ex. 24.5">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdAspiration">Température aspiration (°C)</label>
                            <input id="pcdAspiration" type="number" step="0.1" inputmode="decimal" placeholder="Ex. 12.5">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdLiquide">Température liquide (°C)</label>
                            <input id="pcdLiquide" type="number" step="0.1" inputmode="decimal" placeholder="Ex. 38">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdReprise">Température reprise (°C)</label>
                            <input id="pcdReprise" type="number" step="0.1" inputmode="decimal" placeholder="Ex. 27">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdSoufflage">Température soufflage (°C)</label>
                            <input id="pcdSoufflage" type="number" step="0.1" inputmode="decimal" placeholder="Ex. 14">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdExterieur">Température extérieure (°C)</label>
                            <input id="pcdExterieur" type="number" step="0.1" inputmode="decimal" placeholder="Ex. 32">
                        </div>
                        <div class="pcd-field">
                            <label for="pcdIntensite">Intensité mesurée (A)</label>
                            <input id="pcdIntensite" type="number" step="0.01" inputmode="decimal" placeholder="Ex. 6.4">
                        </div>
                    </div>

                    <div class="pcd-field">
                        <label for="pcdConditions">Conditions de mesure / observations</label>
                        <input id="pcdConditions" type="text" placeholder="Mode, consigne, vitesse, temps de stabilisation...">
                    </div>

                    <button type="button" class="pcd-btn pcd-secondary" id="pcdEnregistrerMesures">
                        Enregistrer le relevé
                    </button>
                    <div id="pcdMesuresResultat" class="pcd-measure-output" hidden></div>
                </div>

                <div class="pcd-warning">
                    ⚠️ Outil d'aide au raisonnement, pas un verdict automatique.
                    Les contrôles électriques doivent être réalisés avec les
                    protections et procédures adaptées. Toute intervention sur
                    le circuit frigorifique doit respecter la réglementation
                    et les qualifications requises.
                </div>
            </div>
        `;

        if (!document.getElementById("pcDiagStyles")) {
            document.head.insertAdjacentHTML("beforeend", styles);
        }
    }

    function afficherQuestion() {
        const zone = document.getElementById("pcdZoneParcours");
        const config = parcours[symptomeActuel];
        const question = config.questions[noeudActuel];

        if (!zone || !question) return;

        const numero = historique.length + 1;

        zone.innerHTML = `
            <div class="pcd-panel">
                <div class="pcd-kicker">${echapper(config.titre)}</div>
                <p class="pcd-small">Question ${numero} du parcours</p>
                <h3 class="pcd-question">${echapper(question.texte)}</h3>

                <div class="pcd-answer">
                    <button class="pcd-btn pcd-yes" data-reponse="oui">✓ Oui</button>
                    <button class="pcd-btn pcd-no" data-reponse="non">✕ Non</button>
                </div>

                <div class="pcd-actions">
                    <button class="pcd-secondary" data-action="retour">← Retour</button>
                    <button class="pcd-secondary" data-action="accueil">Changer de symptôme</button>
                </div>
            </div>
        `;
    }

    function afficherResultat(id) {
        const zone = document.getElementById("pcdZoneParcours");
        const resultat = parcours[symptomeActuel].resultats[id];

        if (!zone || !resultat) return;

        const pistes = resultat.pistes.map(item => `<li>${echapper(item)}</li>`).join("");
        const actions = resultat.actions.map(item => `<li>${echapper(item)}</li>`).join("");

        zone.innerHTML = `
            <div class="pcd-panel">
                <div class="pcd-kicker">Fin du parcours guidé</div>
                <h3 class="pcd-result-title">🔎 ${echapper(resultat.titre)}</h3>

                <h4>Pistes à envisager</h4>
                <ul class="pcd-list">${pistes}</ul>

                <h4>Contrôles conseillés</h4>
                <ul class="pcd-list">${actions}</ul>

                <div class="pcd-warning">
                    Ces pistes ne constituent pas un diagnostic certain.
                    Confirmer par des mesures, les contrôles adaptés et
                    la documentation du fabricant.
                </div>

                <div class="pcd-actions">
                    <button class="pcd-secondary" data-action="retour">← Revoir la réponse</button>
                    <button class="pcd-btn pcd-yes" data-action="nouveau">Nouveau diagnostic</button>
                </div>
            </div>
        `;
    }

    function repondre(reponse) {
        const config = parcours[symptomeActuel];
        const question = config.questions[noeudActuel];

        if (!question) return;

        historique.push({
            noeud: noeudActuel,
            reponse
        });

        const destination = question[reponse];

        if (config.questions[destination]) {
            noeudActuel = destination;
            afficherQuestion();
        } else {
            afficherResultat(destination);
        }
    }

    function retour() {
        if (!historique.length) {
            afficherAccueilParcours();
            return;
        }

        const precedent = historique.pop();
        noeudActuel = precedent.noeud;
        afficherQuestion();
    }

    function afficherAccueilParcours() {
        symptomeActuel = null;
        noeudActuel = null;
        historique = [];

        const zone = document.getElementById("pcdZoneParcours");
        if (zone) zone.innerHTML = "";
    }

    function demarrer(symptome) {
        if (!parcours[symptome]) return;

        symptomeActuel = symptome;
        noeudActuel = parcours[symptome].depart;
        historique = [];
        afficherQuestion();

        const zone = document.getElementById("pcdZoneParcours");
        if (zone) zone.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function enregistrerMesures() {
        const ids = [
            "pcdFluide", "pcdBP", "pcdHP", "pcdAspiration",
            "pcdLiquide", "pcdReprise", "pcdSoufflage",
            "pcdExterieur", "pcdIntensite", "pcdConditions"
        ];

        const valeurs = {};
        ids.forEach(id => {
            const champ = document.getElementById(id);
            valeurs[id] = champ ? champ.value.trim() : "";
        });

        const sortie = [];
        const libelles = {
            pcdFluide: "Fluide",
            pcdBP: "BP",
            pcdHP: "HP",
            pcdAspiration: "Température aspiration",
            pcdLiquide: "Température liquide",
            pcdReprise: "Température reprise",
            pcdSoufflage: "Température soufflage",
            pcdExterieur: "Température extérieure",
            pcdIntensite: "Intensité",
            pcdConditions: "Conditions / observations"
        };

        ids.forEach(id => {
            if (valeurs[id] !== "") {
                let unite = "";
                if (id === "pcdBP" || id === "pcdHP") unite = " bar";
                if (id.includes("Aspiration") || id.includes("Liquide") ||
                    id.includes("Reprise") || id.includes("Soufflage") ||
                    id.includes("Exterieur")) unite = " °C";
                if (id === "pcdIntensite") unite = " A";

                sortie.push(`${libelles[id]} : ${valeurs[id]}${unite}`);
            }
        });

        const reprise = parseFloat(valeurs.pcdReprise);
        const soufflage = parseFloat(valeurs.pcdSoufflage);

        if (Number.isFinite(reprise) && Number.isFinite(soufflage)) {
            sortie.push(`Écart reprise / soufflage : ${(reprise - soufflage).toFixed(1)} °C`);
        }

        const resultat = document.getElementById("pcdMesuresResultat");
        if (!resultat) return;

        resultat.hidden = false;
        resultat.textContent = sortie.length
            ? "RELEVÉ ENREGISTRÉ\n" + sortie.join("\n") +
              "\n\nLes valeurs sont à interpréter selon le fluide, le mode et les conditions constructeur."
            : "Aucune mesure renseignée pour le moment.";
    }

    function initialiser() {
        const page = document.getElementById("pageDiagnostic");
        if (!page) return;

        afficherBase();

        page.addEventListener("click", evenement => {
            const bouton = evenement.target.closest("button");
            if (!bouton) return;

            if (bouton.dataset.symptome) {
                demarrer(bouton.dataset.symptome);
                return;
            }

            if (bouton.dataset.reponse) {
                repondre(bouton.dataset.reponse);
                return;
            }

            switch (bouton.dataset.action) {
                case "retour":
                    retour();
                    break;
                case "accueil":
                case "nouveau":
                    afficherAccueilParcours();
                    break;
            }

            if (bouton.id === "pcdEnregistrerMesures") {
                enregistrerMesures();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialiser);
    } else {
        initialiser();
    }

})();
