function getToken() {
  return localStorage.getItem("token");
}

//trebuie implementat la toate locurile de logout ceva de genul :
// <button onclick="logout()">Logout</button>


function isTokenValid(token) {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expiryTime;
  } catch (error) {
    return false;
  }
}

function getUserRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
}

function redirectIfAuthenticated() {
  const token = getToken();
  if (token && isTokenValid(token)) {
    const role = getUserRole(token);
    if (role === "admin") {
      window.location.replace(window.location.origin + "/menuAdmin");
    } else {
      window.location.replace(window.location.origin + "/menu");
    }
  }
}

module.exports = { redirectIfAuthenticated };
