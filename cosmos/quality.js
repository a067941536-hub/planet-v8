/* 全站畫質設定：高／中（預設）／低。各頁面讀取 QUALITY.cfg，並以 QUALITY.onChange 即時套用。 */
(function (root) {
  'use strict';
  var TABLE = {
    high:   { label: '高', desc: '最佳畫質：最多粒子、最高解析度與完整影子。需要較好的顯示卡。', dpr: 2,   stars: 1,   galaxy: 1,   tex: 360, part: 1,   shadow: 2, mesh: 1,   rocks: 1,   sky: 1,   neb: 1,   octave: 5, glass: true,  aurora: 2, trail: true,  shoot: true },
    medium: { label: '中', desc: '預設：畫質與效能平衡，適合大多數裝置。',                           dpr: 1.5, stars: .7,  galaxy: .65, tex: 260, part: .65, shadow: 1, mesh: .8,  rocks: .6,  sky: .7,  neb: .72, octave: 4, glass: true,  aurora: 1, trail: true,  shoot: true },
    low:    { label: '低', desc: '省效能：關閉毛玻璃、極光與影子，大幅減少粒子。適合舊手機、筆電或省電。', dpr: 1,   stars: .35, galaxy: .35, tex: 170, part: .3,  shadow: 0, mesh: .6,  rocks: .3,  sky: .4,  neb: .5,  octave: 3, glass: false, aurora: 0, trail: false, shoot: false }
  };
  var ORDER = ['high', 'medium', 'low'], cbs = [], KEY = 'cosmos-quality';
  function get() { try { var v = localStorage.getItem(KEY); return TABLE[v] ? v : 'medium'; } catch (e) { return 'medium'; } }
  function apply(l) { var h = document.documentElement; ORDER.forEach(function (k) { h.classList.toggle('q-' + k, k === l); }); }
  var Q = root.QUALITY = { level: get(), cfg: TABLE[get()], TABLE: TABLE, ORDER: ORDER,
    set: function (l) { if (!TABLE[l]) return; Q.level = l; Q.cfg = TABLE[l]; try { localStorage.setItem(KEY, l); } catch (e) {} apply(l); cbs.forEach(function (f) { try { f(l, Q.cfg); } catch (e) { console.error(e); } }); syncUI(); },
    onChange: function (f) { cbs.push(f); },
    dpr: function () { return Math.min(root.devicePixelRatio || 1, Q.cfg.dpr); },
    n: function (base) { return Math.max(1, Math.round(base * Q.cfg.part)); }
  };
  apply(Q.level);
  /* 在指定容器放一組「畫質：高 中 低」分段按鈕 */
  var mounts = [];
  function syncUI() { mounts.forEach(function (m) { Array.prototype.forEach.call(m.querySelectorAll('button[data-q]'), function (b) { b.classList.toggle('on', b.dataset.q === Q.level); }); var d = m.querySelector('.q-desc'); if (d) d.textContent = TABLE[Q.level].desc; }); }
  Q.mount = function (el, opts) {
    opts = opts || {}; var w = document.createElement('div'); w.className = 'q-seg' + (opts.compact ? ' compact' : '');
    w.innerHTML = '<span class="q-lab">畫質</span>' + ORDER.map(function (k) { return '<button type="button" data-q="' + k + '" title="' + TABLE[k].desc + '">' + TABLE[k].label + '</button>'; }).join('') + (opts.desc === false ? '' : '<span class="q-desc"></span>');
    w.addEventListener('click', function (e) { var b = e.target.closest('button[data-q]'); if (b) Q.set(b.dataset.q); });
    el.appendChild(w); mounts.push(w); syncUI(); return w;
  };
})(window);
