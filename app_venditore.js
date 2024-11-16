const apiUrl = "https://script.google.com/macros/s/tuo-script-id/exec";

/**
 * Funzione per avviare la scansione del QR Code.
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
                alert(`QR Code scansionato: ${decodedText}`);
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

/**
 * Funzione per recuperare il saldo del cliente.
 */
async function recuperaSaldo() {
    const idCliente = document.getElementById("idCliente").value;
    const response = await fetch(`${apiUrl}?action=recuperaSaldo&id_cliente=${idCliente}`);
    const data = await response.json();
    document.getElementById("output").innerText = data.status === "success" ?
        `Saldo punti: ${data.data.saldo}` : data.message;
}

/**
 * Funzione per aggiornare il saldo del cliente.
 */
async function aggiornaSaldo() {
    const idCliente = document.getElementById("idCliente").value;
    const punti = prompt("Inserisci il numero di punti da aggiungere:");
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "aggiornaSaldo", id_cliente: idCliente, punti: parseInt(punti) })
    });
    const data = await response.json();
    document.getElementById("output").innerText = data.status === "success" ?
        `Nuovo saldo: ${data.data.nuovoSaldo}` : data.message;
}

/**
 * Funzione per aggiungere un nuovo cliente.
 */
async function aggiungiCliente() {
    const idCliente = prompt("Inserisci ID Cliente:");
    const nome = prompt("Inserisci il nome del cliente:");
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "aggiungiCliente", id_cliente: idCliente, nome: nome })
    });
    const data = await response.json();
    alert(data.message);
}
