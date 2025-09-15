// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('converter-form');
  const input = document.getElementById('temp-input');
  const fromUnit = document.getElementById('from-unit');
  const toUnit = document.getElementById('to-unit');
  const result = document.getElementById('result');
  const swapBtn = document.getElementById('swap-btn');
  const clearBtn = document.getElementById('clear-btn');

  // Helper: parse input (allow comma -> dot)
  function parseTemperature(str) {
    if (typeof str !== 'string') return NaN;
    const normalized = str.trim().replace(',', '.');
    const num = parseFloat(normalized);
    return Number.isFinite(num) ? num : NaN;
  }

  // Core conversion
  function convertTemp(value, from, to) {
    if (from === to) return value; // if same unit

    let c; // intermediate Celsius
    switch (from) {
      case 'c':
        c = value;
        break;
      case 'f':
        c = (value - 32) * 5 / 9;
        break;
      case 'k':
        c = value - 273.15;
        break;
      default:
        throw new Error('Unknown from unit');
    }

    let out;
    switch (to) {
      case 'c':
        out = c;
        break;
      case 'f':
        out = (c * 9 / 5) + 32;
        break;
      case 'k':
        out = c + 273.15;
        break;
      default:
        throw new Error('Unknown to unit');
    }
    return out;
  }

  // Format with safe rounding
  function fmt(num) {
    return Number.parseFloat(num.toFixed(2)).toString(); // 2 decimals, no trailing zeros
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    result.textContent = ''; // clear
    const raw = input.value;
    const value = parseTemperature(raw);

    if (Number.isNaN(value)) {
      result.textContent = 'Please enter a valid number (e.g. -10.5 or 36.6).';
      result.style.color = 'crimson';
      return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;
    try {
      const out = convertTemp(value, from, to);
      const units = { c: '°C', f: '°F', k: 'K' };
      result.style.color = ''; // reset
      result.innerHTML = `<strong>${fmt(out)} ${units[to]}</strong> (from ${fmt(value)} ${units[from]})`;
    } catch (err) {
      result.textContent = 'Conversion error: ' + err.message;
    }
  });

  // Swap units button
  swapBtn.addEventListener('click', () => {
    const a = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = a;
  });

  // Clear form
  clearBtn.addEventListener('click', () => {
    input.value = '';
    result.textContent = '';
    fromUnit.value = 'c';
    toUnit.value = 'f';
    input.focus();
  });
});
