function parseValue(value) {
    if (value === undefined || value === null) return null;

    const cleaned = value.trim();

    if (cleaned === "" || cleaned.toUpperCase() === "NA") {
        return null;
    }

    const numericFields = [
        "MinTemp", "MaxTemp", "Rainfall", "Evaporation",
        "WindGustSpeed", "WindSpeed9am", "WindSpeed3pm",
        "Humidity9am", "Humidity3pm", "Pressure9am",
        "Pressure3pm", "Temp9am", "Temp3pm"
    ];

    return cleaned;
}

function csvLineToPayload(line) {
    const parts = line.split(",");

    if (parts.length < 22) {
        throw new Error("A linha CSV parece incompleta.");
    }

    return {
        Date: parts[0].trim(),
        Location: parts[1].trim(),
        MinTemp: parts[2].trim() === "NA" ? null : Number(parts[2]),
        MaxTemp: parts[3].trim() === "NA" ? null : Number(parts[3]),
        Rainfall: parts[4].trim() === "NA" ? null : Number(parts[4]),
        Evaporation: parts[5].trim() === "NA" ? null : Number(parts[5]),
        WindGustDir: parts[7].trim(),
        WindGustSpeed: parts[8].trim() === "NA" ? null : Number(parts[8]),
        WindDir9am: parts[9].trim(),
        WindDir3pm: parts[10].trim(),
        WindSpeed9am: parts[11].trim() === "NA" ? null : Number(parts[11]),
        WindSpeed3pm: parts[12].trim() === "NA" ? null : Number(parts[12]),
        Humidity9am: parts[13].trim() === "NA" ? null : Number(parts[13]),
        Humidity3pm: parts[14].trim() === "NA" ? null : Number(parts[14]),
        Pressure9am: parts[15].trim() === "NA" ? null : Number(parts[15]),
        Pressure3pm: parts[16].trim() === "NA" ? null : Number(parts[16]),
        Temp9am: parts[19].trim() === "NA" ? null : Number(parts[19]),
        Temp3pm: parts[20].trim() === "NA" ? null : Number(parts[20]),
        RainToday: parts[21].trim()
    };
}

function formToPayload() {
    return {
        Date: document.getElementById("Date").value,
        Location: document.getElementById("Location").value,
        MinTemp: document.getElementById("MinTemp").value === "" ? null : Number(document.getElementById("MinTemp").value),
        MaxTemp: document.getElementById("MaxTemp").value === "" ? null : Number(document.getElementById("MaxTemp").value),
        Rainfall: document.getElementById("Rainfall").value === "" ? null : Number(document.getElementById("Rainfall").value),
        Evaporation: document.getElementById("Evaporation").value === "" ? null : Number(document.getElementById("Evaporation").value),
        WindGustDir: document.getElementById("WindGustDir").value,
        WindGustSpeed: document.getElementById("WindGustSpeed").value === "" ? null : Number(document.getElementById("WindGustSpeed").value),
        WindDir9am: document.getElementById("WindDir9am").value,
        WindDir3pm: document.getElementById("WindDir3pm").value,
        WindSpeed9am: document.getElementById("WindSpeed9am").value === "" ? null : Number(document.getElementById("WindSpeed9am").value),
        WindSpeed3pm: document.getElementById("WindSpeed3pm").value === "" ? null : Number(document.getElementById("WindSpeed3pm").value),
        Humidity9am: document.getElementById("Humidity9am").value === "" ? null : Number(document.getElementById("Humidity9am").value),
        Humidity3pm: document.getElementById("Humidity3pm").value === "" ? null : Number(document.getElementById("Humidity3pm").value),
        Pressure9am: document.getElementById("Pressure9am").value === "" ? null : Number(document.getElementById("Pressure9am").value),
        Pressure3pm: document.getElementById("Pressure3pm").value === "" ? null : Number(document.getElementById("Pressure3pm").value),
        Temp9am: document.getElementById("Temp9am").value === "" ? null : Number(document.getElementById("Temp9am").value),
        Temp3pm: document.getElementById("Temp3pm").value === "" ? null : Number(document.getElementById("Temp3pm").value),
        RainToday: document.getElementById("RainToday").value
    };
}

async function sendPrediction(payload, inputType) {
    const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    const tbody = document.getElementById("data-output");

    tbody.innerHTML = `
        <tr>
            <td>${inputType}</td>
            <td>${result.prediction ?? result.resultado ?? "Sem retorno"}</td>
            <td>${result.message ?? "Predição realizada com sucesso."}</td>
        </tr>
    `;
}

document.getElementById("predictCsvBtn").addEventListener("click", async () => {
    try {
        const line = document.getElementById("csvLine").value.trim();
        const payload = csvLineToPayload(line);
        await sendPrediction(payload, "Linha CSV");
    } catch (error) {
        alert("Erro ao processar a linha CSV: " + error.message);
    }
});

document.getElementById("predictFormBtn").addEventListener("click", async () => {
    try {
        const payload = formToPayload();
        await sendPrediction(payload, "Formulário");
    } catch (error) {
        alert("Erro ao processar o formulário: " + error.message);
    }
});