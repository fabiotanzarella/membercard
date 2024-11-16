// Sostituisci `tuo-script-id` con l'ID del tuo Google Apps Script
const apiUrl = "https://script.google.com/macros/s/AKfycbyH9V7DoTUjgLLHhQbUswx00lLBqYRGZ-iQqlXD-rdrtgvL44cgSt_LEv9lVQU9AHyy5A/exec";

function recuperaSaldo() {
    const idCliente = document.getElementById("idCliente").value;

    fetch(`${apiUrl}?action=recuperaSaldo&id_cliente=${idCliente}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("saldoOutput").textContent = `Saldo punti: ${data.saldo}`;
        } else {
            document.getElementById("saldoOutput").textContent = data.message;
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
