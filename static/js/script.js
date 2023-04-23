var counter = 0;

window.addEventListener('load', () => {
    const dashpage = document.querySelector("#dashboardpage");
    const indexpage = document.querySelector("#homepage");
    $('#myModal').modal('show');

    if(document.title === "Oneredbox - Sign up"){
        signuppage();
    }else if(document.title === "Oneredbox.ng - Your construction company"){
        homepage();
    }else if(document.title === "Oneredbox - Your Dashboard") {
        dashboardpage();
    }else if (document.title === "Oneredbox.ng - Our Projects") {
        projectspage();
    }else if (document.title === "Oneredbox.ng - Login to your account"){
        loginpage();
    }else if (document.title === "Oneredbox - Get Free Quote"){
        freeQuotePage();
    }
    
})

function dashboardpage () {
    const paystackApiKey = JSON.parse(document.getElementById("paystackApiKey").innerHTML);
    const themeToggler = document.querySelector(".theme_toggler")
    const addProjectbtn = document.querySelector(".add-product")
    const addProjectDialog = document.querySelector(".box")
    const backdrop = document.querySelector(".backdrop");
    const addFunds = document.querySelectorAll(".funds_required");
    const submitButton = document.querySelector("#submit-project");
    const sideMenu = document.querySelector("aside")
    const menuBtn = document.querySelector("#menu_btn") //same things
    const closeBtn = document.getElementById("close-btn") //same things
    const payAlertBox = document.querySelector('#paymentForm');
    const profileForm = document.querySelector('#profileForm');
    const userPhoto = document.querySelector('.profile-photo');
    const profilePicInput = document.getElementById("profilePic");
    const profilePicImg = document.querySelector("#profilePic + label img");
    const editProBtn = document.getElementById("editProfile");
    const phoneNumber = document.getElementById('phoneNumber');
    


    userPhoto.addEventListener('click', () => {
        profileForm.style.display = "flex";
        backdrop.style.display = "flex";
    });


    profilePicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          profilePicImg.src = reader.result;
        };
    });

    
    editProBtn.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('profilePic', profilePicInput.files[0]);
        formData.append('phoneNumber', phoneNumber.value);
    
        fetch('/update_profile', {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(formData);
        })
        .catch((error) => console.error(error));

        profileForm.style.display = "none";
        backdrop.style.display = "none";
        window.location.reload();
    });


    //toggle theme
    themeToggler.addEventListener('click', () => {
        document.body.classList.toggle('light-theme-varibles');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    });

    //add project
    addProjectbtn.onclick = function() {
        addProjectDialog.style.display = "flex";
        backdrop.style.display = "flex";
    }
    
    // making everything disapear on clicking blank areas
    backdrop.addEventListener('click', () => {
        addProjectDialog.style.display = "none";
        backdrop.style.display = "none";
        payAlertBox.style.display = "none";
        profileForm.style.display = "none";
    });

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        backdrop.style.display = "none";
        addProjectDialog.style.display = "none";
    
        console.log(counterValues)
    
        const data = {spaces: counterValues};
        fetch('/newproject', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
        window.location.reload()
    })

    //open side bar
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    })

    //close side
    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    })

    // assigninging spaces to all the info in the html
    const spaces = document.querySelectorAll(".space");
    //creating the dictionary
    let counterValues = {};

    // looping through the spaces where space is each individual loop
    spaces.forEach(space => {

        //defining the variables for the title of each space
        const title = space.querySelector(".title").innerHTML;
        //defining the variable for each counter value in each space
        const valueSpan = space.querySelector(".counter-value");
        //changing the value value gotten for that space to an int
        let counter = parseInt(valueSpan.innerHTML, 10);
        //the code below will provide the original int values for the particular dictionary key which will be int 0.
        counterValues[title] = counter;

        //looping through the individual buttons clicked
        space.querySelectorAll('.counter-button').forEach(counterButton => {
            //getting the if the button clicked is marked as increment or decrement
            const direction = counterButton.getAttribute("data-direction");
            //adding an event listener to the buttons
            counterButton.addEventListener("click", function(event) {
                event.preventDefault();
                //adding what to do when the increment or decrement button is clicked
                if (direction === "increment") {
                    counter++;
                } else if (direction === "decrement") {
                    counter--;
                    if (counter < 0) {
                        counter = 0;
                    }
                }
                //updating he dictionary with the key and corresponding value
                counterValues[title] = counter;
                //updating he counter value in the browser so the user can see
                valueSpan.innerHTML = counter;
            })
        });
    });

    // Attach a click event listener to the logout button
    $('#logout-btn').click(function() {
        // Make an AJAX POST request to the Flask logout route
        $.ajax({
        url: '/logout',
        type: 'POST',
        success: function(response) {
            // Redirect to the home page after the user is logged out
            window.location.href = '/';
        },
        error: function(error) {
            console.log(error);
        }
        });
    });

    function testProgress() {
        // Get the element with the id "unique-projects-data"
        const uniqueProjectsDataElement = document.getElementById('unique-projects-data');

        // Parse the JSON data stored in the element
        const uniqueProjects = JSON.parse(uniqueProjectsDataElement.textContent);

        // Loop through each project in the JSON data
        uniqueProjects.forEach((project, index) => {
            // Get the amount due and amount paid elements for this project
            const amountDuePercElement = document.querySelectorAll('#amount_due_perc')[index];
            const amountPaidPercElement = document.querySelectorAll('#amount_paid_perc')[index];
            

            // Calculate the percentage values for amount due and amount paid
            const amountDuePerc = Math.round((project.amount_due / project.contract_sum) * 100);
            const amountPaidPerc = Math.round((project.amount_paid / project.contract_sum) * 100);

            // Set the text content of the percentage elements to the calculated values
            amountDuePercElement.textContent = `${amountDuePerc}%`;
            amountPaidPercElement.textContent = `${amountPaidPerc}%`;
            
        });
    }
    testProgress();

    function progressbar() {

        const fundsPaid = document.querySelectorAll('main .insights .available_funds svg circle');
        const fundsReq = document.querySelectorAll('main .insights .funds_required svg circle');

        fundsPaid.forEach((circle, index) => {
            var uniqueProjects = JSON.parse(document.getElementById("unique-projects-data").innerHTML);
            contract_sum = uniqueProjects[index]['contract_sum'];
            amount_paid = uniqueProjects[index]['amount_paid'];
            amount_paid_perc = amount_paid / (contract_sum /100);
            progresspaid = 223 - (223 * (amount_paid_perc/100));
            const paidAmount = progresspaid.toString();
            circle.style.setProperty("--paidAmount", paidAmount);
        });

        fundsReq.forEach((circle, index) => {
            var uniqueProjects = JSON.parse(document.getElementById("unique-projects-data").innerHTML);

            contract_sum = uniqueProjects[index]['contract_sum'];
            amount_due = uniqueProjects[index]['amount_due'];

            amount_req_perc = amount_due / (contract_sum /100);

            progressreq = 223 - (223 * (amount_req_perc/100));
            const reqAmount = progressreq.toString();
            circle.style.setProperty("--reqAmount", reqAmount);
        });
    }
    
    progressbar();

    addFunds.forEach((fund, index) => {
        var uniqueProjects = JSON.parse(document.getElementById("unique-projects-data").innerHTML);
    
        fund.addEventListener('click', () => {
            var projectId = uniqueProjects[index]['project_id'];
            console.log(projectId);
    
            // Show the dialog box
            payAlertBox.style.display = 'block';
    
            //backdrop
            backdrop.style.display = 'block';
    
            fetch('/get_current_user')
            .then(response => response.json())
            .then(user => {
                const pay = document.getElementById('payButton');
                var payInput = document.getElementById('payamount');
    
                payInput.addEventListener('input', function() {
                    var value = this.value;
                    var formattedValue = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    this.value = formattedValue;
                    var payValue = parseInt(payInput.value.replace(/\D/g, ""));
                    pay.addEventListener('click', payWithPaystack);

                    

                    //paystack payments
                    function payWithPaystack(event) {
                        event.preventDefault();

                        // Close pay dialogue and backdrop
                        payAlertBox.style.display = "none";
                        backdrop.style.display = "none";

                        let handler = PaystackPop.setup({
                            
                            key: paystackApiKey, // Replace with your public key
                            email: user.email,
                            amount: payValue * 100,
                            ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
                            // label: "Optional string that replaces customer email"
                            onClose: function(){
                            alert('Window closed.');
                            },
                            callback: function(response){
                                let message = 'Payment complete! Reference: ' + response.reference;
                                alert(message);
        
                                // Update the database with the payment amount and project ID
                                fetch('/update_database', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        jsonProjectId: projectId,
                                        paymentAmount: payValue
                                    })
                                })
                                .then(response => {
                                    // Handle response from server
                                    window.location.reload()
                                    console.log(response)
                                })
                                .catch(error => {
                                    // Handle error
                                    console.log(error)
                                });
                            }
                        });
                        handler.openIframe();
                    }
                });
                
            });
        })
    
    })
    
}

