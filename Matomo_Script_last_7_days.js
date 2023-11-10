// Read the parameter from the widget parameter
const widgetParameter = args.widgetParameter;

// Ensure that a parameter was passed
if (!widgetParameter) {
  throw new Error("Please make sure to enter a Site-ID as the widget parameter.");
}

// Parse the parameter to get the Site-ID
// Read the `siteId` from the widget parameter
const siteId = args.widgetParameter || "default-site-ID"; // Set a default Site-ID if none was provided

// Constants for the Matomo API
const matomoUrl = "https://analytics.example.com";
const tokenAuth = "your-auth-token";


// Create widget
const widget = new ListWidget();

// Set the widget's background color
widget.backgroundColor = new Color("#000000");

// API requests for the current and previous 7 days
const currentDate = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 7);
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(currentDate.getDate() - 14);

// Functions to format the dates for the API request
function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

async function fetchMatomoData(date1, date2) {
  const formattedDate1 = formatDate(date1);
  const formattedDate2 = formatDate(date2);
  const url = `${matomoUrl}?module=API&method=VisitsSummary.getVisits&idSite=${siteId}&period=range&date=${formattedDate1},${formattedDate2}&format=JSON&token_auth=${tokenAuth}`;
  const response = await new Request(url).loadJSON();
  return response.value;
}

async function fetchMatomoDataViews(date1, date2) {
  const formattedDate1 = formatDate(date1);
  const formattedDate2 = formatDate(date2);
  const url = `${matomoUrl}?module=API&method=Actions.getPageUrls&idSite=${siteId}&period=range&date=${formattedDate1},${formattedDate2}&format=JSON&token_auth=${tokenAuth}`;
  
  try {
    const response = await new Request(url).loadJSON();

    // Calculate the total number of page views
    let totalViews = 0;
    response.forEach(page => {
      totalViews += page.nb_hits;
    });

    return totalViews;
  } catch (error) {
    return null; // or set a default value
  }
}


// Fetch data
const currentData = await fetchMatomoData(sevenDaysAgo, currentDate);
const previousData = await fetchMatomoData(fourteenDaysAgo, sevenDaysAgo);

const currentDataViews = await fetchMatomoDataViews(sevenDaysAgo, currentDate);
const previousDataViews = await fetchMatomoDataViews(fourteenDaysAgo, sevenDaysAgo);

// Calculate percentage change
const percentChange = (currentData - previousData) / previousData * 100;
const percentChangeViews = (currentDataViews - previousDataViews) / previousDataViews * 100;

// Add widget text
const title = widget.addText("📈 Statistics");
title.font = Font.boldSystemFont(14);
title.textColor = new Color("#ffffff");

widget.addSpacer(4);

// Use emojis for a visual representation
const currentVisitorsText = `last 7 days: ${currentData} 👤`;
const previousVisitorsText = `Previous: ${previousData} 👤`;

const currentViewsText = `last 7 days: ${currentDataViews} 👁️‍🗨️`;
const previousViewsText = `Previous: ${previousDataViews} 👁️‍🗨️`;

// Group visitor and page view counts
const statsText = widget.addText(`${currentVisitorsText}\n${currentViewsText}\n\n${previousVisitorsText}\n${previousViewsText}`);
statsText.font = Font.systemFont(12);
statsText.textColor = new Color("#ffffff");

widget.addSpacer(4);

const percentChangeText = `Visitors: ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
const percentChangeViewsText = `Views: ${percentChangeViews >= 0 ? '+' : ''}${percentChangeViews.toFixed(2)}%`;

// Combine percentage changes in one line if space is limited
const changeText = widget.addText(`${percentChangeText}`);
changeText.font = Font.systemFont(12);
changeText.textColor = percentChange >= 0 ? new Color("#00fa9a") : new Color("#ff4500");

const changeTextView = widget.addText(`${percentChangeViewsText}`);
changeTextView.font = Font.systemFont(12);
changeTextView.textColor = percentChangeViews >= 0 ? new Color("#00fa9a") : new Color("#ff4500");

// Display widget
Script.setWidget(widget);
Script.complete();

widget.presentSmall();
