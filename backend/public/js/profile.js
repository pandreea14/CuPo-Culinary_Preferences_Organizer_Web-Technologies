async function fetchProfile() {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
            throw new Error('Not authenticated');
        }

        const user = await response.json();
        document.querySelector('.text p').textContent = `User email: ${user.email}`;
    } catch (error) {
        console.error('Error fetching profile:', error);
        window.location.href = '/login';
    }
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        fetch('/logout', { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logout failed');
                }
                alert('Logout successful');
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchProfile();
});
