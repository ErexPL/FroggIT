const themeToggle = document.querySelector('.theme-toggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

const updateTheme = () => {
    if (darkMode) {
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        document.documentElement.style.setProperty('--white-color', '#282830');
        document.documentElement.style.setProperty('--light-color', '#181810');
        document.documentElement.style.setProperty('--dark-color', '#f8ffff');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
    } else {
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        document.documentElement.style.setProperty('--white-color', '#f8ffff');
        document.documentElement.style.setProperty('--light-color', '#e0f0f0');
        document.documentElement.style.setProperty('--dark-color', '#282830');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
};

if (themeToggle) {
    updateTheme();

    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode);
        updateTheme();
    });
}