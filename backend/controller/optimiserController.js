// import fs from "fs/promises";
// import path from "path";
// import pdf from "pdf-parse/lib/pdf-parse.js";
// import mammoth from "mammoth";
// import { PDFDocument, rgb } from "pdf-lib";
// import fontkit from "@pdf-lib/fontkit"; // ✅ Import fontkit

// // ATS Keywords
// export const keywords = {
//   javascript: 12,
//   typescript: 11,
//   python: 13,
//   java: 11,
//   csharp: 9,
//   cplusplus: 8,
//   react: 15,
//   angular: 13,
//   node: 10,
//   aws: 14,
//   docker: 12,
//   kubernetes: 13,
//   mongodb: 11,
//   sql: 9,
//   ai: 12,
//   ml: 13,
//   "machine learning": 14,
//   html: 8,
//   css: 8,
//   "ui/ux": 10,
//   leadership: 10,
//   teamwork: 10,
//   "problem solving": 11,
//   agile: 9,
//   scrum: 9,
// };

// // Optimise Resume
// export const optimiseResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "Resume file is required." });
//     }

//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();
//     let plainText = "";

//     if (ext === ".pdf") {
//       const fileBuffer = await fs.readFile(filePath);
//       const parsed = await pdf(fileBuffer);
//       plainText = parsed.text;
//     } else if (ext === ".docx") {
//       const data = await mammoth.extractRawText({ path: filePath });
//       plainText = data.value;
//     } else {
//       await fs.unlink(filePath);
//       return res
//         .status(400)
//         .json({ error: "Unsupported file type. Only PDF/DOCX allowed." });
//     }

//     await fs.unlink(filePath);

//     // Find missing keywords to boost ATS score
//     const lowerText = plainText.toLowerCase();
//     const addedSkills = Object.keys(keywords).filter(
//       (kw) => !lowerText.includes(kw.toLowerCase())
//     );

//     const optimisedResumeText =
//       "Professional Summary\n" +
//       "Experienced professional with strong technical and soft skills.\n\n" +
//       "Optimised Skills:\n" +
//       Object.keys(keywords)
//         .map((kw) => kw.charAt(0).toUpperCase() + kw.slice(1))
//         .join(", ") +
//       "\n\nOriginal Content:\n" +
//       plainText +
//       "\n\nAdded ATS Keywords:\n" +
//       addedSkills.join(", ");

//     // Create PDF with Unicode font
//     const pdfDoc = await PDFDocument.create();

//     // ✅ Register fontkit
//     pdfDoc.registerFontkit(fontkit);

//     let page = pdfDoc.addPage();
//     const { width, height } = page.getSize();

//     // Load a TTF font that supports Unicode (place Roboto-Regular.ttf in backend/fonts/)
//     const fontBytes = await fs.readFile(
//       path.join(process.cwd(), "fonts", "Roboto-Regular.ttf")
//     );
//     const font = await pdfDoc.embedFont(fontBytes);

//     const lines = optimisedResumeText.match(/.{1,80}/g);
//     let yPos = height - 40;

//     for (const line of lines) {
//       if (yPos < 40) {
//         page = pdfDoc.addPage();
//         yPos = height - 40;
//       }
//       page.drawText(line, {
//         x: 50,
//         y: yPos,
//         font,
//         size: 12,
//         color: rgb(0, 0.3, 0.6),
//       });
//       yPos -= 18;
//     }

//     const pdfBytes = await pdfDoc.save();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=Optimised_Resume.pdf",
//     });
//     res.send(Buffer.from(pdfBytes));
//   } catch (err) {
//     console.error("Resume Optimiser Error:", err);
//     res.status(500).json({ error: err.message || "Failed to optimise resume." });
//   }
// };
import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// ATS Keywords (उदाहरण स्वरूप कुछ कीवर्ड)
export const keywords = {
  javascript: 12,
  typescript: 11,
  python: 13,
  java: 11,
  csharp: 9,
  cplusplus: 8,
  react: 15,
  angular: 13,
  node: 10,
  aws: 14,
  docker: 12,
  kubernetes: 13,
  mongodb: 11,
  sql: 9,
  ai: 12,
  ml: 13,
  "machine learning": 14,
  html: 8,
  css: 8,
  "ui/ux": 10,
  leadership: 10,
  teamwork: 10,
  "problem solving": 11,
  agile: 9,
  scrum: 9,
};

