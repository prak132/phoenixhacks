(function () {
    "use strict"

    let blockedSiteList = [];

    const currentSiteURL = new URL(window.location.origin);

    const isSiteBlocked = () => {
        console.log(blockedSiteList);
        for(let i = 0; i < blockedSiteList.length; i++) {
            let site = blockedSiteList[i];
            console.log(site);
            if(currentSiteURL.hostname == site) {
                return true;
            }
        }
        return false;
    }

    const redirect = () => {
        console.log(`Redirecting to ${chrome.runtime.getURL("src/problemset/blocked.html")}?site=${window.location.href}`)
        location.replace(`${chrome.runtime.getURL("src/problemset/blocked.html")}?site=${window.location.href}`);
    }

    chrome.storage.local.get("sites", (res) => {
        if(res.sites) {
            blockedSiteList = JSON.parse(res.sites);
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