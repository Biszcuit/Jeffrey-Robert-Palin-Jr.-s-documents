// "Copy to clipboard": copies the document's entire text at once,
// with every line break, blank line, space and symbol kept as written.
(function () {
  var button = document.getElementById('copy-button');
  var source = document.getElementById('document-text');
  var status = document.getElementById('copy-status');
  if (!button || !source) return;

  var label = button.textContent;
  var timer = null;

  function copyWithTextarea(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.left = '0';
    area.style.width = '1px';
    area.style.height = '1px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    button.focus();
    return ok;
  }

  function report(ok) {
    clearTimeout(timer);
    if (ok) {
      button.textContent = 'Copied to clipboard';
      button.classList.add('is-copied');
      status.classList.remove('is-error');
      status.textContent = 'All ' + button.getAttribute('data-words') + ' words copied.';
      timer = setTimeout(function () {
        button.textContent = label;
        button.classList.remove('is-copied');
        status.textContent = '';
      }, 3500);
    } else {
      status.classList.add('is-error');
      status.textContent = 'Your browser blocked copying. Select the text below and copy it instead.';
    }
  }

  button.addEventListener('click', function () {
    // textContent is the exact text shown on the page, character for character.
    var text = source.textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { report(true); },
        function () { report(copyWithTextarea(text)); }
      );
    } else {
      report(copyWithTextarea(text));
    }
  });
})();
