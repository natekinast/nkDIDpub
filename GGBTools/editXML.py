import tkinter as tk
from tkinter import filedialog
import os
import zipfile
import xml.etree.ElementTree as ET


class GGBToolsApp:
    def __init__(self, root):
        self.root = root
        self.ggb_file_path = tk.StringVar()
        self.status_text = tk.StringVar()
        self.status_text.set("Status: Waiting for file selection...")

        self.list_options = [
            "Change Grid Color",
            "Bold Axes",
            "Set Line Opacity 100%",
        ]

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

        # Create Multi-select listbox
        self.ms_listbox = tk.Listbox(root, selectmode=tk.MULTIPLE)
        for option in self.list_options:
            self.ms_listbox.insert(tk.END, option)
        self.ms_listbox.pack(pady=10)

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

    def ggb_to_xml(self, ggb_file_path):
        dir = os.path.dirname(ggb_file_path)

        # Check if file path ends with .ggb
        if not ggb_file_path.endswith(".ggb"):
            self.append_status("Error: Invalid file type. Please provide a .ggb file.")
            return

        # Rename .ggb file to .zip
        zip_file_path = ggb_file_path[:-4] + ".zip"
        os.rename(ggb_file_path, zip_file_path)

        # Extract geogebra.xml from .zip
        with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
            try:
                zip_ref.extract("geogebra.xml", path=dir)
            except KeyError:
                self.append_status("Error: 'geogebra.xml' not found in the archive.")
                return
            else:
                self.append_status("'geogebra.xml' extracted successfully.")

        # Rename the .zip file back to .ggb if needed
        return os.path.join(dir, "geogebra.xml")

    def change_grid_color(self, file_path):
        # Change grid color to RGB(148, 148, 148)
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

        ggb_file_path = self.ggb_file_path.get()
        zip_file_path = ggb_file_path[:-4] + ".zip"

        self.replace_file_in_zip(zip_file_path, "geogebra.xml", file_path)

    def bold_axes(self, file_path):
        # Make axes bold
        if not file_path.endswith(".xml"):
            return
        tree = ET.parse(file_path)
        root = tree.getroot()
        euclidianView = root.find("euclidianView")
        lineStyle = euclidianView.find("lineStyle")
        lineStyle.set("axes", "3")
        tree.write(file_path)

        ggb_file_path = self.ggb_file_path.get()
        zip_file_path = ggb_file_path[:-4] + ".zip"

        self.replace_file_in_zip(zip_file_path, "geogebra.xml", file_path)

    def set_line_opacity(self, file_path):
        # Change opacity to 100% for lines, segments, rays, and vectors
        if not file_path.endswith(".xml"):
            return
        tree = ET.parse(file_path)
        root = tree.getroot()
        types = ["segment", "line", "ray", "vector"]
        construction = root.find("construction")
        for element in construction:
            if element.tag == "element":
                if element.get("type") in types:
                    element.find("lineStyle").set("opacity", "255")
        tree.write(file_path)

        ggb_file_path = self.ggb_file_path.get()
        zip_file_path = ggb_file_path[:-4] + ".zip"

        self.replace_file_in_zip(zip_file_path, "geogebra.xml", file_path)

    def cleanup(self):
        # Rename the zip file back to ggb and remove xml file
        ggb_file_path = self.ggb_file_path.get()
        zip_file_path = ggb_file_path[:-4] + ".zip"
        xml_file_path = os.path.join(os.path.dirname(ggb_file_path), "geogebra.xml")
        os.rename(zip_file_path, ggb_file_path)
        os.remove(xml_file_path)
        self.append_status("Done.")

    def go_function(self):
        file_path = self.ggb_file_path.get()
        xml_path = self.ggb_to_xml(file_path)

        # Get list of currently selected items and run different functions based on selection
        selected_items = self.ms_listbox.curselection()

        if 0 in selected_items:
            self.append_status("Changing grid color...")
            self.change_grid_color(xml_path)

        if 1 in selected_items:
            self.append_status("Bolding axes...")
            self.bold_axes(xml_path)

        if 2 in selected_items:
            self.set_line_opacity(xml_path)

        else:
            self.append_status("Error: Invalid selection.")

        self.cleanup()


def main():
    # Create the GUI
    root = tk.Tk()
    root.geometry("400x500")
    root.config(bg="#424242")
    root.title("GGB Tools")
    app = GGBToolsApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
