const GOLD_PARQUET_URL = "https://raw.githubusercontent.com/aswinv90/indian-market-historical-data/main/data/COMMODITIES/GOLD_INR.parquet";
const FX_PARQUET_URL = "https://raw.githubusercontent.com/aswinv90/indian-market-historical-data/main/data/MACRO/forex_rates.parquet";
const GOLD_SOURCE_URL = "https://github.com/aswinv90/indian-market-historical-data";
const DATASET_LICENSE_URL = "https://github.com/aswinv90/indian-market-historical-data/blob/main/LICENSE";
const DUCKDB_CDN = "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm";

const GRC_CURRENCIES = {
  INR:{label:"INR — Indian rupee (₹)",symbol:"₹",fx:null},
  USD:{label:"USD — US dollar ($)",symbol:"$",fx:"USD_INR"},
  GBP:{label:"GBP — British pound (£)",symbol:"£",fx:"GBP_INR"},
  EUR:{label:"EUR — Euro (€)",symbol:"€",fx:"EUR_INR"},
  JPY:{label:"JPY — Japanese yen (¥)",symbol:"¥",fx:"JPY_INR"}
};
const GRC_UNITS = {gram:1,tola:11.6638,kg:1000};

function grcEscape(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function grcMoney(n,currency){const c=GRC_CURRENCIES[currency];return c.symbol+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});}
function grcDateISO(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+"T00:00:00Z");return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s;}
function grcDateFromRow(v){if(v instanceof Date)return v.toISOString().slice(0,10);let s=String(v??"");if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);const d=new Date(s);return Number.isFinite(d.getTime())?d.toISOString().slice(0,10):"";}
function grcNum(v){if(v===null||v===undefined||v==="")return NaN;const n=Number(v);return Number.isFinite(n)?n:NaN;}

