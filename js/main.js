// *** DOM elements ***
const title = document.querySelector(".header__title");
const introduction = document.querySelector(".header__intoduction");

const salutation = document.querySelector(".salutation");
const radioButtons = document.querySelectorAll(".salutation__option");
const radioButtonsLabels = document.querySelectorAll(".salutation__label");

const firstName = document.getElementById("firstName");
const firstNameLabel = document.querySelector(".first-name-label");

const lastName = document.getElementById("lastName");
const lastNameLabel = document.querySelector(".last-name-label");

const email = document.getElementById("email");
const emailLabel = document.querySelector(".email-label");

const password = document.getElementById("password");
const passwordLabel = document.querySelector(".password-label");

const formStatusMessage = document.querySelector(".form__status-message");

const submitButton = document.getElementById("submit-btn");
const loginLink = document.getElementById("login-link");


let formData;

// *** fetch and set data ***
const fetchFormLabels = async () => {
    const formData = await fetch("http://localhost:3000/registrationLabels").then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        }))
        .then(res => {
            return res.data
        }).catch(error => {
            return error;
        })
    );

    return formData;
}

const setFormLabels = () => {
    fetchFormLabels().then(data => {
        formData = data;

        title.textContent = data.RegistrationTitle;
        introduction.textContent = data.RegistrationIntroductionText;

        data.SalutationSource.forEach((sourceObj, index) => {
            radioButtons[index].setAttribute("id", sourceObj.ID);
            radioButtons[index].setAttribute("value", sourceObj.Name);
            radioButtonsLabels[index].textContent = sourceObj.Name;
            radioButtonsLabels[index].setAttribute("for", sourceObj.ID);
        });

        firstNameLabel.textContent = data.FirstName.FieldLabel;
        lastNameLabel.textContent = data.LastName.FieldLabel;
        emailLabel.textContent = data.Email.FieldLabel;
        passwordLabel.textContent = data.Password.FieldLabel;
        // print password rules
        // print checkboxes

        submitButton.textContent = data.RegistrationSaveButtonLabel;
        loginLink.textContent = data.RegistrationLoginLinkLabel;
        loginLink.setAttribute("href", data.RegistrationLoginLink.url);
    });
}
setFormLabels();


// *** Submit Form ***
const form = document.getElementById("form");
 
form.addEventListener("submit", e => {
    e.preventDefault();

    isFormVaid = validateForm();
    console.log(isFormVaid);
    if (!isFormVaid) {
        return;
    }

    const payload = new FormData(form);

    fetch("http://localhost:3000/createUser", {
        method: "POST",
        body: payload
    })
    .then(res => {
        res.json();
        showFormStatusMessage(res.status);
    })
    .catch(error => console.log(error));
})

const showFormStatusMessage = (status) => {
    if (status === 201) {
        formStatusMessage.textContent = "Successfully created acount!";
    } else {
        formStatusMessage.classList.add("error");
        formStatusMessage.textContent = "Acount was not created, there has been a mistake.";
    }
}


// *** Validate Form ***
const validateForm = () => {
    // could be named better
    const check1 = checkIsInputValid(firstName, formData.FirstName);
    const check2 = checkIsInputValid(lastName, formData.LastName);
    const check3 = checkIsInputValid(email, formData.Email);
    const check4 = checkIsInputValid(password, formData.Password);

    // check radio buttons - fill hidden input field with selection from radio button and check if it is filed (is required check)
    // check checkboxes

    // the fastes solution at this point
    const checks = new Array(check1, check2, check3, check4);

    if (checks.includes(false)) {
        return false;
    } else {
        return true;
    }
}

const checkIsInputValid = (element, dataGroup) => {
    if (dataGroup.IsRequired && element.value.length === 0) {
        element.nextElementSibling.textContent = dataGroup.IsRequiredError;
        return false;
    } else if (dataGroup.MaxLength && element.value.length > dataGroup.MaxLength ) {
        element.nextElementSibling.textContent = dataGroup.MaxLengthError;
        return false;
    }
    // ****** fix regex, not working like this *******
    // else if (dataGroup.FieldLabel === "E-Mail" && element.value.match(dataGroup.Regexp1)) {
        // // regex
        // element.nextElementSibling.textContent = dataGroup.Regexp1Error;
        // return false;
    // } 
    // else if (dataGroup.FieldLabel === "Password") {
        // ---> create function to check password rules, register on "keyup" event to check if condition is fulfilled,
        // based on returning results change classes(styling) so it is wisible when it is approved (or steps of aprroval)
    // } 
    else {
        element.nextElementSibling.textContent = "";
        return true;
    }
}