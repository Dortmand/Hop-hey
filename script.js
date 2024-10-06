document.getElementById("product-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const productType = document.getElementById("productType").value;
    const expirationDays = document.getElementById("expirationDays").value;

    if (!productName || !expirationDays) {
        alert("Будь ласка, заповніть всі поля!");
        return;
    }

    // Розрахувати дату закінчення терміну зберігання на основі поточної дати + кількість днів
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);

    addProduct(productName, productType, expirationDate.toISOString().split('T')[0], expirationDays);
    clearForm();
    updateEmptyFields();
    checkExpiringSoon();
});

let products = [];

function addProduct(name, type, expirationDate, expirationDays) {
    const product = {
        name,
        type,
        expirationDates: [{ expirationDate, expirationDays }],
        id: Date.now(),
    };
    products.push(product);
    renderProducts();
}

function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    // Сортування за типом (опт, штучний, інший)
    products.sort((a, b) => a.type.localeCompare(b.type));

    products.forEach((product) => {
        const li = document.createElement("li");
        li.classList.add("product-item");

        product.expirationDates.forEach((exp) => {
            if (isExpiringSoon(exp.expirationDate)) {
                li.classList.add("expiring");
            }
        });

        li.innerHTML = `
            <span>${product.name} (${product.type}) - Періоди реалізації:</span>
            <ul>
                ${product.expirationDates.map(exp => `<li>${exp.expirationDate} (${exp.expirationDays} днів)</li>`).join('')}
            </ul>
            <button class="delete-button" onclick="deleteProduct(${product.id})">Видалити</button>
        `;

        productList.appendChild(li);
    });
}

function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    renderProducts();
    updateEmptyFields();
    checkExpiringSoon();
}

function clearForm() {
    document.getElementById("product-form").reset();
}

function updateEmptyFields() {
    const emptyFields = products.filter((product) => !product.expirationDates.length);
    document.getElementById("total-empty-fields").textContent = emptyFields.length;
}

function checkExpiringSoon() {
    const currentDate = new Date().toISOString().split('T')[0];
    products.forEach((product) => {
        product.expirationDates.forEach((exp) => {
            if (new Date(exp.expirationDate).getTime() - new Date(currentDate).getTime() <= 24 * 60 * 60 * 1000) {
                const li = document.querySelector(`li.product-item[data-id='${product.id}']`);
                if (li) {
                    li.style.backgroundColor = "red";
                }
            }
        });
    });
}

// Функція для додавання товарів за фото (потрібно реалізувати)
function addProductByPhoto(photoData) {
    // Припускаємо, що photoData містить назву товару та період реалізації
    const productName = extractProductNameFromPhoto(photoData);
    const expirationDays = extractExpirationDaysFromPhoto(photoData);

    if (productName && expirationDays) {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        addProduct(productName, "unknown", expirationDate.toISOString().split('T')[0], expirationDays);
        renderProducts();
    }
}

// Заготовка для вилучення назви товару з фото
function extractProductNameFromPhoto(photoData) {
    // Логіка для вилучення назви товару з фото
    return "Приклад Товару";
}

// Заготовка для вилучення днів реалізації з фото
function extractExpirationDaysFromPhoto(photoData) {
    // Логіка для вилучення днів реалізації з фото
    return 7;
}
