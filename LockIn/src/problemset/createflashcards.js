document.getElementById('addFlashcard').addEventListener('click', function() {
    let flashcardContainer = document.getElementById('flashcardContainer');
    let flashcardForm = document.createElement('form');
    let uniqueId = Date.now();
    flashcardForm.innerHTML = `
        <label for="Term${uniqueId}">Term:</label>
        <input type="text" id="term${uniqueId}" class="term" name="term" required>
        <label for="Definition${uniqueId}">Definition:</label>
        <input type="text" id="definition${uniqueId}" class="definition" name="definition" required>
        <button type="button" class="deleteFlashcard">Delete</button>
    `;
    flashcardForm.querySelector('.deleteFlashcard').addEventListener('click', function() {
        flashcardForm.remove();
    });
    flashcardContainer.appendChild(flashcardForm);
});

document.getElementById('saveflashcard').addEventListener('click', function(event) {
    event.preventDefault();
    let setName = document.getElementById('flashcardsetname').value;
    let flashcardSet = Array.from(document.querySelectorAll('form')).map(form => {
        let Definition = form.querySelector('.definition').value;
        let Term = form.querySelector('.term').value;
        if (!setName) {
            alert('Flashcard set name must be filled out.');
            return null;
        }
        if (!Definition || !Term) {
            alert('Both Definition and Term fields must be filled out.');
            return null;
        }
        return {Definition, Term};
    }).filter(flashcard => flashcard !== null);
    let flashcardData = { [setName]: flashcardSet };
    console.log(JSON.stringify(flashcardData));
    chrome.storage.local.get("flashcards", (res) => {
        if(res.flashcards) {
            flashcardData = {...JSON.parse(res.flashcards), ...flashcardData};
        } else {
            flashcardData = {...flashcardData};
        }
        chrome.storage.local.set({"flashcards": JSON.stringify(flashcardData)}, () => {
            console.log('Flashcard set saved');
        });
    });
});