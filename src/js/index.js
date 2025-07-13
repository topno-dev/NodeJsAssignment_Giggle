function setConsoleLog(message) {
    const consoleBox = document.getElementById('consoleBox')
    console.log(message)
    consoleBox.textContent = ''
    consoleBox.textContent = typeof message === 'string' ? message : JSON.stringify(message, null, 2)
}

function fetchChallenges() {
    setConsoleLog("Loading challenges...")
    fetch('/challenges')
        .then(response => response.json())
        .then(data => {
            setConsoleLog(data)
        })
        .catch(err => {
            setConsoleLog("Error fetching challenges: " + err.message)
        });
}

function fetchSubmissions() {
    setConsoleLog("Loading submissions...")
    fetch('/submissions')
        .then(response => response.json())
        .then(data => {
            setConsoleLog(data);
        })
        .catch(err => {
            setConsoleLog("Error fetching submissions: " + err.message)
        });
}
