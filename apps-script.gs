/**
 * Script do convite do João Marcelo — grava as confirmações de presença
 * em uma planilha do Google Sheets.
 *
 * COMO USAR: veja o passo a passo completo no README.md deste projeto.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Confirmações") ||
                SpreadsheetApp.getActiveSpreadsheet().insertSheet("Confirmações");

  // Cria o cabeçalho na primeira vez
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Data/Hora", "Nome", "Acompanhantes", "Total de pessoas", "Status"]);
  }

  const params = e.parameter;
  const nome = params.nome || "";
  const acompanhantes = params.acompanhantes || "";
  const total = params.total || "1";
  const status = params.status || "Confirmado";

  sheet.appendRow([new Date(), nome, acompanhantes, total, status]);

  return ContentService.createTextOutput(JSON.stringify({ result: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("O script está no ar. Use o formulário do convite para enviar confirmações.");
}
