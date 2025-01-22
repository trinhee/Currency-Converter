const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

// Populate dropdowns with currency options
[fromCur, toCur].forEach((select, i) => {
    Object.keys(Country_List).forEach((curCode) => {
        const selected = (i === 0 && curCode === "CAD") || (i === 1 && curCode === "USD") ? "selected" : "";
        select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    });

    // Update flag when currency is changed
    select.addEventListener("change", () => {
        updateFlag(select);
    });
});

// Function to update flag based on currency code
function updateFlag(select) {
    const code = select.value;
    const imgTag = select.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
}

// Function to fetch exchange rate and calculate conversion
async function getExchangeRate() {
    const amountVal = parseFloat(amount.value) || 1; // Default to 1 if input is empty or invalid
    exRateTxt.innerText = "Getting exchange rate...";
    
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCur.value}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const result = await response.json();
        if (!result.conversion_rates) throw new Error("Invalid response from API");

        const exchangeRate = result.conversion_rates[toCur.value];
        if (!exchangeRate) throw new Error("Exchange rate not found for selected currency");

        const totalExRate = (amountVal * exchangeRate).toFixed(2);
        exRateTxt.innerText = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`;
    } catch (error) {
        console.error(error);
        exRateTxt.innerText = "Something went wrong.";
    }
}

// Event listeners for button click and swap icon
window.addEventListener("load", () => {
    updateFlag(fromCur);
    updateFlag(toCur);
    getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    getExchangeRate();
});

exIcon.addEventListener("click", () => {
    // Swap currency values
    [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
    [fromCur, toCur].forEach(updateFlag); // Update flags after swapping
    getExchangeRate();
});
