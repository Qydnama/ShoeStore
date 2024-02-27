document.addEventListener("DOMContentLoaded", async () => {
    await getProducts();
});

async function getProducts() {
    try {
        const cartShoes = localStorage.getItem("cartShoes");
        const cartAccessories = localStorage.getItem("cartAccessories");


        const response = await fetch('/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartShoes: JSON.parse(cartShoes || '{}'),
                cartAccessories: JSON.parse(cartAccessories || '{}')
            })
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const cartItems = await response.json();
        renderCartItems(cartItems);
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}

function renderCartItems(cartItems) {
    const container = document.getElementById('cartItemsContainer');
    let total = 0;

    container.innerHTML = '';

    cartItems.forEach(item => {
        let itemTotal = item.price;
        total += itemTotal;
        let name = item.name.en;
        if (currentLang == 'ru') {
            name = item.name.ru
        }

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item', 'mb-3');
        itemElement.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <img src="${item.image}" alt="${name}" class="img-fluid">
                </div>
                <div class="col-md-6 priceA">
                    <h5>${name}</h5>
                    <p>${locale[currentLang].collectionName}: ${item.collectionName}</p>
                    <p>${locale[currentLang].color}: ${item.color}</p>
                    <p>${locale[currentLang].price}: <span class="productPricee">${item.price}<span> ₸</p>
                </div>
                <div class="col-md-3 d-flex flex-column justify-content-between">
                    <div>
                        <label for="quantity-${item._id}">${locale[currentLang].quantity}:</label>
                        <select id="quantity-${item._id}" class="form-select quantity-selector" data-item-id="${item._id}">
                            ${Array.from({ length: item.inStock }, (_, i) => `<option value="${i + 1}" ${item.quantity === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-item-id="${item._id}">${locale[currentLang].removeFromCart}</button>
                </div>
            </div>
        `;
        container.appendChild(itemElement);
    });


    document.getElementById('totalPrice').textContent = total.toLocaleString(locale.lang);


    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            removeFromCart(button.getAttribute('data-item-id'));
        });
    });
}

function removeFromCart(productId) {

    const cartShoes = JSON.parse(localStorage.getItem('cartShoes')) || {};
    const cartAccessories = JSON.parse(localStorage.getItem('cartAccessories')) || {};


    let cartToUpdate = cartShoes[productId] ? cartShoes : cartAccessories
    let cartType = cartShoes[productId] ? 'cartShoes' : 'cartAccessories';

    if (cartToUpdate[productId]) {
        delete cartToUpdate[productId];

        const localStorageKey = cartType;
        localStorage.setItem(localStorageKey, JSON.stringify(cartToUpdate));


        const cartStates = {
            shoes: JSON.parse(localStorage.getItem('cartShoes')) || {},
            accessories: JSON.parse(localStorage.getItem('cartAccessories')) || {}
        };
        updateCartCount(cartStates);
        getProducts();
    } else {
        console.error('Item not found in cart:', productId);
    }
}



document.addEventListener('change', event => {
    if (event.target.classList.contains('quantity-selector')) {

        const quantity = parseInt(event.target.value);
        event.target.parentElement.parentElement.parentElement.querySelector('.productPricee').setAttribute('quantity', quantity);
        showTotalPrice();
    }
});

function showTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll('.productPricee').forEach((product) => {
        let price = parseInt(product.textContent);
        let quantity = parseInt(product.getAttribute('quantity')) | 1;
        totalPrice += price * quantity;
    });
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString(locale.lang);
}

document.getElementById('checkoutButton').addEventListener('click', event => {
    let isAuth = document.getElementById('checkoutButton').getAttribute('data-isauth');
    if ((isAuth) == "true") {
        alert(locale[currentLang].success);
        localStorage.clear();
        window.location.replace(`/?lang=${currentLang}`);
    } else {
        alert(locale[currentLang].notAuth);
    }
});

function updateCartCount(cartStates) {
    const totalCartCount = Object.keys(cartStates.shoes).length + Object.keys(cartStates.accessories).length;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalCartCount;
    }
}

const currentLang = document.documentElement.lang;
const locale = {
    en: {
        "cart": "Cart",
        "quantity": "Quantity",
        "removeFromCart": "Remove",
        "checkout": "CHECKOUT",
        "orderSummary": "Order Summary",
        "total": "Total",
        "includingVAT": "including VAT",
        "color": "Color",
        "collectionName": "Collection",
        "price": "Price",
        "success": "Thank you for your order!",
        "notAuth": "You are not authorized!"
    },
    ru: {
        "cart": "Корзина",
        "quantity": "Количество",
        "removeFromCart": "Убрать",
        "checkout": "ОФОРМИТЬ",
        "orderSummary": "Заказ",
        "total": "Полная сумма",
        "includingVAT": "НДС включительно",
        "color": "Цвета",
        "collectionName": "Коллекция",
        "price": "Цена",
        "success": "Спасибо вам за ваш заказ!",
        "notAuth": "Вы не авторизовались!"
    }
};

