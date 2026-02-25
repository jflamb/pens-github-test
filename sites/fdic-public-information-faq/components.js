function parseJsonAttribute(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function externalLinkAttrs(href) {
  return /^https?:\/\//i.test(href || "") ? ' target="_blank" rel="noopener noreferrer"' : "";
}

class FDICSiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header class="usa-header usa-header--basic" role="banner">
      <div class="grid-container header-inner">
        <div class="usa-logo site-logo" id="logo">
          <a class="logo-img" href="https://www.fdic.gov" target="_blank" rel="noopener noreferrer" aria-label="FDIC Home">
            <img src="https://www.fdic.gov/themes/custom/fdic_theme/fdic-logo-white-noseal.svg" alt="" />
          </a>
        </div>
        <nav class="tbm tbm-main tbm-no-arrows" id="tbm-main" aria-label="Main navigation">
          <ul class="tbm-nav level-0 items-4">
            <li class="tbm-item level-1"><a class="tbm-link level-1" href="https://www.fdic.gov/about" target="_blank" rel="noopener noreferrer">About</a></li>
            <li class="tbm-item level-1"><a class="tbm-link level-1" href="https://www.fdic.gov/resources" target="_blank" rel="noopener noreferrer">Resources</a></li>
            <li class="tbm-item level-1"><a class="tbm-link level-1" href="https://www.fdic.gov/analysis" target="_blank" rel="noopener noreferrer">Analysis</a></li>
            <li class="tbm-item level-1"><a class="tbm-link level-1" href="https://www.fdic.gov/news" target="_blank" rel="noopener noreferrer">News</a></li>
          </ul>
        </nav>
      </div>
    </header>`;
  }
}

class FDICSiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="usa-footer usa-footer--medium">
      <div class="footer-primary">
        <div class="grid-container footer-primary-grid">
          <section>
            <p class="footer-title">CONTACT THE FDIC</p>
            <a class="usa-button" href="https://www.fdic.gov/contact" target="_blank" rel="noopener noreferrer">Contact Us</a>
          </section>
          <section>
            <p class="footer-title">STAY INFORMED</p>
            <form class="subscribe-form" action="https://public.govdelivery.com/accounts/USFDIC/subscribers/qualify" method="post" target="_blank">
              <label for="email" class="visually-hidden">Enter your email address</label>
              <input id="email" name="email" type="email" placeholder="Enter your email address" />
              <button class="usa-button" type="submit">Subscribe</button>
            </form>
          </section>
          <section>
            <p class="footer-title">HOW CAN WE HELP YOU?</p>
            <a class="usa-button" href="https://ask.fdic.gov/fdicinformationandsupportcenter/s/?language=en_US" target="_blank" rel="noopener noreferrer">Get Started</a>
          </section>
        </div>
      </div>

      <div class="footer-secondary">
        <div class="grid-container">
          <nav class="footer-secondary-menu" aria-label="Footer Secondary Menu">
            <ul class="menu menu--footer-secondary-menu nav">
              <li><a href="https://www.fdic.gov/about/website-policies" target="_blank" rel="noopener noreferrer">Policies</a></li>
              <li><a href="https://www.fdic.gov/help" target="_blank" rel="noopener noreferrer">Help</a></li>
              <li><a href="https://www.fdic.gov/foia" target="_blank" rel="noopener noreferrer">FOIA</a></li>
              <li><a href="https://www.fdic.gov/espanol" target="_blank" rel="noopener noreferrer">En Español</a></li>
              <li><a href="https://www.fdic.gov/about/fdic-accessibility-statement" target="_blank" rel="noopener noreferrer">Accessibility</a></li>
              <li><a href="https://www.fdic.gov/about/open-government" target="_blank" rel="noopener noreferrer">Open Government</a></li>
              <li><a href="https://www.usa.gov" target="_blank" rel="noopener noreferrer">usa.gov</a></li>
              <li><a href="https://www.fdic.gov/about/contact-fdic" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><a href="https://www.fdic.gov/about/privacy-program" target="_blank" rel="noopener noreferrer">Privacy</a></li>
              <li><a href="https://www.fdic.gov/about/plain-writing-act-2010" target="_blank" rel="noopener noreferrer">Plain Writing</a></li>
              <li><a href="https://www.fdic.gov/about/no-fear-act" target="_blank" rel="noopener noreferrer">No Fear Act Data</a></li>
              <li><a href="https://www.fdicoig.gov" target="_blank" rel="noopener noreferrer">Inspector General</a></li>
            </ul>
          </nav>
          <a class="back-link" href="../../index.html">Back to all sites</a>
        </div>
      </div>
    </footer>`;
  }
}

