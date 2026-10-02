/* Schéma fermé : aucun texte libre, score individuel ou identifiant d'apprenant.
   Ce fichier doit précéder l'initialisation de Plausible. */
(() => {
  const base=/^(pageview|engagement|Jeu démarré|Parcours terminé|Dossier 0[1-9] (démarré|terminé))$/;
  const teaching=/^Dossier 0[1-9] (décision adaptée|décision à revoir|erreur critique|bilan sans erreur critique|bilan avec erreur critique)$/;
  let enabled=true;
  window.gsvAnalytics={
    isTeachingEnabled:()=>enabled,
    setTeachingEnabled(value){
      enabled=Boolean(value);
    },
    transformRequest(payload){
      if(!base.test(payload.n)&&!(enabled&&teaching.test(payload.n)))return null;
      payload.u=location.origin+location.pathname;
      payload.r=null;
      delete payload.p;
      delete payload.$;
      return payload;
    },
    trackTeaching(code,outcome){
      const name=`Dossier ${code} ${outcome}`;
      if(!enabled||!teaching.test(name))return;
      try { if(typeof window.plausible==="function")window.plausible(name); } catch { /* Jamais bloquer le jeu. */ }
    }
  };
})();
