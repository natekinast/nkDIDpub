import tkinter as tk
from tkinter import filedialog
import os
import zipfile

root = tk.Tk()
root.withdraw()

rootPath = filedialog.askdirectory()
ggbFiles = []

for file in os.listdir(rootPath):
    if file.endswith(".ggb"):
        ggbFiles.append(file)


def getJSFromGGB(fileName):
    ggbFilePath = rootPath + "/" + fileName
    ggbFileName = os.path.splitext(ggbFilePath)[0]

    os.rename(ggbFilePath, ggbFileName + ".zip")

    with zipfile.ZipFile(ggbFileName + ".zip", "r") as zip_ref:
        zip_ref.extract("geogebra_javascript.js")

    os.rename("geogebra_javascript.js", ggbFileName + "-globalJS.js")
    os.rename(ggbFileName + ".zip", ggbFilePath)


for file in ggbFiles:
    getJSFromGGB(file)
