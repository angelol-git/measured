function checkTable() {
    console.log("Checking table");
    const measurementTable = document.querySelector(".Table_table__conFW");
    //Check for the button meaning no measurements
    if (measurementTable) {
        console.log("Found table!");
        compareMeasurements(measurementTable);
        clearInterval(intervalTable);
    }
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

    console.log(staticMeasurements);
    console.log(measurementArray);
    for (let i = 0; i < measurementArray.length; i++) {
        if (measurementArray[i][0] === staticMeasurements[i][0]) {
            console.log(measurementArray[i][0]);

            const inchDifference = (measurementArray[i][1] - staticMeasurements[i][1]).toFixed(2);
            const cmDifference = (measurementArray[i][2] - staticMeasurements[i][2]).toFixed(2);

            console.log(`in: ${measurementArray[i][1]} - ${staticMeasurements[i][1]} = `, inchDifference);
            console.log(`cm: ${measurementArray[i][2]} - ${staticMeasurements[i][2]} = `, cmDifference);
        }
    }

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
