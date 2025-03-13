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
            const measurementMap = imageData[category][measurementModalImage.children[0].src];
            const measurementList = measurementModal.querySelector(".pdp-size-chart__guide-image-measurements").children[1];
            handleModalButtons(measurementList, activeItem, measurementMap);
            compareMeasurements(measurementList, activeItem, measurementMap);
        } else {
            //console.log("Measured: Measurement Modal not found. Retrying in", retryDelay, "ms");
            setTimeout(checkModal, retryDelay);
        }
    };
    checkModal();
}

function handleModalButtons(measurementModal, activeItem, measurementMap) {
    const sizeButtons = document.querySelector(".pdp-size-chart__size-buttons-list");
    const inchButton = document.querySelector(".pdp-size-chart__unit-buttons-list")?.children[0];
    const cmButton = document.querySelector(".pdp-size-chart__unit-buttons-list")?.children[1];
    const closeButton = isMobileView() ? document.querySelector('.modal-close') : document.querySelector('.modal-btn-close');
    const backDropButton = document.getElementById('backdrop');
    // Store event handler references
    inchButtonHandlerRef = () => {
        currentSystem = "inch";
        compareMeasurements(measurementModal, activeItem, measurementMap);
    };
    cmButtonHandlerRef = () => {
        currentSystem = "cm";
        compareMeasurements(measurementModal, activeItem, measurementMap);
    };
    sizeButtonsHandlerRef = () => {
        compareMeasurements(measurementModal, activeItem, measurementMap);
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

function compareMeasurements(measurementList, activeItem, measurementMap) {
    deletePreviousMeasurements();
    const activeKeys = Object.keys(activeItem.measurements);
    displayActiveTitle(measurementList, activeItem);

    for (let i = 0; i < activeKeys.length; i++) {
        if (Object.hasOwn(measurementMap, activeKeys[i])) {

            const { element: listItemElement, value: originalValue } = getOriginalMeasurement(measurementList, measurementMap, activeKeys[i]);
            if (!listItemElement) continue;

            let activeValues = currentSystem === "inch" ? activeItem.measurements[activeKeys[i]][0] : activeItem.measurements[activeKeys[i]][1];
            let valueDifference = (originalValue - activeValues).toFixed(2);
            displayDifferences(listItemElement, valueDifference, currentSystem);
        }
    }
}

function getOriginalMeasurement(measurementList, measurementMap, key) {
    for (let i = 0; i < measurementList.children.length; i++) {
        if (measurementList.children[i].style.cssText === measurementMap[key]) {
            return {
                element: measurementList.children[i],
                value: measurementList.children[i].innerText.split(" ")[0]
            };
        }
    }
    return { element: null, value: null };
}

function displayActiveTitle(measurementList, item) {
    const activeTitle = document.createElement("div");
    activeTitle.classList.add("measured-difference");
    activeTitle.innerHTML +=
        `<p "style="color:grey">
            Comparing to ${item.title}
        </p>`;
    measurementList.parentNode.parentNode.insertBefore(activeTitle, measurementList.parentNode);
}

// Have to use this method to add classes and append right beside the list item element
// Adding directly in the innerHtml list item element causes issues with measurement/unit changes
// (Changes from inches to cm)
function displayDifferences(listItemElement, difference) {
    //Use p tag instead of ul,li or div to not conflict with css
    const newDifferenceElement = document.createElement("p");
    newDifferenceElement.classList.add("measured-difference");
    newDifferenceElement.style.whiteSpace = "nowrap";
    function formatDifference(difference) {
        if (parseFloat(difference) === 0.00) {
            return `<span style="background-color: white; color:grey">=</span>`;
        } else {
            const color = difference > 0 ? "green" : "red";
            const sign = difference > 0 ? "+" : "";
            const unit = currentSystem === "inch" ? ' "' : " cm";
            return `<span style="background-color: white; color: ${color}">${sign}${difference} ${unit}</span>`;
        }
    }

    newDifferenceElement.innerHTML = formatDifference(difference);
    listItemElement.append(newDifferenceElement);
}

function deletePreviousMeasurements() {
    const prevDifference = document.querySelectorAll('.measured-difference');
    if (prevDifference) {
        for (var i = 0, len = prevDifference.length; i < len; i++) {
            prevDifference[i].remove();
        }
    }
}

function closeModal(inchButton, cmButton, sizeButtons, closeButton) {
    currentSystem = "inch";
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
        categoryElementText.includes("Sweatpants") ||
        categoryElementText.includes("Jeans")) {
        return "Bottoms";
    }
}

const imageData = {
    Tops: {
        "https://res.cloudinary.com/ssense/image/upload/v1485365329/size_guide/category_215.jpg": {
            "Chest": "left: 51%; top: 40%;",
            "Sleeve Length": "left: 16%; top: 20%;",
            "Shoulders": "left: 51%; top: 8%;",
            "Length": "left: 87%; top: 54%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365328/size_guide/category_216.jpg": {
            "Chest": "left: 45%; top: 40%;",
            "Sleeve Length": "left: 12%; top: 18%;",
            "Shoulders": "left: 45%; top: 6%;",
            "Length": "left: 91%; top: 55%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365327/size_guide/category_217.jpg": {
            "Chest": "left: 45%; top: 40%;",
            "Sleeve Length": "left: 12%; top: 18%;",
            "Shoulders": "left: 45%; top: 6%;",
            "Length": "left: 90%; top: 55%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463872/size_guide/category_218.jpg": {
            "Chest": "left: 42%; top: 44%;",
            "Length": "left: 72%; top: 55%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365331/size_guide/category_204.jpg": {
            "Chest": "left: 49%; top: 42%;",
            "Sleeve Length": "left: 13%; top: 32%;",
            "Shoulders": "left: 49%; top: 9%;",
            "Length": "left: 87%; top: 56%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_205_208.jpg": {
            "Chest": "left: 51%; top: 41%;",
            "Sleeve Length": "left: 18%; top: 23%;",
            "Shoulders": "left: 51%; top: 7%;",
            "Length": "left: 88%; top: 52%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463877/size_guide/category_206.jpg": {
            "Chest": "left: 48%; top: 42%;",
            "Sleeve Length": "left: 15%; top: 24%;",
            "Shoulders": "left: 48%; top: 9%;",
            "Length": "left: 84%; top: 51%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463875/size_guide/category_207_209.jpg": {
            "Chest": "left: 48%; top: 41%;",
            "Sleeve Length": "left: 15%; top: 25%;",
            "Shoulders": "left: 48%; top: 5%;",
            "Length": "left: 83%; top: 55%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_210.jpg": {
            "Chest": "left: 51%; top: 40%;",
            "Sleeve Length": "left: 16%; top: 18%;",
            "Shoulders": "left: 51%; top: 51%;",
            "Length": "left: 87%; top: 55%;"
        }
    },
    Outerwear: {
        "https://res.cloudinary.com/ssense/image/upload/v1485365324/size_guide/category_179_181_182_184.jpg": {
            "Chest": "left: 48%; top: 52%;",
            "Sleeve Length": "left: 15%; top: 33%;",
            "Shoulders": "left: 48%; top: 16%;",
            "Length": "left: 84%; top: 62%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365323/size_guide/category_180_183_187_188.jpg": {
            "Chest": "left: 48%; top: 36%;",
            "Sleeve Length": "left: 12%; top: 25%;",
            "Shoulders": "left: 48%; top: 1%;",
            "Length": "left: 85%; top: 53%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365325/size_guide/category_185.jpg": {
            "Chest": "left: 48%; top: 41%;",
            "Sleeve Length": "left: 13%; top: 22%;",
            "Shoulders": "left: 48%; top: 5%;",
            "Length": "left: 87%; top: 52%;"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463867/size_guide/category_189_202.jpg": {
            "Chest": "left: 44%; top: 41%;",
            "Shoulders": "left: 44%; top: 3%;",
            "Length": "left: 72%; top: 52%;"
        }
    },
    Bottoms: {
        //Pants,Trousers,Jeans
        "https://res.cloudinary.com/ssense/image/upload/v1509463868/size_guide/category_193_195.jpg": {
            "Leg Opening": "left: 33%; top: 99%;",
            "Front Rise": "left: 69%; top: 20%;",
            "Inseam": "left: 52%; top: 57%;",
            "Waist": "left: 45%; top: 2%;"
        },
        //Sweatpants
        "https://res.cloudinary.com/ssense/image/upload/v1509463869/size_guide/category_194.jpg": {
            "Leg Opening": "left: 33%; top: 100%;",
            "Front Rise": "left: 69%; top: 20%;",
            "Inseam": "left: 54%; top: 59%;",
            "Waist": "left: 45%; top: 2%;"
        }
    }
}

//mutationObserverGlobal();
waitForMeasurementModal();
