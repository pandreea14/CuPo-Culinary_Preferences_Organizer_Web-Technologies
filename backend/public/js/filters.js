//event listener pentru filtre
document.addEventListener('DOMContentLoaded', (event) => {
    const rangeInput = document.getElementById('price-filter');
    const minValueDisplay = document.getElementById('min-value');
  
    rangeInput.addEventListener('input', () => {
        minValueDisplay.textContent = rangeInput.value;
    });
  });