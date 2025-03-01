let inchButtonHandlerRef;
let cmButtonHandlerRef;
let sizeButtonsHandlerRef;
let currentSystem = "inch";

function isMobileView() {
    return window.innerWidth <= 991;
}

function waitForMeasurementModal() {
    let retryDelay = 1000;
    const maxRetryDelay = 5000;

    const checkModal = async () => {
        const measurementModal = document.querySelector('.modal-container-outer');
        if (measurementModal) {
            console.log("Measured: Measurement Modal Found.");
            const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
            const measurementModalImage = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements");
            if (measurementModalHeader.children[0].innerText === "SIZE CONVERSION CHART") {
                //Or not loaded yet, this still works fine though
                console.log("Measured: Error - No measurements provided. Retrying in", retryDelay, "ms");
                retryDelay = Math.min(retryDelay += 1000, maxRetryDelay);
                setTimeout(checkModal, retryDelay);
                return;
            }

            const category = getSSenseCategory();
            const activeItem = await getActiveItem(category);
            if (activeItem === -1) {
                console.log("Measured: Error - No active items. Retrying in", retryDelay, "ms");
                retryDelay = Math.min(retryDelay += 1000, maxRetryDelay);
                setTimeout(checkModal, retryDelay);
                return;
            }
            retryDelay = 1000;
            const imageSource = imageData[category][measurementModalImage.children[0].src];
            handleModalButtons(measurementModal, activeItem, imageSource);
            compareMeasurements(measurementModal, activeItem, imageSource);
        } else {
            //console.log("Measured: Measurement Modal not found. Retrying in", retryDelay, "ms");
            setTimeout(checkModal, retryDelay);
        }
    };

    checkModal();
}

// function waitForMeasurementModal() {
//     const checkModalInterval = setInterval(async () => {
//         const measurementModal = document.querySelector('.modal-container-outer');
//         if (measurementModal) {
//             console.log("Measured: Measurement Modal Found.");
//             clearInterval(checkModalInterval);

//             const measurementModalHeader = measurementModal.querySelector(".pdp-size-chart__tab-links");
//             const measurementModalImage = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements");
//             if (measurementModalHeader.children[0].innerText === "SIZE CONVERSION CHART") {
//                 console.log("Measured: Error - No measurements provided ");
//                 return;
//             }

//             const category = getSSenseCategory();
//             const activeItem = await getActiveItem(category);
//             if (activeItem === -1) {
//                 console.log("Measured: Error - No active items.")
//                 return;
//             }
//             const imageSource = imageData[category][measurementModalImage.children[0].src];
//             console.log(imageSource);
//             handleModalButtons(measurementModal, activeItem, imageSource);
//             compareMeasurements(measurementModal, activeItem, imageSource);
//         }
//     }, 500); // Check every 500ms
// }

function handleModalButtons(measurementModal, activeItem, imageSource) {
    const sizeButtons = document.querySelector(".pdp-size-chart__size-buttons-list");
    const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list")?.children[0];
    const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list")?.children[1];
    const closeButton = isMobileView() ? document.querySelector('.modal-close') : document.querySelector('.modal-btn-close');
    const backDropButton = document.getElementById('backdrop');
    // Store event handler references
    inchButtonHandlerRef = () => {
        currentSystem = "inch";
        compareMeasurements(measurementModal, activeItem, imageSource);
    };
    cmButtonHandlerRef = () => {
        currentSystem = "cm";
        compareMeasurements(measurementModal, activeItem, imageSource);
    };
    sizeButtonsHandlerRef = () => {
        compareMeasurements(measurementModal, activeItem, imageSource);
    };

    if (inchButton && cmButton && sizeButtons) {
        inchButton.addEventListener('click', inchButtonHandlerRef);
        cmButton.addEventListener('click', cmButtonHandlerRef);
        sizeButtons.addEventListener('click', sizeButtonsHandlerRef);
    }
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeModal(inchButton, cmButton, sizeButtons, closeButton);
            setTimeout(waitForMeasurementModal, 500);
        });
    }

    if (backDropButton) {
        backDropButton.addEventListener('click', () => {
            closeModal(inchButton, cmButton, sizeButtons, closeButton);
            setTimeout(waitForMeasurementModal, 500);
        });
    }
}

