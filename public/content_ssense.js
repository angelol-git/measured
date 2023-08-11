const intervalChecker = setInterval(() => {
    const measurementModal = checkSSenseModal();
    if (measurementModal) {
        console.log("Measured: Measurements found.");
        init(measurementModal);
        clearInterval(intervalChecker);
    }
}, 2000);

function checkSSenseModal() {
    console.log("Measured: Looking for modal...");
    const measurementModal = document.querySelector(".modal-container-outer");
    return measurementModal;
}

async function init(measurementModal) {
    const resultMeasurements = validSSenseMeasurements(measurementModal);
    if (resultMeasurements === -1) {
        console.log("Measured: Error - No measurements provided.");
        return;
    }
    const category = getSSenseCategory();

    const resultActiveItem = await checkActiveItems(category);
    if (resultActiveItem === -1) {
        console.log("Measured: Error - No active items.")
        return;
    }

    const resultParsedData = parseSSenseMeasurements(measurementModal)
    if (resultParsedData === -1) {
        console.log("Measured: Error - parsing data.")
        return;
    }
    const resultCompare = compareSSenseMeasurements(measurementModal, resultParsedData, resultActiveItem);
    const measurementValueElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    for (let i = 0; i < resultCompare.length; i++) {
        displaySSenseDifference(measurementValueElement.children[i], resultCompare[i]);
    }
}

function validSSenseMeasurements(measurementModal) {
    const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
    if (measurementModalHeader.children.length === 1) {
        return -1;
    }
    return 1;
}
function getSSenseCategory() {
    const categoryElement = document.getElementById("pdpProductNameText");
    const categoryElementText = categoryElement.innerText.trim();
    if (categoryElementText.includes("T-Shirt") ||
        categoryElementText.includes("Henley") ||
        categoryElementText.includes("Polo") ||
        categoryElementText.includes("Tank Top")) {
        return "Tops";
    }
    else if (categoryElementText.includes("Cardigan") ||
        categoryElementText.includes("Sweater") ||
        categoryElementText.includes("Hoodie") ||
        categoryElementText.includes("Sweatshirt") ||
        categoryElementText.includes("Turtleneck")) {
        return "Tops";
    }

    else if (categoryElementText.includes("Jacket") ||
        categoryElementText.includes("Bomber") ||
        categoryElementText.includes("Coat") ||
        categoryElementText.includes("Peacoat") ||
        categoryElementText.includes("Vest")) {
        return "Outerwear";
    }
}

async function checkActiveItems(category) {
    return new Promise((resolve, reject) => {
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
function parseSSenseMeasurements(measurementModal) {
    const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    if (!measurementValuesElement) {
        return -1;
    }
    const measurementObject = {};

    //Currently only works with t-shirts because of the image.
    const measurementCategory = {
        "left: 45%; top: 40%;": "Chest",
        "left: 12%; top: 18%;": "Sleeve Length",
        "left: 45%; top: 6%;": "Shoulders",
        "left: 90%; top: 55%;": "Length"
    };

    for (let i = 0; i < measurementValuesElement.children.length; i++) {
        const categoryCSS = measurementValuesElement.children[i].style.cssText;
        const categoryValueInch = (measurementValuesElement.children[i].innerText.split(" ")[0]);
        const categoryValueCm = Math.trunc(categoryValueInch * 2.54);
        if (measurementCategory.hasOwnProperty(categoryCSS)) {
            measurementObject[measurementCategory[categoryCSS]] = [categoryValueInch, categoryValueCm];
        }
    }

    return measurementObject;
}
function compareSSenseMeasurements(measurementModal, parsedData, item, system = "Inch") {
    //let position = 0;
    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(parsedData);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));
    const difference = [];
    // const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[0];
    // const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[1];
    // console.log(document.querySelector(".pdp-size-chart__unit-buttons-list").children);

    // cmButton.addEventListener('click', () => {
    //     console.log("Hello");
    // })

    // displayGrailedCompareItem(measurementTable, item);

    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])
        const parsedValue = (parsedData[key])

        const inchDifference = (parsedValue[0] - activeValue[0]).toFixed(2);
        const cmDifference = (parsedValue[1] - activeValue[1]).toFixed(2);

        difference.push(inchDifference)
        //displaySSenseDifference(measurementModal, position, inchDifference, cmDifference);
        //position++;
    }
    return difference;
}

function displaySSenseDifference(measurementModal, difference) {
    let formattedDifference = difference;
    if (parseFloat(difference) === 0.00) {
        formattedDifference = "=";
    }
    measurementModal.innerHTML += ` ${formattedDifference}"`;
}

