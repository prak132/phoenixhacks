(function () {
    "use strict"

    let blockedSiteList = new Set();

    const currentSiteURL = new URL(window.location.origin);

    const isSiteBlocked = () => {
        for(site of blockedSiteList) {
            if(currentSiteURL.hostname === site.hostname) return true;
        }
        return false;
    }

    const redirect = () => {
        window.location = `${chrome.runtime.getURL("index.html")}?site=${window.location.href}`;
    }

    chrome.storage.local.get("sites", (res) => {
        if(res.sites) {
            blockedSiteList = res.sites;
        }
        if(isSiteBlocked()) {
            chrome.storage.local.get(window.location.origin, (res) => {
                if(!res[window.location.origin] || Date.now() > res[window.location.origin]) {
                    redirect();
                }
            })
        }

    });
})();