import tkinter as tk
from tkinter import filedialog
import os
import zipfile


class ExtractApp:
    def __init__(self, root):
        self.root = root
        self.folder_path = tk.StringVar()
        self.status_text = tk.StringVar()
        self.status_text.set("Status: Waiting for folder selection...")

        # Create "Choose folder" button
        self.choose_folder_button = tk.Button(
            self.root,
            text="Choose folder",
            command=self.choose_folder,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.choose_folder_button.pack(pady=10)  # Add vertical padding

        # Create a label to display the chosen folder
        self.folder_label = tk.Label(
            self.root, textvariable=self.folder_path, bg="#424242", fg="white"
        )
        self.folder_label.pack(pady=10)

        # Create "Extract" button
        self.extract_button = tk.Button(
            self.root,
            text="Extract",
            command=self.extract_function,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.extract_button.pack(pady=10)

        self.status_label = tk.Label(
            self.root,
            textvariable=self.status_text,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.status_label.pack(pady=10)

    def choose_folder(self):
        # Open a folder selection dialog and update the folder_path
        folder_selected = filedialog.askdirectory()
        self.folder_path.set(folder_selected)
        self.status_text.set("Status: Folder selected. Click 'Extract' to begin.")

    def extract_function(self):
        rootPath = self.folder_path.get()
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

        self.status_text.set("Status: Extraction complete.")


def main():
    root = tk.Tk()
    root.geometry("400x200")
    root.config(bg="#424242")
    app = ExtractApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
