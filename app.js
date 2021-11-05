// Carousel
var myCarousel = document.querySelector("#myCarousel");
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 3500,
  pause: false,
});
// End of Carousel

// Variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
// End of variables

// Cart
let cart = [];

//Buttons
let buttonsDOM = [];
//End of Cart

//Getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
//End of Getting the products

//Display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
        <!-- Single product -->
            <article class="products">
                <div class="img-container">
                    <div class="bckground-product col">
                        <div class="d-flex justify-content-center">
                            <img class="flaticon-products pt-5 pb-3" src="img/hairdryer.png" alt="">
                        </div>
                        <div class="d-flex justify-content-center">
                            <div class="horiz-line"></div>
                        </div>
                        <div class="d-flex justify-content-center">
                            <h3 class="product-title pt-3">${product.title}</h3>
                        </div>
                        <div class="d-flex justify-content-center">
                            <h6 class="product-description text-center pt-1">Servicio completo sssss de peluquería</h6>
                        </div>
                        <img src=${product.image} alt="" class="product-img">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
                <div>
                    <h4 class="product-price pt-1">COP $ 100.000</h4>
                </div>
            </article>
            <!--------------- end of single product --------------->
        `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "Ya en tu carro";
        event.target.disabled = true;
        //Get product from products
        let cartItems = { ...Storage.getProduct(id), amount: 1 };

        //Add product to the cart
        cart = [...cart, cartItems];

        //Save the car in local storage
        Storage.saveCart(cart);
        //Set cart values
        this.setCartValues(cart);
        //Display cart itmes
        //Show the cart
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = parseInt(itemsTotal);
    console.log(cartTotal);
    console.log(cartItems);
  }
}
//End of Display products

//Local storage

//End of Local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}
//
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  // products.getProducts().then((data) => console.log(products));
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
