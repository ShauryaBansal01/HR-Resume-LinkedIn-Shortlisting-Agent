import fitz  # PyMuPDF
import docx
import io

def parse_pdf(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text("text") + "\n"
    return text.strip()

def parse_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def parse_file(file_filename: str, file_bytes: bytes) -> str:
    if file_filename.lower().endswith('.pdf'):
        return parse_pdf(file_bytes)
    elif file_filename.lower().endswith('.docx'):
        return parse_docx(file_bytes)
    elif file_filename.lower().endswith('.txt'):
        return file_bytes.decode('utf-8').strip()
    else:
        raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT.")
