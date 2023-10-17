//Simulador Compra de supermercado online.



//Clase constructora y sus respectivos atributos y metodos
class Producto {
    constructor(id, nombre, precio, categoria, marca, imagen){
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.categoria = categoria,
        this.marca = marca,
        this.imagen = imagen,
        this.cantidad = 1
    }
    //Metodos
    sumarUnidad(){
        this.cantidad++
        return this.cantidad
    }
    restarUnidad(){
        this.cantidad = this.cantidad - 1
        return this.cantidad
    }
}


const cargarGondola = async()=>{
    const resp = await fetch("producto.json")
    const dataProducto = await resp.json()
    for(let product of dataProducto){
        let productonuevo = new Producto(product.id, product.nombre, product.precio, product.categoria, product.marca, product.imagen)
        gondola.push(productonuevo)
    }
    localStorage.setItem("gondola", JSON.stringify(gondola))
}



//Declaracion de contenedor de objetos
let gondola = []
//Modificacion de Storage y push de objetos
if(localStorage.getItem("gondola")){
    for(let product of JSON.parse(localStorage.getItem("gondola"))){
        let productStorage = new Producto(product.id, product.nombre, product.precio, product.categoria, product.marca, product.imagen)
        gondola.push(productStorage)
    }
}else{
    cargarGondola(gondola)
}

//Captura de DOM
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) ?? []
let containerProductos = document.getElementById("productos")
let formInsertarNuevoProducto = document.getElementById("formInsertarNuevoProducto")
let guardarProductoBtn = document.getElementById("guardarProductoBtn")
let selectOrden = document.getElementById("selectOrden")
let modalbodyCarrito = document.getElementById("modalbodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")
let fechaDiv = document.getElementById("fecha")
let loaderTexto = document.getElementById("loaderTexto")
let loader = document.getElementById("loader")


//Lista de Productos mostrada en DOM
function listaProductos(array){
    containerProductos.innerHTML = ""
    for(let producto of array){
        //Card Visualizada en el DOM
        let ProductoNuevoDiv= document.createElement("div")
        ProductoNuevoDiv.className = "col-12 col-md-6 col-lg-4 my-2"
        ProductoNuevoDiv.innerHTML = `
            <div id="${producto.id}" class="card" style="width: 18rem;">
                    <img class="card-img-top img-fluid" style="height: 200px;"src="img/${producto.imagen}" alt="${producto.nombre}">
                    <div class="card-body">
                        <h4 class="card-title">${producto.nombre}</h4>
                        <p>Categoria: ${producto.categoria}</p>
                        <p>Marca: ${producto.marca}</p>
                        <p class="">Precio: ${producto.precio}</p>
                    <button id="agregarBtn${producto.id}" class="btn btn-outline-success">Agregar al carrito</button>
                    </div>
        </div> `
        containerProductos.append(ProductoNuevoDiv)
        let agregarBtn = document.getElementById(`agregarBtn${producto.id}`)
        agregarBtn.addEventListener("click", () => {
            agregarAlCarrito(producto)
        })
    }
}


