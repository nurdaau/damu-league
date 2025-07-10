// DOM Elements
const themeToggleBtn = document.querySelector('.theme-toggle');
const menuToggleBtn = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const divisionButtons = document.querySelectorAll('.division-buttons button');
const pages = document.querySelectorAll('.page');
const tableContainers = document.querySelectorAll('#table .table-container');
const playoffDivisionButtons = document.querySelectorAll('.playoff-division-buttons button');
const playoffGridContainers = document.querySelectorAll('.playoff-grid-container');

// Constants
const THEME_KEY = 'darkTheme';
const ACTIVE_CLASS = 'active';

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

      // Update active navigation link
      navLinks.forEach(link => link.classList.remove(ACTIVE_CLASS));
      const activeNavLink = document.querySelector(`.main-nav a[data-page="${pageId}"]`);
      if (activeNavLink) {
        activeNavLink.classList.add(ACTIVE_CLASS);
      }

      // If showing table page, ensure a default table division is active
      if (pageId === 'table') {
        const activeTable = document.querySelector('#table .table-container.active, #table .table-container[style*="display: block"]');
        if (!activeTable && tableContainers.length > 0 && divisionButtons.length > 0) {
          showTableDivision(tableContainers[0].id, divisionButtons[0]);
        }
      } else if (pageId === 'playoffs') {
        // Show the default playoff bracket (first one)
        if (playoffGridContainers.length > 0 && playoffDivisionButtons.length > 0) {
          showPlayoffBracket(playoffGridContainers[0].id, playoffDivisionButtons[0]);
        }
      }
    } else {
      console.error(`Page with ID ${pageId} not found`);
    }
    // Скрываем меню после выбора страницы на мобильных
    if (window.innerWidth <= 768) {
      mainNav.classList.remove(ACTIVE_CLASS);
      const icon = menuToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

  } catch (error) {
    console.error('Error in showPage:', error);
  }
}

/**
 * Shows the selected table division and hides others
 * @param {string} tableId - ID of the table container to show
 * @param {HTMLElement} button - Clicked button element
 */
function showTableDivision(tableId, button) {
  try {
    // Update active division button
    divisionButtons.forEach(btn => btn.classList.remove(ACTIVE_CLASS));
    if (button) button.classList.add(ACTIVE_CLASS);

    // Show selected table container
    tableContainers.forEach(table => table.style.display = 'none');
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
      selectedTable.style.display = 'block';
    } else {
      console.error(`Table container with ID ${tableId} not found`);
    }
  } catch (error) {
    console.error('Error in showTableDivision:', error);
  }
}

/**
 * Shows the selected playoff bracket and hides others
 * @param {string} bracketId - ID of the playoff grid container to show
 * @param {HTMLElement} button - Clicked button element
 */
function showPlayoffBracket(bracketId, button) {
  try {
    // Update active playoff division button
    playoffDivisionButtons.forEach(btn => btn.classList.remove(ACTIVE_CLASS));
    if (button) button.classList.add(ACTIVE_CLASS);

    // Show selected playoff grid container
    playoffGridContainers.forEach(grid => grid.style.display = 'none');
    const selectedGrid = document.getElementById(bracketId);
    if (selectedGrid) {
      selectedGrid.style.display = 'grid'; // Use 'grid' as display style for bracket
    } else {
      console.error(`Playoff bracket with ID ${bracketId} not found`);
    }
  } catch (error) {
    console.error('Error in showPlayoffBracket:', error);
  }
}

/**
 * Toggles between light and dark theme (unchanged)
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem(THEME_KEY, isDark);
  const icon = themeToggleBtn.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = isDark ? '☀️' : '🌙';
  }
}

/**
 * Toggles mobile navigation menu (unchanged)
 */
function toggleMenu() {
  mainNav.classList.toggle(ACTIVE_CLASS);
  const icon = menuToggleBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  }
}

/**
 * Initializes the application
 */
function init() {
  try {
    // Set saved theme (unchanged)
    if (localStorage.getItem(THEME_KEY) === 'true') {
      document.body.classList.add('dark-theme');
      const icon = themeToggleBtn.querySelector('.theme-icon');
      if (icon) icon.textContent = '☀️';
    } else {
      const icon = themeToggleBtn.querySelector('.theme-icon');
      if (icon) icon.textContent = '🌙';
    }

    // Set default active page
    const hash = window.location.hash.substring(1); // Get page from hash
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showPage('table'); // Default to table page
    }

    // Add event listeners
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', toggleMenu);
    }

    divisionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tableId = e.target.dataset.table;
        showTableDivision(tableId, e.target);
      });
    });

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = e.target.dataset.page;
        window.location.hash = pageId; // Update hash
        showPage(pageId);
      });
    });

    playoffDivisionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bracketId = e.target.dataset.playoffDiv;
        showPlayoffBracket(bracketId, e.target);
      });
    });

    // Handle initial load with hash
    window.addEventListener('load', () => {
      const hashOnLoad = window.location.hash.substring(1);
      if (hashOnLoad && document.getElementById(hashOnLoad)) {
        showPage(hashOnLoad);
      }
    });

  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
