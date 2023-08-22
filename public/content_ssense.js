
let closeButton;
let inchButtonHandlerRef;
let cmButtonHandlerRef;
let sizeButtonsHandlerRef;
let buttonListenersAttached = false;

function isMobileView() {
    return window.innerWidth <= 991;
}

function bodyMutationObserver() {
    //console.log("Main Observer Loading");
    const observer = new MutationObserver((mutationsList, observer) => {
        const productContainer = isMobileView() ? document.querySelector('.pdp-mobile') : document.querySelector('.pdp-desktop');
        if (productContainer) {
            sizeGuideMutationObserver();
        }
    });

    const containerToObserve = document.querySelector(".main");
    if (containerToObserve) {
        observer.observe(containerToObserve, { childList: true, subtree: true });
    } else {
        console.log("Main container not found");
    }
}

function sizeGuideMutationObserver() {
    //console.log("Observer loading");
    const observer = new MutationObserver((mutationsList, observer) => {
        const sizeGuideButton = document.querySelectorAll('.pdp-size-chart__model-wearing')[1];
        if (sizeGuideButton && !buttonListenersAttached) { // Attach listeners only if not already attached
            console.log("Measured: Found button.");
            sizeGuideButton.addEventListener('click', () => {
                modalMutationObserver();
            });
            buttonListenersAttached = true; // Set the flag to true
            observer.disconnect();
        }
    });

    const containerToObserve = isMobileView() ? document.querySelector('.pdp-mobile') : document.querySelector('.pdp-desktop');
    if (containerToObserve) {
        observer.observe(containerToObserve, { childList: true, subtree: true });
    } else {
        console.log("Product container not found");
    }

}

function modalMutationObserver() {
    const observer = new MutationObserver(async (mutationsList, observer) => {

        const measurementModal = document.querySelector('.modal-container-outer');
        const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
        const measurementModalImage = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements");
        const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
        const closeButton = document.querySelector('.modal-close');
        if (measurementModalHeader && measurementValuesElement && measurementModalImage && closeButton) {

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

            console.log("Measured: Comparing");
            let currentSystem = "inch";
            const imageSource = imageData[category][measurementModalImage.children[0].src];
            displaySSenseCompareItem(measurementModalImage, activeItem);
            compareMeasurements(measurementModal, activeItem, currentSystem, imageSource);

            const sizeButtons = document.querySelector(".pdp-size-chart__size-buttons-list");
            const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[0];
            const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list").children[1];

            inchButtonHandlerRef = () => {
                currentSystem = "inch";
                compareMeasurements(measurementModal, activeItem, currentSystem, imageSource);
            };

            cmButtonHandlerRef = () => {
                currentSystem = "cm";
                compareMeasurements(measurementModal, activeItem, currentSystem, imageSource);
            };

            sizeButtonsHandlerRef = () => {
                compareMeasurements(measurementModal, activeItem, currentSystem, imageSource);
            };

            inchButton.addEventListener('click', inchButtonHandlerRef);
            cmButton.addEventListener('click', cmButtonHandlerRef);
            sizeButtons.addEventListener('click', sizeButtonsHandlerRef);

            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    closeModal(inchButton, cmButton, sizeButtons, closeButton);
                });
            }

            observer.disconnect();
        }
    });
    const containerToObserve = document.querySelector('.modal-container-outer');
    observer.observe(containerToObserve, { childList: true, subtree: true });
}

