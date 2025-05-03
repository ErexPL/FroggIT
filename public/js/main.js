const themeToggle = document.querySelector('.theme-toggle');
const authorSpan = document.querySelector('footer span');
let darkMode = localStorage.getItem('darkMode') === 'true';

AOS.init({
    duration: 1000,
    once: true,
    mirror: false
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
    }, 3000);
});

const form = document.querySelector('form');
if (form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('error');
        });
        
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.classList.remove('error');
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            const submitBtn = form.querySelector('input[type="submit"]');
            submitBtn.value = 'Wysłano!';
            submitBtn.style.backgroundColor = 'var(--primary-color)';
            setTimeout(() => {
                form.reset();
                submitBtn.value = 'Wyślij zgłoszenie';
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }
    });
}
