function checkTable() {
    const measurementTable = document.querySelector(".Table_table__conFW");
    const requestButton = document.querySelector(".RequestAction_button__mAClZ");

    if (measurementTable) {
        console.log("Found table!");
        const category = getCategory();
        //Retrieve items
        chrome.runtime.sendMessage({ action: 'getItem', key: 'items', category: category }, (response) => {
            const item = response.items;
            if (Object.keys(item).length === 0) {
                console.log("No active items.");
                clearInterval(intervalTable);
                return;
            }
            compareMeasurements(measurementTable, Object.values(item)[0]);
            clearInterval(intervalTable);
        });

    }
    else if (requestButton) {
        console.log("No measurements provided");
        clearInterval(intervalTable);
        return;
    }
}

function getCategory() {
    const classList = document.querySelectorAll(".Breadcrumbs_link__q_nNg");
    return classList[2].innerText.split(" ")[1];
}

function compareMeasurements(measurementTable, item) {
    let position = 0;
    const parsedData = parseMeasurements(measurementTable);

    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(parsedData);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));

    displayCompareItem(measurementTable, item);
    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])
        const parsedValue = (parsedData[key])

        const inchDifference = (parsedValue[0] - activeValue[0]).toFixed(2);
        const cmDifference = (parsedValue[1] - activeValue[1]).toFixed(2);

        displayDifference(measurementTable, position, inchDifference, cmDifference);
        position++;
    }
}

function parseMeasurements(measurementTable) {
    //Chest,Length,Shoulders,Sleeve Length,Hem
    const parsedData = Array.from(measurementTable.children).map(item => item.innerText.split('\n').filter(Boolean));
    const measurements = {};

    parsedData.forEach((innerArray) => {
        const key = innerArray[0];
        const value = [
            (innerArray[1].split(" "))[0],
            (innerArray[2].split(" "))[0]
        ];

        measurements[key] = value;
    });

    return measurements;
}

function displayCompareItem(measurementTable, item) {
    console.log(item);
    const parentDiv = measurementTable.parentNode;
    const titleCard = document.createElement("div");
    titleCard.innerHTML += `<p style="font-size:1.4rem;text-align:right">Comparing to ${item.title}</p>`;
    parentDiv.insertBefore(titleCard, measurementTable);
}
function displayDifference(measurementTable, position, inchDifference, cmDifference) {
    const inchCell = measurementTable.children[position].children[1];
    const cmCell = measurementTable.children[position].children[2];

    const inchDiv = document.createElement("div");
    inchDiv.classList.add("Text", "Callout_callout__1Kvd", "Row_column__4KcmY", "Row_unit__LJkvR");
    inchDiv.innerText = `${inchDifference} in`;

    let formattedInch = "";
    let formattedCm = "";
    if (parseFloat(inchDifference) === 0.00) {
        formattedInch = "=";
        formattedCm = "=";
    }
    else {
        formattedInch = inchDifference.match(/^\d/) ? `+${inchDifference} in` : `${inchDifference} in`;
        formattedCm = cmDifference.match(/^\d/) ? `+${cmDifference} cm` : `${cmDifference} cm`;
    }
    inchCell.innerHTML += ` ${formattedInch}`;
    cmCell.innerHTML += ` ${formattedCm}`;
}

const intervalTable = setInterval(checkTable, 500);
