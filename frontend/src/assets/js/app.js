
document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const browseButton = document.getElementById('browse-button');
    const uploadButton = document.getElementById('upload-button');
    const fileName = document.getElementById('file-name');

    // Handle click on the browse button
    browseButton.addEventListener('click', function () {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            updateFileInfo(fileInput.files[0]);
        }
    });

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('border-secondary-back0', 'bg-secondary-back');
    }

    function unhighlight() {
        dropArea.classList.remove('border-secondary-back0', 'bg-secondary-back');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files;
            updateFileInfo(files[0]);
        }
    }

    function updateFileInfo(file) {
        // Check if the file is an Excel file
        const validTypes = ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validTypes.includes(fileExtension) && !validTypes.includes(file.type)) {
            alert('Veuillez sélectionner un fichier Excel valide (.xlsx ou .xls)');
            fileInput.value = '';
            return;
        }

        fileName.textContent = file.name;
        fileName.classList.remove('hidden');
        uploadButton.disabled = false;
    }
});
