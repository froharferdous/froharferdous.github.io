
/* ==========================================================
   01. PERSONAL DETAILS

   Update these values to change the contact links throughout
   the website.

   Email:
       Enter your actual email address without "mailto:".

   LinkedIn:
       Enter your complete LinkedIn profile URL.

   GitHub:
       Enter your complete GitHub profile URL.

   Resume:
       Enter the relative path to your resume PDF.
   ========================================================== */

const config = {

    linkedin: 'https://www.linkedin.com/in/frohar-ferdous/',

    github: 'https://github.com/froharferdous',

    resume: '/assets/frohar-ferdous-resume.pdf'

};


/* ==========================================================
   02. CONTACT LINK LABELS
   ========================================================== */

const labels = {

    linkedin: 'LinkedIn',

    github: 'GitHub',

    resume: 'Download resume'

};


/* ==========================================================
   03. ACTIVATE CONTACT AND SOCIAL MEDIA LINKS

   Finds every HTML element with a data-link attribute.

   For example:

       <a data-link="linkedin">LinkedIn</a>

   Updates the link using the corresponding configuration
   value above.
   ========================================================== */

document.querySelectorAll('[data-link]').forEach(link => {

    const key = link.dataset.link;

    const value = config[key].trim();


    /* Leave empty configuration values inactive */

    if (!value) {
        return;
    }


    /* Set the link destination */

    if (key === 'email') {

        link.href = 'mailto:' + value;

    } else {

        link.href = value;

    }


    /* Activate the link */

    link.removeAttribute('aria-disabled');


    /* Update the displayed text */

    if (key === 'email') {

        link.textContent = value;

    } else {

        link.textContent = labels[key];

    }


    /* Enable resume downloading */

    if (key === 'resume') {

        link.setAttribute('download', '');

    }


    /* Open social media links in a separate browser tab */

    if (key === 'linkedin' || key === 'github') {

        link.target = '_blank';

        link.rel = 'noopener noreferrer';

        link.setAttribute(
            'aria-label',
            labels[key] + ' (opens in a new tab)'
        );

    }

});


/* ==========================================================
   04. RESPONSIVE NAVIGATION

   Handles the mobile navigation menu and automatically
   adjusts the navigation when the browser is resized.
   ========================================================== */

const menu = document.getElementById('menu');

const nav = document.getElementById('navigation');

const mobile = matchMedia('(max-width: 640px)');


/* Open or close the mobile navigation */

function setMenu(open) {

    menu.setAttribute(
        'aria-expanded',
        String(open)
    );

    nav.hidden = !open;

}


/* Synchronise the navigation with the screen size */

function syncMenu() {

    menu.hidden = !mobile.matches;

    setMenu(!mobile.matches);

}


/* Initialise navigation */

syncMenu();


/* Update navigation when screen width changes */

mobile.addEventListener('change', syncMenu);


/* Toggle navigation when the menu button is clicked */

menu.addEventListener('click', () => {

    const isOpen =
        menu.getAttribute('aria-expanded') === 'true';

    setMenu(!isOpen);

});


/* ==========================================================
   05. CLOSE MOBILE MENU AFTER SECTION SELECTION
   ========================================================== */

nav.addEventListener('click', event => {

    const link = event.target.closest('a');


    /* Only close the navigation on mobile devices */

    if (link && mobile.matches) {

        setMenu(false);


        /* Find the selected website section */

        const section = document.querySelector(
            link.hash
        );


        /* Move keyboard focus to the selected section */

        if (section) {

            section.setAttribute('tabindex', '-1');

            section.focus({
                preventScroll: true
            });

        }

    }

});


/* ==========================================================
   06. KEYBOARD NAVIGATION

   Pressing Escape closes the mobile navigation menu.
   ========================================================== */

document.addEventListener('keydown', event => {

    if (
        event.key === 'Escape' &&
        mobile.matches &&
        !nav.hidden
    ) {

        setMenu(false);

        menu.focus();

    }

});


/* ==========================================================
   07. PROJECT CATEGORY FILTERING

   Each project has a data-category attribute in index.html.

   Available categories:

       design
       analysis
       energy
       embedded

   Projects can belong to multiple categories, for example:

       data-category="design analysis"
   ========================================================== */

const filters = document.getElementById('filters');

const status = document.getElementById('filter-status');

const cards = [
    ...document.querySelectorAll('.project')
];


/* Enable project filtering */

filters.hidden = false;

status.hidden = false;


/* ==========================================================
   08. FILTER PROJECTS
   ========================================================== */

