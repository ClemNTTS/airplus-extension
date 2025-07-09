chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(`🔔 Message de téléchargement : ${msg.url}`)
  if (msg.type === "download") {
    try {
      const filename = msg.url.split('/').pop() || 'image.jpg';
      chrome.downloads.download({
        url: msg.url,
        filename,
        saveAs: true
      });
    } catch (err) {
      console.error("❌ Erreur de téléchargement :", err);
    }
  }
});
