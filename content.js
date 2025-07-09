(async () => {
  console.log("✅ Injection de la sidebar");

  // Inject CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("sidebar.css");
  document.head.appendChild(link);

  // Inject HTML (structure seulement)
  const html = await fetch(chrome.runtime.getURL("sidebar-body.html")).then(res => res.text());
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Inject Script
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("sidebar.js");
  document.body.appendChild(script);

  function createLinkItem(href) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = href;
    a.target = "_blank";
  
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(href);
    };
  
    div.appendChild(a);
    div.appendChild(copyBtn);
    return div;
  }
  
  function createImageItem(src) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = src;
    img.className = "thumbnail";
  
    const dlBtn = document.createElement("button");
    dlBtn.textContent = "⬇️";
    dlBtn.onclick = () => {
      console.log("Downloading image message :", src);
      chrome.runtime.sendMessage({ type: "download", url: src });
    };
  
    div.appendChild(img);
    div.appendChild(dlBtn);
    return div;
  }
  
  // Lister tous les liens
  const links = [...new Set([...document.querySelectorAll("a[href]")].map(a => a.href))].sort();
  links.forEach(href => {
    const item = createLinkItem(href);
    document.getElementById("link-list").appendChild(item);
  });
  
  // Lister toutes les images
  const images = [...new Set([...document.querySelectorAll("img[src]")].map(img => img.src))].sort();
  images.forEach(src => {
    const item = createImageItem(src);
    document.getElementById("image-list").appendChild(item);
  });

  document.getElementById("sidebar-counter").textContent =
  `${document.querySelectorAll("a[href]").length} liens / ${document.querySelectorAll("img[src]").length} images`;


  const sidebar = document.getElementById("custom-sidebar");

  // Bouton de fermeture
  const closeBtn = document.getElementById("close-sidebar");
  closeBtn.onclick = () => {
    sidebar.style.opacity = "0";
    sidebar.style.transform = "translateX(100%)";

    // Créer le bouton flottant pour réouverture
    const reopenBtn = document.createElement("div");
    reopenBtn.id = "reopen-sidebar-btn";
    reopenBtn.textContent = "📑";
    reopenBtn.title = "Réouvrir la sidebar";
    Object.assign(reopenBtn.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#007bff",
      color: "white",
      padding: "10px 12px",
      borderRadius: "50%",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      cursor: "pointer",
      zIndex: 10000,
      fontSize: "22px"
    });
    document.body.appendChild(reopenBtn);

    reopenBtn.onclick = () => {
      sidebar.style.opacity = "1";
      sidebar.style.transform = "translateX(0)";
      reopenBtn.remove();
    };
  };


})();

