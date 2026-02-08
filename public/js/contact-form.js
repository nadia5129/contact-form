document.getElementById("contact-form").onsubmit = () => {

     clearErrors();

    let isValid = true;

    //validate first name
    let fname = document.getElementById("fname").value.trim();
    if(!fname){
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    //validate last name
    let lname = document.getElementById("lname").value.trim();
    if(!lname){
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    //validate how we met
    let meet = document.getElementById("meet").value;
    if(!meet){
        document.getElementById("err-meet").style.display = "block";
        isValid = false;
    }

    // validate email, email is optional but if provided includes @ and .
    //if (email exists AND (no @ OR no .))
    let email = document.getElementById("email").value.trim();
    if(email && (!email.includes("@") || !email.includes("."))){
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    //if mailing list is checked, email must be provided
    let mailing = document.getElementById("mailing").checked;
    if(mailing && !email){
        document.getElementById("err-mailing").style.display = "block";
        isValid = false;
    }

    // validate linkedin url, if url provided, must start with https://linkedin.com/
    let url = document.getElementById("lurl").value.trim();
    if(url && !url.startsWith("https://linkedin.com/in/")){
        document.getElementById("err-lurl").style.display = "block";
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}