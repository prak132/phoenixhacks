document.addEventListener('DOMContentLoaded', async (event) => {

    // chrome.storage.local.clear();

    document.getElementById('chooseRandomSet').addEventListener('click', function() {
        let setNames = Object.keys(json);
        if (setNames.length === 0) {return;}
        let randomSetName = setNames[Math.floor(Math.random() * setNames.length)];
        currentSet = json[randomSetName];
        let flashcardContainer = document.getElementById('flashcardContainer');
        flashcardContainer.innerHTML = '';
        displayQuestion();
    });

    let json = JSON.parse((await chrome.storage.local.get("flashcards")).flashcards || "{}");
    // console.log(json);
    let isSolved = false;
    let currentSet = null;
    let currentQuestionIndex = 0;

    document.addEventListener('DOMContentLoaded', (event) => {
        displayFlashcardSets();
    });

    function displayFlashcardSets() {
        let flashcardContainer = document.getElementById('flashcardContainer');
        for (let setName in json) {
            let setDiv = document.createElement('div');
            setDiv.innerHTML = `
                <p>${setName}</p>
                <button class="choose-set" data-set-name="${setName}">Choose</button>
            `;
            flashcardContainer.appendChild(setDiv);
        }

        let chooseSetButtons = document.getElementsByClassName('choose-set');
        for (let button of chooseSetButtons) {
            button.addEventListener('click', function() {
                currentSet = json[button.getAttribute('data-set-name')];
                flashcardContainer.innerHTML = '';
                displayQuestion();
            });
        }
    }

    function displayQuestion() {
        let question = currentSet[currentQuestionIndex];
        let flashcardContainer = document.getElementById('flashcardContainer');
        flashcardContainer.innerHTML = `
            <p class="termtext" style="font-size: 24px;">${question.Term}</p>
            <input type="text" style="width: 25%;" id="definitionInput" placeholder="Type the definition here">
            <button id="submitDefinition">Submit</button>
        `;

        let answerInput = document.getElementById('definitionInput');
        let submitButton = document.getElementById('submitDefinition');
        submitButton.addEventListener('click', function() {
            checkAnswer(answerInput.value);
        });
    }

    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }   

    async function checkAnswer(userAnswer) {
        let correctAnswer = currentSet[currentQuestionIndex].Definition;
        console.log(currentSet[currentQuestionIndex]);
        let works = userAnswer === correctAnswer;
        if(!works) {
            let result = await query({
                "inputs": {
                    "source_sentence": userAnswer,
                    "sentences": [correctAnswer]
                }
            });
            if(result[0] > 0.8) works = true;
        }
        if (works) {
            displayBanner('Correct!', 'green');
            currentQuestionIndex++;
            if (currentQuestionIndex < currentSet.length) {
                displayQuestion();
            } else {
                const queryString = window.location.search;
                console.log(queryString);
                const urlParams = new URLSearchParams(queryString);
                const site = urlParams.get('site');
                isSolved = true;
                chrome.storage.local.get("sites", (res) => {
                    if(res.sites) {
                        let blockedSiteList = JSON.parse(res.sites);
                        blockedSiteList.forEach(site => {
                            blockedSiteList = blockedSiteList.filter(blockedSite => blockedSite !== site);
                            chrome.storage.local.set({"sites": JSON.stringify(blockedSiteList)});
                        });
                    }
                });
                location.replace(site);

                function updateWebsites() {
                    chrome.storage.local.get("sites", (res) => {
                        if(res.sites) {
                            let blockedSiteList = JSON.parse(res.sites);
                            let container = document.getElementById('blockedWebsitesContainer');
                            container.innerHTML = '';
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
                }
                console.log("sending message");
                setTimeout(async () => {
                    if(chrome.storage) chrome.storage.local.get("sites", (res) => {
                        let theSites = [];
                        if(res.sites) theSites = JSON.parse(res.sites);
                        newSites = new Set(theSites)
                        newSites.add(site);
                        console.log([...newSites]);
                        chrome.storage.local.set({"sites": JSON.stringify([...newSites])}, () => {});
                        updateWebsites();
                        console.out.log('site added');
                    });
                }, 10 * 1000);
            }
        } else {
            displayBanner('Incorrect!', 'red');
        }
    }
    function displayBanner(message, color) {
        let banner = document.getElementById('banner');
        banner.textContent = message;
        banner.style.backgroundColor = color;
        banner.style.color = 'white';
        banner.style.fontSize = '24px';
        banner.style.padding = '20px';
        banner.style.width = '35%';
        banner.style.justifyContent = 'center';
        banner.style.display = 'flex';
        banner.style.margin = 'auto';
        banner.style.marginBottom = '20px';
        banner.style.borderRadius = '10px';
        setTimeout(function() {
            banner.textContent = '';
            banner.style.backgroundColor = 'transparent';
        }, 2000);
    }

    displayFlashcardSets();
});
