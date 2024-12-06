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
      console.log(e.target.result);

      // Array de datos de los estudiantes
      const students = [
        {
          fullName: "Ariza Paez Fany Milena",
          documentNumber: "1,032,505,677",
          documentType: "C.C.",
          documentCity: "Bogotá",
          part: "3",
          program:
            "Técnico Laboral por Competencias en Auxiliar de Talento Humano",
          intensity: "1200",
          grades: [
            {
              title: "FUNDAMENTACIÓN BÁSICA",
              subjects: [
                [
                  "GESTIÓN DE PERSONAL Y RELACIONES ORGANIZACIONALES",
                  "4.2",
                ],
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

      // Función para generar un PDF individual
      function generatePDF(student) {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginLeft = 20;

        // Añadir imagen de fondo centrada
        const imgWidth = 150; // Ajustar ancho
        const imgHeight = 150; // Ajustar alto
        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = (pageHeight - imgHeight) / 2;

        // Añadir imagen translúcida (simulada)
        doc.addImage(
          backgroundImage,
          "JPEG",
          xOffset,
          yOffset,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        // Encabezado
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          "Fundación Bilingües Centro Colombiano de Lenguas Modernas",
          105,
          10,
          { align: "center" }
        );
        doc.text(
          "Institución para el Trabajo y Desarrollo Humano",
          105,
          14,
          { align: "center" }
        );
        doc.text(
          "Personería Jurídica No. 5461 del 03 de diciembre de 2004",
          105,
          18,
          { align: "center" }
        );
        doc.text("Licencia de Funcionamiento No. 06-003 de 2010", 105, 22, {
          align: "center",
        });

        // Título
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("CERTIFICA:", 105, 30, { align: "center" });
        doc.setFont(undefined, "normal");

        // Información del estudiante
        doc.setFontSize(8);

        /* const textContent = [
          `El suscrito Coordinador Académico de la Fundación Bilingües Centro Colombiano de Lenguas Modernas,`,
          `certifica que:`,
          `El (a) estudiante ${student.fullName} identificado (a) con C.C. ${student.documentNumber} de ${student.documentCity},`,
          `CURSÓ Y APROBÓ el plan de estudios correspondiente al programa ${student.program},`,
          `con intensidad horaria de 1200 horas divididas en 3 semestres académicos.`,
          `Programa aprobado según Resolución No. 06-098 del 2019.`,
          ``,
          `Obteniendo las siguientes calificaciones:`,
        ];
        doc.text(textContent.join(" "), marginLeft, 40, {
          maxWidth: 170,
          align: "justify",
        }); */

        `Que el (a) estudiante Diaz Diaz Wulimar Naumi identificado (a) con P.P.T.	4,968,648 de Bogotá, CURSÓ Y APROBÓ el plan de estudios correspondientes 
        al programa, Técnico Laboral por Competencias en Auxiliar de Talento Humano. con intensidad horaria de 1200 horas dividas en 3 semestres académicos. 
        Programa aprobado según Resolución No. 06-098 del 2019. Obteniendo las siguientes calificaciones
        `;

        const textParts = [
          { text: "Que el (a) estudiante ", bold: false },
          { text: `${student.fullName} `, bold: true },
          { text: "identificado (a) con ", bold: false },
          { text: `${student.documentType} `, bold: true },
          { text: `${student.documentNumber} `, bold: true },
          { text: "de ", bold: false },
          { text: `${student.documentCity}, `, bold: true },
          {
            text: "CURSÓ Y APROBÓ el plan de ln estudios correspondiente al programa ",
            bold: false,
          },
          { text: `${student.program} `, bold: true },
          {
            text: `con intensidad horaria de ${student.instensity} horas divididas en ${student.part} semestres académicos. `,
            bold: false,
          },
          {
            text: `Programa aprobado según Resolución ${student.programResolution} `,
            bold: false,
          },
          {
            text: "Obteniendo las siguientes calificaciones: ",
            bold: false,
          },
        ];

        const yPosition = 40;

        drawFormattedText(doc, textParts, 20, 40, {
          maxWidth: 170,
          lineHeight: 5,
          align: "justify",
        });

        // Función para añadir secciones de calificaciones
        function addGradesSection(title, grades, startY) {
          doc.autoTable({
            startY: startY,
            margin: { left: marginLeft },
            head: [
              [
                {
                  content: title,
                  colSpan: 2,
                  styles: {
                    halign: "center",
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: "bold",
                  },
                },
              ],
            ],
            body: grades.map((grade) => [grade[0], grade[1]]),
            theme: "grid",
            styles: { fontSize: 7, cellPadding: 1, valign: "middle" },
            columnStyles: {
              0: { cellWidth: 140 },
              1: { cellWidth: 30, halign: "center" },
            },
          });

          return doc.lastAutoTable.finalY;
        }

        // Añadir las secciones de notas
        let currentY = 78;
        student.grades.forEach((section) => {
          currentY =
            addGradesSection(section.title, section.subjects, currentY) + 5;
        });

        // Promedio acumulado y pie de página
        const footerContent = [
          `PROMEDIO ACUMULADO EN EL PROGRAMA: ${student.average}`,
          `La nota mínima aprobatoria es de (3.0).`,
          ``,
          `Se expide en ${student.documentCity}, a los ${student.date}, por solicitud y con destino al interesado (a).`,
          ``,
          `Coordinador Académico`,
          `Cesar David Rodríguez Rodríguez`,
        ];
        doc.text(footerContent.join(" "), marginLeft, currentY, {
          maxWidth: 170,
          align: "justify",
        });

        // Guardar el PDF
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