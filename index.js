var synth = window.speechSynthesis;

var mtalk = document.querySelector("#m_talk")
var mmessage = document.querySelector("#m_message")
var mfeeling = document.querySelector("#m_feeling")

var isSpeaking = false

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
        let texto = String(event.results[last][0].transcript).replace("ISO", "IZZO");
        document.querySelector("#resultado").textContent = texto;

        // Verifica se a assistente não está falando para evitar ressonância
        if (!isSpeaking) {
            if(texto === "sair") {
                console.log("sair")
                recognition.continuous = false;
                recognition.stop();
            } else {
                bot(texto)
            }
        }
    }

    // Faz a requisição pro bot
    async function bot(text) {
        const object = { "message": text };
        const response = await fetch('http://127.0.0.1:8087/talk', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            },
            method: 'POST',
            body: JSON.stringify(object)
        });
        const responseText = await response.text();
        let res_json = JSON.parse(responseText)

        mtalk.innerText = res_json.talk
        mmessage.innerText = res_json.message
        mfeeling.innerText = res_json.feeling

        talk(res_json.talk)
    }

    // Sistema de síntese de voz
    function talk(message) {
        let voice = synth.getVoices()[4];
        let utterThis = new SpeechSynthesisUtterance(message);
        utterThis.voice = voice
        utterThis.pitch = 1;
        utterThis.rate = 1;
        recognition.stop();
        synth.speak(utterThis)

        // O evento abaixo é acionado quando para de falar
        utterThis.addEventListener('end', (event) => {
            recognition.start();
        });
    }
});