function freeQuotePage() {
    const submitButton = document.querySelector("#submit-project");

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log(counterValues)
    
        const data = {spaces: counterValues};
        fetch('/newproject', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
    })

    // assigninging spaces to all the info in the html
    const spaces = document.querySelectorAll(".space");
    //creating the dictionary
    let counterValues = {};

    // looping through the spaces where space is each individual loop
    spaces.forEach(space => {

        //defining the variables for the title of each space
        const title = space.querySelector(".title").innerHTML;
        //defining the variable for each counter value in each space
        const valueSpan = space.querySelector(".counter-value");
        //changing the value value gotten for that space to an int
        let counter = parseInt(valueSpan.innerHTML, 10);
        //the code below will provide the original int values for the particular dictionary key which will be int 0.
        counterValues[title] = counter;

        //looping through the individual buttons clicked
        space.querySelectorAll('.counter-button').forEach(counterButton => {
            //getting the if the button clicked is marked as increment or decrement
            const direction = counterButton.getAttribute("data-direction");
            //adding an event listener to the buttons
            counterButton.addEventListener("click", function(event) {
                event.preventDefault();
                //adding what to do when the increment or decrement button is clicked
                if (direction === "increment") {
                    counter++;
                } else if (direction === "decrement") {
                    counter--;
                    if (counter < 0) {
                        counter = 0;
                    }
                }
                //updating he dictionary with the key and corresponding value
                counterValues[title] = counter;
                //updating he counter value in the browser so the user can see
                valueSpan.innerHTML = counter;
            })
        });
    });

}

