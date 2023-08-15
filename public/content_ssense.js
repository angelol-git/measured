function sizeGuideMutationObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const sizeGuideButton = document.querySelectorAll('.pdp-size-chart__model-wearing')[1];
        if (sizeGuideButton) {
            console.log("Measured: Found button.");
            sizeGuideButton.addEventListener('click', () => {
                modalMutationObserver();
            });
            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.pdp-header__right');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

function modalMutationObserver() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const measurementModal = document.querySelector('.modal-container-outer');
        const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
        const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
        if (measurementModalHeader && measurementValuesElement) {
            console.log("Measured: Multiple elements loaded.");
            compareMeasurements(measurementModal);
            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.modal-container-outer');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

async function compareMeasurements(measurementModal) {

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

    const resultOriginalMeasurements = parseSSenseMeasurements(measurementModal)
    if (resultOriginalMeasurements === -1) {
        console.log("Measured: Error - parsing data.")
        return;
    }

    const resultCompare = compareSSenseMeasurements(resultOriginalMeasurements, resultActiveItem);
    const measurementValueElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];

    for (let i = 0; i < resultCompare.length; i++) {
        displaySSenseDifference(measurementValueElement.children[i], "inch", resultCompare[i][0]);
    }
    // displayGrailedCompareItem(measurementTable, item);

    toggleUnitSystems(measurementValueElement, resultCompare, Object.values(resultOriginalMeasurements));
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
        const categoryValueCm = (Math.trunc(categoryValueInch * 2.54)).toString();
        if (measurementCategory.hasOwnProperty(categoryCSS)) {
            measurementObject[measurementCategory[categoryCSS]] = [categoryValueInch, categoryValueCm];
        }
    }

    return measurementObject;
}
function compareSSenseMeasurements(parsedData, item) {
    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(parsedData);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));
    const difference = [];

    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])
        const parsedValue = (parsedData[key])

        const inchDifference = (parsedValue[0] - activeValue[0]).toFixed(2);
        const cmDifference = (parsedValue[1] - activeValue[1]).toFixed(2);

        difference.push([inchDifference, cmDifference]);
    }
    return difference;
}

function displaySSenseDifference(measurementElement, system, difference, originalMeasurements, initial = true) {
    let formattedDifference = difference;
    if (!initial) {
        if (system === "inch") {
            measurementElement.innerHTML = originalMeasurements + " &quot";
            //measurementElement.innerHTML = measurementElement.innerText.trim().split(" ")[0] + " &quot";
        }
        else if (system === "cm") {
            measurementElement.innerHTML = originalMeasurements + " cm";
            //measurementElement.innerHTML = measurementElement.innerText.trim().split(" ")[0] + " cm";
        }
    }
    if (parseFloat(difference) === 0.00) {
        formattedDifference = "=";
    }
    if (system === "inch") {
        measurementElement.innerHTML += ` ${formattedDifference}"`;
    }
    else {
        measurementElement.innerHTML += ` ${formattedDifference} cm`;

    }
}

function toggleUnitSystems(measurementValueElement, resultCompare, resultOriginalMeasurements) {
    const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[0];
    const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[1];
    inchButton.addEventListener('click', () => {
        for (let i = 0; i < resultCompare.length; i++) {
            displaySSenseDifference(measurementValueElement.children[i], "inch", resultCompare[i][0], resultOriginalMeasurements[i][0], false);
        }
    })
    cmButton.addEventListener('click', () => {
        for (let i = 0; i < resultCompare.length; i++) {
            displaySSenseDifference(measurementValueElement.children[i], "cm", resultCompare[i][1], resultOriginalMeasurements[i][1], false);
        }
    })
}
sizeGuideMutationObserver();