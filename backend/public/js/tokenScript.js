function getToken() {
  return localStorage.getItem("token");
}

//trebuie implementat la toate locurile de logout ceva de genul :
// <button onclick="logout()">Logout</button>

// // Function to parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function isTokenValid(token) {
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
    // const role = getUserRole(token);
    // if (role === "admin") {
    //   window.location.replace(window.location.origin + "/menuAdmin");
    // } else {
    window.location.replace(window.location.origin + "/menu");
    // }
  }
}

//cred ca poate fi generalizat aici dar nu stiu inca
// function roleValidation(requiredRole) {
//   try {
//     const role = getUserRole(token);
//     console.log("User role:", role);
//     if (role !== requiredRole) {
//       // Error message indicating lack of access
//       alert("Access denied: Please login as admin first.");
//       window.location.replace(window.location.origin + "/loginAdmin");
//     } else {
//       redirectIfAuthenticated();
//     }
//   } catch (error) {
//     console.error("Error during role validation:", error);
//     alert("It seems like you are logged out. Please login again!");
//   }
// }
// document.addEventListener("DOMContentLoaded", () => {
//   roleValidation("user");
// });

module.exports = { redirectIfAuthenticated, getUserRole, parseJwt };
