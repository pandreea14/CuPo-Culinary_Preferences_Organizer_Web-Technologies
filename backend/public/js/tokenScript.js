function getToken() {
    return localStorage.getItem('token');
}

function isTokenValid(token) {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expiryTime;
    } catch (error) {
        return false;
    }
}

function redirectIfAuthenticated() {
    const token = getToken();
    if (token && isTokenValid(token)) {
            window.location.href = window.location.origin + '/menu';
    }
}

module.exports = { redirectIfAuthenticated };
