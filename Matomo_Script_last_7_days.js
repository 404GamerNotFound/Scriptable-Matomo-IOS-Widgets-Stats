
// Konstanten für die Matomo-API
const matomoUrl = "Matomo_URL";
const siteId = "SITE_ID"; // Ersetze mit deiner Site-ID
const tokenAuth = "TOKEN";


// Widget erstellen
const widget = new ListWidget();

// Hintergrundfarbe des Widgets setzen
widget.backgroundColor = new Color("#000000");

// API-Anfragen für die aktuellen und vorherigen 7 Tage
const currentDate = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 7);
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(currentDate.getDate() - 14);

// Funktionen zum Formatieren von Datumsangaben für die API-Anfrage
function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

async function fetchMatomoData(date1, date2) {
  const formattedDate1 = formatDate(date1);
  const formattedDate2 = formatDate(date2);
  const url = `${matomoUrl}?module=API&method=VisitsSummary.getVisits&idSite=${siteId}&period=range&date=${formattedDate1},${formattedDate2}&format=JSON&token_auth=${tokenAuth}`;
  console.log(`Anfrage-URL: ${url}`);
  const response = await new Request(url).loadJSON();
  console.log(`API-Antwort: ${JSON.stringify(response)}`);
  return response.value; // Hier anpassen basierend auf der tatsächlichen Antwortstruktur
}

// Daten abrufen
const currentData = await fetchMatomoData(sevenDaysAgo, currentDate);
const previousData = await fetchMatomoData(fourteenDaysAgo, sevenDaysAgo);

// Prozentuale Änderung berechnen
const percentChange = (currentData - previousData) / previousData * 100;

// Widget-Texte hinzufügen
const title = widget.addText("Besuchermenge (7 Tage)");
title.font = Font.boldSystemFont(16);

widget.addSpacer(5);

const currentVisitors = widget.addText(`Aktuell: ${currentData}`);
currentVisitors.font = Font.systemFont(14);

const previousVisitors = widget.addText(`Früher: ${previousData}`);
previousVisitors.font = Font.systemFont(14);

const percentText = widget.addText(`${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`);
percentText.font = Font.systemFont(14);
percentText.textColor = percentChange >= 0 ? Color.green() : Color.red();

widget.addSpacer(5);

// Seitenaufrufe ebenfalls anzeigen (ähnlicher API-Aufruf und Logik)

// Widget anzeigen
Script.setWidget(widget);
Script.complete();

widget.presentSmall();
