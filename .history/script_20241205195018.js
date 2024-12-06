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
  
        doc.addImage(backgroundImage, "JPEG", (width - 150) / 2, (height - 150) / 2, 150, 150, undefined, "FAST");
  
        doc.setFont("helvetica", "normal").setFontSize(8);
        ["Fundación Bilingües Centro Colombiano de Lenguas Modernas",
          "Institución para el Trabajo y Desarrollo Humano",
          "Personería Jurídica No. 5461 del 03 de diciembre de 2004",
          "Licencia de Funcionamiento No. 06-003 de 2010"].forEach((line, i) => {
          doc.text(line, width / 2, 10 + i * 4, { align: "center" });
        });
  
        doc.setFontSize(10).setFont(undefined, "bold").text("CERTIFICA:", width / 2, 30, { align: "center" });
  
        const text = `
          Que el (a) estudiante ${student.fullName}, identificado (a) con ${student.documentType} ${student.documentNumber} de ${student.documentCity},
          CURSÓ Y APROBÓ el plan de estudios del programa ${student.program}, con una intensidad horaria de ${student.intensity} horas.
          Programa aprobado según Resolución No. 06-098 del 2019. Obteniendo las siguientes calificaciones:
        `;
        doc.setFont(undefined, "normal").setFontSize(10).text(text, 20, 40, { maxWidth: 170, align: "justify" });
  
        let currentY = 78;
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
  