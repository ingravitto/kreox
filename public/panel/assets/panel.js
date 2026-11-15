// Panel KREOX: contadores de caracteres, vista de Google en vivo, URL automática, filas de FAQ y tooltip de gráficos.
(function () {
  // Contadores de caracteres
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var max = parseInt(el.getAttribute('data-count'), 10);
    var out = document.querySelector('[data-counter-for="' + el.name + '"]');
    if (!out) return;
    out.classList.add('counter');
    var upd = function () {
      var n = el.value.length;
      out.textContent = n + ' de ' + max + ' caracteres.';
      out.classList.toggle('is-over', n > max);
      out.classList.toggle('is-near', n <= max && n > max * 0.9);
    };
    el.addEventListener('input', upd);
    upd();
  });

  // Vista de Google en vivo
  document.querySelectorAll('[data-serp]').forEach(function (el) {
    var out = document.querySelector('[data-serp-out="' + el.getAttribute('data-serp') + '"]');
    if (!out) return;
    el.addEventListener('input', function () { out.textContent = el.value; });
  });

  // URL a partir del título (solo noticias nuevas, mientras no se haya escrito a mano)
  var src = document.querySelector('[data-slug-source]');
  var dst = document.querySelector('[data-slug-target]');
  if (src && dst) {
    var manual = dst.value !== '';
    dst.addEventListener('input', function () { manual = dst.value !== ''; });
    var slug = function (s) {
      return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ñ/g, 'n').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
    };
    src.addEventListener('input', function () { if (!manual) dst.value = slug(src.value); });
  }

  // Filas de preguntas frecuentes
  var rows = document.querySelector('[data-faq-rows]');
  var tpl = document.getElementById('faq-row-tpl');
  var add = document.querySelector('[data-faq-add]');
  if (rows && tpl && add) {
    add.addEventListener('click', function () {
      rows.appendChild(tpl.content.cloneNode(true));
      var last = rows.querySelectorAll('[data-faq-row]');
      last[last.length - 1].querySelector('input').focus();
    });
    rows.addEventListener('click', function (e) {
      var b = e.target.closest('[data-faq-remove]');
      if (!b) return;
      var row = b.closest('[data-faq-row]');
      if (rows.querySelectorAll('[data-faq-row]').length === 1) { row.querySelectorAll('input, textarea').forEach(function (i) { i.value = ''; }); return; }
      row.remove();
      add.focus();
    });
  }

  // Avisar antes de salir con cambios sin guardar
  document.querySelectorAll('form.editor, form.form').forEach(function (f) {
    if (!f.querySelector('textarea')) return;
    var dirty = false;
    f.addEventListener('input', function () { dirty = true; });
    f.addEventListener('submit', function () { dirty = false; });
    window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  });

  // Tooltip con línea guía en los gráficos
  document.querySelectorAll('[data-chart]').forEach(function (fig) {
    var pts = JSON.parse(fig.getAttribute('data-chart'));
    var unit = fig.getAttribute('data-unit');
    var svg = fig.querySelector('svg');
    var hit = fig.querySelector('.ch-hit');
    var cross = fig.querySelector('.ch-cross');
    var dot = fig.querySelector('.ch-dot');
    var tip = fig.querySelector('.ch-tip');
    var fmt = new Intl.NumberFormat('es-ES');
    var hide = function () { cross.setAttribute('hidden', ''); dot.setAttribute('hidden', ''); tip.hidden = true; };
    hit.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect();
      var vb = svg.viewBox.baseVal;
      var x = (e.clientX - r.left) * vb.width / r.width;
      var best = pts[0];
      pts.forEach(function (p) { if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p; });
      cross.setAttribute('x1', best.x); cross.setAttribute('x2', best.x); cross.removeAttribute('hidden');
      dot.setAttribute('cx', best.x); dot.setAttribute('cy', best.y); dot.removeAttribute('hidden');
      tip.innerHTML = '';
      var b = document.createElement('strong'); b.textContent = fmt.format(best.v) + ' ' + unit;
      tip.appendChild(b); tip.appendChild(document.createTextNode(' · ' + best.f));
      tip.style.left = (svg.offsetLeft + best.x * r.width / vb.width) + 'px';
      tip.style.top = (svg.offsetTop + best.y * r.height / vb.height) + 'px';
      tip.hidden = false;
    });
    hit.addEventListener('pointerleave', hide);
  });
})();
