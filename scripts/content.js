function checkTable() {
    console.log("Checking table");
    const measurementTable = document.querySelector(".Table_table__conFW");
    if (measurementTable) {
        console.log("Found table!");
        addText(measurementTable);
        clearInterval(intervalTable);
    }
}

function addText(measurementTable) {
    const textP = document.createElement("p");
    textP.innerHTML = "QQQQ";
    measurementTable.appendChild(textP);
}

const intervalTable = setInterval(checkTable, 500);