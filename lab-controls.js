const root = document.documentElement;
const themeButton = document.querySelector("#themeToggle");
const toolbar = document.querySelector("#labToolbar");
const preview = document.querySelector("#devicePreview");
const frame = document.querySelector("#previewFrame");
const closeButton = document.querySelector("#closePreview");

if (root && themeButton) {
    root.dataset.theme = localStorage.getItem("lab-theme") || "dark";

    themeButton.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = nextTheme;
        localStorage.setItem("lab-theme", nextTheme);
    });
}

document.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => {
const width = Number(button.dataset.preview);

if (!preview || !frame || !width) return;

frame.style.setProperty("--preview-width", `${width}px`);
preview.hidden = false;

const pageUrl = new URL(window.location.href);
pageUrl.searchParams.set("preview", "1");
frame.src = pageUrl.href;
    });
});

if (closeButton && preview && frame) {
    closeButton.addEventListener("click", () => {
        preview.hidden = true;
        frame.src = "about:blank";
    });
}

if (new URLSearchParams(window.location.search).has("preview") && toolbar) {
    toolbar.hidden = true;
}