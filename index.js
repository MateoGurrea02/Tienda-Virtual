let contadorCarrito = document.getElementById('contadorCarrito')
async function getAllProducts(){
  let response = await fetch('https://fakestoreapi.com/products')
  let info = await response.json()
  renderProducts(info)
  contadorCarrito.innerText = obtenerProductosLocalStorage().length
}
async function getOneProduct(idProducto){
  let response = await fetch(`https://fakestoreapi.com/products/${idProducto}`)
  let info = await response.json()
  // renderProductos(info)
  console.log(info)
}
async function getAllCategories(){
  let response = await fetch(`https://fakestoreapi.com/products/categories`)
  let info = await response.json()
  renderCategories(info)
}
async function getProductsOneCategory(categoria){
  let response = await fetch(`https://fakestoreapi.com/products/category/${categoria}`)
  let info = await response.json()
  renderProducts(info)
}
const renderProducts = async (products) => {
  let container = document.getElementById('container')
  container.innerHTML = ""
  
  products.map((product)=>{
    let card = document.createElement('div')
    card.setAttribute('class','col-md-4 mt-2')
    
    card.innerHTML = `
      <div class="card justify-content-center">
        <div class="card-body">
          <div class="justify-content-center">
            <img src="${product.image}" id="imagen${product.id}" class="card-img img-fluid" style="width:300px; height:300px; object-fit:content;object-fit:content;" alt="">
          </div>
        </div>

        <div class="card-body bg-light text-center">
          <div class="mb-2">
            <h6 class="font-weight-semibold mb-2">
              <a href="#" class="text-default mb-2" data-abc="true">${product.title}</a>
            </h6>
            <a href="#" class="text-muted" data-abc="true">${product.category}</a>
          </div>
          ${renderStars(Math.round(product.rating.rate))}
          <h3 class="mb-0 font-weight-semibold">$${product.price}</h3>
          
          <button type="button" class="btn btn-success" id="agg${product.id}"><i class="fa fa-cart-plus mr-2"></i>Agregar al carrito</button>
        </div>
      </div>
    `
    container.appendChild(card)
    let btnAgregarAlCarrito = document.getElementById(`agg${product.id}`)
    btnAgregarAlCarrito.addEventListener('click',()=>{
      notificacionCarrito(product)

    })

    let imagenId = document.getElementById(`imagen${product.id}`)
    imagenId.addEventListener('click',()=>{
      renderDetalleProducto(product)
    })
  })

}
const renderStars = (num)=>{
  let div = document.createElement('div')
  for(let i=0; i < num;i++){
    let star = document.createElement('i')
    star.setAttribute('class','fa fa-star')
    div.appendChild(star)
  }
  return div.innerHTML;
}
const renderCategories = async (categories) => {
  let containerCategories = document.getElementById('containerCategories')
  categories.map((category)=>{
    let li = document.createElement('li')
    li.innerHTML = `<button class="dropdown-item" id="${category}">${category}</button>`
    containerCategories.appendChild(li)
  })

  categories.map((category)=>{
    let btn = document.getElementById(`${category}`)
    btn.addEventListener('click',()=>{
      getProductsOneCategory(category)
    })
  })


}
const obtenerProductosLocalStorage = () => {
  const productosString = localStorage.getItem('productos');
  return productosString ? JSON.parse(productosString).sort((a,b) => a.title.localeCompare(b.title)) : [];
};

const guardarProductosLocalStorage = (productos) => {
  localStorage.setItem('productos', JSON.stringify(productos));
};

const agregarAlCarrito = (producto)=>{
  let productos = obtenerProductosLocalStorage()
  
  if(productos == null){
    let lista = []
    lista.push(producto)
    guardarProductosLocalStorage(lista)
    contadorCarrito.innerText = obtenerProductosLocalStorage().length
  }else{
    if(productos.some((prod)=> prod.id === producto.id)){
      aumentarCantidad(producto,obtenerProductosLocalStorage())
    }else{
      productos.push(producto)
      guardarProductosLocalStorage(productos)
      contadorCarrito.innerText = obtenerProductosLocalStorage().length
    }
  }

}

const aumentarCantidad = (producto,productosStorage)=>{
  let nuevalista = productosStorage.filter((prod)=>prod.id != producto.id)
  let productoLocalStorage = productosStorage.filter((prod)=>prod.id === producto.id)
  producto.amount = productoLocalStorage[0].amount + 1
  nuevalista.push(producto)
  guardarProductosLocalStorage(nuevalista)
  contadorCarrito.innerText = obtenerProductosLocalStorage().length
}

const reducirCantidad = (producto,productosStorage)=>{
  let nuevalista = productosStorage.filter((prod)=>prod.id != producto.id)
  let productoLocalStorage = productosStorage.filter((prod)=>prod.id === producto.id)
  if(productoLocalStorage[0].amount <= 1){
    guardarProductosLocalStorage(nuevalista)
  }else{
    producto.amount = productoLocalStorage[0].amount - 1
    nuevalista.push(producto)
    guardarProductosLocalStorage(nuevalista)
  }
  contadorCarrito.innerText = obtenerProductosLocalStorage().length
}

