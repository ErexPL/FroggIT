const themeToggle = document.querySelector('.theme-toggle');
const authorSpan = document.querySelector('footer span');
let darkMode = localStorage.getItem('darkMode') === 'true';

AOS.init({
    duration: 1000
});

const updateTheme = () => {
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
};

updateTheme();
themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    updateTheme();
});

authorSpan.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    textarea.value = authorSpan.textContent;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    authorSpan.classList.add('copied');
            
    setTimeout(() => {
        authorSpan.classList.remove('copied');
    }, 2500);
});