export async function mountGoldRateCalculator(container, options={}) {
  if(!container) throw new Error("Gold calculator container element is required.");
  const config={defaultDate:options.defaultDate||"1989-11-11",defaultCurrency:options.defaultCurrency||"INR",...options};
  const instanceId="grc-"+Math.random().toString(36).slice(2,9);
  container.innerHTML=`
  <section class="grc-root" id="${instanceId}">
   <div class="grc-shell">
    <header class="grc-head"><div class="grc-icon" aria-hidden="true">⚖️</div><div><h2 class="grc-title">Historical Gold Rate</h2><p class="grc-sub">India bullion reference · date-based jewellery valuation</p></div></header>
    <div class="grc-grid">
     <section class="grc-card"><h3>Purchase details</h3>
      <form data-role="form">
       <div class="grc-field"><label for="${instanceId}-date">Purchase date (type or select)</label><div class="grc-date"><input id="${instanceId}-date" name="date" type="text" inputmode="numeric" value="${grcEscape(config.defaultDate)}" placeholder="YYYY-MM-DD" pattern="\\d{4}-\\d{2}-\\d{2}" required><button type="button" data-role="calendar" aria-label="Open calendar">📅</button><input data-role="date-picker" type="date" value="${grcEscape(config.defaultDate)}" aria-label="Select purchase date" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none"></div><div class="grc-hint">Type YYYY-MM-DD directly, or use the calendar button.</div></div>
       <div class="grc-field"><label for="${instanceId}-purity">Gold purity</label><select id="${instanceId}-purity" name="purity"><option value="24">24K — 99.9%</option><option value="22" selected>22K — 91.6%</option><option value="18">18K — 75%</option><option value="custom">Custom purity (%)</option></select></div>
       <div class="grc-field" data-role="custom-wrap" hidden><label for="${instanceId}-custom">Custom purity percentage</label><input id="${instanceId}-custom" name="customPurity" type="number" min="1" max="100" step=".01" placeholder="e.g. 91.6"></div>
       <div class="grc-field"><label for="${instanceId}-weight">Jewellery weight</label><input id="${instanceId}-weight" name="weight" type="number" min=".0001" step="any" value="1" required></div>
       <div class="grc-field"><label for="${instanceId}-unit">Weight unit</label><select id="${instanceId}-unit" name="unit"><option value="gram">Grams</option><option value="tola">Tola (11.6638 g)</option><option value="kg">Kilograms</option></select></div>
       <div class="grc-field"><label for="${instanceId}-currency">Output currency</label><select id="${instanceId}-currency" name="currency">${Object.entries(GRC_CURRENCIES).map(([k,v])=>`<option value="${k}" ${k===config.defaultCurrency?"selected":""}>${v.label}</option>`).join("")}</select><div class="grc-hint">The gold market remains India. Foreign-currency results are conversions, not local jeweller rates; historical FX coverage may be limited.</div></div>
       <button class="grc-primary" type="submit" data-role="submit">Fetch rate & calculate</button>
       <div class="grc-status" data-role="status" role="status" aria-live="polite">Historical data will load when you calculate. An internet connection is required for the first lookup.</div>
      </form>
     </section>
     <section class="grc-card"><h3>Valuation result</h3>
      <div class="grc-result"><div class="grc-kicker">Estimated gold rate per gram</div><div class="grc-big" data-role="rate">—</div><div class="grc-small" data-role="caption">Enter details and fetch a historical rate.</div></div>
      <div class="grc-metrics">
       <div class="grc-metric"><div class="grc-metric-label">Gold weight</div><div class="grc-metric-value" data-role="weight-out">—</div></div>
       <div class="grc-metric"><div class="grc-metric-label">Estimated gold value</div><div class="grc-metric-value" data-role="value">—</div></div>
       <div class="grc-metric"><div class="grc-metric-label">Purity</div><div class="grc-metric-value" data-role="purity-out">—</div></div>
       <div class="grc-metric"><div class="grc-metric-label">Rate date used</div><div class="grc-metric-value" data-role="date-out">—</div></div>
      </div>
      <div class="grc-source" data-role="source">Data source: <a href="${GOLD_SOURCE_URL}" target="_blank" rel="noopener">community-maintained Indian historical market dataset</a>. Rates are reference estimates, not a jeweller quote.</div>
      <div class="grc-footer">Excludes making charges, GST, stones and resale deductions. Exact daily values are shown only when the source contains a record for that date; otherwise the prior available trading-day record is labelled.</div>
     </section>
    </div>
   </div>
  </section>`;
  const root=container.querySelector("#"+instanceId);
  const el=(role)=>root.querySelector(`[data-role="${role}"]`);
  const field=(name)=>root.querySelector(`[name="${name}"]`);
  let dbPromise=null, connPromise=null, goldViewReady=false, fxViewReady=false, disposed=false;
  const cleanupFns=[];
  function listen(target,event,fn){target.addEventListener(event,fn);cleanupFns.push(()=>target.removeEventListener(event,fn));}
  function status(message,kind="info"){el("status").textContent=message;el("status").dataset.kind=kind;}
  function setBusy(busy){el("submit").disabled=busy;el("submit").textContent=busy?"Loading historical data…":"Fetch rate & calculate";}
  async function getConnection(){
    if(connPromise)return connPromise;
    connPromise=(async()=>{
      status("Loading the browser's analytical engine…");
      const duckdb=await import(DUCKDB_CDN);
      const bundle=await duckdb.selectBundle(duckdb.getJsDelivrBundles());
      const workerBootstrapUrl=URL.createObjectURL(new Blob([`importScripts(${JSON.stringify(bundle.mainWorker)});`],{type:"text/javascript"}));
      const worker=new Worker(workerBootstrapUrl);
      URL.revokeObjectURL(workerBootstrapUrl);
      const db=new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(),worker);
      await db.instantiate(bundle.mainModule,bundle.pthreadWorker);
      const conn=await db.connect();
      dbPromise={duckdb,db,worker,conn};
      return conn;
    })().catch(err=>{connPromise=null;throw err;});
    return connPromise;
  }
  async function getColumnNames(conn,url){
    const q=url.replace(/'/g,"''");
    const result=await conn.query(`DESCRIBE SELECT * FROM read_parquet('${q}')`);
    return result.toArray().map(r=>{const o=r.toJSON();return String(o.column_name??o.column??"");}).filter(Boolean);
  }
  function chooseDateColumn(columns){
    const candidates=["Date","date","__index_level_0__","index","timestamp","Timestamp"];
    for(const c of candidates)if(columns.includes(c))return c;
    return columns.find(c=>/date|time|index/i.test(c))||null;
  }
  function chooseRateColumn(columns,purity){
    const exact=p=>columns.find(c=>c.toLowerCase()===p.toLowerCase());
    const target=purity==="custom"?null:purity;
    if(target){const c=exact(`Gold_${target}K_1g`);if(c)return c;const ten=exact(`Gold_${target}K_10g`);if(ten)return ten;}
    return null;
  }
  function sqlIdent(name){return '"'+name.replace(/"/g,'""')+'"';}
  async function ensureGoldView(conn){
    if(goldViewReady)return;
    status("Connecting to the historical gold dataset…");
    const cols=await getColumnNames(conn,GOLD_PARQUET_URL);
    const dateCol=chooseDateColumn(cols);
    if(!dateCol)throw new Error("The source dataset has no recognizable date column.");
    const rateCols=cols.filter(c=>/^Gold_(24|22|18)K_(1g|10g)$/i.test(c));
    if(!rateCols.length)throw new Error("The source dataset did not expose the expected gold-rate columns.");
    const url=GOLD_PARQUET_URL.replace(/'/g,"''");
    await conn.query(`CREATE VIEW gold_history AS SELECT * FROM read_parquet('${url}')`);
    dbPromise.goldDateColumn=dateCol;dbPromise.goldColumns=cols;goldViewReady=true;
  }
  async function ensureFxView(conn){
    if(fxViewReady)return;
    const cols=await getColumnNames(conn,FX_PARQUET_URL);
    const dateCol=chooseDateColumn(cols);
    if(!dateCol)throw new Error("The historical currency dataset has no recognizable date column.");
    const url=FX_PARQUET_URL.replace(/'/g,"''");
    await conn.query(`CREATE VIEW fx_history AS SELECT * FROM read_parquet('${url}')`);
    dbPromise.fxDateColumn=dateCol;dbPromise.fxColumns=cols;fxViewReady=true;
  }
  async function queryOne(conn,sql){const t=await conn.query(sql);const rows=t.toArray();return rows.length?rows[0].toJSON():null;}
  async function calculate(event){
    event?.preventDefault();
    if(disposed)return;
    const date=field("date").value.trim(), weight=Number(field("weight").value), unit=field("unit").value, purity=field("purity").value, currency=field("currency").value;
    if(!grcDateISO(date)){status("Enter a valid date in YYYY-MM-DD format.", "error");field("date").focus();return;}
    if(!(weight>0)){status("Enter a weight greater than zero.","error");field("weight").focus();return;}
    let purityPct;
    if(purity==="custom"){purityPct=Number(field("customPurity").value);if(!(purityPct>0&&purityPct<=100)){status("Enter a custom purity percentage between 0 and 100.","error");return;}}
    setBusy(true);
    try{
      const conn=await getConnection();await ensureGoldView(conn);
      const dateCol=sqlIdent(dbPromise.goldDateColumn);
      const rateCol=chooseRateColumn(dbPromise.goldColumns,purity);
      let rateQuery, actualPurity=purity, rateLabel;
      if(rateCol){
        const divisor=rateCol.toLowerCase().endsWith("_10g")?10:1;
        rateQuery=`SELECT CAST(${dateCol} AS DATE)::VARCHAR AS rate_date, ${sqlIdent(rateCol)} / ${divisor}.0 AS rate FROM gold_history WHERE CAST(${dateCol} AS DATE) <= DATE '${date}' AND ${sqlIdent(rateCol)} IS NOT NULL ORDER BY CAST(${dateCol} AS DATE) DESC LIMIT 1`;
      } else {
        // Custom purity derives from the source's 24K reference.
        rateQuery=`SELECT CAST(${dateCol} AS DATE)::VARCHAR AS rate_date, Gold_24K_1g AS rate FROM gold_history WHERE CAST(${dateCol} AS DATE) <= DATE '${date}' AND Gold_24K_1g IS NOT NULL ORDER BY CAST(${dateCol} AS DATE) DESC LIMIT 1`;
        actualPurity="custom";
      }
      let row=await queryOne(conn,rateQuery);
      if(!row||!Number.isFinite(grcNum(row.rate)))throw new Error("No gold rate record was found on or before that date in the source dataset.");
      const rateDate=grcDateFromRow(row.rate_date);
      let inrRate=grcNum(row.rate);
      if(purity==="custom")inrRate*=purityPct/100/(0.999); // 24K source represents 999 purity.
      const grams=weight*GRC_UNITS[unit];
      let outRate=inrRate, fxNote="";
      if(currency!=="INR"){
        const fxCol=GRC_CURRENCIES[currency].fx;
        await ensureFxView(conn);
        if(!dbPromise.fxColumns.includes(fxCol))throw new Error(`Historical ${currency} exchange-rate data is not available from this source.`);
        const fxDateCol=sqlIdent(dbPromise.fxDateColumn);
        const fxRow=await queryOne(conn,`SELECT CAST(${fxDateCol} AS DATE)::VARCHAR AS fx_date, ${sqlIdent(fxCol)} AS inr_per_unit FROM fx_history WHERE CAST(${fxDateCol} AS DATE) <= DATE '${rateDate}' AND ${sqlIdent(fxCol)} IS NOT NULL ORDER BY CAST(${fxDateCol} AS DATE) DESC LIMIT 1`);
        if(!fxRow||!(grcNum(fxRow.inr_per_unit)>0))throw new Error(`No historical ${currency}/INR exchange rate was found for ${rateDate}. Choose INR or another supported date/currency.`);
        outRate=inrRate/grcNum(fxRow.inr_per_unit);
        fxNote=` Converted using ${currency}/INR ${grcNum(fxRow.inr_per_unit).toFixed(4)} dated ${grcDateFromRow(fxRow.fx_date)}.`;
      }
      const total=outRate*grams;
      const currencyName=GRC_CURRENCIES[currency].label;
      el("rate").textContent=grcMoney(outRate,currency);
      el("caption").textContent=`${purity==="custom"?"Custom purity "+purityPct+"%":purity+"K"} · ${currencyName} · per gram`;
      el("weight-out").textContent=grams.toLocaleString("en-IN",{maximumFractionDigits:4})+" g";
      el("value").textContent=grcMoney(total,currency);
      el("purity-out").textContent=purity==="custom"?purityPct+"%":purity+"K";
      el("date-out").textContent=rateDate===date?rateDate:`${rateDate} (prior trading day)`;
      status(`Rate retrieved successfully for ${rateDate}.${rateDate!==date?" No record exists for the exact date; the most recent prior record is used.":""}${fxNote}`, "success");
      el("source").innerHTML=`Source: <a href="${GOLD_SOURCE_URL}" target="_blank" rel="noopener">Indian historical gold dataset</a> · <a href="${DATASET_LICENSE_URL}" target="_blank" rel="noopener">license</a>. Dataset rate is ₹${inrRate.toFixed(2)}/g for the selected purity before currency conversion. ${currency!=="INR"?"Foreign currency is a conversion of the Indian market rate, not a local market quote.":""}`;
    }catch(err){
      console.error("Gold calculator lookup failed",err);
      status(`${err?.message||"Could not retrieve the historical rate."} Check your internet connection and try again.`, "error");
    }finally{setBusy(false);}
  }
  listen(el("form"),"submit",calculate);
  listen(el("calendar"),"click",()=>{const p=el("date-picker");try{p.showPicker()}catch{p.focus();p.click();}});
  listen(el("date-picker"),"change",()=>{field("date").value=el("date-picker").value;});
  listen(field("date"),"change",()=>{if(grcDateISO(field("date").value))el("date-picker").value=field("date").value;});
  listen(field("purity"),"change",()=>{root.querySelector('[data-role="custom-wrap"]').hidden=field("purity").value!=="custom";});
  if(options.autoCalculate) calculate(new Event("submit",{cancelable:true}));
  return {calculate:()=>calculate(new Event("submit",{cancelable:true})),destroy:async()=>{disposed=true;cleanupFns.forEach(fn=>fn());try{if(dbPromise){await dbPromise.conn.close();await dbPromise.db.terminate();dbPromise.worker.terminate();}}catch{}container.innerHTML="";}};
}
