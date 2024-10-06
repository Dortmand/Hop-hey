document.getElementById("product-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const productType = document.getElementById("productType").value;
    const expirationDays = document.getElementById("expirationDays").value;

    if (!productName || !expirationDays) {
        alert("Будь ласка, заповніть всі поля!");
        return;
    }

    // Розрахунок дати закінчення терміну зберігання
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);

    addProduct(productName, productType, expirationDate.toISOString().split('T')[0], expirationDays);
    clearForm();
    updateEmptyFields();
    checkExpiringSoon();
});

let products = [];

// Додавання товару з можливістю додавання кількох термінів реалізації
function addProduct(name, type, expirationDate, expirationDays) {
    const product = products.find(p => p.name === name);

    if (product) {
        product.expirationDates.push({ expirationDate, expirationDays });
    } else {
        products.push({
            name,
            type,
            expirationDates: [{ expirationDate, expirationDays }],
            id: Date.now(),
        });
    }
    renderProducts();
}

// Рендер списку товарів
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    // Сортування за типом товару
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

// Видалення товару
function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    renderProducts();
    updateEmptyFields();
    checkExpiringSoon();
}

// Очищення форми
function clearForm() {
    document.getElementById("product-form").reset();
}

// Оновлення кількості товарів без термінів
function updateEmptyFields() {
    const emptyFields = products.filter((product) => !product.expirationDates.length);
    document.getElementById("total-empty-fields").textContent = emptyFields.length;
}

// Перевірка, чи скоро закінчиться термін реалізації
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

// Додавання товару через фото
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const photoData = e.target.result;
            addProductByPhoto(photoData);
        };
        reader.readAsDataURL(file);
    }
}

// Додавання товару через фото (заготовка)
function addProductByPhoto(photoData) {
    const productName = extractProductNameFromPhoto(photoData);
    const expirationDays = extractExpirationDaysFromPhoto(photoData);

    if (productName && expirationDays) {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        addProduct(productName, "unknown", expirationDate.toISOString().split('T')[0], expirationDays);
        renderProducts();
    }
}

// Витягування назви товару з фото (заготовка)
function extractProductNameFromPhoto(photoData) {
    return "Приклад Товару"; // Повертає назву товару після розпізнавання
}

// Витягування терміну реалізації з фото (заготовка)
function extractExpirationDaysFromPhoto(photoData) {
    return 7; // Повертає кількість днів реалізації після розпізнавання
                                        }
