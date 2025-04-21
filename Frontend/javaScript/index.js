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

// display food Items

const apiFetch = async () => {
  try {
    const foodCard = document.getElementById("foodCard");

    // Fetch localFoods and continentalFoods separately
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
        <div class="card"> 
          <img src="${food.image}" class="card-img" alt="${food.name}">
          <div class="card-body">
            <h5 class="card-title">${food.name}</h5>
            <p class="card-text">${food.description}</p>
            <div class="card-footer">
              <span class="price">₵${food.price}</span>
              <button type="button" class="add-btn" onclick="addFoodToCart('${food.id}','${food.name}','${food.price}','${food.description}','${food.image}')">+ Add To Cart</button>
            </div>
          </div>
        </div>
      `;
    };

    // Clear existing content before appending new items
    foodCard.innerHTML = "";

    // Loop through localFoods and continentalFoods and generate the cards
    [...localFoods, ...continentalFoods].forEach((food) => {
      foodCard.innerHTML += createCard(food);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

apiFetch();

// search section

document.getElementById("searchInput").addEventListener("input", () => {
  handleSearch(event);
});

async function handleSearch(event) {
  event.preventDefault(); // Prevent form from refreshing

  try {
    const searchInput = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    const foodCard = document.getElementById("foodCard");
    // Fetch localFoods and continentalFoods separately
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
        <div class="card"> 
          <img src="${food.image}" class="card-img" alt="${food.name}">
          <div class="card-body">
            <h5 class="card-title">${food.name}</h5>
            <p class="card-text">${food.description}</p>
            <div class="card-footer">
              <span class="price">₵${food.price}</span>
                <button type="button" class="add-btn" onclick="addFoodToCart(${food.id},'${food.name}','${food.price}','${food.description}','${food.image}')">+</button>
            </div>
          </div>
        </div>
      `;
    };

    // Clear previous search results
    foodCard.innerHTML = "";

    // Merge both categories and filter based on search input
    const filteredFoods = [...localFoods, ...continentalFoods].filter((food) =>
      food.name.trim().toLowerCase().includes(searchInput)
    );

    // Display only filtered results
    if (filteredFoods.length > 0) {
      filteredFoods.forEach((food) => {
        foodCard.innerHTML += createCard(food);
      });
    } else {
      foodCard.innerHTML = "<p>No matching results found.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.getElementById("localFoodCat").addEventListener("click", async () => {
  try {
    const localDisplay = document.getElementById("foodCard");
    localDisplay.innerHTML = "";
    const localFoodsResponse = await axios.get(
      "http://localhost:5000/localFoods"
    );
    const localFoods = localFoodsResponse.data;
    const createCard = (food) => {
      return `
      <div class="card"> 
        <img src="${food.image}" class="card-img" alt="${food.name}">
        <div class="card-body">
          <h5 class="card-title">${food.name}</h5>
          <p class="card-text">${food.description}</p>
          <div class="card-footer">
            <span class="price">₵${food.price}</span>
             <button type="button" class="add-btn" onclick="addFoodToCart(${food.id},'${food.name}','${food.price}','${food.description}','${food.image}')">+</button>
          </div>
        </div>
      </div>
    `;
    };
    [...localFoods].forEach((food) => {
      foodCard.innerHTML += createCard(food);
    });
    // console.log(localFoods);
  } catch {
    console.error("Error fetching products:", error);
  }
});

document
  .getElementById("ContinentalFoodCat")
  .addEventListener("click", async () => {
    try {
      const localDisplay = document.getElementById("foodCard");
      localDisplay.innerHTML = "";
      const continentalFoodsResponse = await axios.get(
        "http://localhost:5000/continentalFoods"
      );
      const localFoods = continentalFoodsResponse.data;
      const createCard = (food) => {
        return `
      <div class="card"> 
        <img src="${food.image}" class="card-img" alt="${food.name}">
        <div class="card-body">
          <h5 class="card-title">${food.name}</h5>
          <p class="card-text">${food.description}</p>
          <div class="card-footer">
            <span class="price">₵${food.price}</span>
              <button type="button" class="add-btn" onclick="addFoodToCart(${food.id},'${food.name}','${food.price}','${food.description}','${food.image}')">+</button>
          </div>
        </div>
      </div>
    `;
      };
      [...localFoods].forEach((food) => {
        foodCard.innerHTML += createCard(food);
      });
      // console.log(localFoods);
    } catch {
      console.error("Error fetching products:", error);
    }
  });

document.getElementById("closeCat").addEventListener("click", () => {
  apiFetch();
});

// adding food to cart
const addFoodToCart = async (id, name, price, description, image) => {
  try {
    const cartFood = {
      id: id,
      name: name,
      price: price,
      image: image,
      description: description,
    };
    if (cartFood) {
      successMess(`${cartFood.name} is successfully added to cart`);
      setTimeout(async () => {
        await axios.post("http://localhost:5000/cart", cartFood);
      }, 1000);
      return;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Display cart
const cartDisplay = async () => {
  try {
    const response = await axios.get("http://localhost:5000/cart");

    const cartFood = response.data;

    // Function to create cart item HTML

    const navCart = document.getElementById("navCart");
    navCart.innerHTML = cartFood.length;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
cartDisplay();