export const optimiseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    // Read and parse uploaded file
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let plainText = "";

    if (ext === ".pdf") {
      const fileBuffer = await fs.readFile(filePath);
      const parsed = await pdf(fileBuffer);
      plainText = parsed.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      plainText = data.value;
    } else {
      await fs.unlink(filePath);
      return res
        .status(400)
        .json({ error: "Unsupported file type. Only PDF/DOCX allowed." });
    }

    await fs.unlink(filePath); // Delete temp uploaded file

    // Find missing keywords to add
    const lowerText = plainText.toLowerCase();
    const addedSkills = Object.keys(keywords).filter(
      (kw) => !lowerText.includes(kw.toLowerCase())
    );

    // Construct formatted resume text with sections
    const optimisedResumeText =
      "Professional Summary\n" +
      "Experienced professional with strong technical and soft skills.\n\n" +
      "Optimised Skills\n" +
      Object.keys(keywords)
        .map((kw) => kw.charAt(0).toUpperCase() + kw.slice(1))
        .join(", ") +
      "\n\nOriginal Content\n" +
      plainText.trim() +
      "\n\nAdded ATS Keywords\n" +
      addedSkills.join(", ");

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Load fonts (अपना Roboto-Regular.ttf और Roboto-Bold.ttf इस path पर रखें)
    const fontRegularBytes = await fs.readFile(
      path.join(process.cwd(), "fonts", "Roboto-Regular.ttf")
    );
    const fontRegular = await pdfDoc.embedFont(fontRegularBytes);

    const fontBoldBytes = await fs.readFile(
      path.join(process.cwd(), "fonts", "Roboto-Bold.ttf")
    );
    const fontBold = await pdfDoc.embedFont(fontBoldBytes);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const marginX = 50;

    const fontSizeNormal = 12;
    const fontSizeHeader = 16;
    const lineHeightNormal = fontSizeNormal * 1.5;
    const lineHeightHeader = fontSizeHeader * 1.8;
    const paragraphSpacing = lineHeightNormal * 0.6;

    let yPos = height - 40;

    // Text को paragraphs में तोड़ें
    const paragraphs = optimisedResumeText.split(/\n\s*\n/);

    for (const para of paragraphs) {
      const trimmedPara = para.trim();

      // Header को पहचानें - छोटे, बिना punctuation वाले टाइटल्स
      const isHeader =
        /^[A-Za-z\s\/]+$/.test(trimmedPara) && trimmedPara.length < 40;

      // Use font and size based on header or normal body
      const fontToUse = isHeader ? fontBold : fontRegular;
      const fontSize = isHeader ? fontSizeHeader : fontSizeNormal;
      const lineHeight = isHeader ? lineHeightHeader : lineHeightNormal;

      // Lines में split करें paragraph को (embedded newline से)
      const lines = trimmedPara.split("\n");

      for (const line of lines) {
        // Word boundaries पर 90 char तक line wrap करें
        const wrappedLines = [];
        let currentLine = line.trim();

        while (currentLine.length > 0) {
          if (currentLine.length <= 90) {
            wrappedLines.push(currentLine);
            break;
          }
          let breakPos = currentLine.lastIndexOf(" ", 90);
          if (breakPos === -1) breakPos = 90;
          wrappedLines.push(currentLine.slice(0, breakPos));
          currentLine = currentLine.slice(breakPos).trim();
        }

        // Draw each wrapped line, page handling
        for (const wLine of wrappedLines) {
          if (yPos < 40) {
            page = pdfDoc.addPage();
            yPos = height - 40;
          }
          page.drawText(wLine, {
            x: marginX,
            y: yPos,
            font: fontToUse,
            size: fontSize,
            color: rgb(0, 0.3, 0.6),
            maxWidth: width - marginX * 2,
          });
          yPos -= lineHeight;
          if (yPos < 40) {
            page = pdfDoc.addPage();
            yPos = height - 40;
          }
        }
      }
      yPos -= paragraphSpacing; // paragraph spacing
    }

    const pdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=Optimised_Resume.pdf",
    });
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Resume Optimiser Error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ error: error.message || "Failed to optimise resume." });
    }
  }
};