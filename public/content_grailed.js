function mutationObserverTable() {
    let containerToObserve;
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const measurementTable = document.querySelector(".Table_table__conFW");
        const requestButton = document.querySelector(".RequestAction_button__mAClZ");
        if (measurementTable) {
            observer.disconnect();
            console.log("Measured: Found Table.");
            const category = getGrailedCategory();
            const activeItem = await getActiveItem(category);
            if (activeItem === -1) {
                console.log("Measured: Error - No active items.")
                return;
            }

            compareMeasurements(measurementTable, activeItem);

        }
        else if (requestButton) {
            console.log("Measured: Error - No measurements provided.");
            observer.disconnect();
        }

    });

    containerToObserve = document.querySelector('.MainContent_sidebar__29G6s');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

function getGrailedCategory() {
    const classList = document.querySelectorAll(".Breadcrumbs_link__q_nNg");
    const lastElement = classList[2].innerText.split(" ").length;
    return classList[2].innerText.split(" ")[lastElement - 1];
}

async function getActiveItem(category) {
    return new Promise((resolve) => {
        // eslint-disable-next-line no-undef
        chrome.runtime.sendMessage({ action: 'getItem', key: 'items', category: category }, (response) => {
            const item = response.items;
            if (Object.keys(item).length === 0) {
                resolve(-1);
            }
            else {
                resolve(Object.values(item)[0]);
            }
        });
    });
}

function compareMeasurements(measurementTable, item) {
    const sourceMeasurements = parseGrailedMeasurements(measurementTable);
    const sourceKeys = Object.keys(sourceMeasurements);
    const activeKeys = Object.keys(item.measurements);

    displayGrailedCompareItem(measurementTable, item);

    for (let i = 0; i < sourceKeys.length; i++) {
        let tableRow = "";
        if (activeKeys.includes(sourceKeys[i])) {
            for (let j = 0; j < measurementTable.children.length; j++) {
                if (measurementTable.children[j].children[0].innerText.includes(sourceKeys[i])) {
                    tableRow = measurementTable.children[j];
                    break;
                }
            }
            const activeValues = (item.measurements[sourceKeys[i]])
            const sourceValues = (sourceMeasurements[sourceKeys[i]])

            const inchDifference = (sourceValues[0] - activeValues[0]).toFixed(2);
            const cmDifference = (sourceValues[1] - activeValues[1]).toFixed(2);

            displayGrailedDifference(tableRow, inchDifference, cmDifference, sourceValues[0], sourceValues[1], activeValues[0], activeValues[1]);
        }

    }
}

function parseGrailedMeasurements(measurementTable) {
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

function displayGrailedCompareItem(measurementTable, item) {
    const parentDiv = measurementTable.parentNode;
    const titleCard = document.createElement("div");
    titleCard.innerHTML +=
        `<p style="font-size:1.4rem;text-align:right">
            Comparing to <span style="color:grey">${item.title}</span>
        </p>`;
    parentDiv.insertBefore(titleCard, measurementTable);
}

function displayGrailedDifference(tableRow, inchDifference, cmDifference, originalInch, originalCm, activeInch, activeCm) {
    // eslint-disable-next-line no-unused-vars
    const [_, inchCell, cmCell] = tableRow.children;

    function formatDifference(value, value2, unit) {
        const num = parseFloat(value);
        //accommodate for edge cases due to rounding conversation errors 
        const num2 = parseFloat(value2);
        if (num === 0 || num2 === 0) return `<span style="color: grey; font-weight:bold">=</span>`;
        const color = num > 0 ? "green" : "red";
        const sign = num > 0 ? "+" : "";
        return `<span style="color: ${color}; font-weight:bold">${sign}${value} ${unit}</span>`;
    }

    inchCell.innerHTML =
        `${originalInch}<span style="color: grey;">/${activeInch}</span> 
                        <br> ${formatDifference(inchDifference, cmDifference, "in")}`;
    cmCell.innerHTML =
        `${originalCm}<span style="color: grey;">/${activeCm}</span> 
                        <br> ${formatDifference(cmDifference, inchDifference, "cm")}`;
}

mutationObserverTable();