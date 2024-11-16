const apiUrl = "https://script.google.com/macros/s/AKfycbyx59Jp_fzAniWATo1Tf3FOoondSeiBo2hpOg56N0G0ReWyVsnOt191l4bW3d6rJDn2yg/exec";

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
                console.log("QR Code scansionato:", decodedText);
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
    const idCliente = document.getElementById("idCliente").value.trim();

    if (!idCliente) {
        alert("Inserisci un ID Cliente valido.");
        return;
    }

    console.log("Recupero saldo per ID Cliente:", idCliente);

    try {
        const response = await fetch(`${apiUrl}?action=recuperaSaldo&id_cliente=${idCliente}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`Errore di rete: ${response.status}`);
        }

        const data = await response.json();
        console.log("Risposta dell'API:", data);

        if (data.status === "success") {
            document.getElementById("output").innerText = `Saldo punti: ${data.data.saldo}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Errore durante il recupero del saldo:", error);
        alert("Errore durante il recupero del saldo.");
    }
}

/**
 * Funzione per aggiornare il saldo del cliente.
 */
async function aggiornaSaldo() {
    const idCliente = document.getElementById("idCliente").value.trim();
    const punti = parseInt(prompt("Inserisci il numero di punti da aggiungere:"));

    if (!idCliente || isNaN(punti)) {
        alert("Inserisci un ID Cliente valido e un numero di punti.");
        return;
    }

    console.log("Aggiornamento saldo per ID Cliente:", idCliente, "Punti:", punti);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "aggiornaSaldo", id_cliente: idCliente, punti: punti })
        });

        const data = await response.json();
        console.log("Risposta dell'API:", data);

        if (data.status === "success") {
            document.getElementById("output").innerText = `Nuovo saldo: ${data.data.nuovoSaldo}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Errore durante l'aggiornamento del saldo:", error);
        alert("Errore durante l'aggiornamento del saldo.");
    }
}

/**
 * Funzione per aggiungere un nuovo cliente.
 */
async function aggiungiCliente() {
    const idCliente = prompt("Inserisci ID Cliente:");
    const nome = prompt("Inserisci il nome del cliente:");

    if (!idCliente || !nome) {
        alert("Inserisci un ID Cliente e un nome validi.");
        return;
    }

    console.log("Aggiunta cliente:", idCliente, nome);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "aggiungiCliente", id_cliente: idCliente, nome: nome })
        });

        const data = await response.json();
        console.log("Risposta dell'API:", data);

        alert(data.message);
    } catch (error) {
        console.error("Errore durante l'aggiunta del cliente:", error);
        alert("Errore durante l'aggiunta del cliente.");
    }
}
