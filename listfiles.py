import os

def get_files_content(directory, excluded_directories, excluded_files):
    files_data = []

    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in excluded_directories]

        for file in files:
            file_path = os.path.join(root, file)

            if file_path in excluded_files:
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                files_data.append({
                    "name": file,
                    "path": file_path,
                    "content": content
                })
            except Exception as e:
                print(f"Erreur lors de la lecture du fichier {file_path}: {e}")

    return files_data

def save_to_text(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for file_info in data:
            f.write(f"===== {file_info['name']} =====\n")
            f.write(f"Chemin : {file_info['path']}\n")
            f.write(file_info['content'] + "\n\n")

if __name__ == "__main__":
    directory = "backend"
    output_file = "files_content.txt"

    excluded_directories = {
        "node_modules",
        ".git",
    }

    excluded_files = {
        os.path.join(directory, "yarn.lock"),
        os.path.join(directory, ".gitignore"),
        os.path.join(directory, "eslint.config.mjs"),
        os.path.join(directory, "next-env.d.ts"),
        os.path.join(directory, "next.config.ts"),
        os.path.join(directory, "package-lock.json"),
        os.path.join(directory, "postcss.config.mjs"),
        os.path.join(directory, "README.md"),
        os.path.join(directory, "node_modules"),
        os.path.join(directory, "files_content.txt")
    }

    if os.path.exists(directory):
        files_content = get_files_content(directory, excluded_directories, excluded_files)
        save_to_text(files_content, output_file)
        print(f"Les données ont été enregistrées dans {output_file}")
    else:
        print(f"Le dossier {directory} n'existe pas.")