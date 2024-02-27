let user_data = document.querySelector('.personalData')
let user_id = user_data.getAttribute('data-id');
let user_name = user_data.getAttribute('data-name');
let user_email = user_data.getAttribute('data-email');

const currentLang = document.documentElement.lang;
const localization = {
    en: {
        nameError: "The name must be at least 3 letters and contain only letters",
        userExists: "A user with that name already exists",
        emailError: "Enter the correct email address",
        wrongPassword: "Incorrect password",
        passwordError: "Password verification error",
        passwordValError: "The password must be at least 3 characters long and contain no special characters",
        passwordSame: "The password matches the old password",
        passwordNotSame: "Passwords don't match",
        nothingChanged: "You haven't changed anything!",
        success: "We have successfully updated the data!",
        error: "Error"
    },
    ru: {
        nameError: "Имя должно быть не менее 3 букв и содержать только буквы",
        userExists: "Пользователь с таким именем уже существует",
        emailError: "Введите правильный адрес электронной почты",
        wrongPassword: "Неправильный пароль",
        passwordError: "Ошибка проверки пароля",
        passwordValError: "Пароль должен быть не менее 3 символов и не содержать специальные символы",
        passwordSame: "Пароль совпадает со старым паролем",
        passwordNotSame: "Пароли не совпадают",
        nothingChanged: "Вы ничего не поменяли!",
        success: "Успешно обновили данные!",
        error: "Ошибка"

    }
};

function validateName() {
    let nameInput = document.getElementById("inputName");
    let nameError = document.getElementById("inputNameError");
    let name = nameInput.value;
    let nameExists = localStorage.getItem(name)
    let nameExistsMap = JSON.parse(nameExists)
    
    let user = localStorage.getItem('user1');
    let userMap = JSON.parse(user);
    function isValidName(name) {

        const namePattern = /^[А-Яа-яA-Za-zҚқҢңҒғІіІі]*$/;
        return namePattern.test(name);
    }

    if (name.length === 0 || name.length < 3 || !isValidName(name)) {
        nameError.innerHTML = localization[currentLang].nameError;
        setInvalid(nameInput);
    } else if (nameExists && nameExistsMap.name != userMap.name) {
        nameError.innerHTML = localization[currentLang].userExists;
        setInvalid(nameInput);
    }
    else {
        nameError.innerHTML ='';
        setValid(nameInput);
    }
}

