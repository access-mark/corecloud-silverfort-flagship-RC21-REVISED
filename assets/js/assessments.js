(function(){
  const TYPE_LABELS={
    WORKLOAD_VENUE:'Workload Venue Assessment',
    SOVEREIGNTY:'Digital Sovereignty Assessment',
    AI_READINESS:'AI Readiness Assessment',
    SILVERFORT_IDENTITY:'Silverfort Identity Security Risk Assessment'
  };
  function classify(type, score){
    const generic=[
      [20,'Reactive','Technology decisions are largely tactical. Immediate governance and assessment work is recommended.'],
      [40,'Emerging','Basic awareness exists, but practices are inconsistent and require structure.'],
      [60,'Developing','Your organisation has useful foundations but requires stronger governance, measurement and executive alignment.'],
      [80,'Managed','Your organisation demonstrates solid maturity. The next opportunity is optimisation and strategic roadmap development.'],
      [100,'Strategic','Your organisation demonstrates strong maturity. Focus should shift to continuous improvement, recoverability and executive-level optimisation.']
    ];
    const sovereign=[
      [20,'Exposed','Sovereignty visibility is limited. Immediate dependency, jurisdiction and recoverability assessment is recommended.'],
      [40,'Emerging','Basic sovereignty controls exist, but governance, access and recoverability require stronger structure.'],
      [60,'Developing','Sovereignty awareness is developing. The next opportunity is formal control and dependency management.'],
      [80,'Governed','Sovereignty is actively governed. Focus should shift to recoverability testing and AI-era governance.'],
      [100,'Strategic','Sovereignty is treated as a business capability with strong control, visibility and recoverability.']
    ];
    const ai=[
      [20,'Not Ready','AI ambition is ahead of readiness. Data, governance, infrastructure and operating foundations should be assessed before scaling.'],
      [40,'Emerging','AI foundations are emerging, but governance, data quality and operational models require structure.'],
      [60,'Developing','AI readiness is developing. The next opportunity is disciplined governance and production-readiness.'],
      [80,'Ready','Your organisation shows strong AI readiness. Focus should shift to economic optimisation and scale governance.'],
      [100,'Advanced','AI capability appears mature and governed. Future focus should centre on strategic AI value and sovereignty.']
    ];
    const table = type==='SOVEREIGNTY' ? sovereign : type==='AI_READINESS' ? ai : generic;
    return table.find(row=>score<=row[0]).slice(1);
  }
  function finding(type){
    const maps={
      WORKLOAD_VENUE:['Workload placement should be governed through economics, sovereignty and capability rather than vendor preference.','Build a structured workload inventory and classify workloads by criticality, data sensitivity and operating requirements.','Proceed to a formal Workload Venue Assessment and executive venue roadmap.'],
      SOVEREIGNTY:['Sovereignty maturity depends on visibility across jurisdiction, residency, access, control and recoverability.','Prioritise provider dependency mapping, privileged access review and recoverability planning.','Proceed to a formal Sovereignty Assessment and governance review.'],
      SILVERFORT_IDENTITY:['Reported control gaps require validation across real authentication paths, privileged identities and exceptions.','Prioritise privileged MFA, legacy authentication and non-human identity discovery based on reported gaps.','Book a scoped Silverfort identity-security discovery session to validate findings and solution fit.'],
      AI_READINESS:['AI success depends on readiness across data, infrastructure, governance, capability and operations.','Strengthen data governance and AI accountability before scaling AI adoption.','Proceed to a formal AI Readiness Assessment and executive AI roadmap.']
    };
    return maps[type]||maps.WORKLOAD_VENUE;
  }
  function buildCaptureForm(type, score, label, summary){
    return `<div class="glass capture-panel" data-assessment-capture-panel>
      <div class="eyebrow gold">Request an Executive Follow-up</div>
      <h3>Send this result to CoreCloud for follow-up</h3>
      <p class="muted">Send your result to CoreCloud so the team can recommend the appropriate assessment or advisory next step.</p>
      <form class="lead-form" action="https://formsubmit.co/sales@corecloudza.com" method="POST" data-lead-type="ASSESSMENT" data-lead-source="ASSESSMENT_${type}">
        <input name="_cc" type="hidden" value="mark@corecloudza.com" />
        <input name="_template" type="hidden" value="table" />
        <input name="_captcha" type="hidden" value="true" />
        <input name="_next" type="hidden" value="https://www.corecloudza.com/thank-you.html" />
        <input name="_subject" type="hidden" value="[CoreCloudZA] ${TYPE_LABELS[type]||type} Self-Assessment Result" />
        <input name="Lead Type" type="hidden" value="ASSESSMENT_RESULT" />
        <input name="Source" type="hidden" value="CoreCloudZA Assessment Tool" />
        <input name="firstName" placeholder="First Name" required />
        <input name="lastName" placeholder="Last Name" required />
        <input name="company" placeholder="Company" required />
        <input name="title" placeholder="Job Title" />
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="phone" placeholder="Phone Number" />
        <input name="assessmentType" type="hidden" value="${type}" />
        <input name="assessmentLabel" type="hidden" value="${TYPE_LABELS[type]||type}" />
        <input name="score" type="hidden" value="${score}" />
        <input name="classification" type="hidden" value="${label}" />
        <textarea name="notes" hidden>${summary}</textarea><textarea name="assessmentAnswers" hidden></textarea>
        <button class="btn primary" type="submit">Send My Assessment to CoreCloud</button>
        <p class="form-note" data-form-note></p>
      </form>
    </div>`;
  }
  document.querySelectorAll('[data-assessment-form]').forEach(form=>{
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const questions=[...form.querySelectorAll('.question')];
      const selected=questions.map(q=>q.querySelector('input:checked'));
      if(questions.length===0||selected.some(x=>!x)){const first=questions.find(q=>!q.querySelector('input:checked'));first?.scrollIntoView({behavior:'smooth',block:'center'});first?.querySelector('input')?.focus();alert('Please answer every assessment question before calculating your result.');return;}
      const vals=selected.map(x=>parseInt(x.value,10));
      if(vals.some(x=>!Number.isFinite(x)||x<0||x>5)){alert('Invalid assessment answer. Please review your selections.');return;}
      const type=form.getAttribute('data-assessment-type')||'WORKLOAD_VENUE';
      const identity=type==='SILVERFORT_IDENTITY';
      const known=identity?vals.filter(v=>v!==5):vals;
      const unknown=vals.length-known.length;
      const score=identity?(known.length?Math.round(known.reduce((a,b)=>a+4-b,0)/(known.length*4)*100):0):Math.round(vals.reduce((a,b)=>a+b,0)/(questions.length*4)*100);
      const [label,summary]=identity?(known.length?[score<25?'Lower indicated exposure':score<55?'Moderate indicated exposure':'Higher indicated exposure','Self-reported exposure index based on '+known.length+' assessed controls; '+unknown+' unknown controls excluded and requiring validation. Not a technical security audit.']:['Insufficient evidence','All 20 controls were marked unknown. Exposure cannot be scored without validated information.']):classify(type, score);
      const result=document.querySelector('[data-result-wrap]');
      let f=finding(type);
      if(identity){
        const themes=[['Privileged access and MFA',[4,7,8,9,11]],['Legacy application MFA',[1,5,9]],['Service and non-human identities',[12,13,14,15]],['Identity threat response',[16,17,18,19]],['Hybrid directory visibility',[0,2,3]]];
        const ranked=themes.map(([name,ids])=>({name,gaps:ids.filter(i=>vals[i]===0).length,partial:ids.filter(i=>vals[i]===2).length,unknown:ids.filter(i=>vals[i]===5).length})).sort((a,b)=>(b.gaps*3+b.partial)-(a.gaps*3+a.partial));
        f=[ranked[0].name+': '+ranked[0].gaps+' reported gaps, '+ranked[0].partial+' partial controls and '+ranked[0].unknown+' unknowns.','Validate the highest-risk exceptions and '+unknown+' unverified controls before deciding remediation.','Request scoped Silverfort discovery covering '+ranked.slice(0,2).map(x=>x.name.toLowerCase()).join(' and ')+'.'];
      }
      document.querySelector('[data-score]').textContent=identity&&!known.length?'N/A':score;
      document.querySelector('[data-classification]').textContent=label;
      document.querySelector('[data-summary]').textContent=summary;
      document.querySelector('[data-finding1]').textContent=f[0];
      document.querySelector('[data-finding2]').textContent=f[1];
      document.querySelector('[data-finding3]').textContent=f[2];
      result.hidden=false;
      const answers=[...form.querySelectorAll('.question')].map((q,i)=>{const checked=q.querySelector('input:checked');return `${i+1}. ${q.querySelector('h3')?.textContent||'Question'} — ${checked?.closest('label')?.textContent.trim()||'No answer'}`}).join('\n');
      const resultPanel = result.querySelector('.result-panel');
      if(resultPanel && !result.querySelector('[data-assessment-capture-panel]')){
        resultPanel.insertAdjacentHTML('afterend', buildCaptureForm(type, score, label, summary));
      } else if(result.querySelector('[data-assessment-capture-panel]')){
        result.querySelector('[name="score"]').value=score;
        result.querySelector('[name="classification"]').value=label;
        result.querySelector('[name="notes"]').value=summary;
      }
      const answerField=result.querySelector('[name="assessmentAnswers"]');if(answerField)answerField.value=answers;
      const nextField=result.querySelector('[name="_next"]');if(nextField)nextField.value=new URL('thank-you.html',location.href).href;
      result.scrollIntoView({behavior:'smooth',block:'start'});
      
    });
  });
})();