function signuppage() {
    const loginBtn = document.querySelector("#login");
    const createPassword = document.querySelector("#createPass");
    const confirmPassword = document.querySelector("#confirmPass");
    const passwarning = document.querySelector("#passwarning");
    const confirmpasswarning = document.querySelector("#confirm_passwarning");
    const createAccountBtn = document.querySelector("#mainSignupButton");

    //Disable ability to create account
    if (createAccountBtn) {
        createAccountBtn.disabled = true;
    }

    //when you clicj the login button on the sign up page
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login';
        })
    }

    // Define a regular expression to match special characters
    var specialChars = /[!@#$%^&*(),.?":{}|<>]/;

    // Define a function to check the password
    function checkPassword() {
    var password = createPassword.value;

    // Check for required password criteria
    var hasDigit = /[0-9]/.test(password);
    var hasLowercase = /[a-z]/.test(password);
    var hasUppercase = /[A-Z]/.test(password);
    var hasSpecialChar = specialChars.test(password);
    var isLongEnough = password.length >= 6;

    // Display the password warning message if necessary
    if (!hasDigit || !hasLowercase || !hasUppercase || !hasSpecialChar || !isLongEnough) {
        passwarning.style.display = "block";
        passwarning.style.color = "red";
        createAccountBtn.disabled = true;
    } else {
        passwarning.style.display = "none";
    }
    }

    function confirmPass() {
        if (createPassword.value !== confirmPassword.value) {
            confirmpasswarning.style.display = "block";
            confirmpasswarning.style.color = "red";
            createAccountBtn.disabled = true;
        }else{
            confirmpasswarning.style.display = "none";
            createAccountBtn.disabled = false;
        }
    }

    if (createPassword) {
        // Call the checkPassword function when the createPassword button is clicked
        createPassword.addEventListener("input", checkPassword);

        // Call the checkPassword function when the createPassword input loses focus
        createPassword.addEventListener("blur", checkPassword);

        // Call the checkPassword function when the createPassword button is clicked
        confirmPassword.addEventListener("input", confirmPass)
        confirmPassword.addEventListener("input", confirmPass)
    }

}