function filter(category) {

    let count = 0;


    /* Check each project against the selected category */

    cards.forEach(card => {

        const categories =
            card.dataset.category.split(' ');

        const show =
            category === 'all' ||
            categories.includes(category);


        /* Display or hide the project */

        card.hidden = !show;


        /* Count visible projects */

        if (show) {

            count++;

        }

    });


    /* Update the selected filter button */

    filters.querySelectorAll('button').forEach(button => {

        const selected =
            button.dataset.filter === category;

        button.setAttribute(
            'aria-pressed',
            String(selected)
        );

    });


    /* Update the visible project count */

    status.textContent =
        `Showing ${count} of ${cards.length} projects`;

}


/* ==========================================================
   09. HANDLE FILTER BUTTON CLICKS
   ========================================================== */

filters.addEventListener('click', event => {

    const button = event.target.closest(
        'button[data-filter]'
    );

    if (button) {

        filter(button.dataset.filter);

    }

});


/* Show all projects when the website first loads */

filter('all');


/* ==========================================================
   10. AUTOMATIC COPYRIGHT YEAR

   Automatically displays the current year in the footer.
   ========================================================== */

document.getElementById('year').textContent =
    new Date().getFullYear();


/* ==========================================================
   WEBSITE APPEARANCE

   - Automatic system theme detection
   - Manual light and dark mode selection
   - Persistent visitor preferences
   - Live system theme synchronisation
   ========================================================== */

(() => {

    const root = document.documentElement;

    const themeSelect =
        document.getElementById('theme-select');

    const systemTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    const storageKey = 'portfolio-theme';

    const validThemes = [
        'system',
        'light',
        'dark'
    ];


    /* ======================================================
       RETRIEVE SAVED PREFERENCE
       ====================================================== */

    function getSavedTheme() {

        try {

            const savedTheme =
                localStorage.getItem(storageKey);

            return validThemes.includes(savedTheme)
                ? savedTheme
                : 'system';

        } catch {

            return 'system';

        }

    }


    /* ======================================================
       SAVE THEME PREFERENCE
       ====================================================== */

    function saveTheme(preference) {

        try {

            localStorage.setItem(
                storageKey,
                preference
            );

        } catch {

            // Theme selection remains functional
            // if local storage is unavailable.

        }

    }


    /* ======================================================
       DETERMINE CURRENT THEME
       ====================================================== */

    let themePreference = getSavedTheme();


    function resolveTheme(preference) {

        if (preference === 'system') {

            return systemTheme.matches
                ? 'dark'
                : 'light';

        }

        return preference;

    }


    /* ======================================================
       APPLY THE SELECTED THEME
       ====================================================== */

    function applyTheme(preference) {

        const theme = resolveTheme(preference);


        /* Update the website theme */

        root.setAttribute(
            'data-theme',
            theme
        );


        /* Synchronise the theme selector */

        if (themeSelect) {

            themeSelect.value = preference;

        }


        /* Update mobile browser theme colour */

        const themeMeta = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeMeta) {

            const background = getComputedStyle(root)
                .getPropertyValue('--paper')
                .trim();

            if (background) {

                themeMeta.setAttribute(
                    'content',
                    background
                );

            }

        }

    }


    /* ======================================================
       INITIALISE WEBSITE APPEARANCE
       ====================================================== */

    applyTheme(themePreference);


    /* ======================================================
       HANDLE MANUAL THEME SELECTION
       ====================================================== */

    if (themeSelect) {

        themeSelect.addEventListener(
            'change',
            () => {

                const selectedTheme =
                    themeSelect.value;

                if (!validThemes.includes(selectedTheme)) {

                    return;

                }

                themePreference = selectedTheme;

                applyTheme(themePreference);

                saveTheme(themePreference);

            }
        );

    }


    /* ======================================================
       FOLLOW SYSTEM THEME CHANGES
       ====================================================== */

    function handleSystemThemeChange() {

        if (themePreference === 'system') {

            applyTheme('system');

        }

    }


    if (typeof systemTheme.addEventListener === 'function') {

        systemTheme.addEventListener(
            'change',
            handleSystemThemeChange
        );

    } else if (typeof systemTheme.addListener === 'function') {

        systemTheme.addListener(
            handleSystemThemeChange
        );

    }


    /* ======================================================
       SYNCHRONISE APPEARANCE BETWEEN BROWSER TABS
       ====================================================== */

    window.addEventListener(
        'storage',
        event => {

            if (
                event.key === storageKey ||
                event.key === null
            ) {

                themePreference = getSavedTheme();

                applyTheme(themePreference);

            }

        }
    );

})();
