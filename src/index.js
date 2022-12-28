const { app, BrowserWindow } = require("electron");
const path = require("path");

if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1500,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "html/index.html"));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const ElectronPreferences = require("electron-preferences");
const fs = require("fs");

homedir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

pcsDir = path.join(homedir, ".PaddeCraftSoftware");
cfgDir = path.join(pcsDir, "WeatherManager");
weatherFile = path.join(cfgDir, "weather.json");

if (!fs.existsSync(pcsDir)) {
    fs.mkdirSync(pcsDir);
}

firstStart = false;

if (!fs.existsSync(cfgDir)) {
    firstStart = true;
    fs.mkdirSync(cfgDir);
    console.log(weatherFile);
    fs.writeFile(weatherFile, JSON.stringify({ data: [] }), "utf-8", (err) => {
        if (err) throw err;
    });
}

const preferences = new ElectronPreferences({
    // Preference file path
    dataStore: path.join(cfgDir, "settings.json"),

    // Preference default values
    defaults: {
        keys: {
            temp: "Temperatur Aussen(℃)",
            time: "Zeit",
            humid: "Luftfeuchtigkeit Aussen(%)",
            wind: "Wind(km/h)",
            rain: "Regen Event(mm)",
            pressure: "Rel. Luftdruck(hpa)",
        },
        formats: {
            time: "YYYY/M/D H:mm",
        },
        other: {
            daily_after_entries: 100,
        },
    },

    // Preference sections visible to the UI
    sections: [
        {
            id: "keys",
            label: "Keys",
            icon: "key-25", // See the list of available icons below
            form: {
                groups: [
                    {
                        label: "Set keys for your csv files",
                        fields: [
                            {
                                label: "Time",
                                key: "time",
                                type: "text",
                            },
                            {
                                label: "Temperature",
                                key: "temp",
                                type: "text",
                            },
                            {
                                label: "Humidity",
                                key: "humid",
                                type: "text",
                            },
                            {
                                label: "Windspeed",
                                key: "wind",
                                type: "text",
                            },
                            {
                                label: "Rain",
                                key: "rain",
                                type: "text",
                            },
                            {
                                label: "Pressure",
                                key: "pressure",
                                type: "text",
                            },
                        ],
                    },
                ],
            },
        },
        {
            id: "formats",
            label: "Formats",
            icon: "badge-13",
            form: {
                groups: [
                    {
                        label: "Set formats for your csv files",
                        fields: [
                            {
                                label: "Time",
                                key: "time",
                                type: "text",
                                hint: "https://github.com/taylorhakes/fecha#formatting-tokens",
                            },
                        ],
                    },
                ],
            },
        },
        {
            id: "other",
            label: "Other",
            icon: "grid-45",
            form: {
                groups: [
                    {
                        label: "Chart settings",
                        fields: [
                            {
                                label: "Daily after entries",
                                key: "daily_after_entries",
                                type: "text",
                                hint: "If there are more entries than this to be loaded, the chart only will display one entry per day.",
                            },
                        ],
                    },
                ],
            },
        },
    ],
});

if (firstStart) {
    app.on("ready", () => {
        preferences.show();
    });
}
