window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

window.addEventListener("load", function () {
    var recognition = new window.SpeechRecognition();

    recognition.grammars = new window.SpeechGrammarList();
    recognition.continuous = true; // Mantém a escuta do áudio
    recognition.lang = navigator.language || 'pt-BR'; // "navigator.language" pega a predefinição do navegador
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.querySelector("button").addEventListener('click', () =>{
        recognition.start();
    });

    recognition.addEventListener('speechend', () =>{
        recognition.stop();
    });
    
    recognition.addEventListener('error', (event) => {
        document.querySelector("#resultado").textContent = 'Erro no reconhecimento do texto: ' + event.error; 
    });
    
    recognition.onresult = function (event) {
        let last = event.results.length - 1;
        let texto = event.results[last][0].transcript;
        document.querySelector("#resultado").textContent = texto;
        if(String(texto) === "sair") {
            console.log("sair")
            recognition.continuous = false;
            recognition.stop();
        }
    }
});

navigator.geolocation.getCurrentPosition((e) => {
    console.log(e)
}, (e) => {
    console.log(e)
})