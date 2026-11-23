/* ==========================================================
   PRO CLIM — DIAGNOSTIC CVC
   Catalogue multi-constructeurs + diagnostic guidé
   Version 3.0 — Références sécurisées
   ========================================================== */

(() => {
  "use strict";

  const PAGE = "pageDiagnostic";
  const $ = id => document.getElementById(id);

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));

  const normalize = value =>
    String(value || "").toUpperCase().replace(/[\s\-_.]/g, "");

  const S = {
    symptom: "",
    step: 0,
    answers: [],
    fault: null,
    report: null
  };

  /* ========================================================
     1. CATALOGUE CONSTRUCTEURS
     ======================================================== */

  const CATALOG = {

    "Daikin": {
      "Résidentiel — Split mural": [
        "FTXF / RXF — Sensira",
        "FTXM / RXM — Perfera",
        "FTXJ / RXJ — Stylish",
        "FTXG / RXG — Emura",
        "FTXP / RXP — Comfora",
        "FTXC / RXC",
        "FTXH / RXH"
      ],
      "Multi-split": [
        "2MXM", "3MXM", "4MXM", "5MXM", "MXM", "Multi+"
      ],
      "Sky Air — Tertiaire": [
        "FFA", "FCAG", "FBA", "FDA", "FHA",
        "FNA", "FUA", "RZAG", "RZASG", "RZA"
      ],
      "VRV 5-S": [
        "RXYSA4A7V1B",
        "RXYSA5A7V1B",
        "RXYSA6A7V1B",
        "RXYSA4A7Y1B",
        "RXYSA5A7Y1B",
        "RXYSA6A7Y1B"
      ],
      "VRV 5": ["RXYA", "RXYA-A", "RXYA-B", "RXYQ"],
      "VRV IV / IV+": ["RXYQ", "REYQ", "RWEYQ", "RXYTQ"],
      "VRV récupération de chaleur": ["REYQ", "REYA", "RWEYQ"],
      "Altherma — PAC air/eau": [
        "ERGA", "EPGA", "EDLA", "EBLA",
        "EHVH", "EHBH", "ETVH", "ETBH"
      ],
      "Rooftop / Packaged": ["UAT", "UATY", "UATQ"],
      "Groupes d'eau glacée / Applied": [
        "EWAD", "EWAT", "EWAH", "EWWD", "EWYT"
      ]
    },

    "Mitsubishi Electric": {
      "Résidentiel — Série M": [
        "MSZ-HR", "MSZ-AY", "MSZ-AP", "MSZ-EF",
        "MSZ-LN", "MSZ-FT", "MSZ-FH", "MSZ-RW",
        "MFZ-KT", "SFZ-M"
      ],
      "Groupes extérieurs mono-split": [
        "MUZ-HR", "MUZ-AY", "MUZ-AP", "MUZ-EF",
        "MUZ-LN", "MUZ-FT", "MUZ-FH", "SUZ-M", "PUZ-M"
      ],
      "Multi-split": [
        "MXZ-2F", "MXZ-3F", "MXZ-4F",
        "MXZ-5F", "MXZ-6F", "MXZ-H", "MXZ-F", "PXZ-F"
      ],
      "Mr Slim — Tertiaire": [
        "PEAD-M", "PEA-M", "PLA-M", "PCA-M",
        "PKA-M", "PSA-M", "SEZ-M", "SLZ-M", "PUMY", "PUZ-M"
      ],
      "City Multi — VRF": [
        "PUHY", "PURY", "PUMY", "PQRY",
        "PURY-P", "PUHY-P", "PUCY", "PUMY-CP"
      ],
      "Ecodan — PAC air/eau": [
        "PUZ-WM", "PUZ-SWM", "PUZ-SHWM",
        "SUZ-SWM", "ERSE", "ERSD", "ERST"
      ],
      "Zubadan / Hyper Heating": [
        "PUHZ-SHW", "PUZ-SHWM", "PUHZ-HW"
      ],
      "Ventilation Lossnay": ["LGH", "VL"]
    },

    "Mitsubishi Heavy Industries": {
      "Résidentiel — Split mural": ["SRK", "SRC", "SRF", "SRR"],
      "Multi-split": ["SCM", "SRK multi"],
      "Tertiaire — PAC commerciale": [
        "FDT", "FDTC", "FDK", "FDC", "FDU", "FDE", "FDUM"
      ],
      "DRV / VRF — KX": ["KXZX", "KXZ", "KXZR", "KX"],
      "PAC air/eau": ["Hydrolution", "Q-ton"]
    },

    "Samsung": {
      "Résidentiel — Split mural": [
        "AR09", "AR12", "AR18", "AR24",
        "WindFree", "Cebu", "Luzon"
      ],
      "Multi-split": ["AJ", "AJN", "AJT", "FJM"],
      "Commercial — CAC": ["AC", "ACN", "AC071", "AC100", "AC140"],
      "Gainable / Cassette": ["AM", "AC", "AV", "AJ"],
      "DRV / VRF — DVM": [
        "AM080", "AM100", "AM120", "AM140", "AM160",
        "DVM S", "DVM S2", "DVM S Mini", "DVM S Water", "DVM S HR"
      ],
      "PAC air/eau — EHS": [
        "AE", "AM", "EHS Mono", "EHS Split", "EHS HT"
      ]
    },

    "Atlantic / Fujitsu": {
      "Fujitsu — Résidentiel": [
        "ASYG", "ASHG", "AOYG", "AOHG", "ASY", "ASH"
      ],
      "Fujitsu — Multi-split": [
        "AOYG multi", "ASYG multi", "AOHG multi"
      ],
      "Fujitsu — Tertiaire": ["ARYG", "ABYG", "AUYG", "ARXG", "AUXG"],
      "Fujitsu — VRF Airstage": [
        "AJY", "AIRSTAGE V", "AIRSTAGE J", "AIRSTAGE VR-II"
      ],
      "Atlantic — PAC air/eau Alféa": [
        "Alféa Extensa", "Alféa Excellia", "Alféa Duo", "Alféa Hybrid"
      ],
      "Atlantic — Climatisation": ["Takao", "Kazendo", "Shogun"]
    },

    "LG": {
      "Résidentiel — Split mural": [
        "S09", "S12", "PC", "Dualcool", "Artcool", "Standard Plus"
      ],
      "Multi-split": ["MU", "FM", "Multi F"],
      "Commercial — Gainable / Cassette": [
        "UM", "UU", "UB", "CT", "ARNU", "ABN"
      ],
      "DRV / VRF — Multi V": [
        "Multi V", "Multi V i", "Multi V S",
        "Multi V 5", "Multi V Water", "ARUN", "ARUB"
      ],
      "PAC air/eau — Therma V": [
        "HM", "HU", "HN", "Therma V Monobloc", "Therma V Split"
      ]
    },

    "Panasonic": {
      "Résidentiel — Split mural": [
        "CS-TZ", "CS-Etherea", "CS-XZ", "CS-Z",
        "CS-PZ", "CU-TZ", "CU-Z"
      ],
      "Multi-split": [
        "CU-2Z", "CU-3Z", "CU-4Z", "CU-5Z", "CU-2E", "CU-3E"
      ],
      "PACi — Tertiaire": [
        "S-36", "S-50", "S-60", "S-71", "S-100", "S-125", "U-"
      ],
      "Cassette / Gainable / Console": [
        "S-60PU", "S-71PU", "S-100PU",
        "S-125PU", "S-100PF", "S-125PF"
      ],
      "DRV / VRF — ECOi": [
        "U-", "ECOi EX", "ECOi 2WAY", "ECOi 3WAY", "ECOi MINI"
      ],
      "PAC air/eau — Aquarea": [
        "WH-MDC", "WH-MXC", "WH-SDC", "WH-SXC",
        "Aquarea T-CAP", "Aquarea High Performance"
      ]
    },

    "Toshiba": {
      "Résidentiel — Split mural": [
        "RAS-B", "RAS-10", "RAS-13", "RAS-16",
        "Seiya", "Shorai", "Daiseikai"
      ],
      "Multi-split": ["RAS-M", "RAS-2M", "RAS-3M", "RAS-4M", "RAS-5M"],
      "Tertiaire — Digital Inverter": ["RAV-GM", "RAV-RM", "RAV-SM", "RAV-HM"],
      "Gainable / Cassette": ["RAV-RM", "RAV-SM", "RAV-GM", "MMD"],
      "DRV / VRF — SMMS": [
        "MMY", "SMMS-u", "SHRM-u", "SHRM Advance", "Mini SMMS"
      ],
      "PAC air/eau — Estia": ["HWS", "Estia", "HWT"]
    },

    "Hitachi": {
      "Résidentiel — airHome": [
        "RAK", "RAC", "airHome 400", "airHome 600", "airHome 800"
      ],
      "Multi-split": ["RAM", "RAC multi"],
      "Tertiaire — Utopia": ["RAS", "RPI", "RPC", "RPK", "RPF"],
      "DRV / VRF — Set Free": [
        "RAS", "RCS", "Set Free Sigma", "Set Free Mini", "Set Free FSXN"
      ],
      "PAC air/eau — Yutaki": [
        "Yutaki S", "Yutaki S Combi", "Yutaki M", "Yutaki H"
      ]
    },

    "Toshiba Carrier": {
      "Résidentiel / Split": ["RAS", "RAV"],
      "Multi-split": ["RAS-M", "RAS-2M", "RAS-3M"],
      "Tertiaire": ["RAV", "MMK", "MMD"],
      "VRF / SMMS": ["MMY", "SMMS", "SHRM", "Mini SMMS"],
      "Applied / Eau glacée": ["Carrier Aqua", "AquaSnap", "Toshiba Applied"]
    },

    "Midea": {
      "Résidentiel — Split mural": [
        "MSAG", "MSAF", "Xtreme Save", "Breezeless", "All Easy Pro"
      ],
      "Multi-split": ["M2OE", "M3OE", "M4OE", "M5OE"],
      "Tertiaire — Commercial": ["MCD", "MCA", "MTI", "MUE", "MOU"],
      "DRV / VRF": [
        "V6", "V6R", "V8", "V8i", "V9", "Atom T Mini VRF"
      ],
      "PAC air/eau — M-Thermal": [
        "M-Thermal", "M-Thermal Arctic", "M-Thermal Mono", "M-Thermal Split"
      ]
    },

    "Gree": {
      "Résidentiel — Split mural": [
        "Pular", "Fair", "Amber", "Clivia", "Lomo", "GWH"
      ],
      "Multi-split": ["GWHD", "Free Match", "Multi"],
      "Tertiaire": ["GUD", "GKH", "GREE Commercial"],
      "DRV / VRF — GMV": ["GMV5", "GMV6", "GMV", "GMV Mini"],
      "PAC air/eau — Versati": ["Versati", "Versati III", "Versati IV"]
    },

    "Haier": {
      "Résidentiel — Split mural": [
        "Flexis", "Pearl", "Revive", "Expert", "Jade", "Tundra"
      ],
      "Multi-split": ["2U", "3U", "4U", "5U"],
      "Tertiaire": ["AB", "AD", "AC", "AU"],
      "DRV / VRF — MRV": ["MRV", "MRV V", "MRV S", "MRV Water"],
      "PAC air/eau": ["Super Aqua", "Monobloc", "Split"]
    },

    "Hisense": {
      "Résidentiel — Split mural": [
        "Easy Smart", "Energy Pro", "New Comfort", "Hi-Smart"
      ],
      "Multi-split": ["AMW", "Multi"],
      "Tertiaire": ["AUV", "AUD", "AVW"],
      "DRV / VRF": ["Hi-FLEXi", "Hi-FLEXi S", "Hi-FLEXi M"],
      "PAC air/eau": ["Hi-Therma", "Hi-Therma Monobloc", "Hi-Therma Split"]
    },

    "Carrier": {
      "Résidentiel — Split": ["42QHG", "42QHP", "42QSS", "42QHC"],
      "Multi-split": ["38QUS", "38Q", "42Q"],
      "Tertiaire": ["42", "40", "42QSS", "40VM"],
      "VRF": ["XCT8", "40V", "38VM", "XPower"],
      "Groupes d'eau glacée": ["AquaSnap", "30RB", "30RBP", "30XW"],
      "PAC air/eau": ["AquaSnap", "AquaForce"]
    },

    "Trane": {
      "Groupes d'eau glacée": [
        "CGAM", "RTAC", "RTWD", "Sintesis", "CenTraVac"
      ],
      "Rooftop": ["Voyager", "Precedent", "Foundation"],
      "CTA / Traitement d'air": [
        "Climate Changer", "M-Series", "Performance Climate Changer"
      ],
      "PAC / Pompes à chaleur": ["Sintesis", "Flex", "Airfinity"],
      "DRV / VRF": ["Trane VRF", "Mini VRF"]
    },

    "York": {
      "Résidentiel / Split": ["YH", "YZ", "YFK"],
      "Multi-split": ["York Multi"],
      "VRF": ["Mini VRF", "Full VRF", "YV", "YVA"],
      "Groupes d'eau glacée": ["YCAV", "YVAA", "YVWA", "YK"],
      "Rooftop / CTA": ["Predator", "Sunline", "Air Handling"]
    },

    "Lennox": {
      "Résidentiel — Split / PAC": ["EL", "ML", "SL", "XP", "XC"],
      "Multi-split": ["Lennox Multi"],
      "Tertiaire / Rooftop": [
        "Energence", "Prodigy", "L Series", "K Series"
      ],
      "CTA / Traitement d'air": ["Lennox Air Handling"]
    },

    "Bosch": {
      "Résidentiel — Split": [
        "Climate 5000", "Climate 7000i", "Climate 3000i"
      ],
      "Multi-split": ["Climate Multi"],
      "Tertiaire / Cassette / Gainable": [
        "Climate 5000M", "Climate 5000i", "Climate 7000"
      ],
      "VRF — Air Flux": [
        "Air Flux 4300 A", "Air Flux 5300 A", "Air Flux AF"
      ],
      "PAC air/eau": [
        "Compress 3000", "Compress 5000", "Compress 6000", "Compress 7000"
      ]
    },

    "Autre marque": {
      "Autre système": ["Référence à saisir manuellement"]
    }
  };

  /* ========================================================
     2. BASE DE PROCÉDURES CONSTRUCTEUR
     Les entrées sont limitées aux documents identifiés.
     ======================================================== */

  const DATABASE = {

    "Daikin": {
      "VRV 5-S": {
        models: [
          "RXYSA4A7V1B",
          "RXYSA5A7V1B",
          "RXYSA6A7V1B",
          "RXYSA4A7Y1B",
          "RXYSA5A7Y1B",
          "RXYSA6A7Y1B"
        ],
        codes: {
          "U4-01": {
            title: "Erreur de transmission entre unités intérieures et unité extérieure",
            meaning: "La carte principale détecte une transmission anormale sur la ligne F1-F2 vers les unités intérieures.",
            effect: "Le système peut s'arrêter de fonctionner.",
            source: {
              manufacturer: "Daikin",
              document: "Service Manual VRV 5-S",
              reference: "ESIE20-07A",
              revision: "Juillet 2021",
              chapter: "3.3.141 — U4-01",
              pages: "129 à 130",
              url: "https://manuals.plus/m/1ce2518f699a93a42189544c6b3b060a654ef84f8919b07d0c83bdaa6f8c884b.pdf"
            },
            steps: [
              {
                title: "Alimentation électrique",
                question: "L'alimentation électrique est-elle conforme aux prescriptions ?",
                instruction: "Contrôler l'alimentation conformément au chapitre électrique du manuel. Vérifier les perturbations, les chutes de tension et les courts-circuits.",
                detail: "Le manuel mentionne notamment un déséquilibre supérieur à 4 %, une chute de tension ou un court-circuit comme causes possibles.",
                yesLabel: "Oui, alimentation conforme",
                noLabel: "Non, anomalie constatée",
                noTitle: "Anomalie d'alimentation",
                noText: "Rechercher et corriger le défaut d'alimentation : déséquilibre, chute de tension, perturbation ou court-circuit.",
                reference: "§ 5.1 — Electrical circuit"
              },
              {
                title: "Liaison de transmission F1-F2",
                question: "La liaison F1-F2 entre les unités est-elle conforme ?",
                instruction: "Contrôler la ligne de transmission entre les unités intérieures et l'unité extérieure. Vérifier le câblage, les raccordements et les éventuelles interruptions.",
                detail: "Le manuel identifie une liaison défectueuse ou interrompue comme cause possible du défaut U4-01.",
                yesLabel: "Oui, liaison conforme",
                noLabel: "Non, anomalie constatée",
                noTitle: "Anomalie sur la liaison F1-F2",
                noText: "Localiser l'anomalie sur la liaison de transmission : raccordement, câblage ou interruption. Corriger conformément au schéma électrique.",
                reference: "§ 5.1 — Electrical circuit"
              },
              {
                title: "Nombre d'unités intérieures détectées",
                question: "Le nombre d'unités détectées correspond-il au nombre réellement installé ?",
                instruction: "Consulter le réglage terrain 1-10 de l'unité extérieure pour contrôler le nombre d'unités intérieures détectées.",
                detail: "Si le nombre détecté est inférieur au nombre attendu, contrôler les unités privées d'alimentation ou présentant une carte électronique défectueuse.",
                yesLabel: "Oui, nombre identique",
                noLabel: "Non, il manque une ou plusieurs unités",
                noTitle: "Unité intérieure non détectée",
                noText: "Identifier les unités manquantes. Contrôler leur alimentation électrique puis, si nécessaire, leur carte électronique principale.",
                reference: "Réglage 1-10 — § 7.9 ; § 4.14"
              },
              {
                title: "Carte électronique principale",
                question: "Le contrôle de la carte principale est-il conforme à la procédure constructeur ?",
                instruction: "Effectuer le contrôle de la carte principale de l'unité extérieure en suivant la procédure dédiée du manuel de service.",
                detail: "Ne pas remplacer la carte uniquement sur la présence du code U4-01.",
                yesLabel: "Oui, carte conforme",
                noLabel: "Non, anomalie constatée",
                noTitle: "Anomalie de carte principale",
                noText: "Reprendre les contrôles de la carte principale conformément au manuel. Vérifier les éléments prescrits avant de conclure à son remplacement.",
                reference: "§ 4.15 — Main PCB"
              },
              {
                title: "Réinitialisation et perturbations électriques",
                question: "Après réinitialisation, le défaut U4-01 réapparaît-il ?",
                instruction: "Effectuer une réinitialisation électrique conformément aux prescriptions constructeur, puis observer le fonctionnement du système.",
                detail: "Si le défaut disparaît puis réapparaît après un certain temps, rechercher une source externe de perturbation électrique.",
                yesLabel: "Oui, le défaut réapparaît",
                noLabel: "Non, le défaut ne réapparaît pas",
                yesBranch: true,
                noTitle: "Défaut non réapparu",
                noText: "Le défaut n'est pas réapparu après réinitialisation. Surveiller le fonctionnement et vérifier l'historique.",
                branchTitle: "Recherche de perturbation électrique",
                branchText: "Le défaut réapparaît après réinitialisation. Rechercher une source externe de perturbation électrique conformément au chapitre dédié du manuel.",
                reference: "§ 5.4 — External factors"
              },
              {
                title: "Fonctionnement forcé des unités intérieures",
                question: "Toutes les unités intérieures démarrent-elles en ventilation forcée ?",
                instruction: "Régler le paramètre terrain 2-5 de l'unité extérieure sur 1 pour lancer les unités intérieures raccordées en ventilation forcée.",
                detail: "Si une unité ne fonctionne pas, vérifier si elle est privée d'alimentation ou si sa carte électronique est défectueuse.",
                yesLabel: "Oui, toutes les unités démarrent",
                noLabel: "Non, une ou plusieurs unités ne démarrent pas",
                noTitle: "Unité intérieure inactive",
                noText: "Identifier précisément l'unité qui ne démarre pas. Contrôler son alimentation électrique puis sa carte électronique principale.",
                reference: "Réglage 2-5 — § 7.9 ; § 4.14"
              }
            ]
          }
        }
      }
    },

    "Samsung": {
      "DRV / VRF — DVM": {
        models: ["DVM S"],
        codes: {
          "E121": {
            title: "Sonde de température intérieure — anomalie",
            meaning: "Le manuel DVM S répertorie E121 comme défaut de sonde de température intérieure : circuit ouvert ou court-circuit.",
            effect: "La mesure de température intérieure peut être incorrecte.",
            source: {
              manufacturer: "Samsung",
              document: "DVM S Indoor Unit Service Manual",
              reference: "Manuel de service DVM S",
              revision: "Document constructeur consulté",
              chapter: "Liste des codes défaut",
              pages: "Selon version du manuel",
              url: "https://s3.amazonaws.com/samsung-files/Tech_Files/DVM/DVM%20S/Service%20Manuals/DVM%20S_wind%20free%204way%20M4way_SERVICE%20MANUAL-00211E_1_180206.pdf"
            },
            steps: [
              {
                title: "Identification de la sonde",
                question: "La sonde concernée a-t-elle été identifiée sur le schéma de l'unité exacte ?",
                instruction: "Identifier la sonde de température intérieure à partir du schéma électrique et de la référence complète de l'unité intérieure.",
                detail: "Ne pas déduire le connecteur ou le repère uniquement à partir du code défaut.",
                yesLabel: "Sonde identifiée",
                noLabel: "Identification incertaine",
                noTitle: "Identification nécessaire",
                noText: "Retrouver le schéma correspondant à la référence complète de l'unité avant toute mesure.",
                reference: "Schéma électrique constructeur"
              },
              {
                title: "Connectique de sonde",
                question: "Le connecteur et le câblage de la sonde sont-ils conformes ?",
                instruction: "Après consignation, contrôler visuellement le connecteur, le maintien des broches, le câble et les traces d'oxydation ou d'échauffement.",
                detail: "Ne pas manipuler les connecteurs sur un circuit alimenté.",
                yesLabel: "Connectique conforme",
                noLabel: "Anomalie constatée",
                noTitle: "Défaut de connectique",
                noText: "Corriger le raccordement ou remplacer le faisceau uniquement après identification de la pièce adaptée.",
                reference: "Schéma électrique constructeur"
              },
              {
                title: "Contrôle de la sonde",
                question: "La valeur mesurée correspond-elle à la courbe constructeur à la température réelle ?",
                instruction: "Sonde isolée électriquement de la carte, mesurer sa résistance et comparer à la table constructeur correspondant à cette sonde.",
                detail: "Ne pas appliquer une valeur générique NTC : les caractéristiques doivent correspondre à la référence exacte.",
                yesLabel: "Valeur conforme",
                noLabel: "Valeur non conforme",
                noTitle: "Sonde à approfondir",
                noText: "Comparer de nouveau la mesure à la courbe exacte. Vérifier la température de la sonde et la qualité du contact thermique.",
                reference: "Table résistance / température constructeur"
              }
            ]
          },

          "E122": {
            title: "Sonde d'entrée d'évaporateur — anomalie",
            meaning: "Le manuel DVM S répertorie E122 comme défaut de sonde d'entrée d'évaporateur.",
            effect: "La régulation ne dispose plus d'une mesure fiable à cet emplacement.",
            source: {
              manufacturer: "Samsung",
              document: "DVM S Indoor Unit Service Manual",
              reference: "Manuel de service DVM S",
              revision: "Document constructeur consulté",
              chapter: "Liste des codes défaut",
              pages: "Selon version du manuel",
              url: "https://s3.amazonaws.com/samsung-files/Tech_Files/DVM/DVM%20S/Service%20Manuals/DVM%20S_wind%20free%204way%20M4way_SERVICE%20MANUAL-00211E_1_180206.pdf"
            },
            steps: [
              {
                title: "Identification de la sonde",
                question: "La sonde d'entrée d'évaporateur est-elle identifiée sur le schéma exact ?",
                instruction: "Repérer la sonde et son connecteur avec le schéma correspondant à la référence de l'unité.",
                detail: "Ne pas confondre sonde d'entrée et sonde de sortie de batterie.",
                yesLabel: "Sonde identifiée",
                noLabel: "Identification incertaine",
                noTitle: "Identification nécessaire",
                noText: "Consulter le schéma électrique et la nomenclature de l'unité.",
                reference: "Schéma constructeur"
              },
              {
                title: "Câblage et connectique",
                question: "Le faisceau et le connecteur sont-ils conformes ?",
                instruction: "Après consignation, inspecter le câble, les broches et les connexions.",
                detail: "Rechercher coupure, mauvais contact ou oxydation.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de câblage",
                noText: "Corriger le défaut de connexion identifié avant de remplacer la sonde.",
                reference: "Schéma constructeur"
              },
              {
                title: "Mesure de la sonde",
                question: "La résistance correspond-elle à la courbe constructeur ?",
                instruction: "Mesurer la résistance sonde isolée et comparer à la courbe correspondant à la référence exacte.",
                detail: "Aucune valeur universelle ne doit être appliquée.",
                yesLabel: "Conforme",
                noLabel: "Non conforme",
                noTitle: "Sonde à contrôler",
                noText: "Vérifier la mesure, la température réelle et la référence de la sonde.",
                reference: "Courbe constructeur"
              }
            ]
          },

          "E123": {
            title: "Sonde de sortie d'évaporateur — anomalie",
            meaning: "Le manuel DVM S répertorie E123 comme défaut de sonde de sortie d'évaporateur.",
            effect: "La régulation peut recevoir une température incorrecte.",
            source: {
              manufacturer: "Samsung",
              document: "DVM S Indoor Unit Service Manual",
              reference: "Manuel de service DVM S",
              revision: "Document constructeur consulté",
              chapter: "Liste des codes défaut",
              pages: "Selon version du manuel",
              url: "https://s3.amazonaws.com/samsung-files/Tech_Files/DVM/DVM%20S/Service%20Manuals/DVM%20S_wind%20free%204way%20M4way_SERVICE%20MANUAL-00211E_1_180206.pdf"
            },
            steps: [
              {
                title: "Identification",
                question: "La sonde de sortie d'évaporateur est-elle identifiée sur le schéma exact ?",
                instruction: "Vérifier le repère de la sonde et son connecteur à partir du schéma de l'unité.",
                detail: "Ne pas confondre avec la sonde d'entrée d'évaporateur.",
                yesLabel: "Identifiée",
                noLabel: "Non identifiée",
                noTitle: "Identification nécessaire",
                noText: "Consulter le schéma exact de l'unité.",
                reference: "Schéma constructeur"
              },
              {
                title: "Connectique",
                question: "Le câblage est-il conforme ?",
                instruction: "Après consignation, inspecter le connecteur et le faisceau.",
                detail: "Rechercher coupure, mauvais contact ou oxydation.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de connectique",
                noText: "Corriger la connexion après identification de la pièce.",
                reference: "Schéma constructeur"
              },
              {
                title: "Sonde",
                question: "La valeur mesurée correspond-elle à la courbe constructeur ?",
                instruction: "Comparer la résistance mesurée à la table correspondant à la sonde et à sa température.",
                detail: "Ne pas appliquer de courbe NTC générique.",
                yesLabel: "Conforme",
                noLabel: "Non conforme",
                noTitle: "Sonde à contrôler",
                noText: "Vérifier la mesure et la référence exacte de la sonde.",
                reference: "Table constructeur"
              }
            ]
          },

          "E154": {
            title: "Défaut ventilateur intérieur",
            meaning: "Le manuel DVM S répertorie E154 comme anomalie du ventilateur intérieur.",
            effect: "Le débit d'air peut être interrompu ou insuffisant.",
            source: {
              manufacturer: "Samsung",
              document: "DVM S Indoor Unit Service Manual",
              reference: "Manuel de service DVM S",
              revision: "Document constructeur consulté",
              chapter: "Liste des codes défaut",
              pages: "Selon version du manuel",
              url: "https://s3.amazonaws.com/samsung-files/Tech_Files/DVM/DVM%20S/Service%20Manuals/DVM%20S_wind%20free%204way%20M4way_SERVICE%20MANUAL-00211E_1_180206.pdf"
            },
            steps: [
              {
                title: "Inspection mécanique",
                question: "La turbine tourne-t-elle librement hors tension ?",
                instruction: "Après consignation et vérification d'absence de tension, contrôler la turbine, les obstacles et les frottements.",
                detail: "Ne jamais introduire les mains dans une turbine alimentée.",
                yesLabel: "Rotation libre",
                noLabel: "Blocage ou frottement",
                noTitle: "Anomalie mécanique",
                noText: "Identifier la cause du blocage ou du frottement avant toute remise en service.",
                reference: "Contrôle mécanique"
              },
              {
                title: "Connectique moteur",
                question: "Le câblage moteur et ses connecteurs sont-ils conformes au schéma ?",
                instruction: "Contrôler le faisceau, les connecteurs et l'état des broches après consignation.",
                detail: "Le brochage dépend du modèle exact.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de câblage",
                noText: "Corriger le défaut identifié en suivant le schéma exact.",
                reference: "Schéma constructeur"
              },
              {
                title: "Contrôle électronique",
                question: "Le moteur et la commande ont-ils été contrôlés selon la procédure exacte ?",
                instruction: "Effectuer les contrôles moteur, alimentation et commande selon le manuel de service de l'unité.",
                detail: "Ne pas appliquer de tension ou de valeur de résistance générique à un moteur électronique.",
                yesLabel: "Contrôle conforme",
                noLabel: "Anomalie constatée",
                noTitle: "Contrôle complémentaire requis",
                noText: "Identifier si l'anomalie concerne le moteur, son alimentation ou la carte de commande à l'aide de la procédure constructeur.",
                reference: "Manuel de service exact"
              }
            ]
          }
        }
      }
    },

    "Mitsubishi Electric": {
      "City Multi — VRF": {
        models: ["PUCY", "PUMY-CP"],
        codes: {
          "6608": {
            title: "Absence de réponse de l'unité concernée",
            meaning: "Le document Mitsubishi City Multi répertorie le code 6608 comme absence de réponse.",
            effect: "La communication avec l'équipement concerné est anormale.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Codes de communication",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Identification de l'unité",
                question: "L'unité en défaut et son adresse ont-elles été identifiées ?",
                instruction: "Relever l'adresse, l'unité concernée et l'historique des défauts.",
                detail: "Ne pas intervenir sur une unité sans confirmer son identification.",
                yesLabel: "Identifiée",
                noLabel: "Non identifiée",
                noTitle: "Identification nécessaire",
                noText: "Identifier l'unité et son adresse avec l'outil de service et la documentation correspondante.",
                reference: "Documentation City Multi"
              },
              {
                title: "Alimentation de l'équipement",
                question: "L'unité concernée dispose-t-elle de son alimentation normale ?",
                instruction: "Contrôler l'alimentation et les protections selon le schéma électrique du modèle exact.",
                detail: "Respecter les règles de consignation et de mesure électrique.",
                yesLabel: "Alimentation conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut d'alimentation",
                noText: "Rechercher l'origine de l'absence d'alimentation et corriger avant de poursuivre.",
                reference: "Schéma électrique constructeur"
              },
              {
                title: "Communication",
                question: "La liaison de communication est-elle conforme au schéma ?",
                instruction: "Contrôler le câblage, les raccordements, les connexions et les éventuelles coupures conformément à la topologie de l'installation.",
                detail: "Ne pas appliquer une méthode de mesure non prévue par le constructeur.",
                yesLabel: "Liaison conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de communication à localiser",
                noText: "Reprendre le contrôle de la liaison et des connexions sur le segment concerné.",
                reference: "Documentation City Multi"
              }
            ]
          },

          "6831": {
            title: "Anomalie de signal de télécommande MA",
            meaning: "Le document Mitsubishi City Multi répertorie le code 6831 parmi les défauts de signal de télécommande MA.",
            effect: "La commande ou sa communication peut être perturbée.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Défauts de télécommande MA",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Identification de la commande",
                question: "La télécommande et son type sont-ils identifiés ?",
                instruction: "Vérifier le modèle de commande et sa compatibilité avec l'installation.",
                detail: "La procédure dépend de la configuration exacte.",
                yesLabel: "Identifiée",
                noLabel: "Non identifiée",
                noTitle: "Identification nécessaire",
                noText: "Relever la référence de la télécommande et consulter sa documentation.",
                reference: "Documentation constructeur"
              },
              {
                title: "Liaison MA",
                question: "La liaison de la télécommande est-elle conforme ?",
                instruction: "Contrôler le câblage et les connexions selon le schéma correspondant à l'installation.",
                detail: "Ne pas supposer un brochage universel.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de liaison",
                noText: "Corriger le raccordement ou le câblage identifié.",
                reference: "Schéma électrique exact"
              }
            ]
          },

          "6832": {
            title: "Anomalie de signal de télécommande MA",
            meaning: "Le document Mitsubishi City Multi répertorie le code 6832 dans les défauts de signal de télécommande MA.",
            effect: "La communication de la commande peut être perturbée.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Défauts de télécommande MA",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Identification de la commande",
                question: "La commande concernée est-elle identifiée ?",
                instruction: "Relever sa référence, son adresse éventuelle et l'unité associée.",
                detail: "Confirmer la configuration avec le schéma exact.",
                yesLabel: "Identifiée",
                noLabel: "Non identifiée",
                noTitle: "Identification nécessaire",
                noText: "Retrouver la référence et le schéma de la commande.",
                reference: "Documentation constructeur"
              },
              {
                title: "Contrôle de la liaison",
                question: "Le raccordement est-il conforme au schéma ?",
                instruction: "Inspecter le câblage et les connexions après consignation lorsque cela est nécessaire.",
                detail: "Les contrôles électriques doivent suivre la notice exacte.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de raccordement",
                noText: "Corriger l'anomalie de câblage ou de connexion identifiée.",
                reference: "Schéma constructeur"
              }
            ]
          },

          "6833": {
            title: "Anomalie de signal de télécommande MA",
            meaning: "Le document Mitsubishi City Multi répertorie le code 6833 dans les défauts de signal de télécommande MA.",
            effect: "La commande peut ne pas communiquer normalement.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Défauts de télécommande MA",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Identification",
                question: "La télécommande et l'unité associée sont-elles identifiées ?",
                instruction: "Relever les références et la configuration de commande.",
                detail: "Vérifier la topologie de l'installation.",
                yesLabel: "Identifiées",
                noLabel: "Non identifiées",
                noTitle: "Identification nécessaire",
                noText: "Confirmer les références et la configuration.",
                reference: "Documentation constructeur"
              },
              {
                title: "Contrôle de la liaison",
                question: "Le câblage est-il conforme ?",
                instruction: "Contrôler le raccordement selon le schéma constructeur.",
                detail: "Ne pas appliquer de brochage générique.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de liaison",
                noText: "Corriger le défaut identifié et vérifier à nouveau la communication.",
                reference: "Schéma constructeur"
              }
            ]
          },

          "6834": {
            title: "Anomalie de signal de télécommande MA",
            meaning: "Le document Mitsubishi City Multi répertorie le code 6834 dans les défauts de signal de télécommande MA.",
            effect: "La commande peut ne pas communiquer normalement.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Défauts de télécommande MA",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Identification",
                question: "La commande concernée est-elle identifiée ?",
                instruction: "Identifier la télécommande, l'unité associée et la configuration du système.",
                detail: "La procédure doit correspondre à la configuration réelle.",
                yesLabel: "Identifiée",
                noLabel: "Non identifiée",
                noTitle: "Identification nécessaire",
                noText: "Consulter la documentation de la configuration installée.",
                reference: "Documentation constructeur"
              },
              {
                title: "Contrôle de la liaison",
                question: "Le raccordement est-il conforme ?",
                instruction: "Contrôler le câblage, les connexions et la continuité selon la procédure constructeur.",
                detail: "Ne pas déduire la panne d'une seule mesure non documentée.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de liaison",
                noText: "Corriger le défaut de raccordement constaté.",
                reference: "Schéma constructeur"
              }
            ]
          },

          "7100": {
            title: "Erreur de capacité totale",
            meaning: "Le document Mitsubishi City Multi répertorie le code 7100 comme erreur de capacité totale.",
            effect: "La configuration ou la capacité déclarée du système doit être vérifiée.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Erreur de capacité",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Inventaire des unités",
                question: "La liste des unités installées correspond-elle à la configuration prévue ?",
                instruction: "Relever les références des unités intérieures et extérieures ainsi que la configuration réelle.",
                detail: "Comparer avec le dossier de conception et les limites constructeur.",
                yesLabel: "Configuration conforme",
                noLabel: "Écart constaté",
                noTitle: "Configuration à vérifier",
                noText: "Reprendre l'inventaire et vérifier les références des unités installées.",
                reference: "Documentation de combinaison constructeur"
              },
              {
                title: "Capacité et combinaison",
                question: "La combinaison de capacités respecte-t-elle les prescriptions du constructeur ?",
                instruction: "Vérifier le ratio et les limites de combinaison dans la documentation correspondant aux références exactes.",
                detail: "Ne pas appliquer un ratio générique à toutes les générations City Multi.",
                yesLabel: "Combinaison conforme",
                noLabel: "Combinaison non conforme",
                noTitle: "Combinaison à corriger",
                noText: "Recalculer la combinaison à partir des données officielles des unités concernées.",
                reference: "Table de combinaison constructeur"
              }
            ]
          },

          "2502": {
            title: "Défaut pompe de drainage",
            meaning: "Le document Mitsubishi City Multi répertorie le code 2502 comme défaut de pompe de drainage sur les familles couvertes par le document.",
            effect: "L'évacuation des condensats peut être interrompue.",
            source: {
              manufacturer: "Mitsubishi Electric",
              document: "City Multi Error Code",
              reference: "CityMultiErrorCode V3",
              revision: "13 décembre 2024",
              chapter: "Drain pump",
              pages: "Selon modèle",
              url: "https://www.mitsubishielectric.com.sg/getmedia/d80ea241-92ab-43d3-a6ae-331eba54394f/CityMultiErrorCode_V3.pdf"
            },
            steps: [
              {
                title: "Contrôle de l'évacuation",
                question: "L'évacuation des condensats est-elle libre ?",
                instruction: "Contrôler le bac, la tuyauterie, la pente, les raccordements et l'absence d'obstruction.",
                detail: "Éviter tout débordement d'eau sur les équipements électriques.",
                yesLabel: "Évacuation libre",
                noLabel: "Obstruction ou défaut",
                noTitle: "Défaut d'évacuation",
                noText: "Nettoyer et corriger le réseau d'évacuation en respectant la configuration de l'installation.",
                reference: "Documentation unité intérieure"
              },
              {
                title: "Flotteur et détection",
                question: "Le dispositif de détection de niveau fonctionne-t-il conformément à la notice ?",
                instruction: "Contrôler le flotteur et son raccordement selon la procédure du modèle exact.",
                detail: "Ne pas shunter une sécurité de niveau pour exploiter l'installation.",
                yesLabel: "Conforme",
                noLabel: "Anomalie",
                noTitle: "Défaut de détection",
                noText: "Identifier le défaut de flotteur, de câblage ou de commande avec la notice exacte.",
                reference: "Schéma constructeur"
              },
              {
                title: "Pompe de drainage",
                question: "La pompe fonctionne-t-elle conformément à la procédure constructeur ?",
                instruction: "Contrôler la pompe, son alimentation et son fonctionnement selon le manuel exact de l'unité.",
                detail: "Ne pas appliquer de valeur électrique générique.",
                yesLabel: "Fonctionnement conforme",
                noLabel: "Anomalie",
                noTitle: "Pompe à contrôler",
                noText: "Identifier la panne de pompe, d'alimentation ou de commande à partir du schéma et du manuel exacts.",
                reference: "Manuel de service exact"
              }
            ]
          }
        }
      }
    }
  };

  const BRANDS = Object.keys(CATALOG);

  const TYPES = [
    "Split mural",
    "Multi-split",
    "Gainable",
    "Cassette",
    "Console",
    "Plafonnier",
    "DRV / VRV",
    "PAC air/eau",
    "Groupe d'eau glacée",
    "Rooftop",
    "CTA / ventilation",
    "Autre"
  ];

  const COMPONENTS = [
    ["Sonde de température d'air", "NTC"],
    ["Sonde de batterie", "NTC"],
    ["Sonde de tuyauterie frigorifique", "NTC"],
    ["Sonde de refoulement compresseur", "NTC"],
    ["Sonde échangeur extérieur", "NTC"],
    ["Sonde de température extérieure", "NTC"],
    ["Transducteur de pression", "transducteur"],
    ["Pressostat haute pression", "pressostat"],
    ["Pressostat basse pression", "pressostat"],
    ["Protection thermique compresseur", "autre"],
    ["Ventilateur intérieur", "autre"],
    ["Ventilateur extérieur", "autre"],
    ["Détendeur électronique", "autre"],
    ["Vanne 4 voies", "autre"],
    ["Compresseur", "autre"],
    ["Carte électronique", "autre"],
    ["Moteur de turbine", "autre"],
    ["Pompe de condensats", "autre"],
    ["Autre composant", "autre"]
  ];

  const OPTIONS = (items, selected = "") =>
    items.map(value =>
      `<option value="${esc(value)}" ${value === selected ? "selected" : ""}>${esc(value)}</option>`
    ).join("");

  const BRAND_OPTIONS = `
    <option value="">Sélectionner un constructeur</option>
    ${OPTIONS(BRANDS)}
  `;

  const TYPE_OPTIONS = `
    <option value="">Sélectionner un type</option>
    ${OPTIONS(TYPES)}
  `;

  const COMPONENT_OPTIONS = `
    <option value="">Sélectionner un composant</option>
    ${COMPONENTS.map(component =>
      `<option value="${esc(component[0])}" data-type="${esc(component[1])}">${esc(component[0])}</option>`
    ).join("")}
  `;

  /* ========================================================
     3. PARCOURS PAR SYMPTÔME
     ======================================================== */

  const PATHS = {
    froid: {
      title: "Ne fait plus de froid",
      steps: [
        ["Confirmer la demande", "Vérifier le mode FROID, la consigne, la programmation et la commande centralisée."],
        ["Contrôler alimentation et protections", "Vérifier les protections, voyants et connexions. Ne pas réarmer plusieurs fois une protection qui déclenche."],
        ["Observer les deux unités", "Noter les voyants, codes, ventilateurs, bruits et éventuelles mises en sécurité."],
        ["Vérifier les débits d'air", "Inspecter filtres, échangeurs, turbines, ventilateurs et dégagements du groupe extérieur."],
        ["Relever les températures", "Mesurer air repris et soufflé après stabilisation. Noter consigne, température ambiante et temps de fonctionnement."],
        ["Approfondir le circuit frigorifique", "Appliquer la procédure constructeur et relever les conditions. Une pression isolée ne permet pas de conclure à un manque de fluide."]
      ]
    },
    chaud: {
      title: "Ne fait plus de chaud",
      steps: [
        ["Confirmer la demande", "Vérifier mode CHAUD, consigne, programmation et commande centralisée."],
        ["Relever les conditions extérieures", "Noter température, humidité, état de batterie et présence de givre."],
        ["Observer les dégivrages", "Noter fréquence, durée, évacuation des condensats et état de la batterie après cycle."],
        ["Contrôler les débits d'air", "Inspecter filtres, échangeurs, ventilateurs et obstacles."],
        ["Relever les températures", "Mesurer reprise, soufflage, extérieur et tuyauteries si pertinent, après stabilisation."],
        ["Contrôler régulation et circuit", "Lire les défauts, contrôler les sondes et paramètres selon la documentation exacte."]
      ]
    },
    demarrage: {
      title: "Ne démarre pas",
      steps: [
        ["Vérifier la commande", "Contrôler marche/arrêt, mode, consigne, programmation et verrouillage."],
        ["Lire les voyants et défauts", "Relever le code exact, les clignotements, l'unité concernée et les circonstances."],
        ["Contrôler les protections", "Identifier tout déclenchement. Ne pas réarmer à répétition."],
        ["Inspecter hors tension", "Après consignation et vérification d'absence de tension, inspecter borniers, connecteurs et traces d'échauffement."],
        ["Contrôler sécurités et communication", "Suivre le schéma et la procédure constructeur du modèle exact."]
      ]
    },
    eau: {
      title: "Fuite d'eau / condensats",
      steps: [
        ["Localiser l'origine", "Repérer le point de sortie et vérifier si la fuite apparaît à l'arrêt ou en fonctionnement."],
        ["Inspecter filtre et batterie", "Rechercher encrassement, givrage et défaut de circulation d'air."],
        ["Contrôler bac et évacuation", "Vérifier bac, pente, pincements, contre-pente et écoulement."],
        ["Contrôler la pompe si présente", "Suivre la notice : flotteur, aspiration, refoulement, alimentation et alarme."],
        ["Vérifier pose et isolation", "Contrôler niveau de l'unité, isolation des tuyauteries et ponts thermiques."]
      ]
    },
    bruit: {
      title: "Bruit / vibration",
      steps: [
        ["Localiser le bruit", "Identifier unité, zone, fréquence et conditions d'apparition."],
        ["Contrôler les fixations", "Vérifier supports, silentblocs, visserie et contact avec les parois."],
        ["Inspecter les ventilateurs", "Hors tension, rechercher corps étranger, jeu, pales endommagées ou frottement."],
        ["Contrôler les tuyauteries", "Rechercher contact, vibration, contrainte ou défaut de support."],
        ["Comparer au fonctionnement normal", "Noter mode, fréquence, vitesse et conditions avant diagnostic complémentaire."]
      ]
    },
    performance: {
      title: "Manque de performance",
      steps: [
        ["Vérifier consigne et conditions", "Noter mode, consigne, température intérieure/extérieure et temps de fonctionnement."],
        ["Contrôler les débits", "Inspecter filtres, batteries, turbines, ventilateurs, gaines et bouches."],
        ["Relever les températures", "Mesurer reprise/soufflage et tuyauteries si pertinent, avec conditions stabilisées."],
        ["Vérifier régulation et sondes", "Comparer les températures affichées à une mesure indépendante et contrôler les sondes selon notice."],
        ["Approfondir", "Relever les paramètres prescrits par le constructeur ; ne pas conclure sur une pression isolée."]
      ]
    }
  };

  /* ========================================================
     4. STYLE
     ======================================================== */

  function styles() {
    if ($("pcDiagnosticStyles")) return;

    const st = document.createElement("style");
    st.id = "pcDiagnosticStyles";
    st.textContent = `
      #${PAGE} .pcd-wrap{max-width:900px;margin:auto;padding:12px;color:#172033}
      #${PAGE} .pcd-card{background:#fff;border:1px solid #dbe3ed;border-radius:14px;padding:15px;margin:12px 0;box-shadow:0 2px 8px #0f172a0b}
      #${PAGE} .pcd-hero{background:#0D47A1;color:white;border-radius:14px;padding:17px;margin-bottom:12px}
      #${PAGE} .pcd-hero h2{margin:0 0 5px}
      #${PAGE} .pcd-muted{color:#64748b;font-size:13px;line-height:1.5}
      #${PAGE} .pcd-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      #${PAGE} .pcd-field{display:block;font-size:13px;font-weight:700;margin:9px 0}
      #${PAGE} .pcd-field input,#${PAGE} .pcd-field select,#${PAGE} .pcd-field textarea{box-sizing:border-box;width:100%;display:block;margin-top:5px;padding:11px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#172033;font:inherit;font-weight:400}
      #${PAGE} .pcd-field textarea{min-height:75px}
      #${PAGE} .pcd-symptoms{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      #${PAGE} .pcd-btn,#${PAGE} .pcd-symptom{border:0;border-radius:9px;padding:13px;margin:5px 0;font-weight:800;cursor:pointer}
      #${PAGE} .pcd-btn{width:100%}
      #${PAGE} .pcd-primary{background:#0D47A1;color:#fff}
      #${PAGE} .pcd-secondary{background:#e8f0fe;color:#0D47A1}
      #${PAGE} .pcd-symptom{width:100%;min-height:65px;background:#f8fafc;border:1px solid #cbd5e1;color:#172033;text-align:left}
      #${PAGE} .pcd-step{background:#f8fafc;border-left:4px solid #0D47A1;border-radius:8px;padding:13px;margin:12px 0;line-height:1.5}
      #${PAGE} .pcd-alert{background:#fff7ed;color:#9a3412;border-radius:9px;padding:12px;font-size:12px;line-height:1.5;margin:12px 0}
      #${PAGE} .pcd-result{border:1px solid #dbe3ed;border-radius:9px;padding:12px;margin:10px 0}
      #${PAGE} .pcd-good{background:#ecfdf5;color:#166534}
      #${PAGE} .pcd-actions{display:flex;gap:8px}
      #${PAGE} .pcd-actions>*{flex:1}
      #${PAGE} .pcd-fault-code{font-size:27px;font-weight:900;color:#b91c1c;margin:2px 0}
      #${PAGE} .pcd-fault-step{border:1px solid #cbd5e1;border-left:5px solid #0D47A1;border-radius:12px;padding:15px;margin:12px 0;background:#f8fafc}
      #${PAGE} .pcd-fault-step h4{font-size:18px;margin:5px 0 10px}
      #${PAGE} .pcd-choice{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}
      #${PAGE} .pcd-choice button{border:0;border-radius:10px;padding:15px 8px;font-weight:900;font-size:15px;cursor:pointer}
      #${PAGE} .pcd-choice .ok{background:#dcfce7;color:#166534}
      #${PAGE} .pcd-choice .ko{background:#fee2e2;color:#991b1b}
      #${PAGE} .pcd-progress{height:7px;background:#e2e8f0;border-radius:10px;overflow:hidden;margin:10px 0}
      #${PAGE} .pcd-progress span{display:block;height:100%;background:#0D47A1}
      #${PAGE} .pcd-small{font-size:12px;color:#64748b}
      #${PAGE} .pcd-tag{display:inline-block;background:#e8f0fe;color:#0D47A1;padding:5px 9px;border-radius:20px;font-size:11px;font-weight:800;margin:3px 0}
      @media(max-width:520px){#${PAGE} .pcd-grid{grid-template-columns:1fr 1fr}}
      @media print{
        body *{visibility:hidden}
        #pcdReport,#pcdReport *{visibility:visible}
        #pcdReport{position:absolute;left:0;top:0;width:100%;border:0}
        #${PAGE} .pcd-hero{print-color-adjust:exact;-webkit-print-color-adjust:exact}
      }
    `;
    document.head.appendChild(st);
  }

  /* ========================================================
     5. CONSTRUCTION DE LA PAGE
     ======================================================== */

  function build() {
    const page = $(PAGE);
    if (!page) return false;

    page.innerHTML = `
      <div class="pcd-wrap">
        <div class="pcd-hero">
          <h2>🛠️ Assistant dépannage CVC</h2>
          <p>Diagnostic guidé, références constructeurs et contrôle des composants.</p>
        </div>

        <div id="pcdAccueil">
          <section class="pcd-card">
            <h3>🔎 Diagnostic par code défaut</h3>
            <p class="pcd-muted">
              Sélectionne le constructeur, la gamme et la série.
              Saisis ensuite la référence complète inscrite sur la plaque signalétique.
            </p>

            <label class="pcd-field">1. Constructeur
              <select id="pcdMarque">${BRAND_OPTIONS}</select>
            </label>

            <label class="pcd-field">2. Gamme / système
              <select id="pcdGamme" disabled><option value="">Choisir d'abord le constructeur</option></select>
            </label>

            <label class="pcd-field">3. Série / famille de référence
              <select id="pcdModele" disabled><option value="">Choisir d'abord la gamme</option></select>
            </label>

            <label class="pcd-field">Référence complète sur la plaque signalétique
              <input id="pcdReferenceExacte" placeholder="Ex. MSZ-AY35VGK / RXYSA6A7V1B">
            </label>

            <label class="pcd-field">4. Code défaut
              <select id="pcdCode" disabled><option value="">Choisir d'abord le modèle</option></select>
            </label>

            <div id="pcdCatalogueInfo" class="pcd-alert" aria-live="polite">
              Les références catalogue sont des familles et séries. Vérifie toujours la référence complète sur la plaque.
            </div>

            <label class="pcd-field">Type d'installation
              <select id="pcdType">${TYPE_OPTIONS}</select>
            </label>

            <label class="pcd-field">Fluide
              <select id="pcdFluide">
                <option value="">À sélectionner</option>
                ${OPTIONS(["R32","R410A","R407C","R134a","R290","R22","Autre / à confirmer"])}
              </select>
            </label>

            <label class="pcd-field">Contexte de la panne
              <textarea id="pcdContexte" placeholder="Depuis quand ? Conditions d'apparition ? Intervention récente ?"></textarea>
            </label>

            <button class="pcd-btn pcd-primary" data-action="analyze-code">Lancer le diagnostic guidé →</button>
            <div id="pcdResultatCode" aria-live="polite"></div>
          </section>

          <section class="pcd-card">
            <h3>Quel est le symptôme ?</h3>
            <div class="pcd-symptoms">
              ${Object.entries(PATHS).map(([key,value]) =>
                `<button class="pcd-symptom" data-symptom="${key}">${esc(value.title)}</button>`
              ).join("")}
            </div>
          </section>

          <section class="pcd-card">
            <h3>🔬 Contrôle d'un composant sur carte</h3>
            <p class="pcd-muted">Identification du composant, comparaison sonde et température, relevé des références et du document constructeur.</p>
            <button class="pcd-btn pcd-primary" data-action="open-board">Ouvrir le contrôle composants →</button>
          </section>

          <div class="pcd-alert">
            <strong>Sécurité :</strong> consignation et vérification d'absence de tension avant toute intervention hors tension. Les mesures sous tension et interventions frigorifiques exigent les compétences, habilitations/certifications, équipements et procédures adaptés.
          </div>
        </div>

        <div id="pcdParcours" hidden></div>
        <div id="pcdBoard" hidden></div>
        <div id="pcdMesures" hidden></div>
        <div id="pcdRapportZone" hidden></div>
      </div>`;

    return true;
  }

  /* ========================================================
     6. MENUS EN CASCADE
     ======================================================== */

  function fillSelect(id, values, placeholder) {
    const select = $(id);
    if (!select) return;

    select.innerHTML =
      `<option value="">${esc(placeholder)}</option>` +
      values.map(value =>
        `<option value="${esc(value)}">${esc(value)}</option>`
      ).join("");

    select.disabled = values.length === 0;
  }

  function updateBrands() {
    const brand = $("pcdMarque").value;
    const families = Object.keys(CATALOG[brand] || {});

    fillSelect(
      "pcdGamme",
      families,
      families.length ? "Sélectionner une gamme" : "Aucune gamme disponible"
    );

    fillSelect("pcdModele", [], "Sélectionner d'abord la gamme");
    fillSelect("pcdCode", [], "Sélectionner d'abord la référence");

    $("pcdReferenceExacte").value = "";
    $("pcdResultatCode").innerHTML = "";

    $("pcdCatalogueInfo").innerHTML = brand
      ? `<strong>${esc(brand)}</strong> : ${families.length} familles référencées. Les séries proposées servent à identifier la famille ; la référence exacte reste à confirmer sur la plaque signalétique.`
      : "Sélectionne un constructeur pour afficher son catalogue.";
  }

  function updateFamilies() {
    const brand = $("pcdMarque").value;
    const family = $("pcdGamme").value;
    const models = CATALOG[brand]?.[family] || [];

    fillSelect(
      "pcdModele",
      models,
      models.length ? "Sélectionner une série / référence" : "Aucune série disponible"
    );

    fillSelect("pcdCode", [], "Sélectionner d'abord la référence");

    $("pcdReferenceExacte").value = "";
    $("pcdResultatCode").innerHTML = "";

    const documented = DATABASE[brand]?.[family]?.models || [];

    $("pcdCatalogueInfo").innerHTML = `
      <strong>${esc(family)}</strong><br>
      ${models.length} séries ou familles de références proposées.<br>
      ${documented.length
        ? `${documented.length} références ou familles disposent d'entrées dans la base de procédures.`
        : "Catalogue matériel disponible, mais aucune procédure de code défaut n'est encore intégrée pour cette gamme."}
    `;
  }

  function updateModels() {
    const brand = $("pcdMarque").value;
    const family = $("pcdGamme").value;
    const model = $("pcdModele").value;

    const procedures = DATABASE[brand]?.[family];
    const exactModels = procedures?.models || [];
    const codes = procedures?.codes || {};

    const exactMatch = exactModels.some(item =>
      normalize(item) === normalize(model)
    );

    const available = exactMatch ? Object.keys(codes) : [];

    fillSelect(
      "pcdCode",
      available,
      available.length
        ? "Sélectionner le code défaut"
        : "Aucune procédure documentée pour cette série"
    );

    $("pcdReferenceExacte").value = model || "";
    $("pcdResultatCode").innerHTML = "";

    $("pcdCatalogueInfo").innerHTML = available.length
      ? `<strong>${esc(model)}</strong><br>Procédures disponibles : ${available.join(", ")}. La référence complète doit être confirmée sur la plaque.`
      : `<strong>${esc(model)}</strong><br>Référence de série identifiée dans le catalogue. La documentation de dépannage correspondant à cette série n'est pas encore intégrée.`;
  }

  /* ========================================================
     7. VALIDATION STRICTE DE LA RÉFÉRENCE
     ======================================================== */

  function getSelectedProcedure() {
    const brand = $("pcdMarque").value;
    const family = $("pcdGamme").value;
    const model = $("pcdModele").value;
    const code = $("pcdCode").value;
    const exactReference = $("pcdReferenceExacte").value.trim();

    const entry = DATABASE[brand]?.[family];
    const procedure = entry?.codes?.[code];

    if (!procedure || !model || !exactReference) return null;

    const supported = entry.models || [];

    const selectedSupported = supported.some(item =>
      normalize(item) === normalize(model)
    );

    const exactSupported = supported.some(item =>
      normalize(item) === normalize(exactReference)
    );

    if (!selectedSupported || !exactSupported) return null;

    if (normalize(model) !== normalize(exactReference)) return null;

    return {
      ...procedure,
      brand,
      family,
      model,
      code
    };
  }

  function analyzeFault() {
    const brand = $("pcdMarque").value;
    const family = $("pcdGamme").value;
    const model = $("pcdModele").value;
    const code = $("pcdCode").value;
    const exactReference = $("pcdReferenceExacte").value.trim();
    const out = $("pcdResultatCode");

    if (!brand || !family || !model || !code || !exactReference) {
      out.innerHTML = `<div class="pcd-alert">Termine les sélections : constructeur, gamme, référence, référence complète et code défaut.</div>`;
      return;
    }

    const procedure = getSelectedProcedure();

    if (!procedure) {
      out.innerHTML = `
        <div class="pcd-alert">
          <strong>Référence non validée.</strong><br>
          La procédure sélectionnée n'est pas autorisée pour la référence saisie.
          Vérifie la plaque signalétique et sélectionne la référence exacte.
          Pro Clim ne doit pas appliquer une procédure à une machine non couverte.
        </div>`;
      return;
    }

    S.fault = {
      procedure,
      brand,
      family,
      model,
      exactReference,
      code,
      type: $("pcdType").value,
      fluide: $("pcdFluide").value,
      contexte: $("pcdContexte").value.trim(),
      step: 0,
      history: [],
      branch: null
    };

    renderFaultStep();
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ========================================================
     8. DIAGNOSTIC GUIDÉ
     ======================================================== */

  function renderFaultStep() {
    const f = S.fault;
    if (!f) return;

    const p = f.procedure;
    const step = p.steps[f.step];

    if (!step) {
      renderFaultConclusion();
      return;
    }

    const out = $("pcdResultatCode");
    const progress = Math.round((f.step / p.steps.length) * 100);

    out.innerHTML = `
      <section class="pcd-card">
        <div class="pcd-tag">${esc(f.brand)} · ${esc(f.family)}</div>
        <div class="pcd-fault-code">${esc(f.code)}</div>
        <h3>${esc(p.title)}</h3>

        <p class="pcd-muted">
          Série : ${esc(f.model)}<br>
          Référence plaque : ${esc(f.exactReference)}
        </p>

        <div class="pcd-alert">
          <strong>Signification documentée</strong><br>${esc(p.meaning)}
        </div>

        <div class="pcd-progress"><span style="width:${progress}%"></span></div>
        <p class="pcd-small">Vérification ${f.step + 1} sur ${p.steps.length}</p>

        <div class="pcd-fault-step">
          <p class="pcd-small"><strong>CONTRÔLE À EFFECTUER</strong></p>
          <h4>${esc(step.title)}</h4>
          <p><strong>${esc(step.question)}</strong></p>
          <p>${esc(step.instruction)}</p>
          <p class="pcd-muted">${esc(step.detail)}</p>
          <p class="pcd-small">Référence : ${esc(step.reference || p.source.chapter)}</p>
        </div>

        <p><strong>Résultat du contrôle :</strong></p>
        <div class="pcd-choice">
          <button class="ok" data-action="fault-yes">✓ ${esc(step.yesLabel || "Oui")}</button>
          <button class="ko" data-action="fault-no">✕ ${esc(step.noLabel || "Non")}</button>
        </div>

        <p class="pcd-small">Réponds uniquement après avoir effectué le contrôle.</p>
        <button class="pcd-btn pcd-secondary" data-action="fault-reset">Recommencer ce diagnostic</button>
        <p class="pcd-small">Source : ${esc(p.source.reference)} — ${esc(p.source.pages)}</p>
      </section>`;
  }

  function faultChoice(answer) {
    const f = S.fault;
    if (!f) return;

    const step = f.procedure.steps[f.step];

    const historyItem = {
      number: f.step + 1,
      title: step.title,
      question: step.question,
      result: answer ? "Oui" : "Non",
      observation: ""
    };

    f.history.push(historyItem);

    const goesToBranch = answer
      ? step.yesBranch === true
      : step.yesBranch !== true;

    if (goesToBranch) {
      f.branch = { step, historyItem };
      renderFaultBranch();
      return;
    }

    f.step++;

    if (f.step >= f.procedure.steps.length) {
      renderFaultConclusion();
      return;
    }

    renderFaultStep();
  }

  function renderFaultBranch() {
    const f = S.fault;
    if (!f || !f.branch) return;

    const step = f.branch.step;
    const title = step.yesBranch ? step.branchTitle : step.noTitle;
    const description = step.yesBranch ? step.branchText : step.noText;

    $("pcdResultatCode").innerHTML = `
      <section class="pcd-card">
        <div class="pcd-fault-code">${esc(f.code)}</div>
        <div class="pcd-alert"><strong>Orientation du diagnostic</strong><br>La réponse indique une branche de recherche spécifique.</div>
        <h3>${esc(title || "Anomalie à traiter")}</h3>
        <p>${esc(description || "")}</p>

        <label class="pcd-field">Observation / mesure relevée
          <textarea id="pcdFaultObservation" placeholder="Note la mesure, l'unité concernée, le résultat du contrôle..."></textarea>
        </label>

        <button class="pcd-btn pcd-primary" data-action="fault-resolved">Anomalie corrigée — refaire le contrôle</button>
        <button class="pcd-btn pcd-secondary" data-action="fault-unresolved">Anomalie toujours présente</button>
      </section>`;

    $("pcdResultatCode").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function faultResolved() {
    const f = S.fault;
    if (!f || !f.branch) return;

    f.branch.historyItem.observation =
      $("pcdFaultObservation")?.value.trim() || "";

    $("pcdResultatCode").innerHTML = `
      <section class="pcd-card">
        <h3>Contrôle à refaire</h3>
        <p>L'anomalie a été déclarée corrigée. Recommence maintenant le contrôle concerné.</p>
        <button class="pcd-btn pcd-primary" data-action="fault-recheck">Refaire le contrôle</button>
      </section>`;
  }

  function faultRecheck() {
    const f = S.fault;
    if (!f || !f.branch) return;

    f.history.pop();
    f.branch = null;
    renderFaultStep();
  }

  function faultUnresolved() {
    const f = S.fault;
    if (!f || !f.branch) return;

    const observation = $("pcdFaultObservation")?.value.trim() || "";
    f.branch.historyItem.observation = observation;

    $("pcdResultatCode").innerHTML = `
      <section class="pcd-card">
        <h3>Diagnostic suspendu</h3>
        <div class="pcd-alert">L'anomalie est toujours présente. Le parcours constructeur est interrompu à cette étape.</div>
        <p><strong>Contrôle :</strong> ${esc(f.branch.step.title)}</p>
        <p><strong>Observation :</strong> ${esc(observation || "Non renseignée")}</p>
        <button class="pcd-btn pcd-primary" data-action="fault-recheck">Revenir au contrôle</button>
      </section>`;
  }

  function renderFaultConclusion() {
    const f = S.fault;
    if (!f) return;

    const history = f.history.map(item => `
      <div class="pcd-result">
        <strong>${item.number}. ${esc(item.title)}</strong>
        <p>${esc(item.result)}</p>
        ${item.observation ? `<p>${esc(item.observation)}</p>` : ""}
      </div>`).join("");

    $("pcdResultatCode").innerHTML = `
      <section class="pcd-card">
        <h3>Parcours de contrôle terminé</h3>
        <div class="pcd-alert">
          Tous les contrôles de cette séquence ont été déclarés conformes.
          Cela ne prouve pas à lui seul que la panne est réparée.
        </div>

        <h4>Résumé des vérifications</h4>
        ${history}

        <div class="pcd-result">
          <strong>Code :</strong> ${esc(f.code)}<br>
          <strong>Série :</strong> ${esc(f.model)}<br>
          <strong>Référence plaque :</strong> ${esc(f.exactReference)}<br>
          <strong>Constructeur :</strong> ${esc(f.brand)}
        </div>

        <div class="pcd-result">
          <strong>Documentation utilisée</strong>
          <p>${esc(f.procedure.source.document)}</p>
          <p>${esc(f.procedure.source.reference)}</p>
          <p>${esc(f.procedure.source.chapter)}</p>
          <p>Pages ${esc(f.procedure.source.pages)}</p>
          <p>Révision : ${esc(f.procedure.source.revision)}</p>
          <p><a href="${esc(f.procedure.source.url)}" target="_blank" rel="noopener">Consulter le manuel</a></p>
        </div>

        <button class="pcd-btn pcd-primary" data-action="fault-report">Créer un compte rendu</button>
        <button class="pcd-btn pcd-secondary" data-action="fault-reset">Recommencer le diagnostic</button>
      </section>`;

    $("pcdResultatCode").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ========================================================
     9. PARCOURS PAR SYMPTÔME
     ======================================================== */

  function start(key) {
    S.symptom = key;
    S.step = 0;
    S.answers = [];
    showStep();
  }

  function showStep() {
    const p = PATHS[S.symptom];
    if (!p) return;

    const step = p.steps[S.step];

    $("pcdAccueil").hidden = true;
    $("pcdBoard").hidden = true;
    $("pcdMesures").hidden = true;
    $("pcdRapportZone").hidden = true;

    const zone = $("pcdParcours");
    zone.hidden = false;

    zone.innerHTML = `
      <section class="pcd-card">
        <button class="pcd-btn pcd-secondary" data-action="home">← Retour</button>
        <h3>${esc(p.title)}</h3>
        <p class="pcd-muted">Étape ${S.step + 1} / ${p.steps.length}</p>

        <div class="pcd-step">
          <strong>${esc(step[0])}</strong>
          <p>${esc(step[1])}</p>
        </div>

        <label class="pcd-field">Résultat
          <select id="pcdEtat">
            <option>Non réalisé</option>
            <option>Conforme</option>
            <option>Anomalie constatée</option>
            <option>À approfondir</option>
            <option>Non applicable</option>
          </select>
        </label>

        <label class="pcd-field">Mesure / observation
          <textarea id="pcdObs" placeholder="Valeur relevée, constat...">${esc(S.answers[S.step]?.obs || "")}</textarea>
        </label>

        <div class="pcd-actions">
          <button class="pcd-btn pcd-secondary" data-action="prev" ${S.step === 0 ? "disabled" : ""}>← Précédent</button>
          <button class="pcd-btn pcd-primary" data-action="next">${S.step === p.steps.length - 1 ? "Terminer →" : "Enregistrer et continuer →"}</button>
        </div>
      </section>`;

    if (S.answers[S.step]) $("pcdEtat").value = S.answers[S.step].etat;
  }

  function saveStep() {
    S.answers[S.step] = {
      etat: $("pcdEtat").value,
      obs: $("pcdObs").value.trim()
    };
  }

  /* ========================================================
     10. CONTRÔLE DES COMPOSANTS
     ======================================================== */

  function openBoard() {
    $("pcdAccueil").hidden = true;
    $("pcdParcours").hidden = true;
    $("pcdMesures").hidden = true;
    $("pcdRapportZone").hidden = true;

    const zone = $("pcdBoard");
    zone.hidden = false;

    zone.innerHTML = `
      <section class="pcd-card">
        <button class="pcd-btn pcd-secondary" data-action="home">← Retour</button>
        <h3>Identification du composant sur la carte</h3>
        <p class="pcd-muted">Les repères et caractéristiques doivent être confirmés avec le schéma correspondant au modèle exact.</p>

        <div class="pcd-grid">
          <label class="pcd-field">Marque
            <select id="bMarque">${BRAND_OPTIONS}</select>
          </label>
          <label class="pcd-field">Modèle exact
            <input id="bModele" placeholder="Référence complète unité">
          </label>
          <label class="pcd-field">Type d'installation
            <select id="bInstallation">${TYPE_OPTIONS}</select>
          </label>
          <label class="pcd-field">Unité
            <select id="bUnite">${OPTIONS(["Intérieure","Extérieure","Commande / autre"])}</select>
          </label>
          <label class="pcd-field">Composant recherché
            <select id="bComposant">${COMPONENT_OPTIONS}</select>
          </label>
          <label class="pcd-field">Type électrique
            <select id="bType">${OPTIONS(["NTC","PTC","transducteur","pressostat","autre"])}</select>
          </label>
          <label class="pcd-field">Référence carte
            <input id="bCarte" placeholder="Référence sérigraphiée">
          </label>
          <label class="pcd-field">Repère connecteur / composant
            <input id="bRepere" placeholder="Repère du schéma">
          </label>
          <label class="pcd-field">Fonction confirmée
            <input id="bFonction" placeholder="Fonction selon le schéma">
          </label>
          <label class="pcd-field">Document constructeur + page
            <input id="bSource" placeholder="Manuel de service, page/tableau">
          </label>
        </div>

        <div class="pcd-alert">Les repères R1T, R2T, CN1, etc. ne sont pas universels. La fonction doit être confirmée avec le modèle exact, la référence de carte et le schéma.</div>
      </section>

      <section class="pcd-card">
        <h3>🌡️ Comparaison résistance / température</h3>
        <p class="pcd-muted">Uniquement pour une sonde résistive NTC ou PTC. Recopie deux points de la courbe constructeur qui encadrent la température mesurée.</p>

        <div class="pcd-grid">
          <label class="pcd-field">Température mesurée (°C)<input id="bTemp" type="number" step="0.1"></label>
          <label class="pcd-field">Résistance mesurée (Ω)<input id="bMesure" type="number" step="1"></label>
          <label class="pcd-field">Point constructeur 1 — °C<input id="bT1" type="number" step="0.1"></label>
          <label class="pcd-field">Point constructeur 1 — Ω<input id="bR1" type="number" step="1"></label>
          <label class="pcd-field">Point constructeur 2 — °C<input id="bT2" type="number" step="0.1"></label>
          <label class="pcd-field">Point constructeur 2 — Ω<input id="bR2" type="number" step="1"></label>
          <label class="pcd-field">Tolérance constructeur (%)<input id="bTol" type="number" step="0.1" placeholder="Laisser vide si inconnue"></label>
        </div>

        <button class="pcd-btn pcd-primary" data-action="calc-probe">Comparer la mesure →</button>
        <div id="bResult" aria-live="polite"></div>

        <div class="pcd-alert">Avant mesure ohmique : couper, consigner, vérifier l'absence de tension et isoler la sonde de la carte selon la notice. Ne jamais mesurer une résistance sur un circuit alimenté. Un transducteur actif ne se contrôle pas comme une NTC.</div>
      </section>

      <section class="pcd-card">
        <h3>Autres composants</h3>
        <p class="pcd-muted">Transducteurs, pressostats, ventilateurs, détendeurs et vannes nécessitent chacun leur procédure : brochage, alimentation, signal, seuil ou résistance selon le manuel exact.</p>
      </section>`;

    $("bMarque").value = $("pcdMarque").value;
    $("bModele").value = $("pcdReferenceExacte").value;
    $("bInstallation").value = $("pcdType").value;
  }

  function calcProbe() {
    const val = id => $(id).value.trim();

    const type = val("bType");
    const t = Number(val("bTemp"));
    const m = Number(val("bMesure"));
    const t1 = Number(val("bT1"));
    const r1 = Number(val("bR1"));
    const t2 = Number(val("bT2"));
    const r2 = Number(val("bR2"));
    const tolText = val("bTol");
    const out = $("bResult");

    if (type !== "NTC" && type !== "PTC") {
      out.innerHTML = `<div class="pcd-alert">Ce composant ne se contrôle pas avec une simple courbe résistance/température. Consulte le brochage et la procédure constructeur.</div>`;
      return;
    }

    const required = ["bMarque","bModele","bCarte","bRepere","bFonction","bSource"];

    if (required.some(id => !val(id))) {
      out.innerHTML = `<div class="pcd-alert">Complète marque, modèle exact, référence de carte, repère, fonction confirmée et source constructeur.</div>`;
      return;
    }

    if (![t,m,t1,r1,t2,r2].every(Number.isFinite) ||
        m <= 0 || r1 <= 0 || r2 <= 0 || t1 === t2) {
      out.innerHTML = `<div class="pcd-alert">Renseigne des valeurs numériques valides. Les résistances doivent être positives et les températures différentes.</div>`;
      return;
    }

    if (t < Math.min(t1,t2) || t > Math.max(t1,t2)) {
      out.innerHTML = `<div class="pcd-alert">La température est hors des deux points saisis. Ne prolonge pas la courbe par extrapolation.</div>`;
      return;
    }

    const expected = r1 + (t-t1)*(r2-r1)/(t2-t1);
    const delta = Math.abs(m-expected)/expected*100;

    if (
      (type === "NTC" && ((t2 > t1 && r2 >= r1) || (t2 < t1 && r2 <= r1))) ||
      (type === "PTC" && ((t2 > t1 && r2 <= r1) || (t2 < t1 && r2 >= r1)))
    ) {
      out.innerHTML = `<div class="pcd-alert">Les points semblent incohérents avec le type NTC/PTC choisi. Vérifie la courbe constructeur.</div>`;
      return;
    }

    let verdict = "Tolérance non renseignée : écart calculé, conformité non déterminée.";
    let cls = "pcd-alert";

    if (tolText !== "") {
      const tolerance = Number(tolText);

      if (Number.isFinite(tolerance) && tolerance >= 0) {
        const ok = delta <= tolerance;
        verdict = ok
          ? `Dans la tolérance saisie (±${tolerance} %).`
          : `Hors de la tolérance saisie (±${tolerance} %).`;
        if (ok) cls += " pcd-good";
      }
    }

    out.innerHTML = `
      <div class="pcd-result">
        <strong>Résultat — interpolation entre deux points constructeur</strong>
        <p>Température : ${t.toFixed(1)} °C</p>
        <p>Résistance attendue estimée : ${expected.toFixed(1)} Ω</p>
        <p>Résistance mesurée : ${m.toFixed(1)} Ω</p>
        <p>Écart relatif : ${delta.toFixed(1)} %</p>
        <div class="${cls}">${esc(verdict)}</div>
        <p class="pcd-muted">${esc(val("bMarque"))} — ${esc(val("bModele"))} — ${esc(val("bComposant"))} — carte ${esc(val("bCarte"))} — ${esc(val("bRepere"))} : ${esc(val("bFonction"))}. Source : ${esc(val("bSource"))}.</p>
      </div>`;
  }

  /* ========================================================
     11. RELEVÉ DES MESURES
     ======================================================== */

  function showMeasurements() {
    $("pcdParcours").hidden = true;
    $("pcdMesures").hidden = false;
    $("pcdBoard").hidden = true;

    $("pcdMesures").innerHTML = `
      <section class="pcd-card">
        <h3>📏 Relevé des mesures</h3>
        <div class="pcd-grid">
          <label class="pcd-field">Température extérieure (°C)<input id="mExt" type="number" step="0.1"></label>
          <label class="pcd-field">Température ambiante (°C)<input id="mAmb" type="number" step="0.1"></label>
          <label class="pcd-field">Air repris (°C)<input id="mReprise" type="number" step="0.1"></label>
          <label class="pcd-field">Air soufflé (°C)<input id="mSouffle" type="number" step="0.1"></label>
          <label class="pcd-field">BP (bar)<input id="mBP" type="number" step="0.01"></label>
          <label class="pcd-field">HP (bar)<input id="mHP" type="number" step="0.01"></label>
          <label class="pcd-field">Intensité (A)<input id="mA" type="number" step="0.01"></label>
          <label class="pcd-field">Tension (V)<input id="mV" type="number" step="0.1"></label>
        </div>

        <label class="pcd-field">Autres mesures / conditions
          <textarea id="mAutres" placeholder="Températures tuyauteries, fréquence, consigne, stabilisation..."></textarea>
        </label>

        <div class="pcd-alert">Les pressions dépendent du fluide, des températures, de la charge thermique et du régime inverter. Une pression isolée ne permet pas de conclure à un manque de charge.</div>
        <button class="pcd-btn pcd-primary" data-action="report">Créer le compte rendu →</button>
      </section>`;
  }

  /* ========================================================
     12. COMPTE RENDU — SYMPTÔME ET CODE DÉFAUT
     ======================================================== */

  function buildReportContent() {
    const p = PATHS[S.symptom];
    const get = id => $(id)?.value.trim() || "";

    if (!p) return "";

    const lines = S.answers.map((answer,index) => `
      <div class="pcd-result">
        <strong>${index+1}. ${esc(p.steps[index][0])}</strong>
        <p>${esc(answer?.etat || "Non réalisé")}</p>
        <p>${esc(answer?.obs || "")}</p>
      </div>`).join("");

    const fields = [
      ["Marque",get("pcdMarque")],
      ["Gamme",get("pcdGamme")],
      ["Série",get("pcdModele")],
      ["Référence exacte",get("pcdReferenceExacte")],
      ["Type",get("pcdType")],
      ["Fluide",get("pcdFluide")],
      ["Code défaut",get("pcdCode")],
      ["Contexte",get("pcdContexte")],
      ["Température extérieure",get("mExt") ? get("mExt")+" °C" : ""],
      ["Température ambiante",get("mAmb") ? get("mAmb")+" °C" : ""],
      ["Air repris",get("mReprise") ? get("mReprise")+" °C" : ""],
      ["Air soufflé",get("mSouffle") ? get("mSouffle")+" °C" : ""],
      ["BP",get("mBP") ? get("mBP")+" bar" : ""],
      ["HP",get("mHP") ? get("mHP")+" bar" : ""],
      ["Intensité",get("mA") ? get("mA")+" A" : ""],
      ["Tension",get("mV") ? get("mV")+" V" : ""],
      ["Autres",get("mAutres")]
    ].filter(item => item[1]);

    return `
      <section class="pcd-card" id="pcdReport">
        <div class="pcd-hero">
          <h2>PRO CLIM — Compte rendu dépannage</h2>
          <p>${new Date().toLocaleString("fr-FR")}</p>
        </div>
        <h3>${esc(p.title)}</h3>
        ${fields.map(item => `<div class="pcd-result"><strong>${esc(item[0])} :</strong> ${esc(item[1])}</div>`).join("")}
        <h3>Contrôles réalisés</h3>
        ${lines}
        <div class="pcd-alert">Compte rendu des observations saisies. La cause doit être confirmée avec les procédures et valeurs constructeur applicables.</div>
      </section>`;
  }

  function report() {
    const content = buildReportContent();
    if (!content) return;

    $("pcdMesures").hidden = true;
    const zone = $("pcdRapportZone");
    zone.hidden = false;

    zone.innerHTML = `
      ${content}
      <button class="pcd-btn pcd-primary" data-action="copy">Copier le compte rendu</button>
      <button class="pcd-btn pcd-secondary" data-action="print">Imprimer / enregistrer PDF</button>
      <button class="pcd-btn pcd-secondary" data-action="home">Nouveau diagnostic</button>`;
  }

  function faultReport() {
    const f = S.fault;
    if (!f) return;

    const history = f.history.map(item => `
      <div class="pcd-result">
        <strong>${item.number}. ${esc(item.title)}</strong>
        <p>${esc(item.result)}</p>
        <p>${esc(item.observation || "")}</p>
      </div>`).join("");

    $("pcdAccueil").hidden = true;
    $("pcdParcours").hidden = true;
    $("pcdBoard").hidden = true;
    $("pcdMesures").hidden = true;

    const zone = $("pcdRapportZone");
    zone.hidden = false;

    zone.innerHTML = `
      <section class="pcd-card" id="pcdReport">
        <div class="pcd-hero">
          <h2>PRO CLIM — Compte rendu diagnostic</h2>
          <p>${new Date().toLocaleString("fr-FR")}</p>
        </div>

        <h3>${esc(f.procedure.title)}</h3>
        <div class="pcd-result">
          <strong>Constructeur :</strong> ${esc(f.brand)}<br>
          <strong>Gamme :</strong> ${esc(f.family)}<br>
          <strong>Série :</strong> ${esc(f.model)}<br>
          <strong>Référence :</strong> ${esc(f.exactReference)}<br>
          <strong>Code défaut :</strong> ${esc(f.code)}<br>
          <strong>Type :</strong> ${esc(f.type || "Non renseigné")}<br>
          <strong>Fluide :</strong> ${esc(f.fluide || "Non renseigné")}
        </div>

        <div class="pcd-result">
          <strong>Signification</strong>
          <p>${esc(f.procedure.meaning)}</p>
          <strong>Contexte de panne</strong>
          <p>${esc(f.contexte || "Non renseigné")}</p>
        </div>

        <h3>Contrôles réalisés</h3>
        ${history}

        <div class="pcd-result">
          <strong>Documentation</strong>
          <p>${esc(f.procedure.source.document)}</p>
          <p>${esc(f.procedure.source.reference)}</p>
          <p>${esc(f.procedure.source.chapter)}</p>
          <p>Pages : ${esc(f.procedure.source.pages)}</p>
          <p><a href="${esc(f.procedure.source.url)}" target="_blank" rel="noopener">Consulter la documentation</a></p>
        </div>

        <div class="pcd-alert">
          Ce document retranscrit les contrôles et observations saisis. Il ne constitue pas une certification de réparation.
        </div>
      </section>

      <button class="pcd-btn pcd-primary" data-action="copy">Copier le compte rendu</button>
      <button class="pcd-btn pcd-secondary" data-action="print">Imprimer / enregistrer PDF</button>
      <button class="pcd-btn pcd-secondary" data-action="home">Retour à l'accueil</button>`;
  }

  /* ========================================================
     13. RETOUR ACCUEIL
     ======================================================== */

  function home() {
    S.symptom = "";
    S.step = 0;
    S.answers = [];
    S.fault = null;
    S.report = null;

    ["pcdParcours","pcdBoard","pcdMesures","pcdRapportZone"].forEach(id => {
      $(id).hidden = true;
    });

    $("pcdAccueil").hidden = false;

    window.scrollTo({ top:0, behavior:"smooth" });
  }

  /* ========================================================
     14. COPIE DU RAPPORT
     ======================================================== */

  async function copy() {
    const text = $("pcdReport")?.innerText || "";

    if (!text) {
      alert("Aucun compte rendu à copier.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert("Compte rendu copié.");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();

      try {
        document.execCommand("copy");
        alert("Compte rendu copié.");
      } catch (copyError) {
        alert("Copie indisponible. Sélectionne le texte du compte rendu.");
      }

      area.remove();
    }
  }

  /* ========================================================
     15. GESTION DES CLICS
     ======================================================== */

  function click(event) {
    const button = event.target.closest("button");
    if (!button || !$(PAGE)?.contains(button)) return;

    if (button.dataset.symptom) {
      start(button.dataset.symptom);
      return;
    }

    switch (button.dataset.action) {
      case "home":
        home();
        break;

      case "open-board":
        openBoard();
        break;

      case "analyze-code":
        analyzeFault();
        break;

      case "fault-yes":
        faultChoice(true);
        break;

      case "fault-no":
        faultChoice(false);
        break;

      case "fault-resolved":
        faultResolved();
        break;

      case "fault-unresolved":
        faultUnresolved();
        break;

      case "fault-recheck":
        faultRecheck();
        break;

      case "fault-report":
        faultReport();
        break;

      case "fault-reset":
        if (S.fault) {
          const f = S.fault;

          $("pcdMarque").value = f.brand;
          updateBrands();

          $("pcdGamme").value = f.family;
          updateFamilies();

          $("pcdModele").value = f.model;
          updateModels();

          $("pcdReferenceExacte").value = f.exactReference;
          $("pcdCode").value = f.code;

          S.fault = null;
          $("pcdResultatCode").innerHTML = "";
        }
        break;

      case "calc-probe":
        calcProbe();
        break;

      case "prev":
        saveStep();
        S.step = Math.max(0,S.step-1);
        showStep();
        break;

      case "next":
        saveStep();

        if (S.step < PATHS[S.symptom].steps.length-1) {
          S.step++;
          showStep();
        } else {
          showMeasurements();
        }
        break;

      case "report":
        report();
        break;

      case "copy":
        copy();
        break;

      case "print":
        window.print();
        break;
    }
  }

  /* ========================================================
     16. GESTION DES MENUS
     ======================================================== */

  function change(event) {
    const id = event.target.id;

    if (id === "pcdMarque") {
      updateBrands();
      return;
    }

    if (id === "pcdGamme") {
      updateFamilies();
      return;
    }

    if (id === "pcdModele") {
      updateModels();
      return;
    }

    if (id === "bComposant") {
      const option = event.target.selectedOptions[0];
      const type = option?.dataset.type;

      if (!type) return;

      const select = $("bType");

      if (select && [...select.options].some(item => item.value === type)) {
        select.value = type;
      }
    }
  }

  /* ========================================================
     17. INITIALISATION
     ======================================================== */

  function init() {
    if (!$(PAGE) || $(PAGE).dataset.pcDiagnosticReady === "1") return;

    styles();

    if (build()) {
      $(PAGE).dataset.pcDiagnosticReady = "1";
    }
  }

  document.addEventListener("click",click);
  document.addEventListener("change",change);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init);
  } else {
    init();
  }

})();
