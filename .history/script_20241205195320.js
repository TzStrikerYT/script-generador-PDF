function generateCertificates() {
    const { jsPDF } = window.jspdf;
    const fileInput = document.getElementById("backgroundImage");
    const file = fileInput?.files[0];
    if (!file) return alert("Por favor selecciona una imagen de fondo.");
    const reader = new FileReader();
    reader.onload = (e) => {
      const backgroundImage = e.target.result;
      const students = [
        {
          fullName: "Ariza Paez Fany Milena",
          documentNumber: "1,032,505,677",
          documentType: "C.C.",
          documentCity: "Bogotá",
          program: "Técnico Laboral en Auxiliar de Talento Humano",
          intensity: "1200",
          grades: [
            {
              title: "FUNDAMENTACIÓN BÁSICA",
              subjects: [
                ["GESTIÓN DE PERSONAL Y RELACIONES ORGANIZACIONALES", "4.2"],
                ["CONTABILIDAD BÁSICA", "4.6"],
              ],
            },
            {
              title: "FUNDAMENTACIÓN TRANSVERSAL",
              subjects: [
                ["HERRAMIENTAS Y HABILIDADES COMUNICATIVAS", "5.0"],
                ["INNOVACIÓN EMPRESARIAL", "4.7"],
              ],
            },
          ],
          average: "4.44",
          date: "18/07/2024",
        },
      ];
  
      const generatePDF = (student) => {
        const doc = new jsPDF({ format: "a4" });
        const { pageSize } = doc.internal;
        const [width, height] = [pageSize.getWidth(), pageSize.getHeight()];
  
        // Add background image
        doc.addImage(backgroundImage, "JPEG", (width - 150) / 2, (height - 150) / 2, 150, 150, undefined, "FAST");
  
        // Add header information
        doc.setFont("helvetica", "normal").setFontSize(8);
        ["Fundación Bilingües Centro Colombiano de Lenguas Modernas",
          "Institución para el Trabajo y Desarrollo Humano",
          "Personería Jurídica No. 5461 del 03 de diciembre de 2004",
          "Licencia de Funcionamiento No. 06-003 de 2010"].forEach((line, i) => {
          doc.text(line, width / 2, 10 + i * 4, { align: "center" });
        });
  
        // Certification text with improved justification
        doc.setFontSize(10).setFont(undefined, "bold").text("CERTIFICA:", width / 2, 30, { align: "center" });
  
        // Create a more flexible text generation function
        const createJustifiedText = (doc, text, x, y, maxWidth) => {
          // Split text into sentences
          const sentences = text.trim().replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/);
          
          // Track current y position
          let currentY = y;
          
          sentences.forEach(sentence => {
            // Split sentence into words
            const words = sentence.trim().split(/\s+/);
            
            // Track current line
            let line = [];
            let lineWidth = 0;
            
            words.forEach(word => {
              const wordWidth = doc.getTextDimensions(word).w;
              
              // If adding this word would exceed max width, render previous line
              if (lineWidth + wordWidth > maxWidth) {
                // Calculate total whitespace to distribute
                const lineText = line.join(' ');
                const textWidth = doc.getTextDimensions(lineText).w;
                const spaceToDistribute = maxWidth - textWidth;
                
                // Render justified line
                if (line.length > 1) {
                  const spaceWidth = spaceToDistribute / (line.length - 1);
                  doc.text(line.join(''), x, currentY, { 
                    charSpace: spaceWidth / doc.getTextDimensions(' ').w 
                  });
                } else {
                  // For single word lines, left align
                  doc.text(line[0], x, currentY);
                }
                
                // Reset for next line
                currentY += 5;
                line = [word];
                lineWidth = wordWidth;
              } else {
                line.push(word);
                lineWidth += wordWidth + doc.getTextDimensions(' ').w;
              }
            });
            
            // Render last line (left-aligned)
            if (line.length > 0) {
              doc.text(line.join(' '), x, currentY);
              currentY += 5;
            }
          });
          
          return currentY;
        };
  
        // Generate certificate text
        const certificateText = `Que el (a) estudiante ${student.fullName}, identificado (a) con ${student.documentType} ${student.documentNumber} de ${student.documentCity}, CURSÓ Y APROBÓ el plan de estudios del programa ${student.program}, con una intensidad horaria de ${student.intensity} horas. Programa aprobado según Resolución No. 06-098 del 2019. Obteniendo las siguientes calificaciones:`;
  
        // Use the new justification method
        doc.setFont(undefined, "normal");
        const lastY = createJustifiedText(doc, certificateText, 20, 40, 170);
  
        // Rest of the PDF generation remains the same
        let currentY = lastY + 10;
        student.grades.forEach(({ title, subjects }) => {
          doc.autoTable({
            startY: currentY,
            margin: { left: 20 },
            head: [[{ content: title, styles: { halign: "center", fillColor: [41, 128, 185], textColor: [255, 255, 255] } }]],
            body: subjects.map(([name, grade]) => [name, grade]),
            columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 30, halign: "center" } },
            styles: { fontSize: 7 },
          });
          currentY = doc.lastAutoTable.finalY + 5;
        });
  
        doc.text(`PROMEDIO ACUMULADO: ${student.average}. La nota mínima aprobatoria es de 3.0.`, 20, currentY);
        doc.text(`Expedido en ${student.documentCity}, el ${student.date}.`, 20, currentY + 10);
        doc.save(`Certificado_${student.fullName.replace(/ /g, "_")}.pdf`);
      };
  
      students.forEach(generatePDF);
    };
    reader.readAsDataURL(file);
  }