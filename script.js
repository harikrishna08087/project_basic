// ===================================
// ONBOARDING FLOW - JAVASCRIPT
// ===================================

// State Management
let currentScreen = 0;
const totalScreens = 3;

// DOM Elements
const screenWrapper = document.getElementById('screenWrapper');
const screens = document.querySelectorAll('.screen');
const dots = document.querySelectorAll('.dot');
const nextButton = document.getElementById('nextButton');
const skipButton = document.getElementById('skipButton');
const logoContainer = document.getElementById('logoContainer');

// Screen 1 Buttons
const getStartedButton = document.getElementById('getStartedButton');
const loginButton = document.getElementById('loginButton');

// Screen 3 Buttons
const finishButton = document.getElementById('finishButton');
const loginButton2 = document.getElementById('loginButton2');

// ===================================
// SCREEN NAVIGATION
// ===================================

/**
 * Navigate to a specific screen
 * @param {number} screenIndex - Index of the screen to show (0-2)
 */
function goToScreen(screenIndex) {
    // Validate screen index
    if (screenIndex < 0 || screenIndex >= totalScreens) {
        return;
    }

    const previousScreen = currentScreen;

    // Update screens
    screens.forEach((screen, index) => {
        screen.classList.remove('active', 'exit-left');

        if (index === screenIndex) {
            // New active screen
            screen.classList.add('active');
        } else if (index === previousScreen) {
            // Exiting screen
            if (screenIndex > previousScreen) {
                screen.classList.add('exit-left');
            }
        }
    });

    // Update pagination dots
    updateDots(screenIndex);

    // Update next button text
    updateNextButton(screenIndex);

    // Hide/show logo based on screen
    updateLogo(screenIndex);

    // Update current screen
    currentScreen = screenIndex;

    // Log analytics
    logAnalytics('screen_view', {
        screen_index: screenIndex,
        screen_name: getScreenName(screenIndex)
    });
}

/**
 * Navigate to the next screen
 */
function goToNextScreen() {
    if (currentScreen < totalScreens - 1) {
        goToScreen(currentScreen + 1);
    } else {
        // On last screen, complete onboarding
        completeOnboarding();
    }
}

/**
 * Navigate to the previous screen
 */
function goToPreviousScreen() {
    if (currentScreen > 0) {
        goToScreen(currentScreen - 1);
    }
}

/**
 * Update pagination dots
 * @param {number} activeIndex - Index of the active dot
 */
function updateDots(activeIndex) {
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Update next button text based on current screen
 * @param {number} screenIndex - Current screen index
 */
function updateNextButton(screenIndex) {
    const buttonText = nextButton.querySelector('.button-text');

    if (screenIndex === totalScreens - 1) {
        buttonText.textContent = 'Get Started';
    } else {
        buttonText.textContent = 'Next';
    }
}

/**
 * Update logo visibility based on screen
 * @param {number} screenIndex - Current screen index
 */
function updateLogo(screenIndex) {
    if (screenIndex === 0) {
        logoContainer.classList.remove('hidden');
    } else {
        logoContainer.classList.add('hidden');
    }
}

/**
 * Get screen name for analytics
 * @param {number} screenIndex - Screen index
 * @returns {string} Screen name
 */
function getScreenName(screenIndex) {
    const screenNames = ['welcome', 'service_providers', 'management_tools'];
    return screenNames[screenIndex] || 'unknown';
}

// ===================================
// ONBOARDING COMPLETION
// ===================================

/**
 * Complete onboarding and navigate to main app
 */
function completeOnboarding() {
    console.log('Onboarding completed! Redirecting to main app...');

    // Log completion
    logAnalytics('onboarding_completed', {
        screens_viewed: currentScreen + 1,
        timestamp: new Date().toISOString()
    });

    // Add exit animation
    animateExit(() => {
        // In a real app, navigate to main app
        // window.location.href = 'signup.html';

        // For demo purposes
        alert('🎉 Welcome to Event Workforce!\n\nOnboarding completed successfully.');

        // Reset to first screen for demo
        resetOnboarding();
    });
}

/**
 * Skip onboarding and go directly to the app
 */
function skipOnboarding() {
    console.log('Onboarding skipped!');

    // Log skip
    logAnalytics('onboarding_skipped', {
        current_screen: currentScreen,
        screen_name: getScreenName(currentScreen)
    });

    // Add exit animation
    animateExit(() => {
        // In a real app, navigate to main app
        // window.location.href = 'app.html';

        // For demo purposes
        alert('⚡ Skipped to main app!');

        // Reset to first screen for demo
        resetOnboarding();
    });
}

/**
 * Navigate to sign-up flow
 */
function handleGetStarted() {
    console.log('Get Started clicked');

    logAnalytics('get_started_clicked', {
        source: getScreenName(currentScreen)
    });

    animateExit(() => {
        alert('🎉 Redirecting to sign-up...');
        resetOnboarding();
    });
}

/**
 * Navigate to login page
 */
function handleLogin() {
    console.log('Log In clicked');

    logAnalytics('login_clicked', {
        source: getScreenName(currentScreen)
    });

    animateExit(() => {
        alert('👋 Redirecting to login...');
        resetOnboarding();
    });
}

/**
 * Reset onboarding to first screen (for demo purposes)
 */
function resetOnboarding() {
    const body = document.body;
    body.style.opacity = '1';
    body.style.transform = 'scale(1)';
    goToScreen(0);
}

// ===================================
// ANIMATIONS
// ===================================

/**
 * Animate page exit
 * @param {Function} callback - Function to call after animation
 */
function animateExit(callback) {
    const body = document.body;
    body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    body.style.opacity = '0';
    body.style.transform = 'scale(0.95)';

    setTimeout(() => {
        callback();
    }, 400);
}

/**
 * Add ripple effect to buttons on click
 */
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// EVENT LISTENERS
// ===================================

// Next Button
nextButton.addEventListener('click', (e) => {
    addRippleEffect(nextButton, e);
    setTimeout(goToNextScreen, 100);
});

// Skip Button
skipButton.addEventListener('click', skipOnboarding);

// Screen 1 Buttons
if (getStartedButton) {
    getStartedButton.addEventListener('click', (e) => {
        addRippleEffect(getStartedButton, e);
        setTimeout(handleGetStarted, 100);
    });
}

if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        addRippleEffect(loginButton, e);
        setTimeout(handleLogin, 100);
    });
}