async function compareMeasurements(measurementModal, activeItem, system, imageSource) {
    removePreviousMeasurements();
    const originalMeasurements = getOriginalMeasurements(measurementModal, imageSource);

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

function getOriginalMeasurements(measurementModal, imageSource) {
    const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    if (!measurementValuesElement) {
        return -1;
    }
    const originalMeasurements = {};

    //Currently only works with t-shirts because of the image.
    const measurementCategory = imageSource;

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
    titleCard.innerHTML = `<p">Comparing to ${item.title}</p>`;
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

function closeModal(inchButton, cmButton, sizeButtons, closeButton) {

    console.log("closing");

    if (inchButtonHandlerRef) inchButton.removeEventListener('click', inchButtonHandlerRef);
    if (cmButtonHandlerRef) cmButton.removeEventListener('click', cmButtonHandlerRef);
    if (sizeButtonsHandlerRef) sizeButtons.removeEventListener('click', sizeButtonsHandlerRef);
    if (closeButton) closeButton.removeEventListener('click', closeModal);
    buttonListenersAttached = false;
}

const imageData = {
    Tops: {
        //Henley
        "https://res.cloudinary.com/ssense/image/upload/v1485365329/size_guide/category_215.jpg": {
            "left: 51%; top: 40%;": "Chest",
            "left: 16%; top: 20%;": "Sleeve Length",
            "left: 51%; top: 8%;": "Shoulders",
            "left: 87%; top: 54%;": "Length"
        },
        //Polos
        "https://res.cloudinary.com/ssense/image/upload/v1485365328/size_guide/category_216.jpg": {
            "left: 45%; top: 40%;": "Chest",
            "left: 12%; top: 18%;": "Sleeve Length",
            "left: 45%; top: 6%;": "Shoulders",
            "left: 91%; top: 55%;": "Length"
        },
        //T-Shirt
        "https://res.cloudinary.com/ssense/image/upload/v1485365327/size_guide/category_217.jpg": {
            "left: 45%; top: 40%;": "Chest",
            "left: 12%; top: 18%;": "Sleeve Length",
            "left: 45%; top: 6%;": "Shoulders",
            "left: 90%; top: 55%;": "Length"
        },
        //Tank Top
        "https://res.cloudinary.com/ssense/image/upload/v1509463872/size_guide/category_218.jpg": {
            "left: 42%; top: 44%;": "Chest",
            "left: 72%; top: 55%;": "Length"
        },
        //Sweaters
        //Cardigan
        "https://res.cloudinary.com/ssense/image/upload/v1485365331/size_guide/category_204.jpg": {
            "left: 49%; top: 42%;": "Chest",
            "left: 13%; top: 32%;": "Sleeve Length",
            "left: 49%; top: 9%;": "Shoulders",
            "left: 87%; top: 56%;": "Length"
        },
        //Sweater
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_205_208.jpg": {
            "left: 51%; top: 41%;": "Chest",
            "left: 18%; top: 23%;": "Sleeve Length",
            "left: 51%; top: 7%;": "Shoulders",
            "left: 88%; top: 52%;": "Length"
        },
        //Hoodie
        "https://res.cloudinary.com/ssense/image/upload/v1509463877/size_guide/category_206.jpg": {
            "left: 48%; top: 42%;": "Chest",
            "left: 15%; top: 24%;": "Sleeve Length",
            "left: 48%; top: 9%;": "Shoulders",
            "left: 84%; top: 51%;": "Length"
        },
        //Turtle Neck
        "https://res.cloudinary.com/ssense/image/upload/v1509463875/size_guide/category_207_209.jpg": {
            "left: 48%; top: 41%;": "Chest",
            "left: 15%; top: 25%;": "Sleeve Length",
            "left: 48%; top: 5%;": "Shoulders",
            "left: 83%; top: 55%;": "Length"
        },
        //V Neck Sweater
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_210.jpg": {
            "left: 51%; top: 40%;": "Chest",
            "left: 16%; top: 18%;": "Sleeve Length",
            "left: 51%; top: 51%;": "Shoulders",
            "left: 87%; top: 55%;": "Length"
        }
    },
    Outerwear: {
        //Jacket
        "https://res.cloudinary.com/ssense/image/upload/v1485365324/size_guide/category_179_181_182_184.jpg": {
            "left: 48%; top: 52%;": "Chest",
            "left: 15%; top: 33%;": "Sleeve Length",
            "left: 48%; top: 16%;": "Shoulders",
            "left: 84%; top: 62%;": "Length"
        },
        //Coat/Long Jacket
        "https://res.cloudinary.com/ssense/image/upload/v1485365323/size_guide/category_180_183_187_188.jpg": {
            "left: 48%; top: 36%;": "Chest",
            "left: 12%; top: 25%;": "Sleeve Length",
            "left: 48%; top: 1%;": "Shoulders",
            "left: 85%; top: 53%;": "Length"
        },
        //Other Jacket
        "https://res.cloudinary.com/ssense/image/upload/v1485365325/size_guide/category_185.jpg": {
            "left: 48%; top: 41%;": "Chest",
            "left: 13%; top: 22%;": "Sleeve Length",
            "left: 48%; top: 5%;": "Shoulders",
            "left: 87%; top: 52%;": "Length"
        },
        //Vest
        "https://res.cloudinary.com/ssense/image/upload/v1509463867/size_guide/category_189_202.jpg": {
            "left: 44%; top: 41%;": "Chest",
            "left: 44%; top: 3%;": "Shoulders",
            "left: 72%; top: 52%;": "Length"
        }
    }
}

bodyMutationObserver();
