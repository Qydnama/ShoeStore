document.addEventListener('DOMContentLoaded', () => {
    const cartStates = {
        shoes: JSON.parse(localStorage.getItem('cartShoes')) || {},
        accessories: JSON.parse(localStorage.getItem('cartAccessories')) || {}
    };


    updateCartCount(cartStates);


    document.querySelectorAll('.card-cart-button a').forEach(button => {
        const productId = button.getAttribute('data-id');
        const productType = button.getAttribute('data-type'); 


        if (cartStates[productType][productId]) {
            button.classList.add('highlight');
        }

        button.addEventListener('click', (e) => {
            e.preventDefault();

            if (cartStates[productType][productId]) {
                delete cartStates[productType][productId];
                button.classList.remove('highlight');
            } else {
                cartStates[productType][productId] = true;
                button.classList.add('highlight');
            }


            localStorage.setItem(`cart${productType.charAt(0).toUpperCase() + productType.slice(1)}`, JSON.stringify(cartStates[productType]));

            updateCartCount(cartStates);
        });
    });
});


function updateCartCount(cartStates) {
    const totalCartCount = Object.keys(cartStates.shoes).length + Object.keys(cartStates.accessories).length;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalCartCount;
    }
}

