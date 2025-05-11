document.getElementById("file-input").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const typedarray = new Uint8Array(reader.result);

    pdfjsLib.getDocument({ data: typedarray }).promise.then(async function (pdf) {
      let textContent = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map(item => item.str).join(" ");
        textContent += pageText + "\n";
      }

      // Extração aprimorada
      const voo = textContent.match(/GLO\s?\d{3,4}/)?.[0] || "Não encontrado";
      const trechoOD = textContent.match(/(\b[A-Z]{4})-(\b[A-Z]{4})/) || [];
      const origem = trechoOD[1] || "Não encontrado";
      const destino = trechoOD[2] || "Não encontrado";

      // Pega o primeiro FL após "FL STEPS"
      const altMatch = textContent.match(/FL\s*STEPS\s*(?:[A-Z]{4}\/)?(\d{3})\//i);
      const alt = altMatch ? altMatch[1] : "Não encontrado";
      const altText = alt !== "Não encontrado" ? `FL${alt}` : alt;

      const altn = textContent.match(/ALTN\s+([A-Z]{4})/)?.[1] || "Não encontrado";
      const zfw = textContent.match(/ZFW\s+(\d{2,5})/)?.[1] || "Não encontrado";
      const tow = textContent.match(/TOW\s+(\d{2,5})/)?.[1] || "Não encontrado";
      const law = textContent.match(/LAW\s+(\d{2,5})/)?.[1] || "Não encontrado";
      const rota = textContent.match(/ROUTE ID:.*?([A-Z0-9\s\/]+?)SBGR/)?.[1]?.trim() || "Não encontrado";
      const metar = textContent.match(/SBGR.*?SA.*?Q\d{4}/)?.[0] || "Não encontrado";
      const finresAltn = textContent.match(/FINRES\+ALTN\s+(\d{2,5})/)?.[1] || "Não encontrado";
      const pax = textContent.match(/PAX\s+(\d+)/)?.[1] || "Não encontrado";
      const cargo = textContent.match(/CARGO\s+(\d+\.\d+)/)?.[1] || "Não encontrado";

      // Mostrar resultado
      document.getElementById("summary").innerHTML = `
        <h2>Resumo do OFP</h2>
        <p><strong>Número do Voo:</strong> ${voo}</p>
        <p><strong>Origem → Destino:</strong> ${origem} → ${destino}</p>
        <p><strong>Aeroporto Alternativo:</strong> ${altn}</p>
        <p><strong>Nível de Cruzeiro:</strong> ${altText}</p>
        <p><strong>ZFW (Peso sem combustível):</strong> ${zfw} kg</p>
        <p><strong>TOW (Peso na decolagem):</strong> ${tow} kg</p>
        <p><strong>LAW (Peso no pouso):</strong> ${law} kg</p>
        <p><strong>FINRES + ALTN (Reserva total):</strong> ${finresAltn} kg</p>
        <p><strong>Passageiros (PAX):</strong> ${pax}</p>
        <p><strong>Carga (CARGO):</strong> ${cargo} toneladas</p>
        <p><strong>Rota:</strong> ${rota}</p>
        <p><strong>METAR (SBGR):</strong> ${metar}</p>
      `;
    });
  };

  reader.readAsArrayBuffer(file);
});