// Screen 3 Buttons
if (finishButton) {
    finishButton.addEventListener('click', (e) => {
        addRippleEffect(finishButton, e);
        setTimeout(handleGetStarted, 100);
    });
}

if (loginButton2) {
    loginButton2.addEventListener('click', (e) => {
        addRippleEffect(loginButton2, e);
        setTimeout(handleLogin, 100);
    });
}

// Pagination Dots - Click Navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToScreen(index);
    });

    // Accessibility
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to screen ${index + 1}`);

    dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToScreen(index);
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        goToNextScreen();
    } else if (e.key === 'ArrowLeft') {
        goToPreviousScreen();
    } else if (e.key === 'Enter') {
        if (currentScreen === 0) {
            handleGetStarted();
        } else {
            goToNextScreen();
        }
    } else if (e.key === 'Escape') {
        skipOnboarding();
    }
});

// Touch Gestures - Swipe Navigation
let touchStartX = 0;
let touchEndX = 0;

document.body.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.body.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous screen
            goToPreviousScreen();
        } else {
            // Swipe left - go to next screen
            goToNextScreen();
        }
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Log analytics event (placeholder for real analytics)
 * @param {string} eventName - Name of the event
 * @param {object} data - Event data
 */
function logAnalytics(eventName, data) {
    console.log(`[Analytics] ${eventName}:`, data);
    // In production, integrate with analytics service
    // Example: gtag('event', eventName, data);
}

/**
 * Check if user has seen onboarding before
 */
function checkFirstVisit() {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    if (hasSeenOnboarding) {
        console.log('Returning user - onboarding already seen');
        // Optionally show a "Skip to app" option
    } else {
        console.log('First time user - showing onboarding');
        localStorage.setItem('hasSeenOnboarding', 'true');
    }
}

/**
 * Preload images for smooth transitions
 */
function preloadImages() {
    const imageUrls = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCpc6kjYkfCulp5O7iBpM3FfvGLo5T4zI-bcB9Spv0bWYU3trv4SnplSchtoR_QwbYxeiFlqP5wm1DC9XP28cSG66vyoOHIonHF3hUJ4n9hw0Jyhk23j8wKlhkozfi2ogsVpaUXFCvHFY9HZNx1rD6rn4dkLlOO_c8LO5ARmnuETvUHHt3OLOD5B0L3OLulN9ui_o02IoJqKbz1Ep7jABQFtcfUu3dFdampk21pQXpeo5B7DSzvz2JSmGFMHfft3VS-hWlHjGsCxA',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD2W6aq3fuyN5QogAsNCyTgMw1UsMbrMjyVOxtXpdusCMHwmzo6i8GyI-RzO4i3Ew8NUPgKAMW5SOswXrYQVaJVRRHPBBXSophSn1zgEpkLcVrLT8cWUio74XiV5XLhKFPL_befjgB3lH1FdVy2Fl8HhNG9OqS4P-wswvg3sXDrKg4h3kqTuYCcNzHQaxtfcp8HuFxMIMh-QNJ-mQUIT8LAMHynb3mE7pWdorxH6V6j7tWR-Zrsyl13Ci-QD0oWkAIfn0wYVN2dqw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCmr0QlGq4_wqiHWQI-olf3agvOWTs18qVpTbCMFbOEY2Va9py_UnaRB3VANs2VkK7CiWWDb9WcHJT39xYKMxpNyHiyp3inOt9x_oDgzbxeC5hHOpF-fMLgOIUO-dr1528mgftju5B-2MPVup-K5g19IQz6KTpvliYzgYQEsOEaK2fO-N44-5MQ1YqnJq7w3DEoQI7Q5zlxqTAjwIzlqc-in5GlHZzkE0cHwpSJ7gIP5p7xnJIn3Vx0_LVFq1oSDc8DbTxAuM1D9w',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHdH2edrTf2PN5s2a9JEcWxZyzNavY3z4uQnWnOxNlIEwScOCN0WkSvcrFbKkDjuObHiMrr13GpD3XkTyQBZgE7jYin4r-MGxDoZ-3AUQgpbDEO6nA80gA4j7tOF-LaIWxDZnxRVIFykfUd16ZqcO-T93yLPSqZmTKyBcXmL9FfG-B1dPyWfVj0JToupaVKVysfrSahwv--PYjsX_rl2VdeCVq_10LaxpzKlwyixsUH_r5U-kOmNu7ppLn68fev9GYzr8UKDvIig',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize the onboarding experience
 */
function init() {
    console.log('Onboarding initialized');

    // Check if first visit
    checkFirstVisit();

    // Preload images
    preloadImages();

    // Set initial screen
    goToScreen(0);

    // Add accessibility attributes
    nextButton.setAttribute('aria-label', 'Next screen');
    skipButton.setAttribute('aria-label', 'Skip onboarding');

    // Log page view
    logAnalytics('onboarding_started', {
        timestamp: new Date().toISOString()
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
