const { ipcRenderer } = require('electron');

// Poslouchej na zprávu pro zobrazení informací o verzi
ipcRenderer.on('show-update-info', (event, data) => {
    // Zobrazíme informace v GUI
    const updateInfoElement = document.getElementById('update-info');
    const versionElement = document.getElementById('version');
    const descriptionElement = document.getElementById('description');
    const updateButton = document.getElementById('update-button');

    versionElement.innerText = data.latestVersion;
    descriptionElement.innerText = data.description;

    // Zobrazíme aktualizace v UI
    updateInfoElement.style.display = 'block';

    // Přidání eventu pro aktualizaci hry (budeš muset implementovat stahování)
    updateButton.addEventListener('click', () => {
        console.log('Spouštím aktualizaci...');
        // Tady přidej logiku pro stáhnutí a instalaci nové verze
    });
});
