/**

 * Script for loginWortenia.ejs (is the same as login.ejs)

 */



const appwrite = require('appwrite')

const client = new appwrite.Client()

    .setEndpoint('https://wortenia.companialince.com/v1')

    .setProject('wortenia')

const account = new appwrite.Account(client)



// Validation Regexes.

const validUsername = /^[a-zA-Z0-9_]{1,16}$/

const basicEmail = /^\S+@\S+\.\S+$/

//const validEmail          = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i



// Login Elements

const loginCancelContainer = document.getElementById('loginCancelContainer')

const loginCancelButton = document.getElementById('loginCancelButton')

const loginEmailError = document.getElementById('loginEmailError')

const loginUsername = document.getElementById('loginUsername')

const loginPasswordError = document.getElementById('loginPasswordError')

const loginPassword = document.getElementById('loginPassword')

const checkmarkContainer = document.getElementById('checkmarkContainer')

const loginRememberOption = document.getElementById('loginRememberOption')

const loginButton = document.getElementById('loginButton')

const loginForm = document.getElementById('loginForm')



// Control variables.

let lu = false,

    lp = false



/**

 * Show a login error.

 *

 * @param {HTMLElement} element The element on which to display the error.

 * @param {string} value The error text.

 */

function showError(element, value) {

    element.innerHTML = value

    element.style.opacity = 1

}



/**

 * Shake a login error to add emphasis.

 *

 * @param {HTMLElement} element The element to shake.

 */

function shakeError(element) {

    if (element.style.opacity == 1) {

        element.classList.remove('shake')

        void element.offsetWidth

        element.classList.add('shake')

    }

}



/**

 * Validate that an email field is neither empty nor invalid.

 *

 * @param {string} value The email value.

 */

function validateEmail(value) {

    if (value) {

        if (!basicEmail.test(value) && !validUsername.test(value)) {

            showError(loginEmailError, Lang.queryJS('login.error.invalidValue'))

            loginDisabled(true)

            lu = false

        } else {

            loginEmailError.style.opacity = 0

            lu = true

            if (lp) {

                loginDisabled(false)

            }

        }

    } else {

        lu = false

        showError(loginEmailError, Lang.queryJS('login.error.requiredValue'))

        loginDisabled(true)

    }

}



/**

 * Validate that the password field is not empty.

 *

 * @param {string} value The password value.

 */

function validatePassword(value) {

    if (value) {

        loginPasswordError.style.opacity = 0

        lp = true

        if (lu) {

            loginDisabled(false)

        }

    } else {

        lp = false

        showError(loginPasswordError, Lang.queryJS('login.error.invalidValue'))

        loginDisabled(true)

    }

}



// Emphasize errors with shake when focus is lost.

loginUsername.addEventListener('focusout', (e) => {

    validateEmail(e.target.value)

    shakeError(loginEmailError)

})

loginPassword.addEventListener('focusout', (e) => {

    validatePassword(e.target.value)

    shakeError(loginPasswordError)

})



// Validate input for each field.

loginUsername.addEventListener('input', (e) => {

    validateEmail(e.target.value)

})

loginPassword.addEventListener('input', (e) => {

    validatePassword(e.target.value)

})



/**

 * Enable or disable the login button.

 *

 * @param {boolean} v True to enable, false to disable.

 */

function loginDisabled(v) {

    if (loginButton.disabled !== v) {

        loginButton.disabled = v

    }

}



/**

 * Enable or disable loading elements.

 *

 * @param {boolean} v True to enable, false to disable.

 */

function loginLoading(v) {

    if (v) {

        loginButton.setAttribute('loading', v)

        loginButton.innerHTML = loginButton.innerHTML.replace(

            Lang.queryJS('login.login'),

            Lang.queryJS('login.loggingIn')

        )

    } else {

        loginButton.removeAttribute('loading')

        loginButton.innerHTML = loginButton.innerHTML.replace(

            Lang.queryJS('login.loggingIn'),

            Lang.queryJS('login.login')

        )

    }

}



/**

 * Enable or disable login form.

 *

 * @param {boolean} v True to enable, false to disable.

 */

function formDisabled(v) {

    loginDisabled(v)

    loginCancelButton.disabled = v

    loginUsername.disabled = v

    loginPassword.disabled = v

}



