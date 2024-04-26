import express from "express";
import cors from "cors";
import multer from "multer";
import PDFParser from "pdf2json";

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData = [];

function getPDFText(data) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(data);
  });
}

app.post("/api/files", upload.single("file"), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({
      message: "File not found",
    });
  }

  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({
      message: "File must be a PDF",
    });
  }

  try {
    const result = await getPDFText(file.buffer);
    userData = result;
  } catch (error) {
    return res.status(400).json({
      message: "File must be a PDF",
    });
  }

  return res
    .status(200)
    .json({ data: userData, message: "File uploaded successfully" });
});

app.get("/api/pdf", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query parameter 'q' not found" });
  }

  if (Array.isArray(q)) {
    return res
      .status(400)
      .json({ message: "Query parameter 'q' must be a string" });
  }

  const search = q.toString().toLowerCase();

  return res.status(200).json({ data: search });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
