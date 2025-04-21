// error message display

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

// Display Orders
const displayOrders = async () => {
  try {
    const response = await axios.get("http://localhost:5000/orders");
    const orders = response.data;
    const ordersList = document.getElementById("ordersTable");

    // Clear existing table content
    ordersList.innerHTML = "";

    // Create table header
    ordersList.innerHTML += `
      <thead class="table-primary">
        <tr>
          <th scope="col"># Order ID</th>
          <th scope="col">Date / Time</th>
          <th scope="col">Status</th>
          <th scope="col">Price</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
    `;

    // Create table body
    const tbody = document.createElement("tbody");
    ordersList.appendChild(tbody);

    // If no orders, show a message instead
    if (orders.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center fw-bold">You Don't Have Any Orders Yet <img src="/Assets/cart-shopping-solid.svg" height="20" alt="empty list"></td>
        </tr>
      `;
      return; // Stop execution here
    }

    // Function to create an order row
    const createOrder = (order) => {
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
          <th scope="row">${order.id}</th>
          <td>${order.orderDate} ${order.orderTime}</td>
          <td><span class="badge ${statusBadge}">${statusText}</span></td>
          <td>${order.totalPrice}</td>
          <td class=" h-100">
           
                                <!-- Button trigger modal -->
                      <button type="button" class="fa-solid fa-eye me-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="viewOrder('${order.foodIDs.join(
                        ","
                      )}')">
                      </button>

                      <!-- Modal -->
                      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">Orderd Foods Lists</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              ...
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              
                            </div>
                          </div>
                        </div>
                      </div>
            <i class="fa-solid fa-trash" onclick="deleteOrder('${
              order.id
            }')"></i>
          </td>
        </tr>
      `;
    };

    // Loop through orders and display them
    orders.forEach((order) => {
      tbody.innerHTML += createOrder(order);
    });
  } catch (error) {
    console.error(error);
  }
};

displayOrders();

// Delete Order
const deleteOrder = async (id) => {
  try {
    if (id) {
      successMess(`ORDER WITH ID ${id} SUCCESSFULLY DELETED`);
      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/orders/${id}`);
      }, 1000);
    } else {
      errorMess(`Failed to delete order with ID ${id}.`);
    }
  } catch (error) {
    errorMess("Error has occured");
    console.error(error);
  }
};

// View Order

const viewOrder = async (ids) => {
  const foodIDs = ids.split(","); // Convert string back to array

  // Fetch localFoods and continentalFoods separately
  const localFoodsResponse = await axios.get(
    "http://localhost:5000/localFoods"
  );
  const continentalFoodsResponse = await axios.get(
    "http://localhost:5000/continentalFoods"
  );

  const localFoods = localFoodsResponse.data;
  const continentalFoods = continentalFoodsResponse.data;

  // Find matching food items
  const matchedFoods = [...continentalFoods, ...localFoods].filter(
    (food) => foodIDs.includes(food.id.toString()) // Convert ID to string for comparison
  );

  // console.log(matchedFoods); // Check if it's working

  // Display inside modal
  const modalBody = document.querySelector(".modal-body");

  // Clear previous content
  modalBody.innerHTML = "";

  // Add food items to modal
  if (matchedFoods.length > 0) {
    modalBody.innerHTML = matchedFoods
      .map((food) => `<p><strong>${food.name}</strong></p>`)
      .join("");
  } else {
    modalBody.innerHTML = "<p>No food items found.</p>";
  }
};
