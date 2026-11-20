
/* ==========================================================
   PRO CLIM — DIAGNOSTIC CVC + CONTROLE COMPOSANTS
   Version multimarque avec menus déroulants
   ========================================================== */
(() => {
  "use strict";

  const PAGE = "pageDiagnostic";
  const $ = id => document.getElementById(id);

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));

  const S = { symptom:"", step:0, answers:[] };

  const BRANDS = [
    "Daikin",
    "Mitsubishi Electric",
    "Mitsubishi Heavy Industries",
    "Samsung",
    "Atlantic / Fujitsu",
    "LG",
    "Panasonic",
    "Toshiba",
    "Hitachi",
    "Toshiba Carrier",
    "Midea",
    "Gree",
    "Haier",
    "Hisense",
    "Carrier",
    "Trane",
    "York",
    "Lennox",
    "Bosch",
    "Autre marque"
  ];

  const TYPES = [
    "Split mural",
    "Multi-split",
    "Gainable",
    "Cassette",
    "Console",
    "Plafonnier",
    "DRV / VRV",
    "PAC air/eau",
    "Autre"
  ];

  const COMPONENTS = [
    ["Sonde de température d'air", "NTC/PTC"],
    ["Sonde de batterie", "NTC/PTC"],
    ["Sonde de tuyauterie frigorifique", "NTC/PTC"],
    ["Sonde de refoulement compresseur", "NTC/PTC"],
    ["Sonde échangeur extérieur", "NTC/PTC"],
    ["Sonde de température extérieure", "NTC/PTC"],
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
    items.map(v =>
      `<option value="${esc(v)}" ${v === selected ? "selected" : ""}>${esc(v)}</option>`
    ).join("");

  const BRAND_OPTIONS = `
    <option value="">Sélectionner une marque</option>
    ${OPTIONS(BRANDS)}
  `;

  const TYPE_OPTIONS = OPTIONS(TYPES);

  const COMPONENT_OPTIONS = `
    <option value="">Sélectionner un composant</option>
    ${COMPONENTS.map(c =>
      `<option value="${esc(c[0])}" data-type="${esc(c[1])}">${esc(c[0])}</option>`
    ).join("")}
  `;

  const PATHS = {
    froid: { title:"Ne fait plus de froid", steps:[
      ["Confirmer la demande", "Mode FROID, consigne, programmation, commande centralisée et température ambiante."],
      ["Contrôler alimentation et protections", "Vérifier visuellement les protections, voyants et connexions. Ne pas réarmer plusieurs fois une protection qui déclenche."],
      ["Observer les deux unités", "Noter les voyants, codes, ventilateurs, bruits et éventuelles mises en sécurité."],
      ["Vérifier les débits d'air", "Inspecter filtres, échangeurs, turbines, ventilateurs et dégagements du groupe extérieur."],
      ["Relever les températures", "Mesurer air repris et soufflé après stabilisation. Noter consigne, température ambiante et temps de fonctionnement."],
      ["Approfondir le circuit frigorifique", "Appliquer la procédure constructeur et relever toutes les conditions. Une pression isolée ne permet pas de conclure à un manque de fluide."]
    ]},
    chaud: { title:"Ne fait plus de chaud", steps:[
      ["Confirmer la demande", "Vérifier mode CHAUD, consigne, programmation et commande centralisée."],
      ["Relever les conditions extérieures", "Noter température, humidité, état de batterie et présence de givre."],
      ["Observer les dégivrages", "Noter fréquence, durée, évacuation des condensats et état de la batterie après cycle."],
      ["Contrôler les débits d'air", "Inspecter filtres, échangeurs, ventilateurs et obstacles."],
      ["Relever les températures", "Mesurer reprise, soufflage, extérieur et tuyauteries si pertinent, après stabilisation."],
      ["Contrôler régulation et circuit", "Lire les défauts, contrôler les sondes et paramètres selon la documentation exacte."]
    ]},
    demarrage: { title:"Ne démarre pas", steps:[
      ["Vérifier la commande", "Contrôler marche/arrêt, mode, consigne, piles, programmation et verrouillage."],
      ["Lire les voyants et défauts", "Relever le code exact, clignotements, unité concernée et circonstances."],
      ["Contrôler les protections", "Identifier tout déclenchement. Ne pas réarmer à répétition."],
      ["Inspecter hors tension", "Après consignation et vérification d'absence de tension, inspecter borniers, connecteurs et traces d'échauffement."],
      ["Contrôler sécurités et communication", "Suivre le schéma et la procédure constructeur du modèle exact."]
    ]},
    eau: { title:"Fuite d'eau / condensats", steps:[
      ["Localiser l'origine", "Repérer le point de sortie et vérifier si la fuite apparaît à l'arrêt ou en fonctionnement."],
      ["Inspecter filtre et batterie", "Rechercher encrassement, givrage et défaut de circulation d'air."],
      ["Contrôler bac et évacuation", "Vérifier bac, pente, pincements, contre-pente et écoulement."],
      ["Contrôler la pompe si présente", "Suivre la notice : flotteur, aspiration, refoulement, alimentation et alarme."],
      ["Vérifier pose et isolation", "Contrôler niveau de l'unité, isolation des tuyauteries et ponts thermiques."]
    ]},
    bruit: { title:"Bruit / vibration", steps:[
      ["Localiser le bruit", "Identifier unité, zone, fréquence et conditions d'apparition."],
      ["Contrôler les fixations", "Vérifier supports, silentblocs, visserie et contact avec les parois."],
      ["Inspecter les ventilateurs", "Hors tension, rechercher corps étranger, jeu, pales endommagées ou frottement."],
      ["Contrôler les tuyauteries", "Rechercher contact, vibration, contrainte ou défaut de support."],
      ["Comparer au fonctionnement normal", "Noter mode, fréquence, vitesse et conditions avant diagnostic complémentaire."]
    ]},
    performance: { title:"Manque de performance", steps:[
      ["Vérifier consigne et conditions", "Noter mode, consigne, température intérieure/extérieure et temps de fonctionnement."],
      ["Contrôler les débits", "Inspecter filtres, batteries, turbines, ventilateurs, gaines et bouches."],
      ["Relever les températures", "Mesurer reprise/soufflage et tuyauteries si pertinent, avec conditions stabilisées."],
      ["Vérifier régulation et sondes", "Comparer les températures affichées à une mesure indépendante et contrôler les sondes selon notice."],
      ["Approfondir", "Relever les paramètres prescrits par le constructeur ; ne pas conclure sur une pression isolée."]
    ]},
    code: { title:"Code défaut constructeur", steps:[
      ["Identifier exactement la machine", "Relever marque, référence complète, unité intérieure/extérieure, carte et fluide."],
      ["Relever le défaut", "Noter le code exact, clignotements, écran concerné, historique et circonstances."],
      ["Trouver la documentation correspondante", "Utiliser le manuel de service de la référence exacte et de la bonne génération."],
      ["Suivre les contrôles prescrits", "Le code désigne souvent une condition détectée, pas automatiquement la pièce à remplacer."],
      ["Confirmer par les mesures", "Noter chaque mesure, son point de mesure, les conditions et la procédure appliquée."]
    ]}
  };

  function styles(){
    if($("pcDiagnosticStyles")) return;

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
      @media(max-width:520px){#${PAGE} .pcd-grid{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(st);
  }

  function build(){
    const page = $(PAGE);
    if(!page) return false;

    page.innerHTML = `
      <div class="pcd-wrap">
        <div class="pcd-hero">
          <h2>🛠️ Assistant dépannage CVC</h2>
          <p>Diagnostic guidé, identification des composants et relevé des mesures.</p>
        </div>

        <div id="pcdAccueil">
          <section class="pcd-card">
            <h3>Quel est le symptôme ?</h3>
            <div class="pcd-symptoms">
              ${Object.entries(PATHS).map(([k,v]) =>
                `<button class="pcd-symptom" data-symptom="${k}">${esc(v.title)}</button>`
              ).join("")}
            </div>
          </section>

          <section class="pcd-card">
            <h3>Identification de l'installation</h3>
            <div class="pcd-grid">
              <label class="pcd-field">Marque
                <select id="pcdMarque">${BRAND_OPTIONS}</select>
              </label>
              <label class="pcd-field">Modèle exact
                <input id="pcdModele" placeholder="Référence complète">
              </label>
              <label class="pcd-field">Type
                <select id="pcdType">${TYPE_OPTIONS}</select>
              </label>
              <label class="pcd-field">Fluide
                <select id="pcdFluide">
                  <option value="">À sélectionner</option>
                  ${OPTIONS(["R32","R410A","R407C","R134a","R290","R22","Autre / à confirmer"])}
                </select>
              </label>
            </div>
            <label class="pcd-field">Code défaut
              <input id="pcdCode" placeholder="Code exact / clignotements">
            </label>
            <label class="pcd-field">Contexte
              <textarea id="pcdContexte" placeholder="Depuis quand ? Conditions d'apparition ?"></textarea>
            </label>
          </section>

          <section class="pcd-card">
            <h3>🔬 Contrôle d'un composant sur carte</h3>
            <p class="pcd-muted">Choisis la marque et le composant dans les menus. Le modèle et le repère doivent être confirmés sur la documentation exacte.</p>
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

  function start(k){
    S.symptom = k;
    S.step = 0;
    S.answers = [];
    showStep();
  }

  function showStep(){
    const p = PATHS[S.symptom];
    const step = p.steps[S.step];

    $("pcdAccueil").hidden = true;
    $("pcdBoard").hidden = true;
    $("pcdMesures").hidden = true;
    $("pcdRapportZone").hidden = true;

    const z = $("pcdParcours");
    z.hidden = false;

    z.innerHTML = `
      <section class="pcd-card">
        <button class="pcd-btn pcd-secondary" data-action="home">← Retour</button>
        <h3>${esc(p.title)}</h3>
        <p class="pcd-muted">Étape ${S.step+1} / ${p.steps.length}</p>
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
          <textarea id="pcdObs" placeholder="Valeur relevée, constat…">${esc(S.answers[S.step]?.obs||"")}</textarea>
        </label>
        <div class="pcd-actions">
          <button class="pcd-btn pcd-secondary" data-action="prev" ${S.step===0?"disabled":""}>← Précédent</button>
          <button class="pcd-btn pcd-primary" data-action="next">${S.step===p.steps.length-1?"Terminer →":"Enregistrer et continuer →"}</button>
        </div>
      </section>`;

    if(S.answers[S.step]) $("pcdEtat").value = S.answers[S.step].etat;
  }

  function saveStep(){
    S.answers[S.step] = {
      etat:$("pcdEtat").value,
      obs:$("pcdObs").value.trim()
    };
  }

  function openBoard(){
    $("pcdAccueil").hidden = true;
    $("pcdParcours").hidden = true;
    $("pcdMesures").hidden = true;
    $("pcdRapportZone").hidden = true;

    const z = $("pcdBoard");
    z.hidden = false;

    z.innerHTML = `
      <section class="pcd-card">
        <button class="pcd-btn pcd-secondary" data-action="home">← Retour</button>
        <h3>Identification du composant sur la carte</h3>
        <p class="pcd-muted">Sélectionne les informations dans les menus, puis complète les références exactes relevées sur la machine.</p>

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
            <select id="bUnite">
              ${OPTIONS(["Intérieure","Extérieure","Commande / autre"])}
            </select>
          </label>

          <label class="pcd-field">Composant recherché
            <select id="bComposant">${COMPONENT_OPTIONS}</select>
          </label>

          <label class="pcd-field">Type électrique
            <select id="bType">
              ${OPTIONS(["NTC","PTC","transducteur","pressostat","autre"])}
            </select>
          </label>

          <label class="pcd-field">Référence carte
            <input id="bCarte" placeholder="Référence sérigraphiée">
          </label>

          <label class="pcd-field">Repère connecteur/composant
            <input id="bRepere" placeholder="Ex. repère du schéma">
          </label>

          <label class="pcd-field">Fonction confirmée
            <input id="bFonction" placeholder="Fonction selon le schéma">
          </label>

          <label class="pcd-field">Document constructeur + page
            <input id="bSource" placeholder="Manuel de service, page/tableau">
          </label>
        </div>

        <div class="pcd-alert">
          <strong>Important :</strong> les repères R1T, R2T, CN1, etc. ne sont pas universels. La fonction du composant doit être confirmée avec le modèle exact, la référence de carte et le schéma.
        </div>
      </section>

      <section class="pcd-card">
        <h3>🌡️ Comparaison résistance / température</h3>
        <p class="pcd-muted">Uniquement pour une sonde résistive NTC ou PTC. Recopie deux points de la courbe constructeur qui encadrent la température mesurée. Le résultat est une interpolation entre ces deux points.</p>

        <div class="pcd-grid">
          <label class="pcd-field">Température mesurée (°C)
            <input id="bTemp" type="number" step="0.1">
          </label>
          <label class="pcd-field">Résistance mesurée (Ω)
            <input id="bMesure" type="number" step="1">
          </label>
          <label class="pcd-field">Point constructeur 1 — °C
            <input id="bT1" type="number" step="0.1">
          </label>
          <label class="pcd-field">Point constructeur 1 — Ω
            <input id="bR1" type="number" step="1">
          </label>
          <label class="pcd-field">Point constructeur 2 — °C
            <input id="bT2" type="number" step="0.1">
          </label>
          <label class="pcd-field">Point constructeur 2 — Ω
            <input id="bR2" type="number" step="1">
          </label>
          <label class="pcd-field">Tolérance constructeur (%)
            <input id="bTol" type="number" step="0.1" placeholder="Laisser vide si inconnue">
          </label>
        </div>

        <button class="pcd-btn pcd-primary" data-action="calc-probe">Comparer la mesure →</button>
        <div id="bResult" aria-live="polite"></div>

        <div class="pcd-alert">
          Avant mesure ohmique : couper, consigner, vérifier l'absence de tension et isoler la sonde de la carte selon la notice. Ne jamais mesurer une résistance sur un circuit alimenté. Un transducteur actif ne se contrôle pas comme une NTC.
        </div>
      </section>

      <section class="pcd-card">
        <h3>Autres composants</h3>
        <p class="pcd-muted">Transducteurs, pressostats, ventilateurs, détendeurs et vannes nécessitent chacun leur procédure : brochage, alimentation, signal, seuil ou résistance selon le manuel exact. Aucun test générique ne sera substitué aux données constructeur.</p>
      </section>`;

    $("bMarque").value = $("pcdMarque").value;
    $("bModele").value = $("pcdModele").value;
    $("bInstallation").value = $("pcdType").value;

    if(!$("bMarque").value) $("bMarque").value = "";
  }

  function calcProbe(){
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

    if(type !== "NTC" && type !== "PTC"){
      out.innerHTML = '<div class="pcd-alert">Ce composant ne se contrôle pas avec une simple courbe résistance/température. Consulte le brochage et la procédure constructeur.</div>';
      return;
    }

    const required = ["bMarque","bModele","bCarte","bRepere","bFonction","bSource"];

    if(required.some(id => !val(id))){
      out.innerHTML = '<div class="pcd-alert">Complète marque, modèle exact, référence de carte, repère, fonction confirmée et source constructeur avant validation.</div>';
      return;
    }

    if(![t,m,t1,r1,t2,r2].every(Number.isFinite) || m<=0 || r1<=0 || r2<=0 || t1===t2){
      out.innerHTML = '<div class="pcd-alert">Renseigne des valeurs numériques valides. Les résistances doivent être positives et les températures différentes.</div>';
      return;
    }

    if(t < Math.min(t1,t2) || t > Math.max(t1,t2)){
      out.innerHTML = '<div class="pcd-alert">La température est hors des deux points saisis. Ne prolonge pas la courbe par extrapolation : saisis deux points constructeur qui encadrent la température.</div>';
      return;
    }

    const lowT = t1 < t2 ? t1 : t2;
    const highT = t1 < t2 ? t2 : t1;
    const lowR = t1 < t2 ? r1 : r2;
    const highR = t1 < t2 ? r2 : r1;

    if((type==="NTC" && highR>=lowR) || (type==="PTC" && highR<=lowR)){
      out.innerHTML = '<div class="pcd-alert">Les points semblent incohérents avec le type NTC/PTC choisi. Vérifie la courbe constructeur.</div>';
      return;
    }

    const expected = r1 + (t-t1)*(r2-r1)/(t2-t1);
    const delta = Math.abs(m-expected)/expected*100;

    let verdict = "Tolérance non renseignée : écart calculé, conformité non déterminée.";
    let cls = "pcd-alert";

    if(tolText !== ""){
      const tol = Number(tolText);
      if(Number.isFinite(tol) && tol>=0){
        const ok = delta <= tol;
        verdict = ok
          ? `Dans la tolérance saisie (±${tol} %).`
          : `Hors de la tolérance saisie (±${tol} %). Vérifie conditions, câblage et sonde selon la notice.`;
        if(ok) cls += " pcd-good";
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
        <p class="pcd-muted">
          ${esc(val("bMarque"))} — ${esc(val("bModele"))} — ${esc(val("bComposant"))} — carte ${esc(val("bCarte"))} — ${esc(val("bRepere"))} : ${esc(val("bFonction"))}. Source : ${esc(val("bSource"))}.
        </p>
      </div>`;
  }

  function showMeasurements(){
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
          <textarea id="mAutres" placeholder="Températures tuyauteries, fréquence, consigne, stabilisation…"></textarea>
        </label>

        <div class="pcd-alert">Les pressions dépendent du fluide, des températures, de la charge thermique et du régime inverter. Une pression isolée ne permet pas de conclure à un manque de charge.</div>
        <button class="pcd-btn pcd-primary" data-action="report">Créer le compte rendu →</button>
      </section>`;
  }

  function report(){
    const p = PATHS[S.symptom];
    const get = id => $(id)?.value.trim() || "";

    const lines = S.answers.map((a,i) => `
      <div class="pcd-result">
        <strong>${i+1}. ${esc(p.steps[i][0])}</strong>
        <p>${esc(a?.etat || "Non réalisé")}</p>
        <p>${esc(a?.obs || "")}</p>
      </div>`).join("");

    const fields = [
      ["Marque",get("pcdMarque")],
      ["Modèle",get("pcdModele")],
      ["Type",get("pcdType")],
      ["Fluide",get("pcdFluide")],
      ["Code défaut",get("pcdCode")],
      ["Contexte",get("pcdContexte")],
      ["Température extérieure",get("mExt")+" °C"],
      ["Température ambiante",get("mAmb")+" °C"],
      ["Air repris",get("mReprise")+" °C"],
      ["Air soufflé",get("mSouffle")+" °C"],
      ["BP",get("mBP")+" bar"],
      ["HP",get("mHP")+" bar"],
      ["Intensité",get("mA")+" A"],
      ["Tension",get("mV")+" V"],
      ["Autres",get("mAutres")]
    ].filter(x => x[1] && x[1]!==" °C" && x[1]!==" bar" && x[1]!==" A" && x[1]!==" V");

    $("pcdMesures").hidden = true;

    const z = $("pcdRapportZone");
    z.hidden = false;

    z.innerHTML = `
      <section class="pcd-card" id="pcdReport">
        <div class="pcd-hero">
          <h2>PRO CLIM — Compte rendu dépannage</h2>
          <p>${new Date().toLocaleString("fr-FR")}</p>
        </div>
        <h3>${esc(p.title)}</h3>
        ${fields.map(x => `<div class="pcd-result"><strong>${esc(x[0])} :</strong> ${esc(x[1])}</div>`).join("")}
        <h3>Contrôles réalisés</h3>
        ${lines}
        <div class="pcd-alert">Compte rendu des observations saisies. La cause doit être confirmée avec les procédures et valeurs constructeur applicables.</div>
      </section>

      <button class="pcd-btn pcd-primary" data-action="copy">Copier le compte rendu</button>
      <button class="pcd-btn pcd-secondary" data-action="print">Imprimer / enregistrer PDF</button>
      <button class="pcd-btn pcd-secondary" data-action="home">Nouveau diagnostic</button>`;
  }

  function home(){
    S.symptom = "";
    S.step = 0;
    S.answers = [];

    ["pcdParcours","pcdBoard","pcdMesures","pcdRapportZone"].forEach(id => $(id).hidden = true);

    $("pcdAccueil").hidden = false;
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function copy(){
    const text = $("pcdReport")?.innerText || "";
    try{
      await navigator.clipboard.writeText(text);
      alert("Compte rendu copié.");
    }catch(e){
      alert("Copie indisponible. Sélectionne le texte du compte rendu.");
    }
  }

  function click(e){
    const b = e.target.closest("button");
    if(!b || !$(PAGE)?.contains(b)) return;

    if(b.dataset.symptom){
      start(b.dataset.symptom);
      return;
    }

    switch(b.dataset.action){
      case "home":
        home();
        break;
      case "open-board":
        openBoard();
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
        if(S.step < PATHS[S.symptom].steps.length-1){
          S.step++;
          showStep();
        }else{
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

  function init(){
    if(!$(PAGE) || $(PAGE).dataset.pcDiagnosticReady==="1") return;
    styles();
    if(build()) $(PAGE).dataset.pcDiagnosticReady = "1";
  }

  document.addEventListener("click",click);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init);
  }else{
    init();
  }
})();
