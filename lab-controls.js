const root = document.documentElement;
const themeButton = document.querySelector("#themeToggle");
const toolbar = document.querySelector("#labToolbar");
const preview = document.querySelector("#devicePreview");
const frame = document.querySelector("#previewFrame");

const savedTheme = localStorage.getItem("lab-theme") || "dark";
root.dataset.theme = savedTheme;

themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("lab-theme", nextTheme);
});

document.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => {
        const width = Number(button.dataset.preview);
        frame.src = new URL("lab6.html?preview=1", location.href).href;
        frame.style.setProperty("--preview-width", `${width}px`);
        preview.hidden = false;
    });
});

document.querySelector("#closePreview").addEventListener("click", () => {
    preview.hidden = true;
    frame.src = "about:blank";
});

if (new URLSearchParams(location.search).has("preview")) {
    toolbar.hidden = true;
}