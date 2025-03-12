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

function compareMeasurements(measurementTable, activeItem) {
    const originalMeasurements = parseOriginalMeasurements(measurementTable);
    const originalKeys = Object.keys(originalMeasurements);
    const activeKeys = Object.keys(activeItem.measurements);

    displayActiveTitle(measurementTable, activeItem);
    for (let i = 0; i < originalKeys.length; i++) {
        let tableRowElement = "";
        if (activeKeys.includes(originalKeys[i])) {
            //Match the correct key to the measurement table row element on the page
            for (let j = 0; j < measurementTable.children.length; j++) {
                if (measurementTable.children[j].children[0].innerText.includes(originalKeys[i])) {
                    tableRowElement = measurementTable.children[j];
                    break;
                }
            }
            const activeValues = (activeItem.measurements[originalKeys[i]])
            const originalValues = (originalMeasurements[originalKeys[i]])

            const inchDifference = (originalValues[0] - activeValues[0]).toFixed(2);
            const cmDifference = (originalValues[1] - activeValues[1]).toFixed(2);

            displayDifferences(tableRowElement, inchDifference, cmDifference, originalValues[0], originalValues[1], activeValues[0], activeValues[1]);
        }
    }
}

function parseOriginalMeasurements(measurementTable) {
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

function displayActiveTitle(measurementTable, item) {
    const activeTitle = document.createElement("div");
    activeTitle.innerHTML +=
        `<p style="font-size:1.4rem;text-align:right">
            Comparing to <span style="color:grey">${item.title}</span>
        </p>`;
    measurementTable.parentNode.insertBefore(activeTitle, measurementTable);
}

function displayDifferences(tableRowElement, inchDifference, cmDifference, originalInch, originalCm, activeInch, activeCm) {
    // eslint-disable-next-line no-unused-vars
    const [_, inchCell, cmCell] = tableRowElement.children;

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