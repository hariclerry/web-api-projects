chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "batteryStatus") {
      const { level, charging } = message;
  
      // Send a message to the active tab
      sendMessageToActiveTab({ type: "showAlert", level, charging })
        .then(() => {
          console.log("Battery status sent to content script.");
          sendResponse({ success: true });
        })
        .catch((error) => {
          console.error("Error sending battery status:", error);
          sendResponse({ success: false, error });
        });
  
      // Return true to indicate an async response will be sent
      return true;
    }
  });
  
  // Helper function to send a message to the active tab
  function sendMessageToActiveTab(message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        } else {
          reject(new Error("No active tab found."));
        }
      });
    });
  }