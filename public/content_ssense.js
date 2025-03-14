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
    const originalMeasurements = getOriginalMeasurements(measurementList, measurementMap);
    const activeKeys = Object.keys(activeItem.measurements);

    displayActiveTitle(measurementList, activeItem);
    for (let i = 0; i < activeKeys.length; i++) {
        if (Object.hasOwn(originalMeasurements, activeKeys[i])) {
            let activeValue = currentSystem === "inch" ? activeItem.measurements[activeKeys[i]][0] : activeItem.measurements[activeKeys[i]][1];
            let valueDifference = (originalMeasurements[activeKeys[i]].measurement - activeValue).toFixed(2);
            displayDifferences(originalMeasurements[activeKeys[i]].element, valueDifference, activeValue);
        }
    }
}

function getOriginalMeasurements(measurementList, measurementMap) {
    const measurements = {};
    for (let i = 0; i < measurementList.children.length; i++) {
        const parsedItem = measurementList.children[i];

        measurements[measurementMap[parsedItem.style.cssText]] = {
            element: measurementList.children[i],
            measurement: measurementList.children[i].innerText.split(" ")[0]
        }
    }
    return measurements;
}

function displayActiveTitle(measurementList, item) {
    const activeTitle = document.createElement("div");
    activeTitle.classList.add("measured-difference");
    activeTitle.innerHTML +=
        `<p "style="color:grey">
            Measured: Comparing to ${item.title}
        </p>`;
    measurementList.parentNode.parentNode.insertBefore(activeTitle, measurementList.parentNode);
}

// Have to use this method to add classes and append right beside the list item element
// Adding directly in the innerHtml list item element causes issues with measurement/unit changes
// (Changes from inches to cm)
function displayDifferences(listItemElement, difference, activeValue) {
    //Use p tag instead of ul,li or div to not conflict with css
    const newDifferenceElement = document.createElement("p");
    newDifferenceElement.classList.add("measured-difference");
    newDifferenceElement.style.whiteSpace = "nowrap";
    function formatDifference(difference) {
        const sign = difference > 0 ? "+" : "";
        const color = difference > 0 ? "green" : "red";
        const unit = currentSystem === "inch" ? ' "' : " cm";
        if (parseFloat(difference) === 0.00) {
            return `<span style="background-color: white; color:grey">
                        ${activeValue}${unit}
                        =
                        <br>
                    </span>`;
        } else {
            return `<span style="background-color:white;">   
                        <span style="color:grey">${activeValue}${unit}</span>
                        <br>
                        <span style="color: ${color}">${sign}${difference} ${unit}</span>
                    </span >`
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
            "left: 51%; top: 40%;": "Chest",
            "left: 16%; top: 20%;": "Sleeve Length",
            "left: 51%; top: 8%;": "Shoulders",
            "left: 87%; top: 54%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365328/size_guide/category_216.jpg": {
            "left: 45%; top: 40%;": "Chest",
            "left: 12%; top: 18%;": "Sleeve Length",
            "left: 45%; top: 6%;": "Shoulders",
            "left: 91%; top: 55%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365327/size_guide/category_217.jpg": {
            "left: 45%; top: 40%;": "Chest",
            "left: 12%; top: 18%;": "Sleeve Length",
            "left: 45%; top: 6%;": "Shoulders",
            "left: 90%; top: 55%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463872/size_guide/category_218.jpg": {
            "left: 42%; top: 44%;": "Chest",
            "left: 72%; top: 55%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365331/size_guide/category_204.jpg": {
            "left: 49%; top: 42%;": "Chest",
            "left: 13%; top: 32%;": "Sleeve Length",
            "left: 49%; top: 9%;": "Shoulders",
            "left: 87%; top: 56%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_205_208.jpg": {
            "left: 51%; top: 41%;": "Chest",
            "left: 18%; top: 23%;": "Sleeve Length",
            "left: 51%; top: 7%;": "Shoulders",
            "left: 88%; top: 52%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463877/size_guide/category_206.jpg": {
            "left: 48%; top: 42%;": "Chest",
            "left: 15%; top: 24%;": "Sleeve Length",
            "left: 48%; top: 9%;": "Shoulders",
            "left: 84%; top: 51%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463875/size_guide/category_207_209.jpg": {
            "left: 48%; top: 41%;": "Chest",
            "left: 15%; top: 25%;": "Sleeve Length",
            "left: 48%; top: 5%;": "Shoulders",
            "left: 83%; top: 55%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365334/size_guide/category_210.jpg": {
            "left: 51%; top: 40%;": "Chest",
            "left: 16%; top: 18%;": "Sleeve Length",
            "left: 51%; top: 51%;": "Shoulders",
            "left: 87%; top: 55%;": "Length"
        }
    },
    Outerwear: {
        "https://res.cloudinary.com/ssense/image/upload/v1485365324/size_guide/category_179_181_182_184.jpg": {
            "left: 48%; top: 52%;": "Chest",
            "left: 15%; top: 33%;": "Sleeve Length",
            "left: 48%; top: 16%;": "Shoulders",
            "left: 84%; top: 62%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365323/size_guide/category_180_183_187_188.jpg": {
            "left: 48%; top: 36%;": "Chest",
            "left: 12%; top: 25%;": "Sleeve Length",
            "left: 48%; top: 1%;": "Shoulders",
            "left: 85%; top: 53%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1485365325/size_guide/category_185.jpg": {
            "left: 48%; top: 41%;": "Chest",
            "left: 13%; top: 22%;": "Sleeve Length",
            "left: 48%; top: 5%;": "Shoulders",
            "left: 87%; top: 52%;": "Length"
        },
        "https://res.cloudinary.com/ssense/image/upload/v1509463867/size_guide/category_189_202.jpg": {
            "left: 44%; top: 41%;": "Chest",
            "left: 44%; top: 3%;": "Shoulders",
            "left: 72%; top: 52%;": "Length"
        }
    },
    Bottoms: {
        //Pants, Jeans, Trousers 
        "https://res.cloudinary.com/ssense/image/upload/v1509463868/size_guide/category_193_195.jpg": {
            "left: 33%; top: 99%;": "Leg Opening",
            "left: 69%; top: 20%;": "Front Rise",
            "left: 52%; top: 57%;": "Inseam",
            "left: 45%; top: 2%;": "Waist"
        },
        //Sweatpants
        "https://res.cloudinary.com/ssense/image/upload/v1509463869/size_guide/category_194.jpg": {
            "left: 33%; top: 100%;": "Leg Opening",
            "left: 69%; top: 20%;": "Front Rise",
            "left: 54%; top: 59%;": "Inseam",
            "left: 45%; top: 2%;": "Waist"
        }
    }
}

//mutationObserverGlobal();
waitForMeasurementModal();
