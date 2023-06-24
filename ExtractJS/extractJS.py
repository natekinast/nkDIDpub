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

        # Frame to hold "Extract" and "Sync" buttons
        self.button_frame = tk.Frame(self.root, bg="#424242")
        self.button_frame.pack(pady=10)

        # "Extract" button
        self.extract_button = tk.Button(
            self.button_frame,
            text="Extract",
            command=self.extract_function,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.extract_button.pack(side="left", padx=5)  # Add horizontal padding
        self.extract_button.config(state="disabled")

        # "Sync" button
        self.sync_button = tk.Button(
            self.button_frame,
            text="Sync",
            command=self.sync_function,  # Function yet to be defined
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.sync_button.pack(side="right", padx=5)  # Add horizontal padding
        self.sync_button.config(state="disabled")

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
        if folder_selected is None or folder_selected == "":
            return
        self.append_status("Status: Folder selected. Click 'Extract' to begin.")
        self.extract_button.config(state="normal")
        self.sync_button.config(state="normal")

    def get_JS_from_GGB(self, root_path, file_name):
        # Extract the JavaScript file from the GGB file
        ggb_file_path = os.path.join(root_path, file_name)
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

    def replace_file_in_zip(self, zip_path, target_file_name, replacement_file_path):
        # Create a temporary zip file
        temp_zip_path = zip_path + ".tmp"

        with zipfile.ZipFile(zip_path, "r") as zin, zipfile.ZipFile(
            temp_zip_path, "w"
        ) as zout:
            for item in zin.infolist():
                if item.filename != target_file_name:
                    # If the file is not the one to be replaced, copy it to the new zip
                    zout.writestr(item, zin.read(item.filename))

            # Add the replacement file
            with open(replacement_file_path, "rb") as f:
                data = f.read()
            zout.writestr(target_file_name, data)

        # Remove the original file and rename the temporary file
        os.remove(zip_path)
        os.rename(temp_zip_path, zip_path)

    def sync_JS_to_GGB(self, root_path, file_name):
        ggb_file_path = os.path.join(root_path, file_name)
        ggb_file_name = os.path.splitext(ggb_file_path)[0]
        js_file_path = os.path.join(root_path, ggb_file_name + "-globalJS.js")

        os.rename(ggb_file_path, ggb_file_name + ".zip")

        zip_file_path = os.path.join(root_path, ggb_file_name + ".zip")

        self.replace_file_in_zip(zip_file_path, "geogebra_javascript.js", js_file_path)

        os.rename(ggb_file_name + ".zip", ggb_file_path)
        os.remove(js_file_path)

        if os.path.exists(js_file_path):
            return False

        return True

    def extract_function(self):
        # Extract from all files in the selected folder
        root_path = self.folder_path.get()
        ggb_files = [file for file in os.listdir(root_path) if file.endswith(".ggb")]

        for file in ggb_files:
            try:
                success = self.get_JS_from_GGB(root_path, file)
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

    def sync_function(self):
        # Sync the extracted JS files with the GGB files

        root_path = self.folder_path.get()
        self.append_status(f"root_path: {root_path}")

        ggbfiles = [file for file in os.listdir(root_path) if file.endswith(".ggb")]

        for file in ggbfiles:
            ggb_file_name = os.path.splitext(file)[0]
            js_file_name = ggb_file_name + "-globalJS.js"
            self.append_status(f"Checking for {js_file_name}...")
            # Check if the JS file exists
            if os.path.exists(os.path.join(root_path, js_file_name)):
                try:
                    success = self.sync_JS_to_GGB(root_path, file)
                    if success:
                        self.append_status(f"Sync successful for {file}.")
                    else:
                        self.append_status(
                            f"Sync failed for {file}. JS file is still present."
                        )
                except Exception as e:
                    self.append_status(
                        f"Error occurred while syncing {file}. Error: {str(e)}"
                    )
                    return


def main():
    # Create the GUI
    root = tk.Tk()
    root.geometry("400x300")
    root.config(bg="#424242")
    root.title("Extract JS from GGB files")
    app = ExtractApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
