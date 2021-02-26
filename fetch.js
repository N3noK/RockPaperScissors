export function gameRequest(playerName, playerChoice, callback) {
    let url = `https://us-central1-schere-stein-papier-ee0c9.cloudfunctions.net/widgets/play?playerName=${playerName}&playerHand=${playerChoice}`;
    fetch(url)
        .then(res => res.json())
        .then(data => callback(data));
}

export function requestLeaderboard(callback) {
    fetch('https://us-central1-schere-stein-papier-ee0c9.cloudfunctions.net/widgets/ranking/')
        .then(res => res.json())
        .then(data => callback(data));
}


