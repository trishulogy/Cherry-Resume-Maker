const { createPDF } = require("/Trishulogy/Codes/Cherry Resume Maker/backend/utils/pdfGenerator.js");

const generateResume = async (req, res) => {
  try {
    const data = req.body;
    const pdfBuffer = await createPDF(data);

    // ✅ Send as inline (preview mode)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=resume.pdf",
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating resume:", err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
};

module.exports = { generateResume };
