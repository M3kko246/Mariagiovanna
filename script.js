/* ══════════════════════════════════════════════════════════
   script.js — Invito 18 anni Mariagiovanna
   Struttura:
     1. Animazione apertura busta
     2. Petali animati
     3. Conto alla rovescia
     4. Scroll reveal (IntersectionObserver)
     5. Gestione form di conferma presenza
══════════════════════════════════════════════════════════ */


/* ── 1. ANIMAZIONE APERTURA BUSTA ─────────────────────── */

/**
 * Flag booleano che impedisce di eseguire l'animazione
 * più di una volta (l'utente potrebbe cliccare più volte
 * velocemente durante l'animazione).
 */
let opened = false;

/**
 * openEnvelope()
 * Chiamata dall'attributo onclick sulla .env-wrap nell'HTML.
 *
 * Sequenza:
 *  1. Aggiunge .open all'elemento busta
 *     → CSS apre il lembo (rotateX 180°) e fa uscire il bigliettino
 *  2. Aggiunge .exit all'overlay
 *     → CSS fa sfumare e ingrandire l'overlay (dopo 1.4s di delay)
 *  3. Dopo 2.2s totali, nasconde l'overlay con display:none
 *     e rende visibile il sito principale aggiungendo .visible
 *  4. Lancia spawnPetals() per far cadere i petali
 */
function openEnvelope() {
  // Blocco di sicurezza: esce subito se già cliccato
  if (opened) return;
  opened = true;

  // Step 1: avvia l'animazione CSS della busta
  document.getElementById('envelope').classList.add('open');

  // Step 2: avvia l'animazione di uscita dell'overlay
  document.getElementById('envelope-screen').classList.add('exit');

  // Step 3 & 4: dopo 1.6s (tempo della nuova animazione più snella), switcha la vista
  setTimeout(() => {
    // Rimuove completamente l'overlay dal layout
    document.getElementById('envelope-screen').style.display = 'none';

    // Rende visibile il sito (CSS lo porta da opacity:0 a opacity:1)
    document.getElementById('main-site').classList.add('visible');

    // Fa partire l'effetto petali che cadono
    spawnPetals();
  }, 1650);
}


/* ── 2. PETALI ANIMATI ─────────────────────────────────── */

/**
 * spawnPetals(count)
 * Crea `count` elementi .petal con proprietà casuali
 * e li inserisce nel contenitore #petals-container.
 *
 * Ogni petalo ha:
 * - posizione orizzontale casuale (left: 0–100vw)
 * - posizione verticale di partenza sopra lo schermo
 * - colore casuale tra rosa scuro e cipria
 * - dimensioni casuali per varietà visiva
 * - forma alternata (petalo dritto o ruotato)
 * - durata e ritardo animazione casuali per effetto naturale
 *
 * @param {number} count - Numero di petali da creare (default: 12)
 */
function spawnPetals(count = 12) {
  const container = document.getElementById('petals-container');

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    // Alterna tra due tonalità di rosa
    const color = Math.random() > 0.5 ? '#c8748a' : '#f0ccd8';

    // Alterna la direzione della forma a petalo (border-radius asimmetrico)
    const shape = Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%';

    // Applica tutte le proprietà randomizzate inline
    petal.style.cssText = `
      left:             ${Math.random() * 100}vw;
      top:              ${-20 - Math.random() * 40}px;
      background:       ${color};
      width:            ${6 + Math.random() * 6}px;
      height:           ${8 + Math.random() * 8}px;
      border-radius:    ${shape};
      animation-duration:  ${5 + Math.random() * 8}s;
      animation-delay:     ${Math.random() * 4}s;
    `;

    container.appendChild(petal);
  }
}

/**
 * spawnConfetti()
 * Versione "celebrativa" di spawnPetals con più elementi
 * e colori aggiuntivi (oro, champagne).
 * Usata dopo la conferma della presenza nel form.
 */
function spawnConfetti() {
  const container = document.getElementById('petals-container');
  const colors = ['#c8748a', '#c9a84c', '#f0ccd8', '#f5edd8', '#8b3e54'];

  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    petal.style.cssText = `
      left:             ${Math.random() * 100}vw;
      top:              -10px;
      background:       ${colors[Math.floor(Math.random() * colors.length)]};
      width:            ${4 + Math.random() * 8}px;
      height:           ${6 + Math.random() * 10}px;
      animation-duration:  ${3 + Math.random() * 4}s;
      animation-delay:     ${Math.random() * 1.5}s;
    `;

    container.appendChild(petal);
  }
}


