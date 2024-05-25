document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timeInput').addEventListener('input', (event) => {
        var time = this.value;
        document.getElementById('lockinP').textContent = `You may access your blocked website for ${time} if you solve the problem set`;
    });

    document.getElementById("addcurrWebsite").addEventListener("click", (event) => {
        console.log("sending message");
        (async () => {
            let [tab] = await chrome.tabs.query({active: true});
            tab = new URL(tab.url)
            let currentSiteURL = tab.hostname;
            if(chrome.storage) chrome.storage.local.get("sites", (res) => {
                let theSites = [];
                if(res.sites) theSites = JSON.parse(res.sites);
                newSites = new Set(theSites)
                newSites.add(currentSiteURL);
                console.log([...newSites]);
                chrome.storage.local.set({"sites": JSON.stringify([...newSites])}, () => {});
            });
        })()
    });
})