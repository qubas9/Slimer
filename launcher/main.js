const { app, BrowserWindow, ipcMain } = require('electron');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Cesta k souboru s verzí
const versionFilePath = path.join(__dirname, 'version.txt');

// Funkce pro získání informací o verzi z GitHubu
function checkForUpdates() {
    const url = 'https://api.github.com/repos/{user}/{repo}/releases/latest'; // Nahraď {user} a {repo} svými údaji

    https.get(url, { headers: { 'User-Agent': 'ElectronApp' } }, (response) => {
        let data = '';

        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            const release = JSON.parse(data);
            const latestVersion = release.tag_name; // Verze z GitHubu
            const description = release.body; // Popis nové verze

            // Získání aktuální verze
            const currentVersion = getCurrentVersion();

            // Porovnáme verze a pokud je nová, ukážeme uživateli
            if (latestVersion !== currentVersion) {
                mainWindow.webContents.send('show-update-info', { latestVersion, description });
            }
        });
    }).on('error', (err) => {
        console.error('Chyba při získávání dat z GitHubu:', err);
    });
}

// Funkce pro získání aktuální verze z version.txt, nebo inicializaci souboru, pokud neexistuje
function getCurrentVersion() {
    if (!fs.existsSync(versionFilePath)) {
        // Pokud soubor neexistuje, vytvoříme ho s výchozí verzí
        const initialVersion = 'v0.0.0';  // Počáteční verze
        fs.writeFileSync(versionFilePath, initialVersion);
        console.log('Soubor version.txt neexistoval, vytvořili jsme ho s verzí:', initialVersion);
        return initialVersion;
    }

    // Pokud soubor existuje, přečteme verzi
    return fs.readFileSync(versionFilePath, 'utf8').trim();
}

// Vytvoření okna aplikace
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Zavoláme kontrolu verzí po spuštění aplikace
    checkForUpdates();
}

// Inicializace aplikace
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
