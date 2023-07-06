import tkinter as tk
from tkinter import filedialog
import os
import zipfile
import sys
import xml.etree.ElementTree as ET


class GGBToolsApp:
    def __init__(self, root):
        self.root = root
        self.ggb_file_path = tk.StringVar()
        self.status_text = tk.StringVar()
        self.status_text.set("Status: Waiting for file selection...")

        # "Choose file" button
        self.choose_file_button = tk.Button(
            self.root,
            text="Choose file",
            command=self.choose_file,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.choose_file_button.pack(pady=10)

        # Label to display selected file
        self.file_label = tk.Label(
            self.root, textvariable=self.ggb_file_path, bg="#424242", fg="white"
        )
        self.file_label.pack(pady=10)

        # Frame to hold dropdown menu and "Go" button
        self.button_frame = tk.Frame(self.root, bg="#424242")
        self.button_frame.pack(pady=10)

        # Dropdown menu for actions
        self.action_var = tk.StringVar(self.root)
        self.action_var.set("Select action")
        self.action_menu = tk.OptionMenu(
            self.button_frame,
            self.action_var,
            "XML Test",
        )
        self.action_menu.config(bg="#424242", fg="white", font=("Arial", 10))
        self.action_menu.pack(side="left", pady=10)

        # "Go" button
        self.go_button = tk.Button(
            self.button_frame,
            text="Go",
            command=self.go_function,
            bg="#424242",
            fg="white",
            font=("Arial", 10),
        )
        self.go_button.pack(side="right", pady=10)

        # Text widget to display status
        self.status_text = tk.Text(
            self.root, bg="#424242", fg="white", font=("Arial", 10), width=50, height=10
        )
        self.status_text.pack(pady=10)
        self.append_status("Status: Waiting for file selection...")

    def append_status(self, text):
        # Append text to the status text widget
        self.status_text.insert(tk.END, text + "\n")
        self.status_text.see(tk.END)

    def choose_file(self):
        # Open a file selection dialog and update the file_path
        file_selected = filedialog.askopenfilename(
            defaultextension=".ggb", filetypes=[("GGB files", "*.ggb")]
        )
        self.ggb_file_path.set(file_selected)
        if file_selected is None or file_selected == "":
            return
        self.append_status("Status: File selected. Choose an action and click 'Go'.")

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

    def ggb_to_zip(self, file_path):
        if not file_path.endswith(".ggb"):
            return
        zip_path = file_path[:-4] + ".zip"
        os.rename(file_path, zip_path)

    def get_xml(self, file_path):
        if not file_path.endswith(".zip"):
            return
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extract("geogebra.xml")
        extracted_xml_path = os.path.join(os.path.dirname(file_path), "geogebra.xml")
        return extracted_xml_path

    def xml_edit_test(self, file_path):
        if not file_path.endswith(".xml"):
            return
        tree = ET.parse(file_path)
        root = tree.getroot()
        euclidianView = root.find("euclidianView")
        gridColor = euclidianView.find("gridColor")
        gridColor.set("r", "148")
        gridColor.set("g", "148")
        gridColor.set("b", "148")
        tree.write(file_path)

    def go_function(self):
        action_selected = self.action_var.get()
        file_path = self.ggb_file_path.get()

        if action_selected == "XML Test":
            self.ggb_to_zip(file_path)

        else:
            self.append_status("Error: Invalid action selected.")


def main():
    # Create the GUI
    root = tk.Tk()
    root.geometry("400x300")
    root.config(bg="#424242")
    root.title("GGB Tools")
    app = GGBToolsApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