function projectspage(){

    var slides = document.querySelectorAll('.slide');
    var btns = document.querySelectorAll('.btn');
    let currentSlide = 1;

    // javascript for image slider manual navigation
    var manualNav = function(manual) {
        slides.forEach((slide) => {
            slide.classList.remove('active');

            btns.forEach((btn) => {
                btn.classList.remove('active')
            });
        });

        slides[manual].classList.add('active');
        btns[manual].classList.add('active');
    }

    btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            manualNav(i);
            currentSlide = i;
        });
    });

    // javascript for image slider automatic navigation
    var repeat = function(activeClass) {
        let active = document.getElementsByClassName('active');
        let i = 1;

        var repeater = () => {
            setTimeout(function(){
                [...active].forEach((activeSlide) => {
                    activeSlide.classList.remove('active');
                });

            slides[i].classList.add('active');
            btns[i].classList.add('active');
            i++;

            if (slides.length == i) {
                i = 0;
            }
            if (i >= slides.length) {
                return;
            }
            repeater();
            }, 8000);
        }
        repeater();
    }
    repeat();
}

function homepage(){
    const projectPgBtn = document.querySelector("#goToProjects");

    if (projectPgBtn) {
        projectPgBtn.addEventListener('click', () => {
            window.location.href = '/projects';
        })
    }

    goToSignup();
}

function loginpage (){
    const forgotPass = document.querySelector("#resetPass");
    if (forgotPass) {
        forgotPass.addEventListener('click', () => {
            window.location.href = '/forgot-password';
        })
    }
    goToSignup();
}


function goToSignup(){
    const signUpBtn = document.querySelector("#goToSignUp");
    //when you click the signup button
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            window.location.href = '/signup';
        })
    }
}

// // captcha code for user verification
// (function(){
//     const fonts = ["cursive", "sans-serif", "serif", "monospace"];
//     let captchaValue = ""
//     const loginButton = document.querySelector("#loginButton");

//     function generateCaptcha(){
//         let value = btoa(Math.random()*1000000000);
//         value = value.substr(0,5+Math.random()*5);
//         captchaValue = value;
//     }
//     function setCaptcha() {
//         let html = captchaValue.split("").map((char) =>{
//             const rotate = -20 + Math.trunc(Math.random()*30);
//             const font = Math.trunc(Math.random()*fonts.length);
//             return `<span 
//                 style= "transform:rotate(${rotate}deg);
//                         font-family:${fonts[font]}
//                         "
//                     >${char}</span>`
//         }).join("");
//         document.querySelector(".captcha .preview").innerHTML = html;
//     }
//     function initCaptcha(){
//         document.querySelector(".captcha .captcha-refresh").addEventListener('click', function(){
//             generateCaptcha();
//             setCaptcha();
//         })
//     }
//     initCaptcha();

//     loginButton.addEventListener('click', function(){
//         let inputCaptchaValue = document.querySelector(".captcha-form input").value.toLowerCase();
//         inputCaptchaValue.addEventListener('input', () => {
//             if (inputCaptchaValue != captchaValue.toLowerCase() === inputCaptchaValue) {
//                 loginButton.disabled = false;
//                 console.log("correct captcha")
//             }else {
//                 loginButton.disabled = true;
//                 console.log("Invalid captcha!");
//             }
//         })
//     })
// })();