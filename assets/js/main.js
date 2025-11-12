'use strict';
{
  $(function () {
      $('.header__btn').on('click', function () {
  $('.nav').addClass('is-open');       // 메뉴 열기
  $('html, body').addClass('nav-open'); // 문서 스크롤 잠금
   $(this).attr('aria-expanded', 'true');
});

        $('.nav__btn, .nav__item a').on('click', function(){
            $('.nav').removeClass('is-open');
            $('html, body').removeClass('nav-open'); // 문서 스크롤 해제
            $('.header__btn').attr('aria-expanded', 'false');
          });

        $('.topBtn').on('click', function(){
            const position = 0;
            const speed = 1000;
            $('html,body').animate({
                scrollTop:position
            },speed);
        });

        $(window).on('load scroll', function() {
            const fadeIn = $('.fadeIn');
            console.log(fadeIn)

            fadeIn.each(function(){
                const boxoffset = $(this).offset().top;
                const scrollPos = $(window).scrollTop();
                const wh = $(window).height();

                if(scrollPos > boxoffset - wh +100){
                    $(this).addClass('animated');
                }
            });
        });


    });


const langButtons = document.querySelectorAll('.about__langSwitch .langBtn');
const bios = document.querySelectorAll('.about__bio');

// === Language toggle (About / Work 공용) ===
// 클릭 이벤트 위임 + 섹션 스코프 한정
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.langBtn');
  if (!btn) return;

  const targetLang = btn.dataset.lang; // 'en' | 'ja'
  // 이 버튼이 속한 섹션 범위만 토글: About or Work detail
  const scope = btn.closest('.section--about, .project__description');
  if (!scope) return;

  // 버튼 활성화 상태 갱신
  scope.querySelectorAll('.langBtn').forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('is-active', isActive);
    b.setAttribute('aria-selected', String(isActive));
  });

  // 본문 블록 토글 (About/Work 둘 다 지원)
  scope.querySelectorAll('.about__bio, .project__bio').forEach(block => {
    block.classList.toggle('is-hidden', block.dataset.lang !== targetLang);
  });
});



// === FORCE MOVE TOP BUTTON OUTSIDE ANY CONTAINER ===
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.topBtn');
  if (btn && btn.parentElement !== document.body) {
    document.body.appendChild(btn); // body 직속으로 이동
  }
  // 스타일도 한 번 더 보강(덮어쓰기)
  Object.assign(btn.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: 120
  });
});


// Scroll-triggered fade-in for .fadeIn elements
(function(){
  const els = document.querySelectorAll('.fadeIn');
  if(!('IntersectionObserver' in window) || !els.length){
    // 폴백: 오래된 브라우저는 즉시 표시
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // 초기: 깜빡임 방지용 프레임 뒤 적용
  requestAnimationFrame(() => {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // 1번만 실행(원하면 제거)
        }
      });
    }, {
      root: null,
      threshold: 0.15,         // 15% 보이면 트리거
      rootMargin: '0px 0px -10% 0px' // 하단 여유
    });

    els.forEach(el => io.observe(el));
  });
})();

// 최소 버전: 스크롤/로드 때 .fadeIn 요소에 .animated 붙이기
$(function(){
  const $w = $(window);
  function run(){
    $('.fadeIn').each(function(){
      const boxTop = $(this).offset().top;
      const scroll = $w.scrollTop();
      const wh = $w.height();
      if (scroll > boxTop - wh + 100) {
        $(this).addClass('animated');
      }
    });
  }
  $w.on('load scroll', run);
  run(); // 첫 로드 시 한 번 실행
});

// Scroll progress bar
(function(){
  const bar = document.getElementById('progress');
  if(!bar) return;

  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const ratio = max ? (h.scrollTop / max) : 0;
    bar.style.width = (ratio * 100) + '%';
    ticking = false;
  }
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

// === Skills progress bars (animate on reveal) ===
(function(){
  const bars = document.querySelectorAll('.skillsProgress .bar');
  if(!bars.length) return;

  const animateBar = (bar) => {
    const val = Number(bar.dataset.value || '0');
    const fill = bar.querySelector('.bar__fill');
    const valueEl = bar.querySelector('.bar__value');
    if(!fill || !valueEl) return;

    // 채우기
    requestAnimationFrame(() => { fill.style.width = `var(--value)`; });

    // 숫자 카운트업
    let cur = 0;
    const dur = 800; // ms
    const t0 = performance.now();
    function tick(t){
      const p = Math.min(1, (t - t0) / dur);
      const eased = p < 0.5 ? 2*p*p : -1+(4-2*p)*p; // easeInOut
      cur = Math.round(val * eased);
      valueEl.textContent = cur + '%';
      if(p < 1) requestAnimationFrame(tick);
      else valueEl.textContent = val + '%';
    }
    requestAnimationFrame(tick);
  };

  // 한 번만 재생
  const played = new WeakSet();

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((ents) => {
      ents.forEach(ent => {
        if(ent.isIntersecting && !played.has(ent.target)){
          animateBar(ent.target);
          played.add(ent.target);
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => io.observe(b));
  } else {
    // 폴백: 즉시 채우기
    bars.forEach(animateBar);
  }
})();
    
}


document.addEventListener('DOMContentLoaded', function(){
  var items = document.querySelectorAll('.greetRotate span');
  if(!items.length) return;

  var i = 0;
  function show(n){
    items.forEach(function(el, idx){
      el.classList.toggle('is-show', idx === n);
    });
  }
  show(i);

  // 2초 간격으로 순환 (원하면 2500~3000으로 조절)
  setInterval(function(){
    i = (i + 1) % items.length;
    show(i);
  }, 2000);
});

