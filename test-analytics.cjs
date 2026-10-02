// Local only: node test-analytics.cjs. No analytics request is sent.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"analytics.js"),"utf8");
function setup(){
  const calls=[];
  const ctx={window:{plausible:(...args)=>calls.push(args)},location:{origin:"https://jetpod.github.io",pathname:"/garde-sous-vigilance/"}};
  vm.runInNewContext(source,ctx);
  return {api:ctx.window.gsvAnalytics,ctx,calls};
}
const {api,ctx,calls}=setup();
const goals=fs.readFileSync(path.join(__dirname,"PEDAGOGY-GOALS.txt"),"utf8").trim().split("\n");
assert.equal(new Set(goals).size,45);
for(const n of goals){
  const payload=api.transformRequest({n,u:"https://example.com/?email=secret",r:"secret",p:{name:"secret"},$:123});
  assert.equal(payload.n,n);
  assert.equal(payload.u,"https://jetpod.github.io/garde-sous-vigilance/");
  assert.equal(payload.r,null);
  assert.equal("p" in payload,false);
  assert.equal("$" in payload,false);
}
for(const n of ["Autre","Dossier 10 décision adaptée","Dossier 01 décision adaptée nom","Dossier 01 score 4"]){
  assert.equal(api.transformRequest({n}),null);
}
api.trackTeaching("01","décision adaptée");
api.trackTeaching("01","erreur critique");
api.trackTeaching("01","réponse libre");
assert.equal(calls.length,2);
assert.ok(calls.every(args=>args.length===1&&typeof args[0]==="string"));
api.setTeachingEnabled(false);
for(const n of goals)assert.equal(api.transformRequest({n}),null);
api.trackTeaching("01","décision adaptée");
assert.equal(calls.length,2);
assert.ok(api.transformRequest({n:"Dossier 01 terminé"}));
assert.equal(api.isTeachingEnabled(),false);
vm.runInNewContext(source,ctx);
assert.equal(ctx.window.gsvAnalytics.isTeachingEnabled(),true);
ctx.window.gsvAnalytics.setTeachingEnabled(true);
assert.equal(ctx.window.gsvAnalytics.isTeachingEnabled(),true);
ctx.window.plausible=()=>{throw Error("network blocked")};
assert.doesNotThrow(()=>ctx.window.gsvAnalytics.trackTeaching("01","décision adaptée"));
delete ctx.window.plausible;
assert.doesNotThrow(()=>ctx.window.gsvAnalytics.trackTeaching("01","décision adaptée"));
console.log("PASS: 45 goals, closed schema, URL/referrer/props minimization, page-scoped opt-out, no persistent storage, network failure.");
