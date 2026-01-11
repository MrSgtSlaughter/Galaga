MyGame.screens['high-scores'] = (function(game) {
    'use strict';

    let currentHighlightedValue;
    
    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
        
        LocalScores.persistence.report(); // Load the local high-scores
    }

    function loadFirebaseScores() {
        if (typeof firebaseDB !== 'undefined') {
            firebaseDB.ref('leaderboards/galaga').orderByChild('score').limitToLast(10).once('value', function(snapshot) {
                const scores = [];
                snapshot.forEach(function(child) {
                    scores.push(child.val());
                });
                scores.sort(function(a, b) { return b.score - a.score; });
                
                const list = document.getElementById('firebase-score-list');
                if (list) {
                    list.innerHTML = scores.map(function(s, i) {
                        return '<li style="color:' + (i<3 ? ['#ffd700','#c0c0c0','#cd7f32'][i] : '#0ff') + '">' + s.name + ' - ' + s.score + '</li>';
                    }).join('') || '<li>No global scores yet</li>';
                }
            });
        }
    }

    function selectMenuOption() {
        if (currentHighlightedValue === "id-reset-high-scores") {
            resetHighScores();
        } else if (currentHighlightedValue === "id-high-scores-back") {
            game.showScreen("main-menu");
        }
    }

    function menuDown() {
        if (currentHighlightedValue === 'id-high-scores-back') {
            currentHighlightedValue = "id-reset-high-scores";
            document.getElementById("id-high-scores-back").style.border = "0.1em solid rgb(0, 0, 0)";
            document.getElementById("id-reset-high-scores").style.border = "0.1em solid #CECEF6";
        } else {
            currentHighlightedValue = 'id-high-scores-back';
            document.getElementById("id-high-scores-back").style.border = "0.1em solid #CECEF6";
            document.getElementById("id-reset-high-scores").style.border = "0.1em solid rgb(0, 0, 0)";
        }
    }
    
    function run() {
        currentHighlightedValue = 'id-high-scores-back';
        document.getElementById("id-high-scores-back").style.border = "0.1em solid #CECEF6";
        document.getElementById("id-reset-high-scores").style.border = "0.1em solid rgb(0, 0, 0)";
        
        // Load Firebase scores when viewing high scores
        loadFirebaseScores();

        document.getElementById('body').onkeyup = function(e) {
            if (game.getActiveScreen() === "high-scores") {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    menuDown();
                } else if (e.key === "Enter") {
                    selectMenuOption();
                }  else if (e.key === "Escape") {
                    game.showScreen("main-menu");
                }
            }
        }
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
