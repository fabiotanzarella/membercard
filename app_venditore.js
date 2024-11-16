const apiUrl = "https://script.google.com/macros/s/AKfycbyx59Jp_fzAniWATo1Tf3FOoondSeiBo2hpOg56N0G0ReWyVsnOt191l4bW3d6rJDn2yg/exec";

/**
 * Verifica se la libreria Html5Qrcode è stata caricata correttamente.
 */
if (typeof Html5Qrcode === "undefined") {
    console.error("Errore: La libreria Html5Qrcode non è stata caricata correttamente.");
    alert("Errore: La libreria per la scansione del QR Code non è disponibile.");
}

/**
 * Funzione per avviare la scansione del QR Code.
 */
async function startQRCodeScan() {
    if (typeof Html5Qrcode === "undefined") {
        alert("Errore: La libreria per la scansione del QR Code non è disponibile.");
        return;
    }

    const html5QrCode = new Html5Qrcode("reader");

    try {
        console.log("Avvio della scansione del QR Code...");
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

    try {
        console.log(`Recupero saldo per ID Cliente: ${idCliente}`);
        const response = await fetch(`${apiUrl}?action=recuperaSaldo&id_cliente=${idCliente}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Errore di rete: ${response.status}`);
        }

        const data = await response.json();
        console.log("Risposta:", data);

        if (data.status === "success") {
            document.getElementById("output").innerText = `Saldo punti: ${data.saldo}`;
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

    try {
        console.log(`Aggiornamento saldo per ID Cliente: ${idCliente}, Punti: ${punti}`);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "aggiornaSaldo", id_cliente: idCliente, punti: punti })
        });

        const data = await response.json();
        console.log("Risposta:", data);

        if (data.status === "success") {
            document.getElementById("output").innerText = `Nuovo saldo: ${data.nuovoSaldo}`;
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

    try {
        console.log(`Aggiunta cliente: ${idCliente}, Nome: ${nome}`);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "aggiungiCliente", id_cliente: idCliente, nome: nome })
        });

        const data = await response.json();
        console.log("Risposta:", data);

        alert(data.message);
    } catch (error) {
        console.error("Errore durante l'aggiunta del cliente:", error);
        alert("Errore durante l'aggiunta del cliente.");
    }
}
