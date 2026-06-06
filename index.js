const rail = document.getElementById("release-rail");
const panels = Array.from(document.querySelectorAll(".release-panel"));
const dots = Array.from(document.querySelectorAll(".rail-hint span"));
const currentPanel = document.getElementById("being-in-it");
const upcomingSingles = Array.from(document.querySelectorAll(".single-cover[data-release-date]"));

let activeUpdateTimeout;

function setActiveDot() {
    if (!rail || panels.length === 0) return;

    const activeLine = rail.scrollLeft + rail.clientWidth / 2;
    const activeIndex = panels.reduce((closestIndex, panel, index) => {
        const panelAnchor = panel.offsetLeft + panel.offsetWidth / 2;
        const closestPanel = panels[closestIndex];
        const closestAnchor = closestPanel.offsetLeft + closestPanel.offsetWidth / 2;

        return Math.abs(panelAnchor - activeLine) < Math.abs(closestAnchor - activeLine)
            ? index
            : closestIndex;
    }, 0);

    dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
    });

    panels.forEach((panel, index) => {
        panel.classList.toggle("is-active", index === activeIndex);
    });
}

function scrollToCurrentRelease() {
    if (!rail || !currentPanel) return;

    currentPanel.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });

    setActiveDot();
}

function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function updateCountdowns() {
    const now = Date.now();

    upcomingSingles.forEach((single) => {
        const releaseDate = new Date(single.dataset.releaseDate);
        const countdown = single.querySelector(".countdown");

        if (!countdown || Number.isNaN(releaseDate.getTime())) return;

        const remaining = releaseDate.getTime() - now;

        if (remaining <= 0) {
            single.classList.remove("is-upcoming");
            countdown.hidden = true;
            countdown.textContent = "";
            return;
        }

        countdown.hidden = false;
        countdown.textContent = `${formatCountdown(remaining)} until release`;
    });
}

if (rail) {
    rail.addEventListener("scroll", () => {
        window.clearTimeout(activeUpdateTimeout);
        activeUpdateTimeout = window.setTimeout(setActiveDot, 90);
    });

    window.addEventListener("load", scrollToCurrentRelease);
    window.addEventListener("resize", scrollToCurrentRelease);
}

if (upcomingSingles.length > 0) {
    updateCountdowns();
    window.setInterval(updateCountdowns, 60000);
}
