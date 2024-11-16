// Sostituisci `tuo-script-id` con l'ID del tuo Google Apps Script
const apiUrl = "https://script.google.com/macros/s/tuo-script-id/exec";

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
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {
            document.getElementById("idCliente").value = decodedText;
            html5QrCode.stop();
            recuperaSaldo();
        },
        (errorMessage) => {
            console.warn(errorMessage);
        }
    ).catch((err) => {
        console.error("Errore durante l'avvio della scansione:", err);
    });
}
