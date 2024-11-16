// Sostituisci `tuo-script-id` con l'ID del tuo Google Apps Script
const apiUrl = "https://script.google.com/macros/s/AKfycbwk26K658joqOuBKD8kDUVQMvLQcnmJyO6L5r_U2pn8r6m_pyQXprM9saB0SHBKx5oTDA/exec";

function aggiornaSaldo() {
    const idCliente = document.getElementById("idCliente").value;
    const punti = parseInt(document.getElementById("punti").value);

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "aggiornaSaldo",
            id_cliente: idCliente,
            punti: punti
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("outputVenditore").textContent = `Saldo aggiornato: ${data.nuovoSaldo}`;
        } else {
            document.getElementById("outputVenditore").textContent = data.message;
        }
    })
    .catch(error => console.error("Errore:", error));
}

function startQRCodeScan() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Usa la fotocamera posteriore
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {
            // Testo decodificato dal QR Code
            document.getElementById("idCliente").value = decodedText;
            html5QrCode.stop();
        },
        (errorMessage) => {
            console.warn("Errore durante la scansione:", errorMessage);
        }
    ).catch((err) => {
        console.error("Errore durante l'avvio della scansione:", err);
    });
}

