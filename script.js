// ============================================================
//  CONFIG — ganti PIN di sini
// ============================================================
const CORRECT_PIN = '1234';

// ============================================================
//  STATE
// ============================================================
let currentPin = '';
let locked = false;

// ============================================================
//  KEYPAD LOGIC
// ============================================================
function pressKey(num) {
  if (locked) return;
  if (currentPin.length >= 4) return;

  currentPin += num;
  updateDots();

  if (currentPin.length === 4) {
    locked = true;
    setTimeout(() => checkPin(), 200);
  }
}

function deleteKey() {
  if (locked) return;
  if (currentPin.length === 0) return;
  currentPin = currentPin.slice(0, -1);
  updateDots();
  hideError();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('d' + i);
    if (i < currentPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  }
}

function checkPin() {
  if (currentPin === CORRECT_PIN) {
    showBloom();
  } else {
    showError();
    // Reset after shake animation
    setTimeout(() => {
      currentPin = '';
      updateDots();
      hideError();
      locked = false;
    }, 1200);
  }
}

function showError() {
  const el = document.getElementById('pin-error');
  el.classList.remove('hidden');
  // Re-trigger shake animation
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = '';
}

function hideError() {
  document.getElementById('pin-error').classList.add('hidden');
}

// ============================================================
//  BLOOM ANIMATION → then show Page 2
// ============================================================
function showBloom() {
  const overlay = document.getElementById('bloom-overlay');
  overlay.classList.remove('hidden');

  // After bloom animation completes, transition to page 2
  setTimeout(() => {
    overlay.classList.add('fade-out');
    showPageMain();
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('fade-out');
    }, 900);
  }, 2800);
}

function showPageMain() {
  const login = document.getElementById('page-login');
  const main  = document.getElementById('page-main');

  login.classList.remove('active');
  login.classList.add('hidden');

  main.classList.remove('hidden');
  // Trigger reflow then add active
  main.offsetHeight;
  main.classList.add('active');
}
