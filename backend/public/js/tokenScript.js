export function getToken() {
  return localStorage.getItem("token");
}

// <button onclick="logout()">Logout</button>
export function logout() {
  if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      window.location.replace(window.location.origin + '/login');
  }
}

// Function to parse JWT token
export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() >= expiryTime) {
      alert("Your session has expired. Please log in again.");
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export function roleValidation(requiredRole) {
  try {
    const token = getToken();
    const role = getUserRole(token);
    console.log('User role:', role);
    if (!role) {
      console.log("Role is empty. Staying on the login page.");
      return false;
    }
    if (role === requiredRole) {
      console.log("Role is valid. Proceeding to the next page.");
      return true;
    } else {
      alert("Access denied: Please login as admin first.");
      window.location.replace(window.location.origin + "/login");
      return false;
    }
  } catch (error) {
    console.error('Error during role validation:', error);
    alert("It seems like you are logged out. Please login again!");
    window.location.replace(window.location.origin + "/login");
    return false;
  }
}

export function getUserRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
}

export function protectPage() {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
      window.location.replace(window.location.origin + '/login');
  }
}

export function redirectIfAuthenticated() {
  const token = getToken();
  if (token && isTokenValid(token) && getUserRole(token) === "user") {
    window.location.replace(window.location.origin + "/menu");
  } else if (token && isTokenValid(token) && getUserRole(token) === "admin") {
    window.location.replace(window.location.origin + "/menuAdmin");
  }
}