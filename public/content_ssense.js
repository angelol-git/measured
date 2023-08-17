let closeButton;
let inchButtonHandlerRef;
let cmButtonHandlerRef;
let sizeButtonsHandlerRef;

function isMobileView() {
    return window.innerWidth <= 991;
}
function sizeGuideMutationObserver() {
    let containerToObserve;
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
    if (isMobileView) {
        containerToObserve = document.querySelector('.pdp-mobile');
    }
    else {
        containerToObserve = document.querySelector('.pdp-desktop');
    }
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

function modalMutationObserver() {
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const measurementModal = document.querySelector('.modal-container-outer');
        const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
        const measurementModalImage = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements");
        const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
        if (measurementModalHeader && measurementValuesElement && measurementModalImage) {

            if (measurementModalHeader.children.length === 1) {
                console.log("Measured: Error - No measurements provided.");
                return;
            }
            const category = getSSenseCategory();
            const activeItem = await validActiveItem(category);
            if (activeItem === -1) {
                console.log("Measured: Error - No active items.")
                return;
            }
            displaySSenseCompareItem(measurementModalImage, activeItem);
            let currentSystem = "inch";
            compareMeasurements(measurementModal, activeItem, currentSystem);

            const sizeButtons = document.querySelector(".pdp-size-chart__size-buttons-list");
            const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[0];
            const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[1];

            inchButtonHandlerRef = () => {
                currentSystem = "inch";
                compareMeasurements(measurementModal, activeItem, currentSystem);
            };

            cmButtonHandlerRef = () => {
                currentSystem = "cm";
                compareMeasurements(measurementModal, activeItem, currentSystem);
            };

            sizeButtonsHandlerRef = () => {
                compareMeasurements(measurementModal, activeItem, currentSystem);
            };

            inchButton.addEventListener('click', inchButtonHandlerRef);
            cmButton.addEventListener('click', cmButtonHandlerRef);
            sizeButtons.addEventListener('click', sizeButtonsHandlerRef);


            const closeButton = measurementModal.querySelector('.modal-close'); // Replace with actual selector
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    closeModal();
                });
            }

            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.modal-container-outer');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

async function compareMeasurements(measurementModal, activeItem, system) {
    removePreviousMeasurements();
    const originalMeasurements = getOriginalMeasurements(measurementModal);
    if (originalMeasurements === -1) {
        console.log("Measured: Error - parsing data.")
        return;
    }
    const measurementDifferences = compareSSenseMeasurements(originalMeasurements, activeItem, system);
    const measurementValueElements = Array.from(measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1].children);
    for (const key in measurementDifferences) {
        const measurementValueElement = measurementValueElements.filter((item) => {
            return item.style.cssText === originalMeasurements[key].cssPosition;
        })[0];
        if (system === "inch") {
            displaySSenseDifference(measurementValueElement, measurementDifferences[key].valueDifference, system);
        }
        else {
            displaySSenseDifference(measurementValueElement, measurementDifferences[key].valueDifference, system);
        }
    }

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

async function validActiveItem(category) {
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

function getOriginalMeasurements(measurementModal) {
    const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    if (!measurementValuesElement) {
        return -1;
    }
    const originalMeasurements = {};

    //Currently only works with t-shirts because of the image.
    const measurementCategory = {
        "left: 45%; top: 40%;": "Chest",
        "left: 12%; top: 18%;": "Sleeve Length",
        "left: 45%; top: 6%;": "Shoulders",
        "left: 90%; top: 55%;": "Length"
    };

    for (let i = 0; i < measurementValuesElement.children.length; i++) {
        const cssPosition = measurementValuesElement.children[i].style.cssText;
        const originalValue = (measurementValuesElement.children[i].innerText.split(" ")[0]);
        if (measurementCategory.hasOwnProperty(cssPosition)) {
            originalMeasurements[measurementCategory[cssPosition]] = {
                cssPosition,
                originalValue,
            };
        }
    }

    return originalMeasurements;
}

function compareSSenseMeasurements(originalMeasurements, item, system) {
    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(originalMeasurements);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));
    const difference = {};


    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])
        const parsedValue = (originalMeasurements[key])
        let valueDifference;
        if (system === "inch") {
            valueDifference = (parsedValue.originalValue - activeValue[0]).toFixed(2);
        }
        else {
            valueDifference = (parsedValue.originalValue - activeValue[1]).toFixed(2);
        }
        difference[key] = {
            valueDifference,
        };
    }

    return difference;
}

function displaySSenseDifference(measurementElement, difference, system) {
    const newNode = document.createElement("p");
    newNode.setAttribute('class', 'measured-difference');
    newNode.style.width = "60px";
    newNode.style.backgroundColor = "white";
    newNode.style.textAlign = "left";

    let formattedDifference = "";
    if (parseFloat(difference) === 0.00) {
        formattedDifference = "=";
    } else {
        const sign = difference > 0 ? "+" : "";
        const unit = system === "inch" ? ' "' : " cm";
        formattedDifference = `${sign}${difference} ${unit}`;
    }

    newNode.innerHTML = formattedDifference;
    measurementElement.appendChild(newNode);
}
function displaySSenseCompareItem(measurementElement, item) {
    const parentDiv = measurementElement.parentNode;
    const titleCard = document.createElement("div");
    titleCard.innerHTML += `<p">Comparing to ${item.title}</p>`;
    parentDiv.insertBefore(titleCard, measurementElement);
}
function removePreviousMeasurements() {
    const prevDifference = document.querySelectorAll('.measured-difference');
    if (prevDifference) {
        for (var i = 0, len = prevDifference.length; i < len; i++) {
            prevDifference[i].remove();
        }
    }
}

function closeModal() {
    if (closeButton) closeButton.removeEventListener('click', closeModal);
    if (inchButtonHandlerRef) inchButton.removeEventListener('click', inchButtonHandlerRef);
    if (cmButtonHandlerRef) cmButton.removeEventListener('click', cmButtonHandlerRef);
    if (sizeButtonsHandlerRef) sizeButtons.removeEventListener('click', sizeButtonsHandlerRef);
}

sizeGuideMutationObserver();