class FDICBreadcrumb extends HTMLElement {
  connectedCallback() {
    const crumbs = parseJsonAttribute(this.getAttribute("crumbs"), []);
    const items = crumbs
      .map((crumb) => {
        const label = escapeHtml(crumb?.label || "");
        if (crumb?.href) {
          return `<li class="fdic-breadcrumb__item"><a class="fdic-breadcrumb__item__link" href="${escapeHtml(crumb.href)}"${externalLinkAttrs(crumb.href)}>${label}</a></li>`;
        }
        return `<li class="fdic-breadcrumb__item"><span aria-current="page">${label}</span></li>`;
      })
      .join("");

    this.innerHTML = `<nav class="fdic-breadcrumb" aria-label="Breadcrumb"><ol class="fdic-breadcrumb__list">${items}</ol></nav>`;
  }
}

class FDICShareBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="share-bar" aria-label="Share this page">
      <span class="share-label">Share This:</span>
      <a class="share-action" href="#" aria-label="Share on Facebook"><span class="share-icon fa-brands fa-facebook-f" aria-hidden="true"></span><span class="visually-hidden">Share on Facebook</span></a>
      <a class="share-action" href="#" aria-label="Share on X"><span class="share-icon fa-brands fa-x-twitter" aria-hidden="true"></span><span class="visually-hidden">Share on X</span></a>
      <a class="share-action" href="#" aria-label="Share on LinkedIn"><span class="share-icon fa-brands fa-linkedin-in" aria-hidden="true"></span><span class="visually-hidden">Share on LinkedIn</span></a>
      <a class="share-action" href="#" aria-label="Share through email"><span class="share-icon fa-solid fa-envelope" aria-hidden="true"></span><span class="visually-hidden">Share through email</span></a>
      <a class="share-action" href="#" aria-label="Print this page"><span class="share-icon fa-solid fa-print" aria-hidden="true"></span><span class="visually-hidden">Print this page</span></a>
    </div>`;
  }
}

class FDICSupportNav extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") || "";
    const items = [
      { label: "Information and Support Center", href: "index.html" },
      { label: "Report a Problem", href: "report-problem.html?mode=report" },
      { label: "Ask a Question", href: "report-problem.html?mode=ask" },
      { label: "Get Help with a Failed Bank", href: "report-problem.html?mode=failed" },
      { label: "View My Cases", href: "view-cases.html" },
    ];

    this.innerHTML = `<aside class="support-sidenav" aria-label="Support navigation">${items
      .map((item) => `<a class="support-nav-item${item.href === active ? " selected" : ""}" href="${item.href}">${item.label}</a>`)
      .join("")}</aside>`;
  }
}

class FDICSupportCard extends HTMLElement {
  connectedCallback() {
    const href = this.getAttribute("href") || "#";
    const heading = escapeHtml(this.getAttribute("heading") || "");
    const description = escapeHtml(this.getAttribute("description") || "");
    const cta = escapeHtml(this.getAttribute("cta") || "");

    this.innerHTML = `<article class="support-card">
      <a class="support-card-link" href="${escapeHtml(href)}">
        <h3>${heading}</h3>
        <p>${description}</p>
        <span class="support-card-cta">${cta}</span>
      </a>
    </article>`;
  }
}

class FDICLabeledInput extends HTMLElement {
  connectedCallback() {
    const label = escapeHtml(this.getAttribute("label") || "");
    const inputId = this.getAttribute("input-id") || "";
    const type = this.getAttribute("input-type") || "text";
    const autocomplete = this.getAttribute("autocomplete");
    const placeholder = this.getAttribute("placeholder");
    const required = this.hasAttribute("required");
    const wrapperClass = this.getAttribute("wrapper-class");
    const isSelect = (this.getAttribute("input-tag") || "").toLowerCase() === "select" || type.toLowerCase() === "select";
    const markerId = this.getAttribute("required-marker-id");
    const markerHidden = this.hasAttribute("required-marker-hidden");

    const requiredMarker = required || markerId
      ? ` <span${markerId ? ` id="${escapeHtml(markerId)}"` : ""} class="report-required-marker" aria-hidden="true"${markerHidden ? " hidden" : ""}>*</span>`
      : "";
    const requiredAttrs = required ? ' required aria-required="true"' : "";
    const autocompleteAttr = autocomplete ? ` autocomplete="${escapeHtml(autocomplete)}"` : "";
    const placeholderAttr = placeholder ? ` placeholder="${escapeHtml(placeholder)}"` : "";
    const classAttr = wrapperClass ? ` class="${escapeHtml(wrapperClass)}"` : "";

    let control = "";
    if (isSelect) {
      const options = parseJsonAttribute(this.getAttribute("options"), []);
      const optionMarkup = Array.isArray(options)
        ? options
            .map((opt) => `<option value="${escapeHtml(opt?.value ?? "")}">${escapeHtml(opt?.label ?? "")}</option>`)
            .join("")
        : "";
      control = `<select id="${escapeHtml(inputId)}" class="report-select" data-fdic-input${requiredAttrs}>${optionMarkup}</select>`;
    } else {
      control = `<input id="${escapeHtml(inputId)}" class="report-input" type="${escapeHtml(type)}" data-fdic-input${autocompleteAttr}${placeholderAttr}${requiredAttrs} />`;
    }

    this.innerHTML = `<div${classAttr}>
      <label class="report-label report-label--compact" for="${escapeHtml(inputId)}">${label}${requiredMarker}</label>
      ${control}
    </div>`;
  }
}

class FDICStepActions extends HTMLElement {
  connectedCallback() {
    const backHref = this.getAttribute("back-href");
    const backId = this.getAttribute("back-id");
    const backLabel = escapeHtml(this.getAttribute("back-label") || "Back");
    const nextId = escapeHtml(this.getAttribute("next-id") || "");
    const nextLabel = escapeHtml(this.getAttribute("next-label") || "Continue");
    const nextType = escapeHtml(this.getAttribute("next-type") || "button");
    const nextHref = this.getAttribute("next-href");
    const actionsLabel = escapeHtml(this.getAttribute("actions-label") || "Form actions");
    const extraClass = this.getAttribute("extra-class");

    const backButton = backHref
      ? `<a${backId ? ` id="${escapeHtml(backId)}"` : ""} class="step-btn prev" href="${escapeHtml(backHref)}"><span class="icon" aria-hidden="true">&#8249;</span>${backLabel}</a>`
      : "";

    const nextControl = nextHref
      ? `<a${nextId ? ` id="${nextId}"` : ""} class="step-btn next" href="${escapeHtml(nextHref)}">${nextLabel}<span class="icon" aria-hidden="true">&#8250;</span></a>`
      : `<button${nextId ? ` id="${nextId}"` : ""} type="${nextType}" class="step-btn next">${nextLabel}<span class="icon" aria-hidden="true">&#8250;</span></button>`;

    this.innerHTML = `<div class="report-actions${extraClass ? ` ${escapeHtml(extraClass)}` : ""}" aria-label="${actionsLabel}">${backButton}${nextControl}</div>`;
  }
}