//Funcion Agregar al carrito.
function agregarAlCarrito(elemento){
    let productoagregado  = productosCarrito.find((producto) => producto.id == elemento.id)

    productoagregado == undefined ?
    (
        productosCarrito.push(elemento),
        localStorage.setItem("carrito", JSON.stringify(productosCarrito)),
        Toastify({
            text: `El producto ${elemento.nombre} ha sido sumado al carrito`,
            duration: 3000,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast()) :
          Toastify({
            text: `El producto ${elemento.nombre} ya existe en el carrito`,
            duration: 2500,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, red, orange)",
              color: "black",
              fontWeight: "bold"
            },
          }).showToast()
}
//Funcion que permite visulizar las cards de los prductos que agregamos al carrito y ademas permite sumar, restar o eliminar productos del mismo.
function agregarProdCarrito(array){
    modalbodyCarrito.innerHTML = ""
    array.forEach(
        (productoCarrito) => {
        modalbodyCarrito.innerHTML += `<div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">

        <img class="card-img-top" height="300px" src="img/${productoCarrito.imagen}" alt="">

        <div class="card-body">

               <h4 class="card-title">${productoCarrito.nombre}</h4>

               <p class="card-text">${productoCarrito.marca}</p> 
               
               <p class="card-text">${productoCarrito.categoria}</p>

               <p class="card-text">Precio por Unidad $${productoCarrito.precio}</p> 

               <p class="card-text">Total de Unidades ${productoCarrito.cantidad}</p>
               <p class="card-text">Subtotal ${productoCarrito.cantidad * productoCarrito.precio}</p>
                <button class= "btn btn-dark" id="botonSumarUnidad${productoCarrito.id}"><i class=""></i>+1</button>
                <button class= "btn btn-dark" id="botonEliminarUnidad${productoCarrito.id}"><i class=""></i>-1</button>
                <button class= "btn btn-dark" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>

        </div>    

   </div>`
    }) 

    array.forEach(
        (productoCarrito) => {
            document.getElementById(`botonSumarUnidad${productoCarrito.id}`).addEventListener("click",()=>{
                productoCarrito.sumarUnidad()
                localStorage.setItem("carrito", JSON.stringify(array))
                agregarProdCarrito(array)
            })
            document.getElementById(`botonEliminarUnidad${productoCarrito.id}`).addEventListener("click",
            ()=>{
                let cantidadActual = productoCarrito.cantidad
                if(cantidadActual <= 1){
                    let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
                    cardProducto.remove()
                    let posicion = array.indexOf(productoCarrito)
                    array.splice(posicion, 1)
                    localStorage.setItem("carrito", JSON.stringify(array))
                    calcularTotal(array)
                }else{
                    productoCarrito.restarUnidad()
                }
                localStorage.setItem("carrito", JSON.stringify(array))
                agregarProdCarrito(array)
            })
            document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () =>{
                let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
                cardProducto.remove()
                let posicion = array.indexOf(productoCarrito)
                array.splice(posicion, 1)
                localStorage.setItem("carrito", JSON.stringify(array))
                calcularTotal(array) 
            })
        }
    )
    calcularTotal(array)    
}


//Funcion que calcula el total parcial y final del carrito.
function calcularTotal(array){
    const totalReduce = array.reduce(
        (acumulador, producto)=>
        {return acumulador + (producto.precio * producto.cantidad)},
        0
    )
    totalReduce > 0 ? precioTotal.innerHTML = `<strong>El total de su compra es: ${totalReduce}</strong>` : precioTotal.innerHTML = `No hay productos en el carrito` 
    return totalReduce
}


//Funcion para agregar un producto nuevo
function agregarProducto(array){
    let nombre = document.getElementById("nombreInput")
    let precio = document.getElementById("precioInput")
    let categoria = document.getElementById("categoriaInput")
    let marca = document.getElementById("marcaInput")

    const nuevoProducto = new Producto(gondola.length+1, nombre.value, parseInt(precio.value),categoria.value, marca.value, "productonuevo.png")
    array.push(nuevoProducto)
    nombre.value=""
    precio.value=""
    categoria.value=""
    marca.value=""

    Swal.fire({
        title: "Excelente has agregado un nuevo producto",
        text: `El producto ${nuevoProducto.nombre} de la categoria ${nuevoProducto.categoria.toLowerCase()} se ha añadido a la gondola.`,
        imageUrl: `img/${nuevoProducto.imagen}`,
        imageHeight: 350,
        imageAlt: `Imagen Producto Nuevo`,
        showConfirmButton: false,
        timer: 2500
    })
    localStorage.setItem("gondola", JSON.stringify(gondola))
}

