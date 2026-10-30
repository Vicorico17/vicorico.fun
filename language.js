(() => {
  const menu = document.querySelector('[data-language-menu]');
  if (!menu) return;
  const choices = [...menu.querySelectorAll('[data-language]')];
  const label = menu.querySelector('[data-language-label]');
  const status = menu.querySelector('[data-language-status]');
  const originals = new WeakMap();
  const dictionaries = new Map([['en', {}]]);
  const skip = 'script, style, svg, code, pre, [translate="no"], .text-flip, .quest-name, .github-live-card h4, #projects h3, .github-history-panel li p';
  let language = 'en';
  let dictionary = {};
  let request = 0;
  let frame = 0;
  const normalize = (text) => text.replace(/\s+/g, ' ').trim();
  const translate = (text) => {
    const key = normalize(text);
    if (!key) return text;
    let result = dictionary[key];
    if (!result) {
      const count = key.match(/^(\S+) (commits?|countries selected|country selected)$/);
      const activity = key.match(/^(Latest update|Latest commit) · (.+)$/);
      const history = key.match(/^(.+) · recent commits$/);
      if (count) result = `${count[1]} ${dictionary[count[2]] || count[2]}`;
      else if (activity) result = `${dictionary[activity[1]] || activity[1]} · ${activity[2]}`;
      else if (history) result = `${history[1]} · ${dictionary['recent commits'] || 'recent commits'}`;
    }
    return result ? text.replace(/\S[\s\S]*\S|\S/, result) : text;
  };
  function update(node, key, current, write) {
    let entries = originals.get(node);
    if (!entries) { entries = new Map(); originals.set(node, entries); }
    let record = entries.get(key);
    if (!record || current !== record.rendered) record = { source: current, rendered: current };
    record.rendered = translate(record.source);
    entries.set(key, record);
    if (current !== record.rendered) write(record.rendered);
  }
  function apply() {
    frame = 0;
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement?.closest(skip)) update(node, 'text', node.data, (value) => { node.data = value; });
    }
    document.querySelectorAll('[aria-label], [placeholder], [alt], [title]').forEach((node) => {
      if (node.closest(skip)) return;
      ['aria-label', 'placeholder', 'alt', 'title'].forEach((key) => {
        if (node.hasAttribute(key)) update(node, key, node.getAttribute(key), (value) => node.setAttribute(key, value));
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'alt', 'title'] });
  }
  const observer = new MutationObserver(() => {
    if (!frame) frame = requestAnimationFrame(apply);
  });
  window.siteI18n = {
    originalText(element) {
      if (!element) return '';
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let text = '';
      while (walker.nextNode()) {
        const node = walker.currentNode;
        text += originals.get(node)?.get('text')?.source ?? node.data;
      }
      return text;
    },
  };
  choices.forEach((choice) => choice.addEventListener('click', async () => {
    const next = choice.dataset.language;
    const currentRequest = ++request;
    status.textContent = 'Loading translations…';
    menu.setAttribute('aria-busy', 'true');
    try {
      if (!dictionaries.has(next)) {
        const response = await fetch(`assets/locales/${next}.json?v=20261030a`);
        if (!response.ok) throw new Error('Translation unavailable');
        const data = await response.json();
        if (!data || typeof data !== 'object' || Object.values(data).some((value) => typeof value !== 'string')) throw new Error('Invalid translation');
        dictionaries.set(next, data);
      }
      if (currentRequest !== request) return;
      language = next;
      dictionary = dictionaries.get(language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      choices.forEach((button) => button.setAttribute('aria-pressed', String(button === choice)));
      label.textContent = choice.querySelector('[data-language-name]').textContent;
      menu.querySelector('[data-language-flag]').src = choice.dataset.flag;
      apply();
      status.textContent = '';
      menu.open = false;
      menu.querySelector('summary').focus();
    } catch {
      if (currentRequest === request) status.textContent = 'Translation unavailable. Please try again.';
    } finally {
      if (currentRequest === request) menu.removeAttribute('aria-busy');
    }
  }));
  apply();
})();