function compareMeasurements(measurementModal, activeItem, imageSource) {
    removePreviousMeasurements();
    const originalMeasurements = parseOriginalMeasurements(measurementModal, imageSource);
    const measurementDifferences = calculateDifferences(originalMeasurements, activeItem, currentSystem);
    const originalMeasurementElements = Array.from(measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1].children);

    displayActiveTitle(measurementModal, activeItem);
    for (const key in measurementDifferences) {
        const measurementValueElement = originalMeasurementElements.filter((item) => {
            return item.style.cssText === originalMeasurements[key].cssPosition;
        })[0];
        if (currentSystem === "inch") {
            displayDifferences(measurementValueElement, measurementDifferences[key].valueDifference, currentSystem);
        }
        else {
            displayDifferences(measurementValueElement, measurementDifferences[key].valueDifference, currentSystem);
        }
    }
}

function parseOriginalMeasurements(measurementModal, measurementCategory) {
    const measurementValuesElement = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
    if (!measurementValuesElement) {
        return -1;
    }
    const originalMeasurements = {};

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

function calculateDifferences(originalMeasurements, item) {
    const activeKeys = Object.keys(item.measurements);
    const parsedKeys = Object.keys(originalMeasurements);
    const commonKeys = parsedKeys.filter((key) => activeKeys.includes(key));
    const difference = {};


    for (const key of commonKeys) {
        const activeValue = (item.measurements[key])
        const parsedValue = (originalMeasurements[key])
        let valueDifference;
        if (currentSystem === "inch") {
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

function displayActiveTitle(measurementElement, item) {
    const activeTitle = document.createElement("div");
    activeTitle.innerHTML = `<p style="color:grey">Comparing to ${item.title}</p>`;
    measurementElement.parentNode.insertBefore(activeTitle, measurementElement);
}

function displayDifferences(measurementElement, difference) {
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
        const unit = currentSystem === "inch" ? ' "' : " cm";
        formattedDifference = `${sign}${difference} ${unit}`;
    }

    newNode.innerHTML = formattedDifference;
    measurementElement.appendChild(newNode);
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
    if (inchButtonHandlerRef) inchButton.removeEventListener('click', inchButtonHandlerRef);
    if (cmButtonHandlerRef) cmButton.removeEventListener('click', cmButtonHandlerRef);
    if (sizeButtonsHandlerRef) sizeButtons.removeEventListener('click', sizeButtonsHandlerRef);
    if (closeButton) closeButton.removeEventListener('click', closeModal);
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

    else if (categoryElementText.includes("Pants") ||
        categoryElementText.includes("Trousers") ||
        categoryElementText.includes("Sweatpants")) {
        return "Bottoms";
    }
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
    },
    Bottoms: {
        "https://res.cloudinary.com/ssense/image/upload/v1509463868/size_guide/category_193_195.jpg": {
            "left: 33%; top: 99%;": "Leg Opening",
            "left: 69%; top: 20%;": "Front Rise",
            "left: 52%; top: 57%;": "Inseam",
            "left: 45%; top: 2%;": "Waist",
        },
        //Sweatpants
        "https://res.cloudinary.com/ssense/image/upload/v1509463869/size_guide/category_194.jpg": {
            "left: 33%; top: 100%;": "Leg Opening",
            "left: 69%; top: 20%;": "Front Rise",
            "left: 54%; top: 59%;": "Inseam",
            "left: 45%; top: 2%;": "Waist",
        }
    }
}

//mutationObserverGlobal();
waitForMeasurementModal();
