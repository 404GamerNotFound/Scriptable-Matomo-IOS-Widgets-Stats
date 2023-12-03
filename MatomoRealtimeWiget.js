// Const for Matomo-API
const matomoUrl = "https://analytics.example.com"; // change it to the Matomo URL (analytic.example.com)
const tokenAuth = "API_KEY"; // change it -> API KEY (https://matomo.org/faq/general/faq_114/)
const siteId = args.widgetParameter || "1"; // Standard-Site-ID

// Realtime function
async function fetchRealTimeVisitors() {
    const url = `${matomoUrl}?module=API&method=Live.getLastVisitsDetails&idSite=${siteId}&period=day&date=today&format=JSON&token_auth=${tokenAuth}`;
    try {
        const response = await new Request(url).loadJSON();
        return response.slice(0, 10); // Nehmen Sie die letzten 10 Besuche
    } catch (error) {
        console.error(`Fehler beim Abrufen der Echtzeit-Besucher: ${error}`);
        return []; // Leer, wenn ein Fehler auftritt
    }
}

// create Widget
async function createWidget() {
    let widget = new ListWidget();
    widget.url = matomoUrl;
    widget.backgroundColor = new Color("#000000");

    const realTimeVisitors = await fetchRealTimeVisitors();
    
    // Titke
    const title = widget.addText("👤 Echtzeit-Besucher");
    title.font = Font.boldSystemFont(14);
    title.textColor = new Color("#ffffff");
    
    widget.addSpacer(4);
    
    // Add realtime users
    realTimeVisitors.forEach(visitor => {
        const visitorText = `${visitor.lastActionDateTime.split(' ')[1].substring(0, 5)} - ${visitor.country} - ${visitor.actionDetails.length} 👁️‍🗨️`;
        const textElement = widget.addText(visitorText);
        textElement.font = Font.systemFont(10);
        textElement.textColor = new Color("#ffffff");
    });
    
    return widget;
}

async function createLargeWidget(realTimeVisitors) {
    let widget = new ListWidget();
    widget.url = matomoUrl;
    widget.addSpacer(4);
    
    // Titel
    let title = widget.addText("👤 Real-Time Visitors");
    title.font = Font.boldSystemFont(16);
    title.textColor = Color.blue();
    widget.addSpacer(5);
    
    // Add realtime users
    for (let i = 0; i < realTimeVisitors.length && i < 8; i++) {
        const visitor = realTimeVisitors[i];
        const time = visitor.lastActionDateTime.split(' ')[1].substring(0, 5); // Nur Uhrzeit
        const visitorText = `${time} | ${visitor.country} | Actions: ${visitor.actions}`;
        const deviceText = `Device: ${visitor.deviceType} | OS: ${visitor.operatingSystem} | Browser: ${visitor.browser}`;
        const ipText = `IP: ${visitor.visitIp}`;
        
        let visitorInfo = widget.addText(visitorText);
        visitorInfo.font = Font.systemFont(12);
        visitorInfo.textColor = Color.darkGray();
        
        let deviceInfo = widget.addText(deviceText);
        deviceInfo.font = Font.systemFont(10);
        deviceInfo.textColor = Color.gray();
        
        let ipInfo = widget.addText(ipText);
        ipInfo.font = Font.systemFont(10);
        ipInfo.textColor = Color.gray();
        
        widget.addSpacer(3);
    }
    
    
    return widget;
}


async function createMediumWidget(realTimeVisitors) {
    let widget = new ListWidget();
    widget.url = matomoUrl;
    widget.addSpacer(4);
    
    // Titel
    let title = widget.addText("👤 Real-Time Visitors");
    title.font = Font.boldSystemFont(16);
    title.textColor = Color.blue();
    widget.addSpacer(5);
    
    // Add realtime users
    for (let i = 0; i < realTimeVisitors.length && i < 3; i++) {
        const visitor = realTimeVisitors[i];
        const time = visitor.lastActionDateTime.split(' ')[1].substring(0, 5);
        const visitorText = `${time} | ${visitor.country} | Actions: ${visitor.actions}`;
        const deviceText = `Device: ${visitor.deviceType} | OS: ${visitor.operatingSystem} | Browser: ${visitor.browser}`;
        const ipText = `IP: ${visitor.visitIp}`;
        
        let visitorInfo = widget.addText(visitorText);
        visitorInfo.font = Font.systemFont(12);
        visitorInfo.textColor = Color.darkGray();
        
        let deviceInfo = widget.addText(deviceText);
        deviceInfo.font = Font.systemFont(10);
        deviceInfo.textColor = Color.gray();
        
        let ipInfo = widget.addText(ipText);
        ipInfo.font = Font.systemFont(10);
        ipInfo.textColor = Color.gray();
        
        widget.addSpacer(3);
    }
    
    
    return widget;
}


async function createSmallWidget(realTimeVisitors) {
    let widget = new ListWidget();
    widget.url = matomoUrl;
    widget.addSpacer(4);
    
    // Titel
    let title = widget.addText("👤 Real-Time Visitors");
    title.font = Font.boldSystemFont(16);
    title.textColor = Color.blue();
    widget.addSpacer(5);
    
    // Add realtime users
    for (let i = 0; i < realTimeVisitors.length && i < 5; i++) {
        const visitor = realTimeVisitors[i];
        const time = visitor.lastActionDateTime.split(' ')[1].substring(0, 5);
        const visitorText = `${time} ${visitor.country} 👁️‍🗨️ ${visitor.actions}`;
        
        let visitorInfo = widget.addText(visitorText);
        visitorInfo.font = Font.systemFont(12);
        visitorInfo.textColor = Color.darkGray();
        
        widget.addSpacer(3);
    }
    
    
    return widget;
}


// Run script, show widget
async function run() {
    let realTimeVisitors = await fetchRealTimeVisitors();
    let widget;
    
    if (config.widgetFamily === 'small') {
        widget = await createSmallWidget(realTimeVisitors);
    } else if (config.widgetFamily === 'medium') {
        widget = await createMediumWidget(realTimeVisitors);
    } else {
        widget = await createLargeWidget(realTimeVisitors);
    }
    
    Script.setWidget(widget);
    Script.complete();
}

run();
