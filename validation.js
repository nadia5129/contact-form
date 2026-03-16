export function validateForm(data) {
    console.log("Server side validation happens here");
    console.log(data);

    const errors = [];

    // Validate first name
    if (data.fname.trim() === "") {
        errors.push("First name is required.");
    }

    // Validate last name
    if (data.lname.trim() === "") {
        errors.push("Last name is required.");
    }

    // Validate how we met
    const validMeetOptions = ["conference", "social-media", "friend", "other"];
    if (!validMeetOptions.includes(data.meet)) {
        errors.push("Please select a valid option for how we met.");
    }

    // Validate email format if mailing list is selected
    const validFormats = ["html", "text"];
    if (data.mailing === "on" && !validFormats.includes(data.format)) {
        errors.push("Please choose HTML or Text for email format.");
    }

    console.log(errors);

    return {
        isValid: errors.length === 0,
        errors
    };
}