class BatteryMonitor {
    constructor() {
      this.battery = null; // Will hold the battery object
    }
  
    // Initialize the Battery Monitor
    async init() {
      try {
        // Check if Battery API is supported
        if (!navigator.getBattery) {
          throw new Error("Battery API is not supported on this browser.");
        }
  
        // Get the battery manager object
        this.battery = await navigator.getBattery();
  
        console.log("Battery Monitor Initialized");
        this.updateAllBatteryInfo();
  
        // Add event listeners
        this.battery.addEventListener("chargingchange", () =>
          this.updateChargeInfo()
        );
        this.battery.addEventListener("levelchange", () =>
          this.updateLevelInfo()
        );
      } catch (error) {
        console.error("Failed to initialize Battery Monitor:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  
    // Update all battery information initially
    updateAllBatteryInfo() {
      this.updateChargeInfo();
      this.updateLevelInfo();
    }
  
    // Log and check charging status
    updateChargeInfo() {
      try {
        const isCharging = this.battery.charging;
        console.log(`Battery charging? ${isCharging ? "Yes" : "No"}`);
      } catch (error) {
        console.error("Error updating charging info:", error.message);
      }
    }
  
    // Monitor and display battery level changes
    updateLevelInfo() {
      try {
        const batteryLevel = Math.floor(this.battery.level * 100);
        console.log(`Battery level: ${batteryLevel}%`);
  
        // Trigger alerts based on battery level and charging state
        if (this.battery.charging && batteryLevel === 85) {
          this.showAlert(
            `Warning: Battery at ${batteryLevel}%. Please unplug the charger.`
          );
        } else if (!this.battery.charging && batteryLevel === 59) {
          this.showAlert(
            `Warning: Battery at ${batteryLevel}%. Please plug in the charger.`
          );
        } else return;
        //  {
        //   this.showStatus(`Battery level: ${batteryLevel}%`);
        // }
      } catch (error) {
        console.error("Error updating battery level info:", error.message);
      }
    }
  
    // Function to show an alert
    showAlert(message) {
      alert(message);
    }
  }
  
  // Initialize the Battery Monitor class
  const batteryMonitor = new BatteryMonitor();
  batteryMonitor.init();
  