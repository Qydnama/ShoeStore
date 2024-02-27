const localization = {
    en: {
        confirmDelete: "Are you sure you wanted to delete this product?"
    },
    ru: {
        confirmDelete: "Вы уверены, что хотите удалить этот продукт?"
    }
};

const currentLang = document.documentElement.lang;

const type = document.getElementById('productTypeA').getAttribute('data-product-type');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');

if (type == 'accessories') {
    button1.classList.remove('active');
    button2.classList.add('active');
} 


document.addEventListener('DOMContentLoaded', async function() {
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');

    addProductForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const productData = {
            name: {
                en: document.getElementById('nameProductEn').value,
                ru: document.getElementById('nameProductRu').value
            },
            collectionName: document.getElementById('collectionName').value,
            productType: {
                en: document.getElementById('productTypeEn').value,
                ru: document.getElementById('productTypeRu').value
            },
            price: document.getElementById('price').value,
            color: document.getElementById('color').value,
            image: document.getElementById('image').value,
            isFeatured: document.getElementById('isFeatured').checked,
            inStock: document.getElementById('inStock').value
        };

        try {
            const response = await axios.post(`/profile/admin/products?type=${type}`, productData);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    editProductForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const productId = editProductForm.getAttribute('data-product-id');
        const productData = {
            name: {
                en: document.getElementById('editNameProductEn').value,
                ru: document.getElementById('editNameProductRu').value
            },
            collectionName: document.getElementById('editCollectionName').value,
            productType: {
                en: document.getElementById('editProductTypeEn').value,
                ru: document.getElementById('editProductTypeRu').value
            },
            price: document.getElementById('editPrice').value,
            color: document.getElementById('editColor').value,
            image: document.getElementById('editImage').value,
            isFeatured: document.getElementById('editIsFeatured').checked,
            inStock: document.getElementById('editInStock').value
        };

        try {
            const response = await axios.put(`/profile/admin/products/${productId}?type=${type}`, productData);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    window.setEditModalData = function(productId, nameEn, nameRu, collectionName, productTypeEn, productTypeRu, price, color, image, isFeatured, inStock) {
        editProductForm.setAttribute('data-product-id', productId);
        document.getElementById('editNameProductEn').value = nameEn;
        document.getElementById('editNameProductRu').value = nameRu;
        document.getElementById('editCollectionName').value = collectionName;
        document.getElementById('editProductTypeEn').value = productTypeEn;
        document.getElementById('editProductTypeRu').value = productTypeRu;
        document.getElementById('editPrice').value = price;
        document.getElementById('editColor').value = color;
        document.getElementById('editImage').value = image;
        document.getElementById('editIsFeatured').checked = isFeatured === 'true'
        document.getElementById('editInStock').value = inStock;
    };

    window.deleteProduct = async function(productId) {
        if (confirm(localization[currentLang].confirmDelete)) {
            try {
                const response = await axios.delete(`/profile/admin/products/${productId}?type=${type}`);
                console.log(response.data);
                window.location.reload();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };
});
