document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timeInput').addEventListener('input', (event) => {
        var time = this.value;
        document.getElementById('lockinP').textContent = `You may access your blocked website for ${time} if you solve the problem set`;
    });


    chrome.storage.local.get("sites", (res) => {
        if(res.sites) {
          let blockedSiteList = JSON.parse(res.sites);
          let container = document.getElementById('blockedWebsitesContainer');
          container.style.overflowY = 'auto';
          blockedSiteList.forEach(site => {
            let siteElement = document.createElement('p');
            siteElement.textContent = site;
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
              container.removeChild(siteElement);
              blockedSiteList = blockedSiteList.filter(blockedSite => blockedSite !== site);
              chrome.storage.local.set({"sites": JSON.stringify(blockedSiteList)}, () => {});
            });
            siteElement.appendChild(deleteButton);
            container.appendChild(siteElement);
          });
        }
    });

    document.getElementById('createFlashcardSet').addEventListener('click', function() {    
        window.location.href = 'problemset/createcard.html';
    });

    document.getElementById("addcurrWebsite").addEventListener("click", (event) => {
        // chrome.storage.local.clear();
        console.log("sending message");
        (async () => {
            let [tab] = await chrome.tabs.query({active: true});
            // console.log(tab);
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