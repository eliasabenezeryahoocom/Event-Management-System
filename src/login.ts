(() => {
    // Function to handle login
    function handleLogin(event: Event): void {
      event.preventDefault(); // Prevent form submission and page reload
  
      const emailInput = document.getElementById(
        'inputEmail4',
      ) as HTMLInputElement | null;
      const passwordInput = document.getElementById(
        'inputPassword4',
      ) as HTMLInputElement | null;
  
      if (!emailInput || !passwordInput) {
        console.error('Email or password input fields are missing.');
        return;
      }
  
      const email = emailInput.value.trim();
      const password = passwordInput.value;
  
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
  
      // Make a POST request to the backend for login
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Login successful! Redirecting to the home page...');
            window.location.href = '../index.html'; // Redirect to the home page
          } else {
            alert(data.message || 'Login failed. Please check your credentials and try again.');
          }
        })
        .catch((error) => {
          console.error('Error during login:', error);
          alert('An error occurred. Please try again later.');
        });
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
  
      if (form) {
        form.addEventListener('submit', handleLogin);
      }
    });
  })();
  