class FDICProgressTracker extends HTMLElement {
  connectedCallback() {
    const steps = parseJsonAttribute(this.getAttribute("steps"), []);

    this.innerHTML = `<aside class="report-progress-aside" aria-label="Form progress">
      <div class="report-progress" aria-live="polite">
        <h3 class="report-progress-title">Your progress</h3>
        <ul id="progress-list" class="report-progress-list">${steps
          .map(
            (step) =>
              `<li id="${escapeHtml(step?.id || "")}" class="progress-item is-incomplete"><span class="progress-label">${escapeHtml(step?.label || "")}</span></li>`,
          )
          .join("")}</ul>
      </div>
    </aside>`;
  }
}

class FDICReviewSummary extends HTMLElement {
  connectedCallback() {
    const dlId = escapeHtml(this.getAttribute("dl-id") || "review-summary");
    const idPrefix = escapeHtml(this.getAttribute("id-prefix") || "review");
    const endpointLabel = escapeHtml(this.getAttribute("endpoint-label") || "Routing destination");

    this.innerHTML = `<dl id="${dlId}" class="review-summary" hidden>
      <dt>Request type</dt>
      <dd id="${idPrefix}-intent"></dd>
      <dt>Concern topic</dt>
      <dd id="${idPrefix}-topic"></dd>
      <dt>Issue details</dt>
      <dd id="${idPrefix}-details"></dd>
      <dt>Desired outcome</dt>
      <dd id="${idPrefix}-outcome"></dd>
      <dt>Name</dt>
      <dd id="${idPrefix}-name"></dd>
      <dt>Email</dt>
      <dd id="${idPrefix}-email"></dd>
      <dt>Business phone</dt>
      <dd id="${idPrefix}-phone"></dd>
      <dt>Mailing address</dt>
      <dd id="${idPrefix}-address"></dd>
      <dt>Desired resolution details</dt>
      <dd id="${idPrefix}-resolution"></dd>
      <dt>${endpointLabel}</dt>
      <dd id="${idPrefix}-endpoint"></dd>
    </dl>`;
  }
}

if (!customElements.get("fdic-site-header")) customElements.define("fdic-site-header", FDICSiteHeader);
if (!customElements.get("fdic-site-footer")) customElements.define("fdic-site-footer", FDICSiteFooter);
if (!customElements.get("fdic-breadcrumb")) customElements.define("fdic-breadcrumb", FDICBreadcrumb);
if (!customElements.get("fdic-share-bar")) customElements.define("fdic-share-bar", FDICShareBar);
if (!customElements.get("fdic-support-nav")) customElements.define("fdic-support-nav", FDICSupportNav);
if (!customElements.get("fdic-support-card")) customElements.define("fdic-support-card", FDICSupportCard);
if (!customElements.get("fdic-labeled-input")) customElements.define("fdic-labeled-input", FDICLabeledInput);
if (!customElements.get("fdic-step-actions")) customElements.define("fdic-step-actions", FDICStepActions);
if (!customElements.get("fdic-progress-tracker")) customElements.define("fdic-progress-tracker", FDICProgressTracker);
if (!customElements.get("fdic-review-summary")) customElements.define("fdic-review-summary", FDICReviewSummary);
