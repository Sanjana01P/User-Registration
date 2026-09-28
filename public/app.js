const form = document.querySelector('#registration-form');
const message = document.querySelector('#form-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = 'Sending your RSVP...';
  const formData = new FormData(form);
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData))
  });
  const result = await response.json();
  message.textContent = result.message || result.error;
  message.className = `form-message ${response.ok ? 'success' : 'error'}`;
  if (response.ok) form.reset();
});