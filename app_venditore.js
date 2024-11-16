// Sostituisci `tuo-script-id` con l'ID del tuo Google Apps Script
const apiUrl = "https://script.google.com/macros/s/AKfycbx20GXluTG_QDJ_DYjxcprlM7uvIfBfbMf4SkT7-Jcs9ueaWhaT0Jnya8YtUeagvo5ilA/exec";

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
            console.warn(errorMessage);
        }
    ).catch((err) => {
        console.error("Errore durante l'avvio della scansione:", err);
    });
}
