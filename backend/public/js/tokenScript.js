export function getToken() {
  return getCookie("token");
  // return localStorage.getItem('token');
}

export function logout() {
  if (confirm("Are you sure you want to logout?")) {
      eraseCookie('token');
      localStorage.removeItem('token');
      window.location.replace(window.location.origin + '/login');
  }
}

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
  console.log('role:', getUserRole(token));
  if (token && isTokenValid(token) && getUserRole(token) === 'user') {
    window.location.replace(window.location.origin + "/menu");
  } else if (token && isTokenValid(token) && getUserRole(token) === 'admin') {
    window.location.replace(window.location.origin + "/menuAdmin");
  }
}



// Set a cookie
export async function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

// Delete a cookie
function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}
