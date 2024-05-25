document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timeInput').addEventListener('input', (event) => {
        var time = this.value;
        document.getElementById('lockinP').textContent = `You may access your blocked website for ${time} if you solve the problem set`;
    });

    document.getElementById("addcurrWebsite").addEventListener("click", (event) => {
        let currentSiteURL = new URL(window.location.origin);

        if(chrome.storage) chrome.storage.local.get("sites", (res) => {
            if(!res.sites) res.sites = new Set();
            res.sites.add(currentSiteURL)
            chrome.storage.local.set({"sites": res.sites}, () => {});
        });
    });
});