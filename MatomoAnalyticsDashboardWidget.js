// Const for Matomo-API
const matomoUrl = "https://analytics.example.com"; // change it to the Matomo URL (analytic.example.com)
const tokenAuth = "API_KEY"; // change it -> API KEY (https://matomo.org/faq/general/faq_114/)
const siteId = args.widgetParameter || "1"; // Standard-Site-ID


// Functions for formatting the data for the API request
function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

async function fetchMatomoData(date1, date2) {
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    const url = `${matomoUrl}?module=API&method=VisitsSummary.getVisits&idSite=${siteId}&period=range&date=${formattedDate1},${formattedDate2}&format=JSON&token_auth=${tokenAuth}`;
    const request = new Request(url);
    const response = await request.loadJSON();
    return response.value;
}

async function fetchMatomoDataViews(date1, date2) {
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    const url = `${matomoUrl}?module=API&method=Actions.getPageUrls&idSite=${siteId}&period=range&date=${formattedDate1},${formattedDate2}&format=JSON&token_auth=${tokenAuth}`;
    const request = new Request(url);
    try {
        const response = await request.loadJSON();
        let totalViews = 0;
        response.forEach(page => {
            totalViews += page.nb_hits;
        });
        return totalViews;
    } catch (error) {
        console.error(`Error fetching Matomo data views: ${error}`);
        return 0; // Return a default/fallback value
    }
}

// Function to fetch real-time visitor data
async function fetchRealTimeVisitors() {
  const url = `${matomoUrl}?module=API&method=Live.getLastVisitsDetails&idSite=${siteId}&period=day&date=today&format=JSON&token_auth=${tokenAuth}`;
  try {
    const response = await new Request(url).loadJSON();
    return response.slice(0, 10); // Take the last 10 visits
  } catch (error) {
    console.error(`Error fetching real-time visitors: ${error}`);
    return []; // Empty if an error occurs
  }
}

// Hauptfunktion für das Abrufen und Berechnen der Daten
async function fetchDataAndCalculate() {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    const fourteenDaysAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 14);

    const currentData = await fetchMatomoData(sevenDaysAgo, currentDate);
    const previousData = await fetchMatomoData(fourteenDaysAgo, sevenDaysAgo);
    const currentDataViews = await fetchMatomoDataViews(sevenDaysAgo, currentDate);
    const previousDataViews = await fetchMatomoDataViews(fourteenDaysAgo, sevenDaysAgo);
    
    const realTimeVisitors = await fetchRealTimeVisitors();

    const percentChange = ((currentData - previousData) / previousData) * 100;
    const percentChangeViews = ((currentDataViews - previousDataViews) / previousDataViews) * 100;

    return { currentData, previousData, currentDataViews, previousDataViews, percentChange, percentChangeViews, realTimeVisitors };
}

// Configure widget
const widget = new ListWidget();
widget.url = matomoUrl; // open analytics link if widget klicket
widget.backgroundColor = new Color("#000000");

const widgetSize = config.widgetFamily;

(async () => {
    // Retrieve data for the widget
    const data = await fetchDataAndCalculate();

    if (widgetSize === 'small') {
        const title = widget.addText("📈 Statistics");
        title.font = Font.boldSystemFont(14);
        title.textColor = new Color("#ffffff");

        widget.addSpacer(4);

        const statsText = widget.addText(`last 7 days: ${data.currentData} 👤\nPrevious: ${data.previousData} 👤`);
        statsText.font = Font.systemFont(12);
        statsText.textColor = new Color("#ffffff");
        
        widget.addSpacer(4);
        
        const viewsText = widget.addText(`last 7 days: ${data.currentDataViews} 👁️‍🗨️\nPrevious: ${data.previousDataViews} 👁️‍🗨️`);
        viewsText.font = Font.systemFont(12);
        viewsText.textColor = new Color("#ffffff");

        widget.addSpacer(4);

        const changeText = widget.addText(`👤 Visitors: ${data.percentChange.toFixed(2)}%`);
        changeText.font = Font.systemFont(12);
        changeText.textColor = data.percentChange >= 0 ? new Color("#00fa9a") : new Color("#ff4500");
        
        const changeTextViews = widget.addText(`👁️‍🗨️ Views: ${data.percentChangeViews.toFixed(2)}%`);
        changeTextViews.font = Font.systemFont(12);
        changeTextViews.textColor = data.percentChange >= 0 ? new Color("#00fa9a") : new Color("#ff4500");
    } else if (widgetSize === 'medium') {
        const horizontalStack = widget.addStack();
        horizontalStack.layoutHorizontally();

        const leftStack = horizontalStack.addStack();
        leftStack.layoutVertically();

        const titleMedium = leftStack.addText("📈 Statistics");
        titleMedium.font = Font.boldSystemFont(14);
        titleMedium.textColor = new Color("#ffffff");

        leftStack.addSpacer(4);

        const statsText = leftStack.addText(`last 7 days: ${data.currentData} 👤\nPrevious: ${data.previousData} 👤`);
        statsText.font = Font.systemFont(12);
        statsText.textColor = new Color("#ffffff");
            
        leftStack.addSpacer(4);
            
        const viewsText = leftStack.addText(`last 7 days: ${data.currentDataViews} 👁️‍🗨️\nPrevious: ${data.previousDataViews} 👁️‍🗨️`);
        viewsText.font = Font.systemFont(12);
        viewsText.textColor = new Color("#ffffff");

        leftStack.addSpacer(4);

        const changeTextMedium = leftStack.addText(`👤 Visitors: ${data.percentChange.toFixed(2)}%`);
        changeTextMedium.font = Font.systemFont(12);
        changeTextMedium.textColor = data.percentChange >= 0 ? new Color("#00fa9a") : new Color("#ff4500");
        
        const changeTextViewsMedium = leftStack.addText(`👁️‍🗨️ Views: ${data.percentChangeViews.toFixed(2)}%`);
        changeTextViewsMedium.font = Font.systemFont(12);
        changeTextViewsMedium.textColor = data.percentChange >= 0 ? new Color("#00fa9a") : new Color("#ff4500");

        horizontalStack.addSpacer();
        const rightStack = horizontalStack.addStack();
        rightStack.layoutVertically();
        rightStack.size = new Size(0, 0);

        const placeholder = rightStack.addText("👤 Realtime Visitors");
        placeholder.font = Font.boldSystemFont(14);
        placeholder.textColor = new Color("#ffffff");
        
        rightStack.addSpacer(4);
        
        // Add real-time visitor data to the widget
        if (data.realTimeVisitors && data.realTimeVisitors.length > 0) {
            data.realTimeVisitors.forEach(visitor => {
                const visitorText = `${visitor.lastActionDateTime.split(' ')[1].substring(0, 5)} - ${visitor.country} - ${visitor.actionDetails.length} 👁️‍🗨️`;
                const textElement = rightStack.addText(visitorText);
                textElement.font = Font.systemFont(10);
                textElement.textColor = new Color("#ffffff");
            });
        } else {
            // Placeholder text in case there is no real-time visitor data
            const placeholder = rightStack.addText("No current visitor data available.");
            placeholder.font = Font.systemFont(12);
            placeholder.textColor = new Color("#ffffff");
        }
        
        //rightStack.addSpacer();
    }

    // Show Widget
    Script.setWidget(widget);
    Script.complete();

    if (widgetSize === 'small') {
        widget.presentSmall();
    } else if (widgetSize === 'medium') {
        widget.presentMedium();
    }
})();