const totalCarrito = (listaProductos)=>{
  localStorage.setItem('totalCarrito',0)
  let acumulador = 0
  listaProductos.map((producto) => {
    acumulador = acumulador + (producto.amount * producto.price)
    localStorage.setItem('totalCarrito',acumulador)
  })
}

let btnCarrito = document.getElementById('btnCarrito')
btnCarrito.addEventListener('click',()=>{
  let container = document.getElementById('container')
  container.innerHTML = ""

  let listaCarrito = obtenerProductosLocalStorage()
  let table = document.createElement('table')
  table.setAttribute('class','table table-striped')
  table.innerHTML = `
  <thead>
    <tr>
      <th scope="col">Producto</th>
      <th scope="col">Precio</th>
      <th scope="col">Cantidad</th>
    </tr>
  </thead>
  `
  let tbody = document.createElement('tbody')

  listaCarrito.map((producto) => {
    if(localStorage.getItem('totalCarrito') === null){
      localStorage.setItem('totalCarrito',producto.price)
    }

    totalCarrito(obtenerProductosLocalStorage())

    let tr = document.createElement('tr')
    tr.innerHTML =`
      <td scope="row">${producto.title}</td>
      <td>$${producto.price}</td>
      <td>
        <button class="btn" id="aumentar${producto.id}">+</button>
        <a id="cantidadProductos">${producto.amount}<a/>
        <button class="btn" id="reducir${producto.id}">-</button>  
      </td>      
    `
    tbody.appendChild(tr)    
    // localStorage.setItem('totalCarrito',acumulador)
  })
  console.log(Math.round(localStorage.getItem('totalCarrito')))
  table.appendChild(tbody)
  container.appendChild(table)

  let total = document.createElement('tbody')
  total.innerHTML = `
    <tr>
      <td></td>
      <th scope="col">Total</th>
      <td align="center">$${parseInt(localStorage.getItem('totalCarrito')).toFixed(2)}</td>
    </tr>
  `
  table.appendChild(total)

  listaCarrito.map((producto)=>{
    let btnAumentar = document.getElementById(`aumentar${producto.id}`)
    btnAumentar.addEventListener('click',()=>{
      aumentarCantidad(producto,obtenerProductosLocalStorage())
      totalCarrito(obtenerProductosLocalStorage())
      btnCarrito.click()
    })
    let btnReducir = document.getElementById(`reducir${producto.id}`)
    btnReducir.addEventListener('click',()=>{
      reducirCantidad(producto,obtenerProductosLocalStorage())
      totalCarrito(obtenerProductosLocalStorage())
      btnCarrito.click()
    })
  })

})

const renderDetalleProducto = (producto) => { 
  let body = document.querySelector('body')
  let div = document.createElement('div')
  div.setAttribute('class','detalleModal')
  div.innerHTML =`
  <div class="flex-column p-5 " style="width: 50%; height:70%; background-color:white;margin-top:10em; border-radius: 10px;">
    <div class="d-flex justify-content-end">
      <button type="button" id="btnCerrarDetalle${producto.id}" class="btn-close" aria-label="Close"></button>
    </div>
    <div class="d-flex flex-column text-center align-items-center">
      <img src="${producto.image}" class="" style="width:300px; height:300px; object-fit:content;" alt="">
      <h5 class="card-title">${producto.title}</h5>
      <p class="card-text">${producto.description}</p>
      <div class="d-flex mb-2">
        ${renderStars(Math.round(producto.rating.rate))}
      </div>
      <p class="card-text">Precio: $${producto.price}</p>
      <button type="button" class="btn btn-success" id="${producto.id}"><i class="fa fa-cart-plus mr-2"></i>Agregar al carrito</button>
    </div>
  </div>
  `
  body.appendChild(div)
  let btnAgregarAlCarrito = document.getElementById(`${producto.id}`)
  btnAgregarAlCarrito.addEventListener('click',()=>{
    notificacionCarrito(producto)
    div.remove()
  })

  let btnCerrarDetalle = document.getElementById(`btnCerrarDetalle${producto.id}`)
  btnCerrarDetalle.addEventListener('click',()=>{
    div.remove()
  })
}

const notificacionCarrito = (product)=>{
  let body = document.querySelector('body')
  let notificacion = document.createElement('div')
  notificacion.setAttribute('class','alert alert-success fixed-top')
  notificacion.setAttribute('role','alert')
  notificacion.innerHTML = `<i class="fa-solid fa-check"></i> Producto agregado al carrito`
  notificacion.style.transition = "visibility 0s, opacity 0.5s linear"
  notificacion.style.margin = '5em 0em 5em 2em'
  notificacion.style.width = '20%'
  body.appendChild(notificacion)

  setTimeout(function() {
    /* Hacemos desaparecer el mensaje suavemente */
    notificacion.style.opacity = 0;
    /* Tras 0.5 segundos (500 ms) de la animación cargamos la web de destino */
    setTimeout(function() {
      notificacion.style.visibility = 'hidden';
    }, 500);
  }, 3000);

  let producto = {
    id:product.id,
    title:product.title,
    price:product.price,
    amount: 1,
  }
  agregarAlCarrito(producto)
}

getAllProducts()
getAllCategories()

