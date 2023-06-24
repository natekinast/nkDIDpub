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
        self.choose_folder_button.pack(pady=10)

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
        self.extract_button.config(
            state="disabled"
        )  # Initially disable the Extract button

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
        self.extract_button.config(
            state="normal"
        )  # Enable the Extract button after folder selection

    def getJSFromGGB(self, root_path, fileName):
        ggbFilePath = os.path.join(root_path, fileName)
        ggbFileName = os.path.splitext(ggbFilePath)[0]
        new_js_file_path = ggbFileName + "-globalJS.js"

        if os.path.exists(new_js_file_path):
            return False

        os.rename(ggbFilePath, ggbFileName + ".zip")

        with zipfile.ZipFile(ggbFileName + ".zip", "r") as zip_ref:
            zip_ref.extract("geogebra_javascript.js")

        os.rename("geogebra_javascript.js", new_js_file_path)
        os.rename(ggbFileName + ".zip", ggbFilePath)

        return True

    def extract_function(self):
        root_path = self.folder_path.get()
        ggb_files = [file for file in os.listdir(root_path) if file.endswith(".ggb")]
        self.status_text.set("")

        for file in ggb_files:
            try:
                success = self.getJSFromGGB(root_path, file)
                if not success:
                    self.status_text.set(
                        self.status_text.get()
                        + f"Extraction skipped for {file} as JavaScript file already exists.\n"
                    )
            except Exception as e:
                self.status_text.set(
                    self.status_text.get()
                    + f"Error occurred while extracting {file}. Error: {str(e)}\n"
                )
                return  # if an error occurs, stop further extraction

        self.status_text.set(self.status_text.get() + "Status: Extraction complete.")


def main():
    root = tk.Tk()
    root.geometry("400x200")
    root.config(bg="#424242")
    app = ExtractApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
