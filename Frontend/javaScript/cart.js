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

// Display cart
const cartDisplay = async () => {
  try {
    const response = await axios.get("http://localhost:5000/cart");
    const cartList = document.getElementById("cartList");
    cartList.innerHTML = ""; // Clear existing cart items

    const cartFood = response.data;

    const totalCart = document.getElementById("totalCart");
    totalCart.innerHTML = `You have a total of ${cartFood.length} foods in your cart`;

    const navCart = document.getElementById("navCart");
    navCart.innerHTML = cartFood.length;

    const createFood = (food) => {
      return `
              <div class="card mb-3 shadow-sm">
                  <div class="card-body">
                      <div class="row align-items-center">
                          <!-- Product Image and Details -->
                          <div class="col-12 col-md-6 d-flex flex-wrap align-items-center gap-3 text-center text-md-start">
                              <img src="${food.image}" class="img-fluid rounded-3" alt="Shopping item"
                                  style="width: 65px; height: auto;">
                              <div>
                                  <h5 class="mb-1">${food.name}</h5>
                                  <p class="small text-muted mb-0">${food.description}</p>
                              </div>
                          </div>

                          <!-- Quantity and Price Section -->
                          <div class="col-12 col-md-6 d-flex flex-wrap align-items-center justify-content-md-end gap-3 mt-3 mt-md-0">
                              <!-- Quantity Input -->
                              <div class="d-flex align-items-center border rounded px-2 py-1">
                              <!-- Subtract Button-->
                                  <button onclick="updateQuantity(this, -1)" class="minus btn btn-outline-secondary px-2">-</button>

                                  <input class="quantity fw-bold text-center border-0 bg-body-tertiary text-body cartFoodInput"
                                      min="0" name="quantity" value="1" type="number"
                                      style="width: 50px; min-width: 50px;" oninput="calculateTotal()">


                                  <!-- Add Button -->
                                  <button onclick="updateQuantity(this, 1)" class="plus btn btn-outline-secondary px-2">+</button>
                              </div>

                              <!-- Price -->
                              <div>
                                  <h5 class="fw-bold mb-0  unitPrice">${food.price}</h5>
                              </div>

                              <!-- Total Price -->
                              <div>
                                  <input class="fw-bold text-center border-0 bg-body-tertiary text-body totalPrice"
                                      type="text" value="₵${food.price}" style="width: 80px;" readonly>
                              </div>

                              <!-- Trash Icon -->
                              <button class="btn btn-link text-danger p-0 border-0" onclick="handleDelete( event,'${food.id}','${food.name}')">
                                  <i class="fas fa-trash-alt fs-5"></i>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
    };

    cartFood.forEach((food) => {
      cartList.innerHTML += createFood(food);
    });

    calculateTotal(); // Calculate total price of all items
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
cartDisplay();

// Delete cart food

const handleDelete = (event, id, name) => {
  event.preventDefault(); // Stops default form submission
  deleteFood(id, name);
};

const deleteFood = async (id, name) => {
  try {
    if (id || name) {
      successMess(`${name} was successfully deleted`);

      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/cart/${id}`);
      }, 1000);
    }
    // Refresh the cart without reloading the page
  } catch (error) {
    console.error("Error deleting item:", error);
    errorMess(`Failed to delete ${name}. Please try again.`);
  }
};

// Update quantity with buttons
const updateQuantity = (button, change) => {
  const input = button.parentNode.querySelector(".cartFoodInput");
  let value = parseInt(input.value) || 0;
  value = Math.max(value + change, 0); // Ensure value doesn't go below 0
  input.value = value;
  calculateTotal();
};

// Calculate total for each item and grand total
const calculateTotal = () => {
  const quantityInputs = document.getElementsByClassName("cartFoodInput");
  const unitPriceElements = document.getElementsByClassName("unitPrice");
  const totalPriceElements = document.getElementsByClassName("totalPrice");

  let grandTotal = 0; // To track the total price of all items

  for (let i = 0; i < quantityInputs.length; i++) {
    const quantity = parseInt(quantityInputs[i].value) || 0; // Get quantity
    const price = parseFloat(unitPriceElements[i].textContent) || 0; // Get price
    const total = quantity * price; // Calculate total

    totalPriceElements[i].value = total.toFixed(2); // Display the total price for each item
    grandTotal += total; // Add to the grand total
  }

  // Display grand total
  document.getElementById(
    "grandTotal"
  ).textContent = `Total: ₵${grandTotal.toFixed(2)}`;

  // Display total price
  document.getElementById("totalPrice").textContent = `₵${(
    grandTotal + 20
  ).toFixed(2)}`;
};

///check out
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  const cardHolderName = document.getElementById("cardHolderName").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expirationDate = document.getElementById("expirationDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();
  const deliveryLocation = document
    .getElementById("deliveryLocation")
    .value.trim();
  const totalPrice = document.getElementById("totalPrice").textContent.trim();
  const orderDate = new Date().toISOString().split("T")[0];
  const orderTime = new Date().toLocaleTimeString();
  const status = 0;

  const foodIDs = Array.from(document.getElementsByClassName("cartFoodInput"))
    .map((input) => {
      const deleteButton = input
        .closest(".card-body")
        ?.querySelector("button[onclick^='handleDelete']");
      if (!deleteButton) return null;
      const match = deleteButton
        .getAttribute("onclick")
        .match(/handleDelete\([^,]+,\s*'([^']+)'/);
      return match ? match[1] : null;
    })
    .filter(Boolean); // Remove null values

  if (!cardHolderName || !cardNumber || !expirationDate || !cvv) {
    errorMess("Please enter all your card details.");
    return;
  }

  const cardDetails = {
    cardHolderName,
    deliveryLocation,
    cardNumber,
    expirationDate,
    cvv,
    totalPrice,
    orderDate,
    status,
    orderTime,
    foodIDs,
  };
  if (foodIDs.length === 0) {
    return errorMess("Please add a cart");
  }

  try {
    successMess(`Order placed successfully.`);
    setTimeout(async () => {
      await axios.post("http://localhost:5000/orders", cardDetails);

      foodIDs.map(
        async (id) => await axios.delete(`http://localhost:5000/cart/${id}`)
      );
    }, 1000);

    // Clear input fields
    document.getElementById("cardHolderName").value = "";
    document.getElementById("deliveryLocation").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("expirationDate").value = "";
    document.getElementById("cvv").value = "";
  } catch (error) {
    errorMess("Error placing order");
    console.error(error);
  }
});
