import os
from datetime import datetime

from flask import Flask, render_template, request, url_for, redirect, send_file
from compress.utils.main import creer_zip_en_memoire, autoriser_typ_fichiers, excelToWorld
# db
from sqlalchemy import create_engine




app = Flask(__name__)


PATH_FILE = "static/uploads"
OUTPUT_FOLDER = "output"

app.config["UPLOAD_FOLDER"] = PATH_FILE
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER


# ------------------------- ROUTES --------------------
@app.route('/')
def index():
    return render_template('welcome.html')


@app.route('/upload-file', methods=["POST"])
def uploadFile():
    # Validation des fichiers
    if 'excel_file' not in request.files:
        return "Aucun fichier équivalent trouvé dans le champ excel_file"

    excelFile = request.files["excel_file"]

    if excelFile.filename == "":
        return "Aucun fichier selectionné", 400

    if autoriser_typ_fichiers(excelFile.filename):
        # Extraire le nom
        fileNameExcel = excelFile.filename
        # Stoker le fichier
        maintenant = datetime.now()
        # Formater en chaîne (ex : '2025-05-19 15:23:45')
        date_heure_str = maintenant.strftime("%Y-%m-%d %H:%M:%S")
        newFolderForStockFile = f"{PATH_FILE}/{date_heure_str}"
        os.makedirs(newFolderForStockFile)

        pathFileExcelStoker = os.path.join(newFolderForStockFile, fileNameExcel)
        excelFile.save(pathFileExcelStoker)

        # Éxécuter le code de l'extraxion

        excelToWorld(pathFileExcelStoker, date_heure_str)

        # Retourner la vue
        return redirect(url_for('viewData'))

    return "mauvais fichier", 400


@app.route('/view-data')
def viewData():
    output_folder = os.path.join(os.getcwd(), 'output')
    files = os.listdir(output_folder)
    return render_template('view_data.html', files=files, row_count = len(files))


@app.route("/single-data/<filename>")
def get_one_output(filename):
    if filename in os.listdir(OUTPUT_FOLDER):
        path = os.path.join(OUTPUT_FOLDER, filename)
        filesWord = os.listdir(path)
        return render_template("single_data.html", filesWord=filesWord, row_count = len(filesWord), pathRepo=path, filename = filename)
    return "Ce fichier n'existe pas"


@app.route('/download/<path:pathName>')
def telechargerOneDocWord(pathName):
    # télécharger le fichier
    full_path = os.path.join(os.getcwd(), pathName)
    if os.path.exists(full_path):
        return send_file(full_path, as_attachment=True)
    else:
        return "Fichier introuvable", 404


@app.route('/downloadRepo/<path:nameRepo>')
def telechargerOneDossierDeDocWord(nameRepo):
    full_path = os.path.join(os.getcwd(), OUTPUT_FOLDER, nameRepo)
    zip_en_memoire = creer_zip_en_memoire(full_path)
    return send_file(zip_en_memoire,
                     mimetype='application/zip',
                     as_attachment=True,
                     download_name=nameRepo+'.zip')

if __name__ == '__main__':
    os.makedirs('output', exist_ok=True)
    app.run(debug=True)
