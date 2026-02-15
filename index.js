async function renderSiteList() {
  const list = document.getElementById("site-list");

  try {
    const response = await fetch("./sites.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load sites.json (${response.status})`);
    }

    const data = await response.json();
    const sites = Array.isArray(data.sites) ? data.sites : [];

    if (sites.length === 0) {
      list.innerHTML = "<li>No micro-sites found yet.</li>";
      return;
    }

    list.innerHTML = "";
    for (const site of sites) {
      const item = document.createElement("li");

      const link = document.createElement("a");
      link.href = site.path;
      link.textContent = site.name;
      item.appendChild(link);

      if (site.description) {
        const description = document.createElement("div");
        description.className = "site-description";
        description.textContent = site.description;
        item.appendChild(description);
      }

      list.appendChild(item);
    }
  } catch (error) {
    list.innerHTML = "<li>Could not load sites list.</li>";
    console.error(error);
  }
}

renderSiteList();
