const themeToggle = document.querySelector('.theme-toggle');
const authorSpan = document.querySelector('footer span');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');
let darkMode = localStorage.getItem('darkMode') === 'true';

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

hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    if (mobileNav.classList.contains('active')) {
        hamburgerMenu.querySelector('i').classList.replace('fa-bars', 'fa-xmark');
    } else {
        hamburgerMenu.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
    }
});

mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburgerMenu.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
    });
});

const checkWindowWidth = () => {
    if (window.innerWidth > 768) {
        mobileNav.classList.remove('active');
        mobileNav.classList.remove('mobile-nav');
        hamburgerMenu.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
    } else if (window.innerWidth <= 768) {
        mobileNav.classList.add('mobile-nav');
    }
};

window.addEventListener('resize', checkWindowWidth);

window.addEventListener('DOMContentLoaded', checkWindowWidth);

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
