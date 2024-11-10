let words = [];
let currentWordIndex = 0;
let currentLanguage = 'fr';
let isShowingAnswer = false; // Indique si la réponse est affichée
let hintIndex = 0; // Indice pour le nombre de lettres affichées dans l'indice

// Charger le fichier CSV et analyser les données
fetch('verbes_darija.csv')
    .then(response => response.text())
    .then(data => {
        words = parseCSV(data);
        nextWord(); // Affiche un mot dès que les données sont chargées
    });

// Fonction pour analyser le CSV en tableau d'objets
function parseCSV(data) {
    const lines = data.trim().split('\n');
    const result = [];

    // Ignorer la première ligne (en-tête)
    for (let i = 1; i < lines.length; i++) {
        const [fr, phonetic, ar] = lines[i].split(',');
        result.push({ fr: fr.trim(), phonetic: phonetic.trim(), ar: ar.trim() });
    }

    return result;
}

// Changer la langue d'affichage
document.getElementById('language-select').addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    nextWord(); // Charger un nouveau mot dès qu'on change la langue
});

document.getElementById('toggle-button').addEventListener('click', toggleAnswerOrNextWord);
document.getElementById('hint-button').addEventListener('click', showHint); // Nouveau bouton d'indice

// Affiche un mot aléatoire
function nextWord() {
    currentWordIndex = Math.floor(Math.random() * words.length);
    const word = words[currentWordIndex];
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');

    // Réinitialise l'affichage
    answerText.style.color = 'transparent';
    answerText.textContent = '';
    document.getElementById('toggle-button').textContent = "Voir la réponse";
    isShowingAnswer = false;

    hintIndex = 0; // Réinitialiser l'indice d'indice
    document.getElementById('hint-button').disabled = false; // Activer le bouton indice

    // Afficher le mot dans la langue sélectionnée
    questionText.textContent = currentLanguage === 'fr' ? word.fr : word.ar;
}

// Afficher la réponse complète ou passer au mot suivant
function toggleAnswerOrNextWord() {
    console.log(words)
    const word = words[currentWordIndex];
    const answerText = document.getElementById('answer-text');

    if (!isShowingAnswer) {
        // Montrer la réponse complète selon la langue sélectionnée
        answerText.textContent = currentLanguage === 'fr'
            ? `${word.ar} - ${word.phonetic}` // Si question en français, montrer arabe et phonétique
            : `${word.fr}`; // Si question en arabe, montrer français et phonétique

        answerText.style.color = 'black';
        document.getElementById('toggle-button').textContent = "Mot suivant";
        isShowingAnswer = true;
    } else {
        // Passer au mot suivant
        nextWord();
    }
}

// Affiche progressivement chaque lettre du mot en arabe
function showHint() {
    const word = words[currentWordIndex];
    const answerText = document.getElementById('answer-text');

    // Obtenir uniquement le mot en arabe pour l'indice
    let answer = currentLanguage === 'fr' ? word.ar : word.fr;

    // Afficher une lettre de plus à chaque clic
    if (hintIndex < answer.length) {
        answerText.textContent = answer.slice(0, hintIndex + 1); // Afficher jusqu'à hintIndex
        answerText.style.color = 'black';
        hintIndex++;
    }

    // Désactiver le bouton si on a révélé toute la réponse
    if (hintIndex >= answer.length) {
        document.getElementById('hint-button').disabled = true;
    }
}
