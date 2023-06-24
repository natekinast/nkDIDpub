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

        # "Choose folder" button
        self.choose_folder_button = tk.Button(
            self.root,
            text="Choose folder",
            command=self.choose_folder,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.choose_folder_button.pack(pady=10)

        # Label to display selected folder
        self.folder_label = tk.Label(
            self.root, textvariable=self.folder_path, bg="#424242", fg="white"
        )
        self.folder_label.pack(pady=10)

        # "Extract" button
        self.extract_button = tk.Button(
            self.root,
            text="Extract",
            command=self.extract_function,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.extract_button.pack(pady=10)
        self.extract_button.config(state="disabled")

        # Text widget to display status
        self.status_text = tk.Text(
            self.root, bg="#424242", fg="white", font=("Arial", 10), width=50, height=10
        )
        self.status_text.pack(pady=10)
        self.append_status("Status: Waiting for folder selection...")

    def append_status(self, text):
        # Append text to the status text widget
        self.status_text.insert(tk.END, text + "\n")
        self.status_text.see(tk.END)

    def choose_folder(self):
        # Open a folder selection dialog and update the folder_path
        folder_selected = filedialog.askdirectory()
        self.folder_path.set(folder_selected)
        self.append_status("Status: Folder selected. Click 'Extract' to begin.")
        self.extract_button.config(state="normal")

    def getJSFromGGB(self, root_path, fileName):
        # Extract the JavaScript file from the GGB file
        ggb_file_path = os.path.join(root_path, fileName)
        ggb_file_name = os.path.splitext(ggb_file_path)[0]
        new_js_file_path = ggb_file_name + "-globalJS.js"

        if os.path.exists(new_js_file_path):
            return False

        os.rename(ggb_file_path, ggb_file_name + ".zip")

        with zipfile.ZipFile(ggb_file_name + ".zip", "r") as zip_ref:
            zip_ref.extract("geogebra_javascript.js")

        os.rename("geogebra_javascript.js", new_js_file_path)
        os.rename(ggb_file_name + ".zip", ggb_file_path)

        return True

    def extract_function(self):
        # Extract from all files in the selected folder
        root_path = self.folder_path.get()
        ggb_files = [file for file in os.listdir(root_path) if file.endswith(".ggb")]

        for file in ggb_files:
            try:
                success = self.getJSFromGGB(root_path, file)
                if not success:
                    self.append_status(
                        f"Extraction skipped for {file} as JavaScript file already exists."
                    )
            except Exception as e:
                self.append_status(
                    f"Error occurred while extracting {file}. Error: {str(e)}"
                )
                return

        self.append_status("Status: Extraction complete.")


def main():
    # Create the GUI
    root = tk.Tk()
    root.geometry("400x300")
    root.config(bg="#424242")
    root.title("Extract JS from GGB")
    app = ExtractApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()