// backend/utils/pdfGenerator.js
const PDFDocument = require("pdfkit");

/**
 * Generate a professional resume PDF
 * @param {Object} data Resume JSON sent from frontend
 * @returns {Promise<Buffer>} PDF Buffer
 */
function createPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        bufferPages: true,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // === Monochrome Color Scheme ===
      const darkColor = "#000000";      // Black for primary text
      const mediumColor = "#444444";    // Dark gray for secondary text
      const lightColor = "#666666";     // Medium gray for details
      const lineColor = "#999999";      // Light gray for lines
      const bgColor = "#f9f9f9";        // Very light gray for backgrounds

      // === Helper Functions ===
      function drawSectionHeader(title) {
        const yPosition = doc.y;
        
        // Section title
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .fillColor(darkColor)
          .text(title.toUpperCase(), 50, yPosition + 5);
        
        // Underline
        doc
          .moveTo(50, yPosition + 22)
          .lineTo(200, yPosition + 22)
          .lineWidth(1)
          .strokeColor(lineColor)
          .stroke();
        
        doc.moveDown(1.2);
      }

      // === Header Section ===
      // Name with larger font
      doc
        .fontSize(26)
        .font("Helvetica-Bold")
        .fillColor(darkColor)
        .text(data.personal?.name || "Your Name", 50, 50, { align: "left" });

      // Professional title if available
      if (data.personal?.title) {
        doc
          .fontSize(12)
          .font("Helvetica")
          .fillColor(mediumColor)
          .text(data.personal.title, 50, 75, { align: "left" });
      }

      doc.moveDown(1.5);

      // Contact information - simple text without icons to avoid encoding issues
      const contactInfo = [];
      
      if (data.personal?.address) {
        contactInfo.push(data.personal.address);
      }
      
      if (data.personal?.phone) {
        contactInfo.push(data.personal.phone);
      }
      
      if (data.personal?.email) {
        contactInfo.push(data.personal.email);
      }
      
      // Add LinkedIn as text with link
      if (data.personal?.linkedin) {
        contactInfo.push({
          text: "LinkedIn",
          link: data.personal.linkedin
        });
      }
      
      // Add GitHub as text with link
      if (data.personal?.github) {
        contactInfo.push({
          text: "GitHub", 
          link: data.personal.github
        });
      }
      
      // Draw contact information
      let contactY = 100;
      
      contactInfo.forEach((item) => {
        if (typeof item === 'string') {
          // Regular text
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(mediumColor)
            .text(item, 50, contactY);
        } else if (item.link) {
          // Clickable link
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(mediumColor)
            .text(item.text, 50, contactY, {
              link: item.link,
              underline: true
            });
        }
        contactY += 15;
      });
      
      // Add a divider line
      doc
        .moveTo(50, contactY + 10)
        .lineTo(562, contactY + 10)
        .lineWidth(1)
        .strokeColor(lineColor)
        .stroke();
      
      doc.y = contactY + 20;

      // === Professional Summary ===
      if (data.personal?.about) {
        drawSectionHeader("Professional Summary");
        
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor(mediumColor)
          .text(data.personal.about, {
            align: "left",
            lineGap: 5,
            width: 500
          });
        
        doc.moveDown(1.5);
      }

      // === Two Column Layout ===
      const col1X = 50;
      const col2X = 310;
      const colWidth = 230;
      
      // Track Y positions for both columns
      let col1Y = doc.y;
      let col2Y = doc.y;

      // === Work Experience ===
      if (data.experience && data.experience.length > 0) {
        doc.x = col1X;
        doc.y = col1Y;
        drawSectionHeader("Work Experience");
        
        data.experience.forEach((exp, index) => {
          // Position and company
          if (exp.title || exp.company) {
            doc
              .fontSize(12)
              .font("Helvetica-Bold")
              .fillColor(darkColor)
              .text(exp.title || "", { continued: !!exp.company });
            
            if (exp.company) {
              doc
                .fontSize(11)
                .font("Helvetica")
                .fillColor(mediumColor)
                .text(exp.company ? ` at ${exp.company}` : "");
            }
          }
          
          // Dates
          if (exp.startDate || exp.endDate) {
            doc
              .fontSize(10)
              .font("Helvetica-Oblique")
              .fillColor(lightColor)
              .text(`${exp.startDate || ""} - ${exp.endDate || "Present"}`);
          }
          
          // Description with proper bullet points
          if (exp.description && exp.description.length > 0) {
            exp.description.forEach((d) => {
              if (d && d.trim()) {
                doc
                  .fontSize(10)
                  .font("Helvetica")
                  .fillColor(mediumColor)
                  .text(`• ${d}`, { 
                    indent: 10, 
                    lineGap: 3,
                    paragraphGap: 2
                  });
              }
            });
          }
          doc.moveDown(0.8);
        });
        
        col1Y = doc.y;
      }

      // === Education ===
      if (data.education && data.education.length > 0) {
        doc.x = col1X;
        doc.y = col1Y + 10;
        drawSectionHeader("Education");
        
        data.education.forEach((edu, index) => {
          // Degree
          if (edu.degree) {
            doc
              .fontSize(12)
              .font("Helvetica-Bold")
              .fillColor(darkColor)
              .text(edu.degree);
          }
          
          // University
          if (edu.university) {
            doc
              .fontSize(11)
              .font("Helvetica")
              .fillColor(mediumColor)
              .text(edu.university);
          }
          
          // Dates
          if (edu.startDate || edu.endDate) {
            doc
              .fontSize(10)
              .font("Helvetica-Oblique")
              .fillColor(lightColor)
              .text(`${edu.startDate || ""} - ${edu.endDate || ""}`);
          }
          
          // GPA
          if (edu.gpa) {
            doc
              .fontSize(10)
              .font("Helvetica")
              .fillColor(mediumColor)
              .text(`GPA: ${edu.gpa}`);
          }
          doc.moveDown(0.8);
        });
        
        col1Y = doc.y;
      }

      // === Skills ===
      if (data.skills) {
        doc.x = col2X;
        doc.y = col2Y;
        drawSectionHeader("Skills");
        
        if (data.skills.languages && data.skills.languages.length > 0) {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor(darkColor)
            .text("LANGUAGES", { paragraphGap: 3 });
          
          // Skills list
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(mediumColor)
            .text(data.skills.languages.join(", "), { paragraphGap: 8 });
        }
        
        if (data.skills.frameworks && data.skills.frameworks.length > 0) {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor(darkColor)
            .text("FRAMEWORKS & LIBRARIES", { paragraphGap: 3 });
          
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(mediumColor)
            .text(data.skills.frameworks.join(", "), { paragraphGap: 8 });
        }
        
        if (data.skills.tools && data.skills.tools.length > 0) {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor(darkColor)
            .text("TOOLS & TECHNOLOGIES", { paragraphGap: 3 });
          
          doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(mediumColor)
            .text(data.skills.tools.join(", "), { paragraphGap: 8 });
        }
        
        col2Y = doc.y;
      }

      // === Projects ===
      if (data.projects && data.projects.length > 0) {
        doc.x = col2X;
        doc.y = col2Y + 10;
        drawSectionHeader("Projects");
        
        data.projects.forEach((proj, index) => {
          if (proj.projectTitle) {
            doc
              .fontSize(11)
              .font("Helvetica-Bold")
              .fillColor(darkColor)
              .text(proj.projectTitle);
          }
          
          if (proj.projectLink) {
            doc
              .fontSize(10)
              .font("Helvetica")
              .fillColor(mediumColor)
              .text("View Project", {
                link: proj.projectLink,
                underline: true
              });
          }
          
          if (proj.projectDescription) {
            doc
              .fontSize(10)
              .font("Helvetica")
              .fillColor(mediumColor)
              .text(proj.projectDescription, { 
                lineGap: 4,
                paragraphGap: 5
              });
          }
          doc.moveDown(0.6);
        });
        
        col2Y = doc.y;
      }

      // === Certifications ===
      if (data.certifications && data.certifications.length > 0) {
        // Place in the column with more space
        if (col1Y < col2Y) {
          doc.x = col1X;
          doc.y = col1Y + 10;
        } else {
          doc.x = col2X;
          doc.y = col2Y + 10;
        }
        
        drawSectionHeader("Certifications");
        
        data.certifications.forEach((cert, index) => {
          if (cert.name) {
            doc
              .fontSize(11)
              .font("Helvetica-Bold")
              .fillColor(darkColor)
              .text(cert.name);
          }
          
          if (cert.link) {
            doc
              .fontSize(10)
              .font("Helvetica")
              .fillColor(mediumColor)
              .text("View Certificate", {
                link: cert.link,
                underline: true
              });
          }
          
          if (cert.date) {
            doc
              .fontSize(10)
              .font("Helvetica-Oblique")
              .fillColor(lightColor)
              .text(`Issued: ${cert.date}`);
          }
          doc.moveDown(0.6);
        });
      }

      // === Page Numbers ===
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        
        // Page number
        doc
          .fontSize(9)
          .fillColor(lightColor)
          .text(
            `Page ${i + 1} of ${totalPages}`,
            50,
            doc.page.height - 30,
            { align: "center" }
          );
      }

      // === End PDF ===
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { createPDF };