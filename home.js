document.querySelectorAll('[data-event]').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.plausible === 'function') {
      window.plausible(link.dataset.event, {
        props: { kind: link.dataset.kind || link.dataset.project },
      });
    }
  });
});

document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('vic.cazacu@gmail.com');
    status.textContent = 'Email copied';
    if (typeof window.plausible === 'function') {
      window.plausible('Contact Click', { props: { kind: 'copy-email' } });
    }
  } catch {
    status.textContent = 'Please select and copy the email address above.';
  }
});
