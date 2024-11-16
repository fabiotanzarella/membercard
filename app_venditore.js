// URL dell'API di Google Apps Script
const apiUrl = "https://script.google.com/macros/s/AKfycby5uRvoH7GeFRwFsz3JGaVNLSoGyOb6ASR4WbQPJRTIrK6MtjyFZgOQQSLFMgiCFhHiog/exec";


/**
 * Funzione per aggiungere punti al saldo del cliente.
 */
async function aggiornaSaldo() {
    const idCliente = document.getElementById("idCliente").value;
    const punti = parseInt(document.getElementById("punti").value);

    if (!idCliente || isNaN(punti)) {
        alert("Inserisci un ID Cliente e un numero di punti validi.");
        return;
    }

    // Creiamo l'URL con i parametri
    const url = `${apiUrl}?action=aggiornaSaldo&id_cliente=${encodeURIComponent(idCliente)}&punti=${encodeURIComponent(punti)}`;

    try {
        // Effettuiamo una richiesta GET
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Errore di rete: ${response.status}`);
        }

        const data = await response.json();
        console.log("Risposta dell'API:", data);

        if (data.status === "success") {
            alert(`Saldo aggiornato per ${idCliente}: ${data.nuovoSaldo} punti`);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Errore durante la richiesta:", error);
        alert("Errore durante la richiesta. Verifica la connessione e riprova.");
    }
}

/**
 * Funzione per scannerizzare il QR Code e ottenere l'ID Cliente.
 */
async function startQRCodeScan() {
    const html5QrCode = new Html5Qrcode("reader");

    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {
                document.getElementById("idCliente").value = decodedText;
                html5QrCode.stop();
            },
            (errorMessage) => {
                console.warn("Errore durante la scansione:", errorMessage);
            }
        );
    } catch (error) {
        console.error("Errore durante l'avvio della scansione:", error);
        alert("Errore durante l'avvio della scansione. Riprova.");
    }
}
