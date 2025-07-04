// DOM Elements
const themeToggleBtn = document.querySelector('.theme-toggle');
const dayButtons = document.querySelectorAll('.buttons button');
const divisionButtons = document.querySelectorAll('.division-buttons button');
const pages = document.querySelectorAll('.page');
const daySchedules = document.querySelectorAll('.day-schedule');
const divisions = document.querySelectorAll('.division');

// Constants
const THEME_KEY = 'darkTheme';
const ACTIVE_CLASS = 'active';

/**
 * Shows the selected day schedule and hides others
 * @param {string} dayId - ID of the day to show
 * @param {Event} event - Click event
 */
function showDay(dayId, event) {
  try {
    // Update active day button
    dayButtons.forEach(btn => btn.classList.remove(ACTIVE_CLASS));
    event.target.classList.add(ACTIVE_CLASS);
    
    // Show selected day schedule
    daySchedules.forEach(schedule => schedule.classList.remove(ACTIVE_CLASS));
    const selectedDay = document.getElementById(dayId);
    if (selectedDay) {
      selectedDay.classList.add(ACTIVE_CLASS);
      
      // Reset to first division when changing days
      showDivision(divisions[0].id, divisionButtons[0]);
    } else {
      console.error(`Day schedule with ID ${dayId} not found`);
    }
  } catch (error) {
    console.error('Error in showDay:', error);
  }
}

/**
 * Shows the selected page and hides others
 * @param {string} pageId - ID of the page to show
 */
function showPage(pageId) {
  try {
    pages.forEach(page => page.classList.remove(ACTIVE_CLASS));
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
      selectedPage.classList.add(ACTIVE_CLASS);
      
      // If showing schedule, ensure a day is selected
      if (pageId === 'schedule') {
        const activeDay = document.querySelector('.day-schedule.active');
        if (!activeDay) {
          daySchedules[0].classList.add(ACTIVE_CLASS);
          dayButtons[0].classList.add(ACTIVE_CLASS);
        }
      }
    } else {
      console.error(`Page with ID ${pageId} not found`);
    }
  } catch (error) {
    console.error('Error in showPage:', error);
  }
}

/**
 * Shows the selected division and hides others
 * @param {string} divId - ID of the division to show
 * @param {HTMLElement} button - Clicked button element
 */
function showDivision(divId, button) {
  try {
    // Update active division button
    divisionButtons.forEach(btn => btn.classList.remove(ACTIVE_CLASS));
    if (button) button.classList.add(ACTIVE_CLASS);
    
    // Show selected division
    divisions.forEach(div => div.style.display = 'none');
    const selectedDiv = document.getElementById(divId);
    if (selectedDiv) {
      selectedDiv.style.display = 'block';
    } else {
      console.error(`Division with ID ${divId} not found`);
    }
  } catch (error) {
    console.error('Error in showDivision:', error);
  }
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
  try {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem(THEME_KEY, isDark);
    
    // Update theme icon
    const icon = themeToggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
  } catch (error) {
    console.error('Error in toggleTheme:', error);
  }
}

/**
 * Initializes the application
 */
function init() {
  try {
    // Set saved theme
    if (localStorage.getItem(THEME_KEY) === 'true') {
      document.body.classList.add('dark-theme');
      const icon = themeToggleBtn.querySelector('.theme-icon');
      if (icon) icon.textContent = '☀️';
    }
    
    // Set default active elements
    if (!document.querySelector('.page.active')) {
      showPage('schedule');
    }
    
    if (!document.querySelector('.day-schedule.active')) {
      daySchedules[0].classList.add(ACTIVE_CLASS);
      dayButtons[0].classList.add(ACTIVE_CLASS);
    }
    
    if (!document.querySelector('.division-buttons button.active')) {
      divisionButtons[0].classList.add(ACTIVE_CLASS);
    }
    
    if (divisions.length > 0 && !document.querySelector('.division[style*="display: block"]')) {
      divisions[0].style.display = 'block';
    }
    
    // Add event listeners
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    dayButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dayId = btn.getAttribute('onclick').match(/showDay\('(.+)'\)/)[1];
        showDay(dayId, e);
      });
    });
    
    divisionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const divId = btn.getAttribute('onclick').match(/showDivision\('(.+)'\)/)[1];
        showDivision(divId, e.target);
      });
    });
    
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('onclick').match(/showPage\('(.+)'\)/)[1];
        showPage(pageId);
      });
    });
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);