function validateEmail() {
    const emailInput = document.getElementById("inputEmail");
    const emailError = document.getElementById("inputEmailError");

    const email = emailInput.value;

    function isValidEmail(email) { 
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    if (!isValidEmail(email) || email.length === 0) {
        emailError.innerHTML = localization[currentLang].emailError
        setInvalid(emailInput);
        
    } else {
        emailError.innerHTML = '';
        setValid(emailInput)
    }
}

async function validateOldPassword() {
    const oldPasswordInput = document.getElementById("oldPassword");
    const oldPasswordError = document.getElementById("oldPasswordError");
    const oldPassword = oldPasswordInput.value;
    if (oldPassword != ''){
        try {
            
            const response = await fetch(`/profile/check-password/${user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: oldPassword }),
            });

            if (response.ok) {
                setValid(oldPasswordInput);
                oldPasswordError.innerHTML = '';
            } else {
                setInvalid(oldPasswordInput);
                oldPasswordError.innerHTML = localization[currentLang].wrongPassword;
            }
        } catch (error) {
            console.error('Error checking old password:', error);
            setInvalid(oldPasswordInput);
            oldPasswordError.innerHTML = localization[currentLang].passwordError;
        }   
    } else {
        setInvalid(oldPasswordInput);
        oldPasswordError.innerHTML = localization[currentLang].passwordError;
    }
}


function validatePassword() {
    const pw = document.getElementById("password");
    const passwordError = document.getElementById("passwordError")
    const password = pw.value;
    
    const oldPasswordInput = document.getElementById("oldPassword");
    const oldPassword = oldPasswordInput.value;

    function isValidPassword(password) {
        const passwordPattern = /^[А-Яа-яA-Za-z0-9]{3,}$/;
        return passwordPattern.test(password);
    }

    if (password.length === 0 || password.length < 3 || !isValidPassword(password)) {
        passwordError.innerHTML = localization[currentLang].passwordValError;
        setInvalid(pw);
    } else if (oldPassword == password){
        passwordError.innerHTML = localization[currentLang].passwordSame;
        setInvalid(pw);
    }
    else {
        passwordError.innerHTML = '';
        setValid(pw);
    }
}

function validateConfirmPassword() {
    const confirmPassword = document.getElementById("confirmPassword");
    const confirmPasswordError = document.getElementById("confirmPasswordError")
    const confirmValue = confirmPassword.value;
    const pw = document.getElementById("password");

    function isValidPassword(confirm_password) {
        const passwordPattern = /^[А-Яа-яA-Za-z0-9]{3,}$/;
        return passwordPattern.test(confirm_password);
    }

    if (confirmValue.length === 0 || confirmValue.length < 3 || !isValidPassword(confirmValue)) {
        confirmPasswordError.innerHTML = localization[currentLang].passwordValError;
        setInvalid(confirmPassword)
    }
    else if (confirmValue != pw.value) {
        confirmPasswordError.innerHTML = localization[currentLang].passwordNotSame;
        setInvalid(confirmPassword)
    }
    else {
        confirmPasswordError.innerHTML = '';
        setValid(confirmPassword)
    }
}

async function changeUserInformation() {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    validateOldPassword();
    
    const nameInput = document.getElementById("inputName");
    const name = nameInput.value;
    const emailInput = document.getElementById("inputEmail");
    const email = emailInput.value;

    const oldPasswordInput = document.getElementById("oldPassword");
    const oldPasswordError = document.getElementById("oldPasswordError");
    const oldPassword = oldPasswordInput.value;

    const pw = document.getElementById("password");
    const passwordError = document.getElementById("passwordError")
    const password = pw.value;

    const confirmPassword = document.getElementById("confirmPassword");
    const confirmPasswordError = document.getElementById("confirmPasswordError")
    const confirmValue = confirmPassword.value;

    const form = document.getElementById('form');

    if (oldPassword == "" && password == "" && confirmValue == "") {
        oldPasswordError.innerHTML = '';
        setValid(oldPasswordInput)
        passwordError.innerHTML = '';
        setValid(pw);
        confirmPasswordError.innerHTML = '';
        setValid(confirmPassword);


        if (form.getElementsByClassName("is-valid").length == 5) {
            if ((user_name == name) &&(user_email == email)) {
                alert(localization[currentLang].nothingChanged)
            } else {
                const response = await fetch(`/profile/update-user/${user_id}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: password, name: name }),
                });

                if (response.ok) {
                    alert(localization[currentLang].success);
                    window.location.reload();
                } else {
                    alert(localization[currentLang].error);
                }

            }
        }
        
    } else {
        if (form.getElementsByClassName("is-valid").length == 5) {
                const response = await fetch(`/profile/update-user/${user_id}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: password, name: name }),
                });
                if (response.ok) {
                    alert(`Успешно обновили данные!`);
                    window.location.reload();
                } else {
                    alert(`Ошибка`);
                }

            }
            
    }
    
    

}

async function leave() {
    const response = await fetch(`/profile/logout`, {method: 'GET'});
}



function setInvalid(element) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid')
}

function setValid(element) {
    element.classList.add('is-valid');
    element.classList.remove('is-invalid')
};




function validateForm() {
    const email = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    let valid = true;

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    if (!isValidEmail(email.value)) {
        valid = false;
        displayError(emailError, "Неверный адрес электронной почты");
    }
    else
        emailError.textContent = "";

    if (valid) {
        const modal = new bootstrap.Modal(document.getElementById("staticBackdrop0"));
        modal.toggle();

    }

}
function displayError(element, message) {
    element.textContent = message;
}