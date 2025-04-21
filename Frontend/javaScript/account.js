document.getElementById("login-link").addEventListener("click", function () {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
});

document.getElementById("signup-link").addEventListener("click", function () {
  document.getElementById("signup-container").style.display = "block";
  document.getElementById("login-container").style.display = "none";
});

const errorMess = (messeage) => {
  iziToast.error({
    // title: "Error",
    message: messeage,
    position: "topRight", // Matches your div class
  });
};
const successMess = (message) => {
  iziToast.success({
    // title: "Success",
    message: message,
    position: "topRight", // Matches your div class
  });
};

document.getElementById("login_email").addEventListener("blur", function () {
  const email = document.getElementById("login_email").value.trim();

  if (email === "") {
    errorMess("Email is required");
  } else if (!email.endsWith("@gmail.com")) {
    errorMess("Email must be a Gmail address (e.g., example@gmail.com)");
  }
});

document.getElementById("login_password").addEventListener("blur", function () {
  const password = document.getElementById("login_password").value;
  if (password === "") {
    errorMess("Password is required");
  }
});

document.getElementById("username").addEventListener("blur", function () {
  const username = document.getElementById("username").value;
  if (username === "") {
    errorMess("Username is required");
  }
});

document.getElementById("signUp-email").addEventListener("blur", function () {
  const email = document.getElementById("signUp-email").value.trim();

  if (email === "") {
    errorMess("Email is required");
  } else if (!email.endsWith("@gmail.com")) {
    errorMess("Email must be a Gmail address (e.g., example@gmail.com)");
    return;
  }
});

document
  .getElementById("signUp-password")
  .addEventListener("blur", function () {
    const password = document.getElementById("signUp-password").value;
    if (password === "") {
      errorMess("Password is required");
    }
  });

document.getElementById("phone-number").addEventListener("blur", function () {
  const phoneNumber = document.getElementById("phone-number").value;
  if (phoneNumber === "") {
    errorMess("Phone number is required");
  }
});

document.getElementById("phone-number").addEventListener("input", function () {
  let phoneInput = this.value.replace(/\D/g, ""); // Remove non-numeric characters

  if (!phoneInput.startsWith("0")) {
    phoneInput = "0"; // Force phone number to start with 0
  }

  this.value = phoneInput.slice(0, 10); // Limit to 10 digits

  const errorMsg = document.getElementById("phone-error");
  if (phoneInput.length !== 10) {
    errorMsg.textContent =
      "Phone number must be exactly 10 digits and start with 0.";
  } else {
    errorMsg.textContent = ""; // Clear error if valid
  }
});

//login section
document.getElementById("login-submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login_email").value.trim();
  const password = document.getElementById("login_password").value.trim();

  if (!email || !password) {
    return errorMess("Email and password are required");
  }

  try {
    const response = await axios.get("http://localhost:5000/userAccounts");
    const users = response.data;

    // Find user with matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      return errorMess("Incorrect username or password");
    }

    if (user.role === "admin") {
      successMess(`Welcome Admin, ${user.name}!`);
      setTimeout(() => {
        window.location.href = "../Admin_DashBoard/index.html";
      }, 2000);
      return;
    }

    if (user.role === "user") {
      successMess(`Welcome User, ${user.name}!`);
      setTimeout(() => {
        window.location.href = "../Frontend/html/index.html";
      }, 2000);
      return;
    }

    return errorMess("Unknown role. Please contact support.");
  } catch (error) {
    console.error("Login Error:", error);
    return errorMess("Server error. Please try again later.");
  }
});

//sign_up section
document
  .getElementById("signUp_submit")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("signUp-email").value.trim();
    const phoneNumber = document.getElementById("phone-number").value;
    const password = document.getElementById("signUp-password").value.trim();

    if (!username || !email || !phoneNumber || !password) {
      return errorMess("All input fields required");
    }
    if (phoneNumber.length < 10) {
      return errorMess("incorrect phone number");
    }
    const userDetails = {
      name: username,
      email,
      phoneNumber,
      password,
      role: "user",
    };
    try {
      if (userDetails) {
        successMess(`You have successfully signd up ${userDetails.name}`);
        setTimeout(async () => {
          await axios.post("http://localhost:5000/userAccounts", userDetails);
        }, 3000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      return errorMess("Server error. Please try again later.");
    }
  });
