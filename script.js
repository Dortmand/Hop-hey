document.getElementById("product-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const productType = document.getElementById("productType").value;
    const expirationType = document.getElementById("expirationType").value;
    const expirationDate = document.getElementById("expirationDate").value;

    if (!productName || !expirationDate) {
        alert("Будь ласка, заповніть всі поля!");
        return;
    }

    addProduct(productName, productType, expirationType, expirationDate);
    clearForm();
    updateEmptyFields();
    checkExpiringSoon();
});

let products = [];

function addProduct(name, type, expirationType, expirationDate) {
    const product = {
        name,
        type,
        expirationType,
        expirationDate,
        id: Date.now(),
    };
    products.push(product);
    renderProducts();
}

function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product) => {
        const li = document.createElement("li");
        li.classList.add("product-item");

        if (isExpiringSoon(product.expirationDate)) {
            li.classList.add("expiring");
        }

        li.innerHTML = `
            <span>${product.name} (${product.type}) - ${product.expirationType}: ${product.expirationDate}</span>
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
    const emptyFields = products.filter((product) => !product.expirationDate);
    document.getElementById("total-empty-fields").textContent =
        "Незаповнені поля: " + emptyFields.length;
}

function checkExpiringSoon() {
    const expiringSoonProducts = products.filter((product) =>
        isExpiringSoon(product.expirationDate)
    );

    document.getElementById("expiring-soon").textContent =
        "Товарів, які скоро закінчаться: " + expiringSoonProducts.length;
}

function isExpiringSoon(expirationDate) {
    const today = new Date();
    const productDate = new Date(expirationDate);
    const timeDiff = productDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff <= 1;
}
