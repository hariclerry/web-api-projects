class BatteryMonitor {
    constructor() {
      this.init();
    }
  
    // Initialize battery monitoring
    init() {
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          this.battery = battery;
  
          // Send initial battery status
          this.sendBatteryStatus();
  
          // Listen for battery status changes
          battery.addEventListener("levelchange", () => this.sendBatteryStatus());
          battery.addEventListener("chargingchange", () => this.sendBatteryStatus());
        });
      } else {
        console.error("Battery API is not supported in this browser.");
      }
  
      // Add listener for messages from the background script
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "showAlert") {
          this.handleBatteryAlert(message.level, message.charging);
          sendResponse({ success: true });
        }
      });
    }
  
    // Send the current battery status to the background script
    sendBatteryStatus() {
      if (!this.battery) return;
  
      chrome.runtime.sendMessage(
        {
          type: "batteryStatus",
          level: Math.floor(this.battery.level * 100),
          charging: this.battery.charging,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending battery status:", chrome.runtime.lastError.message);
          }
        }
      );
    }
  
    // Display alerts based on battery level and charging state
    handleBatteryAlert(level, charging) {
      if (charging && level === 25) {
        alert(`Battery Warning: Battery is at ${level}%. Please unplug the charger.`);
      } else if (!charging && level === 80) {
        alert(`Battery Warning: Battery is at ${level}%. Please plug in the charger.`);
      }
    }
  }
  
  // Initialize the BatteryMonitor
  new BatteryMonitor();