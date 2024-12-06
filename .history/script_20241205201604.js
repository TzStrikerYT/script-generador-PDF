function generateCertificates() {
    const { jsPDF } = window.jspdf;
    const fileInput = document.getElementById("backgroundImage");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Por favor selecciona una imagen de fondo.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = function (e) {
      const backgroundImage = e.target.result; // Imagen en formato base64
  
      // Array de datos de los estudiantes
      const students = [
        {
          fullName: "Ariza Paez Fany Milena",
          documentNumber: "1,032,505,677",
          documentType: "C.C.",
          documentCity: "Bogotá",
          program:
            "Técnico Laboral por Competencias en Auxiliar de Talento Humano",
          intensity: "1200",
          part: "3", // Número de semestres
          programResolution: "No. 06-098 del 2019",
          average: "4.44",
          date: "18/07/2024",
        },
      ];
  
      // Función para generar el PDF
      function generatePDF(student) {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
  
        // Texto justificado del estudiante
        const textParts = [
          { text: "Que el (a) estudiante ", bold: false },
          { text: `${student.fullName} `, bold: true },
          { text: "identificado (a) con ", bold: false },
          { text: `${student.documentType} `, bold: true },
          { text: `${student.documentNumber} `, bold: true },
          { text: "de ", bold: false },
          { text: `${student.documentCity}, `, bold: true },
          {
            text: "CURSÓ Y APROBÓ el plan de estudios correspondiente al programa ",
            bold: false,
          },
          { text: `${student.program} `, bold: true },
          {
            text: `con intensidad horaria de ${student.intensity} horas divididas en ${student.part} semestres académicos. `,
            bold: false,
          },
          {
            text: `Programa aprobado según Resolución ${student.programResolution}. `,
            bold: false,
          },
          { text: "Obteniendo las siguientes calificaciones: ", bold: false },
        ];
  
        drawFormattedText(doc, textParts, 20, 40, {
          maxWidth: 170,
          lineHeight: 6,
          align: "justify",
        });
  
        doc.save(`Certificado_${student.fullName.replace(/ /g, "_")}.pdf`);
      }
  
      // Generar un PDF por cada estudiante
      students.forEach((student) => generatePDF(student));
    };
  
    reader.readAsDataURL(file); // Leer la imagen como base64
  }
  
  // Función para dibujar texto justificado
  function drawFormattedText(doc, textParts, x, y, options = {}) {
    const maxWidth = options.maxWidth || 170; // Ancho máximo del texto
    const lineHeight = options.lineHeight || 10; // Altura de cada línea
    const align = options.align || "left"; // Alineación: "left", "center", "right", "justify"
    let currentY = y;
    let currentLine = [];
  
    const drawLine = (line, justify = false) => {
      let currentX = x;
  
      if (justify && align === "justify" && line.length > 1) {
        const totalWidth = line.reduce((sum, part) => sum + doc.getTextWidth(part.text), 0);
        const extraSpace = maxWidth - totalWidth;
        const spaces = line.length - 1;
        const spaceWidth = spaces > 0 ? extraSpace / spaces : 0;
  
        line.forEach((part, index) => {
          doc.setFont("helvetica", part.bold ? "bold" : "normal");
          doc.text(part.text, currentX, currentY);
          currentX += doc.getTextWidth(part.text) + (index < spaces ? spaceWidth : 0);
        });
      } else {
        // Para alineación izquierda, centro o derecha
        if (align === "center") {
          const lineWidth = line.reduce((sum, part) => sum + doc.getTextWidth(part.text), 0);
          currentX += (maxWidth - lineWidth) / 2;
        } else if (align === "right") {
          const lineWidth = line.reduce((sum, part) => sum + doc.getTextWidth(part.text), 0);
          currentX += maxWidth - lineWidth;
        }
  
        line.forEach((part) => {
          doc.setFont("helvetica", part.bold ? "bold" : "normal");
          doc.text(part.text, currentX, currentY);
          currentX += doc.getTextWidth(part.text);
        });
      }
  
      currentY += lineHeight;
      currentLine = [];
    };
  
    textParts.forEach((part) => {
      const words = part.text.split(" ");
      words.forEach((word, i) => {
        const space = i < words.length - 1 ? " " : "";
        const testLine = [...currentLine, { text: word + space, bold: part.bold }];
        const testWidth = testLine.reduce((sum, item) => sum + doc.getTextWidth(item.text), 0);
  
        if (testWidth > maxWidth) {
          drawLine(currentLine, align === "justify");
        }
  
        currentLine.push({ text: word + space, bold: part.bold });
      });
    });
  
    if (currentLine.length > 0) {
      drawLine(currentLine, false);
    }
  }
  