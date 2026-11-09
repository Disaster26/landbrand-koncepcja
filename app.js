(function(){
  var top=document.getElementById('top'),burger=document.getElementById('burger'),nav=document.getElementById('nav');
  function onScroll(){top.classList.toggle('is-scrolled',window.scrollY>8)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  function setMenu(open){burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu');nav.classList.toggle('is-open',open);document.body.style.overflow=open?'hidden':''}
  burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // aktywna sekcja w menu
  var links=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))}).filter(Boolean);
  function spy(){
    var y=window.scrollY+window.innerHeight*0.35,cur=null;
    secs.forEach(function(s){if(s.offsetTop<=y)cur=s.id});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)cur='kontakt';
    links.forEach(function(a){a.classList.toggle('is-active',a.getAttribute('href')==='#'+cur)});
  }
  window.addEventListener('scroll',spy,{passive:true});spy();

  // karuzele: palec, mysz, strzalki, klawiatura
  [].slice.call(document.querySelectorAll('.rail')).forEach(function(rail){
    var navEl=document.querySelector('.rail-nav[data-for="'+rail.id+'"]');
    var items=rail.children,count=navEl&&navEl.querySelector('.rail-count');
    var btns=navEl?navEl.querySelectorAll('.rail-btn'):[];
    function step(){var a=items[0],b=items[1];return b?b.offsetLeft-a.offsetLeft:rail.clientWidth}
    function upd(){
      var i=Math.round(rail.scrollLeft/step());
      if(count)count.textContent=Math.min(i+1,items.length)+' / '+items.length;
      if(btns.length){btns[0].disabled=rail.scrollLeft<4;btns[1].disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4}
    }
    [].forEach.call(btns,function(b){b.addEventListener('click',function(){
      var n=Math.max(1,Math.floor(rail.clientWidth/step())-1);
      rail.scrollBy({left:+b.dataset.dir*step()*n,behavior:'smooth'})})});
    rail.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
    rail.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){rail.scrollBy({left:step(),behavior:'smooth'});e.preventDefault()}
      if(e.key==='ArrowLeft'){rail.scrollBy({left:-step(),behavior:'smooth'});e.preventDefault()}
    });
    var down=false,sx=0,sl=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=rail.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;rail.classList.add('is-drag')}if(moved)rail.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){var s=step(),t=Math.round(rail.scrollLeft/s)*s;rail.classList.remove('is-drag');rail.scrollTo({left:t,behavior:'smooth'})}});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    rail.addEventListener('dragstart',function(e){e.preventDefault()});
    window.addEventListener('resize',upd);upd();
  });

  // formularz pokazowy
  var form=document.getElementById('form'),note=document.getElementById('formNote');
  form.addEventListener('submit',function(e){e.preventDefault();note.hidden=false;note.scrollIntoView({block:'nearest',behavior:'smooth'})});

  // wideo: odtwarzaj tylko w widoku
  var v=document.querySelector('.hero__video');
  if(v&&'IntersectionObserver' in window){
    new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})}).observe(v);
  }
})();
