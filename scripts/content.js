function checkTable() {
    console.log("Checking table");
    const measurementTable = document.querySelector(".Table_table__conFW");
    const requestButton = document.querySelector(".RequestAction_button__mAClZ");

    if (measurementTable) {
        console.log("Found table!");
        compareMeasurements(measurementTable);
        clearInterval(intervalTable);
    }
    else if (requestButton) {
        console.log("No measurements provided");
        clearInterval(intervalTable);
        return;
    }
    // RequestAction_button__mAClZ
}

function compareMeasurements(measurementTable) {
    const staticMeasurements = [
        ["Chest", "22", "80"],
        ["Length", "22", "80"],
        ["Shoulders", "22", "80"],
        ["Sleeve Length", "22", "80"],
        ["Hem", "22", "80"]
    ]

    const measurementArray = parseMeasurements(measurementTable);

    for (let i = 0; i < measurementArray.length; i++) {
        if (measurementArray[i][0] === staticMeasurements[i][0]) {
            //console.log(measurementArray[i][0]);

            const inchDifference = (measurementArray[i][1] - staticMeasurements[i][1]).toFixed(2);
            const cmDifference = (measurementArray[i][2] - staticMeasurements[i][2]).toFixed(2);

            //console.log(`in: ${measurementArray[i][1]} - ${staticMeasurements[i][1]} = `, inchDifference);
            //console.log(`cm: ${measurementArray[i][2]} - ${staticMeasurements[i][2]} = `, cmDifference);

            addDifference(measurementTable, i, inchDifference, cmDifference);
        }
    }

}

function addDifference(measurementTable, position, inchDifference, cmDifference) {
    const inchCell = measurementTable.children[position].children[1];
    //const inchDiv = document.createElement("div");
    //inchDiv.classList.add("Text", "Callout_callout__1Kvd", "Row_column__4KcmY", "Row_unit__LJkvR");
    //inchDiv.innerText = `${inchDifference} in`;
    //console.log("html", inchDiv.innerHTML);
    inchCell.innerHTML += ` ${inchDifference}`;
    //inchCell.appendChild(inchDiv);

    // const cmDiv = document.createElement("div");
    const cmCell = measurementTable.children[position].children[2];
    // cmDiv.classList.add("Text", "Callout_callout__1Kvd", "Row_column__4KcmY", "Row_unit__LJkvR");
    // cmDiv.innerText = `${cmDifference} cm`;
    cmCell.innerHTML += ` ${cmDifference}`;
    // cmCell.appendChild(cmDiv);
}

function parseMeasurements(measurementTable) {
    //Chest,Length,Shoulders,Sleeve Length,Hem
    const parsedData = Array.from(measurementTable.children).map(item => item.innerText.split('\n').filter(Boolean));
    const measurements = parsedData.map(innerArray => {
        return innerArray.map(item => {
            return item.replace(/(in|cm)/g, '').trim();
        });
    });
    return measurements;
}

const intervalTable = setInterval(checkTable, 500);
