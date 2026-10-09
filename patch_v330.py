from pathlib import Path
p=Path('/mnt/data/finmate_work_v329/app.js')
s=p.read_text()
# 1 setup redirect
old="async setupGo(){const a=document.getElementById('pw1').value,b=document.getElementById('pw2').value;if(a.length<8)return alert('Use at least 8 characters.');if(a!==b)return alert('Passwords do not match.');await this.createVault(a)},"
new="async setupGo(){const a=document.getElementById('pw1').value,b=document.getElementById('pw2').value;if(a.length<8)return alert('Use at least 8 characters.');if(a!==b)return alert('Passwords do not match.');await this.createVault(a);const rec=await this.idbGet();if(rec)this.showUnlock(rec)},"
assert old in s
s=s.replace(old,new)
# 2 biometric direct from original user gesture
old="bioReady?`<button class=\"unlock-choice\" onclick=\"APP.showUnlockForm('bio')\"><span class=\"unlock-icon\">☝</span><span><b>Fingerprint / biometrics</b><small>Use your device security</small></span></button>`:'',"
new="bioReady?`<button class=\"unlock-choice\" onclick=\"APP.unlockBiometricGo()\"><span class=\"unlock-icon\">☝</span><span><b>Fingerprint / biometrics</b><small>Use your device security</small></span></button>`:'',"
assert old in s
s=s.replace(old,new)
# Also make showUnlockForm bio auto-trigger for any legacy call
old="else if(mode==='bio'){box.innerHTML=`<div class=\"unlock-form\"><button class=\"btn primary full\" onclick=\"APP.unlockBiometricGo()\">Unlock with fingerprint / device biometrics</button></div>`}"
new="else if(mode==='bio'){box.innerHTML=`<div class=\"unlock-form\"><p class=\"note\">Opening your device fingerprint / biometric prompt…</p></div>`;setTimeout(()=>this.unlockBiometricGo(),0)}"
assert old in s
s=s.replace(old,new)
# 3 remove ticker/symbol explanation panel at end of wealth
old="<div class=\"panel info\"><h3>What is a ticker / symbol?</h3><p>A ticker is the short code used by a market to identify a listed investment. Example: Reliance Industries on NSE is <b>RELIANCE.NS</b>; Apple is <b>AAPL</b>. For Indian mutual funds, use the <b>AMFI scheme code</b> (for example, HDFC Flexi Cap Fund Direct Growth is 118955). A ticker/code lets the app try to refresh the latest market price or NAV. For funds without a code, you can continue entering the value manually.</p></div>"
assert old in s
s=s.replace(old,'')
# 4 migration: normalize property link fields
old="for(const g of this.state.goldJewelry){if(g.metalWeight===undefined)g.metalWeight=Number(g.weight||0);if(g.stoneWeight===undefined)g.stoneWeight=0;if(g.grossWeight===undefined)g.grossWeight=Number(g.metalWeight||0)+Number(g.stoneWeight||0);if(g.weight===undefined)g.weight=Number(g.metalWeight||0)}this.ensureProfiles()},"
new="for(const g of this.state.goldJewelry){if(g.metalWeight===undefined)g.metalWeight=Number(g.weight||0);if(g.stoneWeight===undefined)g.stoneWeight=0;if(g.grossWeight===undefined)g.grossWeight=Number(g.metalWeight||0)+Number(g.stoneWeight||0);if(g.weight===undefined)g.weight=Number(g.metalWeight||0)}for(const r of this.state.realEstate){if(r.propertyLinkTag===undefined)r.propertyLinkTag=r.propertyName||''}for(const l of this.state.liabilities){if(l.propertyName===undefined)l.propertyName=''}this.ensureProfiles()},"
assert old in s
s=s.replace(old,new)
# 4 property form: add link tag field, save it
old="<div class=\"field\"><label>Location / address</label><input id=\"r_location\" value=\"${this.esc(item?.location||'')}\"></div>${[['deed','Deed']"
new="<div class=\"field\"><label>Location / address</label><input id=\"r_location\" value=\"${this.esc(item?.location||'')}\"></div><div class=\"field\"><label>Expense link tag</label><input id=\"r_linkTag\" value=\"${this.esc(item?.propertyLinkTag||item?.propertyName||'')}\" placeholder=\"Use this exact tag on related transactions\"><small class=\"help\">Add this tag to brokerage, commission and other related transactions. Those transactions will appear under this property.</small></div>${[['deed','Deed']"
assert old in s
s=s.replace(old,new)
old="location:document.getElementById('r_location').value,documents,photo,notes:document.getElementById('r_notes').value"
new="location:document.getElementById('r_location').value,propertyLinkTag:document.getElementById('r_linkTag').value.trim()||document.getElementById('r_name').value.trim(),documents,photo,notes:document.getElementById('r_notes').value"
assert old in s
s=s.replace(old,new)
# 4 property details: replace compact estate item map with richer details
old="<div class=\"estate-item\"><div class=\"estate-main\">${x.photo?.data?`<img class=\"estate-photo-thumb\" src=\"${x.photo.data}\" alt=\"Property photo\">`:''}<b>${this.esc(x.propertyName||'Unnamed property')}</b><small>${this.esc(x.propertyType||'')} · ${this.esc(String(x.area||''))} ${this.esc(x.areaUnit||'')}</small><small>Purchased ${this.esc(x.purchaseDate||'—')}</small></div><div class=\"estate-values\"><b>${this.money(x.currentMarketPrice||0)}</b><span>Invested ${this.money(x.investedAmount||0)}</span><span class=\"${Number(x.currentMarketPrice||0)-Number(x.investedAmount||0)>=0?'positive':'negative'}\">P/L ${this.money(Number(x.currentMarketPrice||0)-Number(x.investedAmount||0))}</span></div><div class=\"estate-actions\">${this.estateDocs(x)}<button class=\"btn small\" data-action=\"edit-real-estate\" data-id=\"${x.id}\">Edit</button><button class=\"btn small danger\" data-action=\"delete-real-estate\" data-id=\"${x.id}\">Delete</button></div></div>"
new="<div class=\"estate-item\"><div class=\"estate-main\">${x.photo?.data?`<img class=\"estate-photo-thumb\" src=\"${x.photo.data}\" alt=\"Property photo\">`:''}<b>${this.esc(x.propertyName||'Unnamed property')}</b><small>${this.esc(x.propertyType||'')} · ${this.esc(String(x.area||''))} ${this.esc(x.areaUnit||'')}</small><small>Purchased ${this.esc(x.purchaseDate||'—')}</small><small>Expense link tag: <b>${this.esc(x.propertyLinkTag||x.propertyName||'—')}</b></small></div><div class=\"estate-values\"><b>${this.money(x.currentMarketPrice||0)}</b><span>Invested ${this.money(x.investedAmount||0)}</span><span class=\"${Number(x.currentMarketPrice||0)-Number(x.investedAmount||0)>=0?'positive':'negative'}\">P/L ${this.money(Number(x.currentMarketPrice||0)-Number(x.investedAmount||0))}</span></div><div class=\"estate-linked\"><details open><summary><b>Linked expenses</b></summary>${(()=>{const tag=String(x.propertyLinkTag||x.propertyName||'').trim().toLowerCase();const tx=(this.state.transactions||[]).filter(t=>tag&&Array.isArray(t.tags)&&t.tags.some(z=>String(z).trim().toLowerCase()===tag));const total=tx.filter(t=>this.transactionType(t.type)==='expense'&&t.countAsExpense!==false).reduce((a,t)=>a+Number(t.amount||0),0);return tx.length?`<div class=\"linked-list\">${tx.map(t=>`<div class=\"row\"><span>${this.esc(t.date||'')} · ${this.esc(t.description||'Untitled')}<small class=\"sub\">${this.esc(t.category||'')} · ${this.esc((t.tags||[]).join(', '))}</small></span><b>${this.money(t.amount)}</b></div>`).join('')}</div><small class=\"help\">Linked expense total: ${this.money(total)}</small>`:'<div class=\"empty\">No transactions use this property tag yet.</div>'})()}</details><details><summary><b>Linked liabilities</b></summary>${(()=>{const name=String(x.propertyName||'').trim().toLowerCase();const ls=(this.state.liabilities||[]).filter(l=>name&&String(l.propertyName||'').trim().toLowerCase()===name);return ls.length?`<div class=\"linked-list\">${ls.map(l=>`<div class=\"row\"><span>${this.esc(l.name||'Liability')}<small class=\"sub\">${this.esc(l.type||'')} · ${this.money(l.rate||0)}%</small></span><b>${this.money(l.balance)}</b></div>`).join('')}</div>`:'<div class=\"empty\">No liabilities linked to this property.</div>'})()}</details></div><div class=\"estate-actions\">${this.estateDocs(x)}<button class=\"btn small\" data-action=\"edit-real-estate\" data-id=\"${x.id}\">Edit</button><button class=\"btn small danger\" data-action=\"delete-real-estate\" data-id=\"${x.id}\">Delete</button></div></div>"
assert old in s
s=s.replace(old,new)
# 4 liabilities: add property selector to loan form
old="<div class=\"field\"><label>First EMI date</label><input id=\"f_emiDate\" type=\"date\" value=\"${item?.firstEmiDate||''}\"></div></div>`}"
new="<div class=\"field\"><label>First EMI date</label><input id=\"f_emiDate\" type=\"date\" value=\"${item?.firstEmiDate||''}\"></div><div class=\"field\"><label>Link to property</label><select id=\"f_property\"><option value=\"\">Not linked</option>${(this.state.realEstate||[]).map(r=>`<option value=\"${this.esc(r.propertyName||'')}\" ${item?.propertyName===(r.propertyName||'')?'selected':''}>${this.esc(r.propertyName||'Unnamed property')}</option>`).join('')}</select><small class=\"help\">Select a property to show this liability under that property's details.</small></div></div>`}"
assert old in s
s=s.replace(old,new)
# 4 liability save
old="firstEmiDate:v('f_emiDate')})}"
new="firstEmiDate:v('f_emiDate'),propertyName:v('f_property')})}"
assert old in s
s=s.replace(old,new)
# 5 transaction form: add optional property link selector in expense form, but preserve tags as primary mechanism
old="<div class=\"field\"><label>Account</label><select id=\"f_acc\"><option value=\"\">Select account</option>${this.state.accounts.filter(a=>a.type==='Bank').map(a=>`<option value=\"${this.esc(a.name||a.bankName||'')}\" ${item?.account===(a.name||a.bankName||'')?'selected':''}>${this.esc(a.name||a.bankName||'')}</option>`).join('')}</select></div></div>`"
new="<div class=\"field\"><label>Account</label><select id=\"f_acc\"><option value=\"\">Select account</option>${this.state.accounts.filter(a=>a.type==='Bank').map(a=>`<option value=\"${this.esc(a.name||a.bankName||'')}\" ${item?.account===(a.name||a.bankName||'')?'selected':''}>${this.esc(a.name||a.bankName||'')}</option>`).join('')}</select></div>${type==='expense'?`<div class=\"field\"><label>Link to property (optional)</label><select id=\"f_property\"><option value=\"\">Not linked</option>${(this.state.realEstate||[]).map(r=>{const pn=r.propertyName||'';const tag=r.propertyLinkTag||pn;const selected=(item?.propertyName===pn||((item?.tags||[]).some(t=>String(t).trim().toLowerCase()===String(tag).trim().toLowerCase())));return `<option value=\"${this.esc(tag)}\" ${selected?'selected':''}>${this.esc(pn)}</option>`}).join('')}</select><small class=\"help\">Selecting a property automatically adds its expense link tag to this transaction.</small></div>`:''}</div>`"
assert old in s
s=s.replace(old,new,1)
# save transaction tags + propertyName
old="const obj={id:item?.id||crypto.randomUUID(),date:v('f_date'),amount:Math.abs(Number(v('f_amount'))||0),description:v('f_desc'),tags:v('f_tags').split(',').map(x=>x.trim()).filter(Boolean),category:cat,account:v('f_acc'),type:this.transactionType(type)||'expense',countAsExpense:type==='expense'?(document.querySelector('input[name=\"f_countExpense\"]:checked')?.value!=='no'):false};this.upsert(this.state.transactions,obj)"
new="let tags=v('f_tags').split(',').map(x=>x.trim()).filter(Boolean);const propertyTag=type==='expense'?v('f_property'):'';if(propertyTag&&!tags.some(t=>t.toLowerCase()===propertyTag.toLowerCase()))tags.push(propertyTag);const obj={id:item?.id||crypto.randomUUID(),date:v('f_date'),amount:Math.abs(Number(v('f_amount'))||0),description:v('f_desc'),tags,propertyName:propertyTag?((this.state.realEstate||[]).find(r=>String(r.propertyLinkTag||r.propertyName||'').toLowerCase()===propertyTag.toLowerCase())?.propertyName||''):item?.propertyName||'',category:cat,account:v('f_acc'),type:this.transactionType(type)||'expense',countAsExpense:type==='expense'?(document.querySelector('input[name=\"f_countExpense\"]:checked')?.value!=='no'):false};this.upsert(this.state.transactions,obj)"
assert old in s
s=s.replace(old,new)
p.write_text(s)
