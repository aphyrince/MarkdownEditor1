import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import fs from "fs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        // mainWindow.loadFile(
        //     path.join(__dirname, "../../../front/build/index.html")
        // );
        mainWindow.loadURL("http://localhost:3000");
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(
            path.join(process.resourcesPath, "build/index.html")
        );
    }
};

app.on("ready", createWindow);

ipcMain.handle("show-open-dialog", async (_, options) => {
    const res = await dialog.showOpenDialog(mainWindow!, options);
    return res;
});

ipcMain.handle("read-file", async (_, filePath: string) => {
    const content = await fs.promises.readFile(filePath, "utf8");
    return content;
});

ipcMain.handle(
    "save-file",
    async (_, { filePath, content }: { filePath: string; content: string }) => {
        await fs.promises.writeFile(filePath, content, "utf8");
        return true;
    }
);

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
