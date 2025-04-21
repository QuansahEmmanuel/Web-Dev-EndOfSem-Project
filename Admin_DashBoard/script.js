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

// Total Food Display
const totalFood = async () => {
  const totalFoodCount = document.getElementById("totalFood");
  try {
    const localFoodsResponse = await axios.get(
      "http://localhost:5000/localFoods"
    );
    const continentalFoodsResponse = await axios.get(
      "http://localhost:5000/continentalFoods"
    );
    const localFoods = localFoodsResponse.data;
    const continentalFoods = continentalFoodsResponse.data;
    totalFoodCount.textContent += localFoods.length + continentalFoods.length;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
totalFood();

// Total Orders Display
const totalOrderDisplay = async () => {
  const totalOrderCount = document.getElementById("total_order_display");
  try {
    const res = await axios.get("http://localhost:5000/orders");
    const orders = res.data;
    totalOrderCount.textContent += orders.length;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
totalOrderDisplay();

// View Food Items Button
document.getElementById("viewFood").addEventListener("click", function () {
  const foodTable = document.getElementById("foodTable");
  if (foodTable.style.display === "none") {
    foodTable.style.display = "flex"; // Show the table

    // display food Items
    const apiFetch = async () => {
      try {
        const localFoodsResponse = await axios.get(
          "http://localhost:5000/localFoods"
        );
        const continentalFoodsResponse = await axios.get(
          "http://localhost:5000/continentalFoods"
        );

        const localFoods = localFoodsResponse.data;
        const continentalFoods = continentalFoodsResponse.data;

        // Function to create product card HTML
        const createCard = (food) => {
          return `
         <div class="card" style="width: 15rem;">
                            <img src="${food.image}" class="card-img-top"
                                alt="${food.name}">
                            <div class="card-body">
                                <h5 class="card-title">${food.name}</h5>
                                <p class="card-text">${food.description}.</p>
                                <p class="fw-bold">₵${food.price}</p>
                                <p class="fw-bold">Food ID #${food.id}</p>
                            </div>
                        </div>
        `;
        };

        // Loop through localFoods and continentalFoods and generate the cards
        [...localFoods, ...continentalFoods].forEach((food) => {
          foodTable.innerHTML += createCard(food);
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    apiFetch();
  } else {
    foodTable.style.display = "none"; // Hide the table
  }
  //   console.log("toggle");
});

// Add Food Items Button
document.getElementById("createFood").addEventListener("click", function () {
  const createFoodForm = document.getElementById("createFoodForm");

  if (createFoodForm.style.display === "none") {
    createFoodForm.style.display = "flex"; // Show the form

    // Add event listener to the form
    const addFoodForm = document.getElementById("addFoodForm");
    addFoodForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addFoodForm);
      const name = formData.get("foodName");
      const foodCategory = formData.get("foodCategory");
      const description = formData.get("foodDescription");
      const price = formData.get("foodPrice");
      const image = formData.get("foodImage");

      const data = {
        name,
        foodCategory,
        description,
        price,
        image,
      };
      if (!name || !foodCategory || !description || !price || !image) {
        errorMess("Please fill in all input fields");
        return;
      }

      if (foodCategory === "localFoods") {
        successMess(`${data.name} added successfully`);
        setTimeout(async () => {
          await axios.post("http://localhost:5000/localFoods", data);
        }, 1000);
        return;
      }

      if (foodCategory === "continentalFoods") {
        successMess(`${data.name} added successfully`);
        setTimeout(async () => {
          await axios.post("http://localhost:5000/continentalFoods", data);
        }, 1000);
        return;
      }
    });
  } else {
    createFoodForm.style.display = "none"; // Hide the form
  }
  // console.log("create");
});

// Delete Food Items Button
document.getElementById("deleteFood").addEventListener("click", function () {
  const deleteFoodForm = document.getElementById("deleteFoodForm");

  if (deleteFoodForm.style.display === "none") {
    deleteFoodForm.style.display = "flex"; // Show the form

    // Select the form only once to avoid multiple listeners
    const deleteForm = document.getElementById("delete_Food_Form");

    // Remove previous event listener if it exists
    deleteForm.removeEventListener("submit", handleDeleteFood);

    // Add event listener to the form
    deleteForm.addEventListener("submit", handleDeleteFood);
  } else {
    deleteFoodForm.style.display = "none"; // Hide the form
  }
});

// Function to handle food deletion
async function handleDeleteFood(e) {
  e.preventDefault();
  const deleteForm = document.getElementById("delete_Food_Form");

  const formData = new FormData(deleteForm);
  const foodId = formData.get("foodId");
  const foodCategory = formData.get("foodCategory");

  // Check if fields are empty
  if (!foodId || !foodCategory) {
    errorMess("Please fill in all fields");
    return;
  }

  // Check for valid category
  if (foodCategory !== "localFoods" && foodCategory !== "continentalFoods") {
    errorMess(
      "Invalid category! Please choose either 'localFoods' or 'continentalFoods'."
    );
    return;
  }

  try {
    if (foodCategory === "localFoods") {
      successMess("Food Successfully Deleted");
      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/localFoods/${foodId}`);
      }, 1000);
      return;
    }
    if (foodCategory === "continentalFoods") {
      successMess("Food Successfully Deleted");
      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/continentalFoods/${foodId}`);
      }, 1000);
      return;
    }
  } catch (error) {
    console.error("Error deleting food:", error);
    errorMess("Error deleting food. Please try again.");
  }
}
// Search ID to Delete Function
const DeleteSearchFoodid = async () => {
  const foodId = document.getElementById("delet_foodId").value;
  if (!foodId) {
    errorMess("Please Enter Food ID");
    return;
  }
  try {
    const localFoodResponse = await axios.get(
      `http://localhost:5000/localFoods`
    );
    const continentalFoosResponse = await axios.get(
      `http://localhost:5000/continentalFoods`
    );
    const localFood = localFoodResponse.data;
    const continentalFood = continentalFoosResponse.data;

    const foodItem = [...localFood, ...continentalFood].find(
      (item) => item.id == foodId
    );

    if (!foodItem) {
      errorMess("Food not found");

      document.getElementById("delete_foodCategory").value = "";
      return;
    }
    if (foodItem) {
      document.getElementById("delet_foodId").value = foodItem.id;
      document.getElementById("delete_foodCategory").value =
        foodItem.foodCategory;
      return;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Toggle Edit Food  Button
document.getElementById("editFood").addEventListener("click", function () {
  const updateFoodForm = document.getElementById("editFoodForm");
  updateFoodForm.style.display =
    updateFoodForm.style.display === "none" ? "flex" : "none";
});

const searchFoodid = async () => {
  const foodId = document.getElementById("foodId").value;
  try {
    const localFoodResponse = await axios.get(
      `http://localhost:5000/localFoods`
    );
    const continentalFoosResponse = await axios.get(
      `http://localhost:5000/continentalFoods`
    );
    const localFood = localFoodResponse.data;
    const continentalFood = continentalFoosResponse.data;

    const foodItem = [...localFood, ...continentalFood].find(
      (item) => item.id == foodId
    );
    if (!foodItem) {
      errorMess("Food not found");
      document.getElementById("foodName").value = "";
      document.getElementById("foodCategory").value = "";
      document.getElementById("foodDescription").value = "";
      document.getElementById("foodPrice").value = "";
      document.getElementById("foodImage").value = "";
      return;
    }

    document.getElementById("foodName").value = foodItem.name;
    document.getElementById("foodCategory").value = foodItem.foodCategory;
    document.getElementById("foodDescription").value = foodItem.description;
    document.getElementById("foodPrice").value = foodItem.price;
    document.getElementById("foodImage").value = foodItem.image;

    // console.log(foodItem);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Function to handle food update
document
  .getElementById("edit_Food_Form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(edit_Food_Form);
    const foodId = formData.get("foodId");
    const foodCategory = formData.get("foodCategory");
    const name = formData.get("foodName");
    const description = formData.get("foodDescription");
    const price = formData.get("foodPrice");
    const image = formData.get("foodImage");

    const dataDetails = {
      name,
      foodCategory,
      description,
      price,
      image,
    };

    if (!foodId || !foodCategory || !name || !description || !price || !image) {
      errorMess("Please fill in all fields");
      return;
    }

    try {
      if (foodCategory === "localFoods") {
        const res = await axios.get("http://localhost:5000/localFoods");
        const data = res.data;
        const result = data.find((food) => food.id === foodId);
        if (!result) {
          errorMess("Worng Food Category Selected");
          return;
        }
        if (result) {
          successMess(`${dataDetails.name} updated successfully`);
          setTimeout(async () => {
            await axios.put(
              `http://localhost:5000/localFoods/${foodId}`,
              dataDetails
            );
          }, 1000);
          return;
        }
      } else if (foodCategory === "continentalFoods") {
        const res = await axios.get("http://localhost:5000/continentalFoods");
        const data = res.data;
        const result = data.find((food) => food.id === foodId);
        if (!result) {
          errorMess("Worng Food Category Selected");
          return;
        }
        if (result) {
          successMess(`${dataDetails.name} updated successfully`);
          setTimeout(async () => {
            await axios.put(
              `http://localhost:5000/continentalFoods/${foodId}`,
              dataDetails
            );
          }, 1000);
          return;
        }
      }
    } catch (error) {
      console.error("Error updating food:", error);
      errorMess("Error updating food. Please try again.");
    }
  });

// Toggle View Orders Button
document.getElementById("viewOrder").addEventListener("click", function () {
  const orderTable = document.getElementById("orderTable");
  orderTable.style.display =
    orderTable.style.display === "none" ? "flex" : "none";
});

const viewOrders = async () => {
  const orderContainer = document.getElementById("orderContainer");

  try {
    const response = await axios.get("http://localhost:5000/orders");
    const orders = response.data;

    // Clear existing content before appending
    orderContainer.innerHTML = "";

    // If no orders are found, display a message
    if (orders.length === 0) {
      orderContainer.innerHTML = `
        <div class="alert alert-info text-center" role="alert">
          <strong>No orders found!</strong> Please check back later.
        </div>
      `;
      return;
    }

    // Create the table dynamically
    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";

    // Create table header
    const thead = document.createElement("thead");
    thead.className = "thead-dark";
    thead.innerHTML = `
      <tr>
        <th>Order ID</th>
        <th>Customer Name</th>
        <th>Delivery Address</th>
        <th>Order Details</th>
        <th>Order Price</th>
        <th>Status</th>
      </tr>
    `;

    // Create table body
    const tbody = document.createElement("tbody");

    // Get all food data
    const LocalFoodResponse = await axios.get(
      "http://localhost:5000/localFoods"
    );
    const ContinentalFoodResponse = await axios.get(
      "http://localhost:5000/continentalFoods"
    );
    const LocalFood = LocalFoodResponse.data;
    const ContinentalFood = ContinentalFoodResponse.data;

    // Combine both food lists
    const allFoods = [...LocalFood, ...ContinentalFood];

    // Function to get food names by IDs
    const getFoodNames = (foodIDs) => {
      return foodIDs
        .map((id) => {
          const foundFood = allFoods.find((food) => food.id === id);
          return foundFood ? foundFood.name : "Unknown Food";
        })
        .join(", ");
    };

    // Function to create order rows
    const createOrderRow = (order) => {
      let statusText = "";
      let statusBadge = "";

      if (order.status === 0) {
        statusText = "Pending";
        statusBadge = "bg-warning text-dark"; // Yellow for pending
      } else if (order.status === 1) {
        statusText = "Delivered";
        statusBadge = "bg-success"; // Green for delivered
      }

      return `
        <tr>
          <td>${order.id}</td>
          <td>${order.cardHolderName}</td>
          <td>${order.deliveryLocation}</td>
          <td>${getFoodNames(order.foodIDs)}</td>
          <td>${order.totalPrice}</td>
          <td><span class="badge ${statusBadge}">${statusText}</span></td>
        </tr>
      `;
    };

    // Append order rows
    orders.forEach((order) => {
      tbody.innerHTML += createOrderRow(order);
    });

    // Append thead and tbody to table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Append table to orderContainer
    orderContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching orders:", error);
    orderContainer.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <strong>Error fetching orders.</strong> Please try again later.
      </div>
    `;
  }
};

// Call the function
viewOrders();

// Toggle delete Orders Button
document.getElementById("deleteOrder").addEventListener("click", function () {
  const deleteOrderbox = document.getElementById("deleteOrderbox");
  deleteOrderbox.style.display =
    deleteOrderbox.style.display === "none" ? "flex" : "none";
});

document
  .getElementById("delete_order_Form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const deleteId = document.getElementById("deleteId").value;

    if (!deleteId) {
      errorMess("Please enter an order ID");
      return;
    }
    if (deleteId) {
      const res = await axios.get("http://localhost:5000/orders");
      const data = res.data;
      const orderIds = data.find((orderId) => orderId.id === deleteId);
      if (orderIds) {
        successMess(`${orderIds.id} successfully deleted`);
        deleteOrderID(deleteId);
      } else {
        errorMess("Incorrect Order ID#");
      }
    }
  });

const deleteOrderID = async (id) => {
  try {
    setTimeout(async () => {
      await axios.delete(`http://localhost:5000/orders/${id}`);
    }, 1000);
  } catch (error) {
    console.error("Error deleting order:", error);
    errorMess("In Error has occurd ");
  }
};

// Toggle Orders Status Button
document
  .getElementById("order_status_btn")
  .addEventListener("click", function () {
    const Order_status_box = document.getElementById("Order_status_box");
    Order_status_box.style.display =
      Order_status_box.style.display === "none" ? "flex" : "none";
  });

// Handle Order ID function
const orderStatusID = async () => {
  const orderStatusInputID = document.getElementById("order_status_id").value;

  if (!orderStatusInputID) {
    errorMess("Please enter an order ID");
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:5000/orders/${orderStatusInputID}`
    );
    const data = res.data.status;

    document.getElementById("edit_status").value = data;
  } catch (error) {
    console.error("Error fetching order:", error);
    errorMess("Order ID does not exit");
    document.getElementById("edit_status").value = "";
  }
};

// Handle  Edit Status function
const submitStatus = async () => {
  const orderStatusInputID = document.getElementById("order_status_id").value;
  const editStatus = document.getElementById("edit_status").value;

  if (!orderStatusInputID || !editStatus) {
    errorMess("Enter Order ID and Status");
    return;
  }

  try {
    // 1️⃣ Fetch the existing order
    const res = await axios.get(
      `http://localhost:5000/orders/${orderStatusInputID}`
    );
    const order = res.data;

    if (!order) {
      errorMess("Order ID does not exist");
      return;
    }

    // 2️⃣ Update only the status
    order.status = parseInt(editStatus, 10);

    // 3️⃣ Send the entire updated object back
    await axios.put(
      `http://localhost:5000/orders/${orderStatusInputID}`,
      order
    );

    successMess("Order status updated successfully!");
  } catch (error) {
    console.error("Error updating status:", error);
    errorMess("An error occurred while updating order status.");
  }
};

// Toggle  Payment Transcation Button
document
  .getElementById("payment_tansaction_btn")
  .addEventListener("click", function () {
    const payment_tansaction_container = document.getElementById(
      "payment_tansaction_container"
    );
    payment_tansaction_container.style.display =
      payment_tansaction_container.style.display === "none" ? "flex" : "none";
  });

// Handle Payment Details View function
const viewPaymentDetails = async () => {
  const paymentDetailsCard = document.getElementById("payment_details_card");
  const inputID = document.getElementById("input_ID").value.trim(); // Get the input value

  if (!inputID) {
    errorMess("Please enter an Order ID.");
    return;
  }

  try {
    // Fetch payment details from JSON file
    const response = await axios.get(`http://localhost:5000/orders/${inputID}`);
    const details = response.data;

    if (!details) {
      errorMess("Order not found.");
      return;
    }

    // Function to mask card number (show only last 4 digits)
    const maskCardNumber = (cardNumber) => {
      return "**** **** **** " + cardNumber.slice(-4);
    };

    // Function to determine status color
    const getStatusBadge = (status) => {
      return status === 1
        ? `<span class="badge bg-success">Completed</span>`
        : `<span class="badge bg-warning">Pending</span>`;
    };

    // Generate payment details card dynamically
    const paymentDetails = `
      <div class="container mt-4">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h5>Payment Details</h5>
          </div>
          <div class="card-body">
            <p><strong>Card Holder:</strong> ${details.cardHolderName}</p>
            <p><strong>Delivery Location:</strong> ${
              details.deliveryLocation
            }</p>
            <p><strong>Card Number:</strong> ${maskCardNumber(
              details.cardNumber
            )}</p>
            <p><strong>Expiration Date:</strong> ${details.expirationDate}</p>
            <p><strong>CVV:</strong> ***</p>
            <p><strong>Total Price:</strong> <span class="text-success">${
              details.totalPrice
            }</span></p>
            <p><strong>Order Date:</strong> ${details.orderDate}</p>
            <p><strong>Order Time:</strong> ${details.orderTime}</p>
            <p><strong>Order Status:</strong> ${getStatusBadge(
              details.status
            )}</p>
            <!--<p><strong>Food Items:</strong> ${details.foodIDs.join(
              ", "
            )}</p>> -->
          </div>
        </div>
      </div>
    `;

    // Insert card into the div
    paymentDetailsCard.innerHTML = paymentDetails;
    successMess("Payment details loaded successfully!");
  } catch (error) {
    console.error("Error fetching payment details:", error);
    errorMess("Incorrect payment details. Please try again.");
    paymentDetailsCard.innerHTML = "";
  }
};

// Toggle  View Account Button
document
  .getElementById("view_account_btn")
  .addEventListener("click", function () {
    const view_account_container = document.getElementById(
      "view_account_container"
    );
    view_account_container.style.display =
      view_account_container.style.display === "none" ? "flex" : "none";
  });

const viewAllUserAccounts = async () => {
  const displayAccount = document.getElementById("display_account");

  try {
    const response = await axios.get("http://localhost:5000/userAccounts");
    const users = response.data;

    if (!users.length) {
      errorMess("No user accounts found.");
      displayAccount.innerHTML = "";
      return;
    }

    // successMess("User accounts retrieved successfully.");

    // Create user accounts table
    let tableHTML = `
        <table class="table table-bordered table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
      `;

    users.forEach((user) => {
      let bgRole = "";
      if (user.role === "admin") {
        bgRole = "bg-warning";
      }
      if (user.role === "user") {
        bgRole = "bg-info";
      }

      tableHTML += `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td><span class="badge ${bgRole}">${user.role}</span></td>
            <td>${user.id}</td>
          </tr>
        `;
    });

    tableHTML += `</tbody></table>`;

    // Display table
    displayAccount.innerHTML = tableHTML;
  } catch (error) {
    errorMess("An error occurred while fetching user accounts.");
  }
};
viewAllUserAccounts();

// Toggle  Delete Account Button
document
  .getElementById("delete_accout_btn")
  .addEventListener("click", function () {
    const delete_container = document.getElementById("delete_container");
    delete_container.style.display =
      delete_container.style.display === "none" ? "flex" : "none";
  });

document
  .getElementById("delete_account_Form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    const accountId = document.getElementById("delete_account_Id").value.trim();

    if (!accountId) {
      errorMess("Please enter an Account ID to delete.");
      return;
    }

    if (accountId) {
      const res = await axios.get(`http://localhost:5000/userAccounts`);
      const data = res.data;
      const user = data.find((user) => user.id === accountId);
      if (user) {
        successMess(
          `Account with ID# ${accountId} has been successfully deleted.`
        );
      } else {
        errorMess("Incorrect Account ID");
        return;
      }
    }

    try {
      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/userAccounts/${accountId}`);
      }, 1000);
    } catch (error) {
      errorMess("Account ID not found or an error occurred.");
    }
  });

// Toggle  Create Account Button
document
  .getElementById("create_account_btn")
  .addEventListener("click", function () {
    const create_account_container = document.getElementById(
      "create_account_container"
    );
    create_account_container.style.display =
      create_account_container.style.display === "none" ? "flex" : "none";
  });

document
  .getElementById("create_account_form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload

    // Get form values
    const userName = document.querySelector("[name='user_name']").value.trim();
    const userRole = document.querySelector("[name='user_role']").value;
    const userEmail = document
      .querySelector("[name='user_email']")
      .value.trim();
    const phoneNumber = document
      .querySelector("[name='phoneNumber']")
      .value.trim();
    const userPassword = document
      .querySelector("[name='user_password']")
      .value.trim();

    // Validate input fields
    if (!userName || !userRole || !userEmail || !phoneNumber || !userPassword) {
      errorMess("All fields are required.");
      return;
    }

    // Prepare user data
    const newUser = {
      name: userName,
      role: userRole,
      email: userEmail,
      phoneNumber: phoneNumber,
      password: userPassword,
    };

    try {
      if (newUser) {
        successMess(`${newUser.name} has been successfully created`);
        setTimeout(async () => {
          await axios.post("http://localhost:5000/userAccounts", newUser);
        }, 1000);
        return;
      }
      document.getElementById("create_account_form").reset();
      if (!newUser) {
        errorMess("Failed to create user. Please try again.");
        return;
      }
    } catch (error) {
      errorMess("An error occurred while creating the user.");
    }
  });