// Funcion que finalzia la compra y muestra un cartel emergente que avisa el evento.
function finalizarCompra(array){
    let total = calcularTotal(array)
    Swal.fire({
        text: `Gracias por su compra. Su total fue: ${total}`
    })
    productosCarrito = []
    localStorage.removeItem("carrito")
}

//Funcion que filtra por nombre los productos que el usuario busca a traves del sitio.
function buscarInfo(buscado,array){
   let coincidencias =  array.filter(
        (producto) => {return producto.nombre.toLowerCase().includes(buscado.toLowerCase()) || producto.categoria.toLowerCase().includes(buscado.toLowerCase())}
    )
    coincidencias.length > 0 ? (listaProductos(coincidencias), coincidenciasDiv.innerHTML ="") : (listaProductos(array), coincidencias.innerHTML = `<h3>No hay coincidencias con su búsqueda, este es nuestro catálogo completo</h3>`)
}


//Funcion para filtrar productos por categoria
function buscarCategoria(array){
    console.log("CATEGORIAS")
    for(let producto of array){
        console.log(producto.categoria)
    }
    let categoriaBuscada = prompt(`Escriba el nombre de la categoria que busca`)
    let busqueda = array.filter(
        (producto) => producto.categoria.toLowerCase() == categoriaBuscada.toLowerCase()
    )
    if (busqueda.length == 0){
        console.log(`No contamos con productos de la categoria ${categoriaBuscada}`)
    }
    else{
        listaProductos(busqueda)
    }    
}

//Funcion para comprar el precio de un mismo producto, a su vez ordena los productos de menor a mayor precio
function compararPrecioMenorAMayor(array){
    let productoComparar = prompt(`Escriba el producto a comparar`)
    let busqueda = array.filter(
        (producto) => producto.nombre.toLowerCase() == productoComparar.toLowerCase()
    )
    let arrayMayorMenor = busqueda.concat()

        arrayMayorMenor.sort(
            (prec1, prec2) => prec1.precio - prec2.precio
        )
    if (busqueda.length == 0){
        console.log(`No es posible comparar ese producto ya que no existe en nuestra tienda`)
    }
    else{
        listaProductos(arrayMayorMenor)
    }    
}

//Funcion para comparar precios de un mismo producto, a su vez lo ordena de mayor a menor precio
function compararPrecioMayorAMenor(array){
    let productoComparar = prompt(`Escriba el producto a comparar`)
    let busqueda = array.filter(
        (producto) => producto.nombre.toLowerCase() == productoComparar.toLowerCase()
    )
    let arrayMenorMayor = busqueda.concat()

        arrayMenorMayor.sort(
            (prec1, prec2) => prec2.precio - prec1.precio
        )
    if (busqueda.length == 0){
        Swal.fire({
            title: `No es posible comparar ese producto ya que no existe en nuestra tienda`,
        })
    }
    else{
        listaProductos(arrayMenorMayor)
    }    
}

//Menu switch para ordenar la lista de productos
selectOrden.addEventListener("change", () => {
    switch(selectOrden.value){
        case "1":
            //Compara precio de mayor a menor
            compararPrecioMayorAMenor(gondola)
            break
        case "2":
            //Compara precio de menor a mayor
            compararPrecioMenorAMayor(gondola)
            break
        case "3":
            //filtrar por categoria
            buscarCategoria(gondola)
            break
        default:
            listaProductos(gondola)
            break
    }
})
//Eventos
botonCarrito.addEventListener("click", () => {
    agregarProdCarrito(productosCarrito)
})

guardarProductoBtn.addEventListener("click", () => 
{
    agregarProducto(gondola)
    listaProductos(gondola)
})

buscador.addEventListener("input", () => {
    console.log(buscador.value)
    buscarInfo(buscador.value,gondola)
})
botonFinalizarCompra.addEventListener("click", () => {
    finalizarCompra(productosCarrito)
})

setTimeout(()=>{
    loaderTexto.innerText = `Productos Disponibles`
    loader.remove()
    listaProductos(gondola)
},5000)
