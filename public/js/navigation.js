const pageCache = {};
const routes = ['/', '/gallery', '/info', '/form'];
let currentPage = window.location.pathname;
let pagesLoaded = 0;
let totalPages = routes.length;

const pageStyles = {
    '/': '/css/index.css',
    '/gallery': '/css/gallery.css',
    '/info': '/css/info.css',
    '/form': '/css/form.css'
};

const progressFill = document.querySelector('.progress-fill');
const loadingText = document.querySelector('.loading-text');
const loadingScreen = document.querySelector('.loading-screen');
const pageContent = document.getElementById('page-content');

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    if (window.AOS) {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            disable: false
        });
    }

    initializeNavLinks();
    
    const currentUrl = window.location.pathname || '/';
    pageCache[currentUrl] = document.documentElement.outerHTML;
    pagesLoaded++;
    
    preloadAllPages();
});

function initializeNavLinks() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            navigateTo(href);
        });
    });
}

function navigateTo(url) {
    if (url === currentPage) return;
    
    document.querySelectorAll('nav a').forEach(navLink => {
        if (navLink.getAttribute('href') === url) {
            navLink.classList.add('active');
        } else {
            navLink.classList.remove('active');
        }
    });

    if (pageContent) {
        pageContent.style.opacity = 0;
        
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        
        updatePageStylesheet(url);
        
        setTimeout(() => {
            if (pageCache[url]) {
                updatePageContent(url);
                
                window.history.pushState({}, '', url);
                currentPage = url;

                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 50);
            } else {
                window.location.href = url;
            }
        }, 50);
    }
}

function updatePageStylesheet(url) {
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]:not([href*="font-awesome"]):not([href*="aos"]):not([href="/css/style.css"]):not([href="/css/loading.css"])');
    
    existingLinks.forEach(link => {
        if (Object.values(pageStyles).some(style => link.getAttribute('href') === style)) {
            link.remove();
        }
    });
    
    if (pageStyles[url]) {
        const newStylesheet = document.createElement('link');
        newStylesheet.rel = 'stylesheet';
        newStylesheet.href = pageStyles[url];
        document.head.appendChild(newStylesheet);
    }
}

function updatePageContent(url) {
    if (!pageCache[url]) return;
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageCache[url], 'text/html');
        
        const newPageContent = doc.getElementById('page-content');
        if (!newPageContent) throw new Error('Page content element not found');
        
        const newHtml = newPageContent.innerHTML;
        pageContent.innerHTML = newHtml;
        
        document.title = doc.title;
        
        if (window.AOS) {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.removeAttribute('data-aos-animate');
                el.classList.remove('aos-animate');
            });
            
            AOS.init({
                duration: 1000,
                once: true,
                mirror: false,
                disable: false
            });
            
            setTimeout(() => {
                AOS.refresh();
            }, 150);
        }
        
        const form = document.querySelector('form');
        if (form) {
            initializeFormEvents(form);
        }
        
        setTimeout(() => {
            pageContent.style.transition = '0.3s ease-in-out';
            pageContent.style.opacity = 1;
            setTimeout(() => {
                pageContent.style.transition = 'none';
            }, 300);
        }, 100);
    } catch (error) {
        console.error("Error updating page content:", error);
        window.location.href = url;
    }
}

function initializeFormEvents(form) {
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

async function fetchPage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        
        const html = await response.text();
        pageCache[url] = html;
        
        updateLoadingProgress();
    } catch (error) {
        console.error('Error loading page:', error);
        updateLoadingProgress();
    }
}

function updateLoadingProgress() {
    pagesLoaded++;
    const progress = Math.min((pagesLoaded / totalPages) * 100, 100);
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (loadingText) {
        loadingText.textContent = `Loading... ${Math.round(progress)}%`;
    }
    
    if (pagesLoaded >= totalPages) {
        setTimeout(hideLoadingScreen, 500);
    }
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }
}

function preloadAllPages() {
    routes.forEach(route => {
        if (route !== window.location.pathname) {
            fetchPage(route);
        }
    });
}

window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname);
});
