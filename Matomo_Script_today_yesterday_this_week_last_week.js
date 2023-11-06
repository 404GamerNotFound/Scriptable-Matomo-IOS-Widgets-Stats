// Configure your Matomo data
const matomoUrl = "https://MATOMO_URL.com"; // Replace with your Matomo URL
const siteId = "SITE_ID_FROM_MATOMO"; // Replace with the ID of your website in Matomo
const siteName = "Page.de"; // Replace with the name of your webpage
const tokenAuth = "MATOMO_AUTH_TOKEN"; // Replace with your Matomo API token

// Helper functions
async function fetchVisitorsCount(period, date) {
  const apiUrl = `${matomoUrl}/index.php?module=API&method=VisitsSummary.getVisits&idSite=${siteId}&period=${period}&date=${date}&format=JSON&token_auth=${tokenAuth}`;
  const request = new Request(apiUrl);
  const response = await request.loadJSON();
  return response.value || 0;
}

function getLastWeekDateRange() {
  const today = new Date();
  const pastDay = today.getDay();
  const lastSunday = new Date(today.setDate(today.getDate() - pastDay));
  const lastMonday = new Date(lastSunday.setDate(lastSunday.getDate() - 6));

  const format = (d) => d.toISOString().split('T')[0];
  return {
    start: format(lastMonday),
    end: format(lastSunday)
  };
}

// Main function that creates the widget
async function createWidget() {
  const todayVisitors = await fetchVisitorsCount('day', 'today');
  const yesterdayVisitors = await fetchVisitorsCount('day', 'yesterday');
  const weekVisitors = await fetchVisitorsCount('week', 'today');
  const lastWeekRange = getLastWeekDateRange();
  const lastWeekVisitors = await fetchVisitorsCount('range', `${lastWeekRange.start},${lastWeekRange.end}`);

  let widget = new ListWidget();
  
  // Title with the URL of the website
  let title = widget.addText(`${siteName}`);
  title.font = Font.boldSystemFont(16);

  widget.addText(`Today: ${todayVisitors}`);
  widget.addText(`Yesterday: ${yesterdayVisitors}`);
  widget.addText(`This Week: ${weekVisitors}`);
  widget.addText(`Last Week: ${lastWeekVisitors}`);

  return widget;
}

// Execute the script and display the widget
async function run() {
  let widget = await createWidget();
  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentSmall();
  }
  Script.complete();
}

run();