let loginViewOnSuccess = VIEWS.loginOptions




function loginCancelEnabled(val) {

    if (val) {

        $(loginCancelContainer).show()

    } else {

        $(loginCancelContainer).hide()

    }

}



loginCancelButton.onclick = (e) => {

    console.log('You must login to use the app.')

}



// Disable default form behavior.

loginForm.onsubmit = () => {

    return false

}



// Bind login button behavior.

loginButton.addEventListener('click', async () => {

    // Disable form.

    formDisabled(true)



    // Show loading stuff.

    loginLoading(true)

    

    // Login with Wortenia using appwrite

    try {

        const session = await account.createEmailSession(

            loginUsername.value,

            loginPassword.value

        )

        if (session == null) {

            loginLoading(false)

            formDisabled(false)

            showError(

                loginPasswordError,

                Lang.queryJS('login.error.invalidValue')

            )

            shakeError(loginPasswordError)

            return

        }



        // Login correct



        loginButton.innerHTML = loginButton.innerHTML.replace(

            Lang.queryJS('login.loggingIn'),

            Lang.queryJS('login.success')

        )

        $('.circle-loader').toggleClass('load-complete')

        $('.checkmark').toggle()

        setTimeout(() => {

            switchView(VIEWS.worteniaLogin, loginViewOnSuccess, 500, 500, async () => {
                loginViewOnSuccess = VIEWS.landing // Reset this for good measure.

                loginCancelEnabled(false) // Reset this for good measure.

                loginViewCancelHandler = null // Reset this for good measure.

                loginUsername.value = ''

                loginPassword.value = ''

                $('.circle-loader').toggleClass('load-complete')

                $('.checkmark').toggle()

                loginLoading(false)

                loginButton.innerHTML = loginButton.innerHTML.replace(

                    Lang.queryJS('login.success'),

                    Lang.queryJS('login.login')

                )

                formDisabled(false)

            })

        }, 1000)

    } catch (error) {

        console.error(error)

        loginLoading(false)

        formDisabled(false)

        showError(loginPasswordError, Lang.queryJS('login.error.invalidValue'))

        shakeError(loginPasswordError)

    }



    /*   AuthManager.addMojangAccount(loginUsername.value, loginPassword.value)

    .then((value) => {

      updateSelectedAccount(value);

      loginButton.innerHTML = loginButton.innerHTML.replace(

        Lang.queryJS("login.loggingIn"),

        Lang.queryJS("login.success")

      );

      $(".circle-loader").toggleClass("load-complete");

      $(".checkmark").toggle();

      setTimeout(() => {

        switchView(VIEWS.login, loginViewOnSuccess, 500, 500, async () => {

          // Temporary workaround

          if (loginViewOnSuccess === VIEWS.settings) {

            await prepareSettings();

          }

          loginViewOnSuccess = VIEWS.landing; // Reset this for good measure.

          loginCancelEnabled(false); // Reset this for good measure.

          loginViewCancelHandler = null; // Reset this for good measure.

          loginUsername.value = "";

          loginPassword.value = "";

          $(".circle-loader").toggleClass("load-complete");

          $(".checkmark").toggle();

          loginLoading(false);

          loginButton.innerHTML = loginButton.innerHTML.replace(

            Lang.queryJS("login.success"),

            Lang.queryJS("login.login")

          );

          formDisabled(false);

        });

      }, 1000);

    })

    .catch((displayableError) => {

      loginLoading(false);



      let actualDisplayableError;

      if (isDisplayableError(displayableError)) {

        msftLoginLogger.error("Error while logging in.", displayableError);

        actualDisplayableError = displayableError;

      } else {

        // Uh oh.

        msftLoginLogger.error(

          "Unhandled error during login.",

          displayableError

        );

        actualDisplayableError = {

          title: "Unknown Error During Login",

          desc: "An unknown error has occurred. Please see the console for details.",

        };

      }



      setOverlayContent(

        actualDisplayableError.title,

        actualDisplayableError.desc,

        Lang.queryJS("login.tryAgain")

      );

      setOverlayHandler(() => {

        formDisabled(false);

        toggleOverlay(false);

      });

      toggleOverlay(true);

    }); */

})