/* ── 3. CONTO ALLA ROVESCIA ────────────────────────────── */

/**
 * updateCountdown()
 * Calcola il tempo rimanente alla data della festa
 * e aggiorna i quattro elementi nel DOM.
 *
 * Logica del calcolo:
 * - target è la data/ora esatta della festa
 * - diff è la differenza in millisecondi tra target e adesso
 * - Se diff <= 0, la festa è già iniziata → mostra tutti 0
 * - Altrimenti calcola giorni, ore, minuti, secondi
 *   usando divisioni e modulo (%)
 *
 * Conversioni:
 *   1 giorno   = 86.400.000 ms  (24 × 60 × 60 × 1000)
 *   1 ora      =  3.600.000 ms  (60 × 60 × 1000)
 *   1 minuto   =     60.000 ms  (60 × 1000)
 *   1 secondo  =      1.000 ms
 *
 * padStart(2, '0') → aggiunge uno zero iniziale se necessario
 * (es. "7" diventa "07") per mantenere sempre 2 cifre.
 */
function updateCountdown() {
  // ⚠️ Cambia questa data per aggiornare il conto alla rovescia
  const target = new Date('2026-08-13T20:00:00');
  const now    = new Date();
  const diff   = target - now;   // millisecondi rimanenti

  // Se la festa è già passata, azzera tutto
  if (diff <= 0) {
    ['days', 'hours', 'mins', 'secs'].forEach(id => {
      document.getElementById('cd-' + id).textContent = '00';
    });
    return; // esce dalla funzione
  }

  // Calcolo delle unità di tempo
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  // Aggiorna il DOM
  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

// Esecuzione immediata al caricamento della pagina
// (così i numeri appaiono subito senza aspettare 1 secondo)
updateCountdown();

// Ripete ogni 1000ms (1 secondo) per tenere il countdown aggiornato
setInterval(updateCountdown, 1000);


/* ── 4. SCROLL REVEAL (IntersectionObserver) ───────────── */

/**
 * IntersectionObserver è una API moderna del browser che
 * notifica quando un elemento entra o esce dal viewport
 * (la parte visibile dello schermo), senza bisogno di
 * ascoltare l'evento scroll (più performante).
 *
 * Configurazione:
 * - threshold: 0.12 → l'elemento si attiva quando almeno
 *   il 12% della sua altezza è visibile nel viewport
 *
 * Comportamento:
 * - Ogni elemento con classe .reveal parte nascosto (opacity:0)
 * - Quando entra nel viewport, JS aggiunge la classe .in
 * - CSS gestisce la transizione (opacity + translateY)
 * - observer.unobserve() smette di osservare l'elemento
 *   dopo che è apparso (ottimizzazione: non serve più)
 */
const revealElements = document.querySelectorAll('.reveal');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Elemento entrato nel viewport: aggiunge la classe
        entry.target.classList.add('in');
        // Smette di osservarlo (l'animazione avviene una volta sola)
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Avvia l'osservazione su ogni elemento .reveal
revealElements.forEach(el => scrollObserver.observe(el));


/* ── 5. GESTIONE FORM CONFERMA PRESENZA ───────────────── */

/**
 * ⚠️  CONFIGURAZIONE GOOGLE SHEETS
 * ─────────────────────────────────
 * Per salvare le iscrizioni in un Google Sheets segui questi passi
 * (istruzioni dettagliate anche nel file ISTRUZIONI_SHEETS.txt):
 *
 *  1. Vai su script.google.com e crea un nuovo progetto
 *  2. Incolla il codice dal file google_apps_script.gs
 *  3. Clicca "Distribuisci" → "Nuova distribuzione" → tipo "App web"
 *     - Esegui come: "Me"
 *     - Chi ha accesso: "Chiunque"
 *  4. Copia l'URL della distribuzione (es. https://script.google.com/macros/s/ABC.../exec)
 *  5. Incollalo qui sotto al posto di INSERISCI_QUI_IL_TUO_URL
 */
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz4Lb9cVDVtYBl-z8cxc6KwwsnQUwPP953KmW58ALC1nTyT5hNcp_K_V9lPRGn4e6Pq/exec';

/**
 * Set in memoria che tiene traccia dei partecipanti già confermati
 * durante la sessione corrente del browser.
 * La chiave è "nome|cognome" tutto in minuscolo, così "Mario Rossi"
 * e "mario rossi" vengono trattati come la stessa persona.
 *
 * Nota: questo Set si azzera al ricaricamento della pagina.
 * Il controllo definitivo anti-duplicati avviene lato Google Apps Script.
 */
const iscritti = new Set();

/**
 * sanitizeInput(value)
 * Pulisce un campo di testo:
 *  1. Rimuove spazi iniziali e finali (.trim())
 *  2. Elimina qualsiasi carattere che NON sia una lettera
 *     (incluse lettere accentate italiane), uno spazio o un apostrofo.
 *     Regex: /[^a-zA-ZàèéìòùÀÈÉÌÒÙ '\-]/g
 *     Il \- alla fine permette i trattini (es. "Maria-Giovanna")
 *  3. Converte tutto in minuscolo
 *
 * Esempi:
 *   "Mario123!"  → "mario"
 *   "  Anna  "   → "anna"
 *   "D'Angelo"   → "d'angelo"
 *   "Jean-Paul"  → "jean-paul"
 *
 * @param {string} value - Valore grezzo del campo input
 * @returns {string} Valore pulito e in minuscolo
 */
function sanitizeInput(value) {
  return value
    .trim()
    .replace(/[^a-zA-ZàèéìòùÀÈÉÌÒÙ '\-]/g, '')  // solo lettere, spazi, apostrofi, trattini
    .toLowerCase();
}

/**
 * showFieldError(fieldId, message)
 * Mostra un messaggio di errore sotto un campo del form.
 * Cerca un elemento con id "{fieldId}-error" e ne imposta il testo.
 * Aggiunge anche il bordo rosso al campo stesso.
 *
 * @param {string} fieldId - ID del campo input (es. 'f-nome')
 * @param {string} message - Testo dell'errore da mostrare
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (field)   field.style.borderColor = '#e05a6a';
  if (errorEl) { errorEl.textContent = message; errorEl.style.display = 'block'; }
}

/**
 * clearFieldError(fieldId)
 * Nasconde il messaggio di errore e ripristina il bordo normale.
 *
 * @param {string} fieldId - ID del campo input
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (field)   field.style.borderColor = '';
  if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
}

/**
 * clearAllErrors()
 * Pulisce tutti i messaggi di errore del form prima di ogni submit.
 */
function clearAllErrors() {
  ['f-nome', 'f-cognome'].forEach(clearFieldError);
  const globalErr = document.getElementById('form-error-global');
  if (globalErr) { globalErr.textContent = ''; globalErr.style.display = 'none'; }
}

/**
 * showGlobalError(message)
 * Mostra un messaggio di errore globale (non legato a un singolo campo),
 * usato per il controllo duplicati.
 *
 * @param {string} message - Testo dell'errore
 */
function showGlobalError(message) {
  const globalErr = document.getElementById('form-error-global');
  if (globalErr) { globalErr.textContent = message; globalErr.style.display = 'block'; }
}

/**
 * Aggiorna il valore del campo in tempo reale mentre l'utente digita:
 * - Rimuove caratteri non validi istantaneamente
 * - Mostra il testo in minuscolo nel campo stesso
 * Questo evita che l'utente si accorga del problema solo al submit.
 */
document.addEventListener('DOMContentLoaded', () => {
  ['f-nome', 'f-cognome'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('input', () => {
      // Salva la posizione del cursore per non saltare alla fine dopo la pulizia
      const cursor = field.selectionStart;
      const cleaned = sanitizeInput(field.value);
      field.value = cleaned;
      // Ripristina la posizione del cursore (potrebbe essere cambiata)
      try { field.setSelectionRange(cursor, cursor); } catch(_) {}
      // Nasconde l'errore mentre l'utente sta correggendo
      clearFieldError(fieldId);
    });
  });
});

/**
 * submitForm()
 * Chiamata dal bottone "Confermo la mia presenza" nell'HTML.
 *
 * Flusso di validazione:
 *  1. Pulizia input (sanitizeInput): solo lettere, minuscolo
 *  2. Controllo campi vuoti → errore inline sotto il campo
 *  3. Controllo duplicati nel Set iscritti → errore globale
 *  4. Se tutto ok: aggiunge al Set, mostra successo, invia a Sheets
 */
async function submitForm() {
  // Pulisci eventuali errori precedenti
  clearAllErrors();

  // Leggi e sanifica i campi
  const nomeRaw     = document.getElementById('f-nome').value;
  const cognomeRaw  = document.getElementById('f-cognome').value;
  const messaggioRaw = document.getElementById('f-msg').value;

  const nome      = sanitizeInput(nomeRaw);
  const cognome   = sanitizeInput(cognomeRaw);
  // Messaggio: rimuove tag HTML/script, tronca a 300 caratteri
  const messaggio = messaggioRaw
    .trim()
    .replace(/<[^>]*>/g, '')           // rimuove qualsiasi tag HTML
    .replace(/[<>&"']/g, '')           // rimuove caratteri pericolosi residui
    .slice(0, 300)                     // max 300 caratteri
    || '—';

  // Aggiorna i campi con i valori sanificati (minuscolo, senza caratteri strani)
  document.getElementById('f-nome').value    = nome;
  document.getElementById('f-cognome').value = cognome;

  // ── VALIDAZIONE CAMPI VUOTI ─────────────────────────────
  let hasError = false;

  if (!nome) {
    showFieldError('f-nome', 'Il nome è obbligatorio e deve contenere solo lettere.');
    hasError = true;
  }
  if (!cognome) {
    showFieldError('f-cognome', 'Il cognome è obbligatorio e deve contenere solo lettere.');
    hasError = true;
  }
  if (hasError) return;

  // ── CONTROLLO DUPLICATI ─────────────────────────────────
  // La chiave è "nome|cognome" in minuscolo — case-insensitive
  const chiave = `${nome}|${cognome}`;

  if (iscritti.has(chiave)) {
    showGlobalError(
      `${capitalize(nome)} ${capitalize(cognome)} ha già confermato la presenza! 🌹`
    );
    return;
  }

  // ── TUTTO OK: registra e procedi ───────────────────────
  iscritti.add(chiave);

  // Disabilita il bottone per evitare invii doppi
  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Invio in corso...';

  // Mostra il nome con prima lettera maiuscola nel messaggio di successo
  const nomeDisplay    = capitalize(nome);
  const cognomeDisplay = capitalize(cognome);

  // Mostra subito il successo (UX ottimistica)
  document.getElementById('form-wrap').style.display = 'none';
  document.getElementById('success-name').textContent =
    `Grazie, ${nomeDisplay} ${cognomeDisplay}!`;
  document.getElementById('success-msg').classList.add('show');
  spawnConfetti();

  // ── INVIO A GOOGLE SHEETS ───────────────────────────────
  if (SHEETS_URL && SHEETS_URL !== 'INSERISCI_QUI_IL_TUO_URL') {
    try {
      const params = new URLSearchParams({
        nome:      nomeDisplay,
        cognome:   cognomeDisplay,
        messaggio,
        data: new Date().toLocaleString('it-IT', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      });

      await fetch(`${SHEETS_URL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors'   // necessario per Google Apps Script (vedi commento sopra)
      });

    } catch (err) {
      console.warn('Iscrizione non salvata su Sheets:', err);
    }
  } else {
    console.warn('⚠️ SHEETS_URL non configurato. Leggi le istruzioni in script.js');
  }
}

/**
 * capitalize(str)
 * Mette in maiuscolo la prima lettera di ogni parola.
 * Usato per visualizzare il nome in modo elegante nel messaggio
 * di successo, anche se l'input era tutto minuscolo.
 *
 * Esempi:
 *   "mario"        → "Mario"
 *   "maria grazia" → "Maria Grazia"
 *   "d'angelo"     → "D'Angelo"
 *
 * @param {string} str - Stringa in minuscolo
 * @returns {string} Stringa con iniziali maiuscole
 */
function capitalize(str) {
  return str.replace(/(^|\s|')[a-zàèéìòù]/g, c => c.toUpperCase());
}
