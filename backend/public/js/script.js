document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
  }

  const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send data as JSON
  });

  const result = await response.json();
  alert(result.message);
});
