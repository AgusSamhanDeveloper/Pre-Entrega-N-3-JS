//Simulador de compras
//Se busca simular un sitio de compras online de articulos de supermercado
//Creacion de clase constructora
class Producto {
    constructor(id, nombre, precio, categoria, marca, imagen){
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.categoria = categoria,
        this.marca = marca,
        this.imagen = imagen 
    }
}

//Instanciacion de objetos

const producto1 = new Producto(1, "Jabon", 300, "Limpieza", "Skip", "skip.png")
const producto2 = new Producto(2, "Desodorante", 500, "Higiene", "Rexona", "rexona.png")
const producto3 = new Producto(3, "Dentrifico", 350, "Higiene", "Colgate", "dentrifico.webp")
const producto4 = new Producto(4, "Leche", 550, "Alimentos", "Milkaut", "lecheMilkaut.png")
const producto5 = new Producto(5, "Yerba", 700, "Alimentos", "Playadito", "playadito.png")
const producto6 = new Producto(6, "Agua", 650, "Bebidas", "Villa del Sur", "villa.png")
const producto7 = new Producto(7, "Galletas Surtidas", 300, "Alimentos", "Bagley", "surtidas.jpg")
const producto8 = new Producto(8, "Azucar", 250, "Alimentos", "Arcor", "azucar.png")
const producto9 = new Producto(9, "Detergente", 100, "Limpieza", "Ala", "detergente.png")
const producto10 = new Producto(10, "Jugo", 1200, "Bebidas", "Citric", "jugo.png")

//Declaracion de contenedor de objetos
let gondola = []
//Modificacion de Storage y push de objetos
if(localStorage.getItem("gondola")){
    for(let product of JSON.parse(localStorage.getItem("gondola"))){
        let productStorage = new Producto(product.id, product.nombre, product.precio, product.categoria, product.marca, product.imagen)
        gondola.push(productStorage)
    }
}else{
    gondola.push(producto1,producto2,producto3,producto4,producto5,producto6,producto7,producto8,producto9,producto10)
    localStorage.setItem("gondola", JSON.stringify(gondola))
}

//Captura por ID
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? []
let supermercado = JSON.parse(localStorage.getItem("gondola")) || ([].push(producto1,producto2,producto3,producto4,producto5,producto6,producto7,producto8,producto9,producto10))
let formInsertarNuevoProducto = document.getElementById("formInsertarNuevoProducto")
let guardarProductoBtn = document.getElementById("guardarProductoBtn")
let containerProductos = document.getElementById("productos")
let modalbodyCarrito = document.getElementById("modalbodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")

//Funcion para agregar un producto nuevo
function agregarProducto(array){
    let nombre = document.getElementById("nombre_del_productoInput")
    let precio = document.getElementById("precioInput")
    let categoria = document.getElementById("categoriaInput")
    let marca = document.getElementById("marcaInput")

    const nuevoProducto = new Producto(gondola.length+1, nombre.value, parseInt(precio.value),categoria.value, marca.value, "productonuevo.png")
    array.push(nuevoProducto)
    nombre.value=""
    precio.value=""
    categoria.value=""
    marca.value=""
    localStorage.setItem("gondola", JSON.stringify(gondola))
}
guardarProductoBtn.addEventListener("click", () => 
{
    agregarProducto(gondola)
    listaProductos(gondola)
})

//Funcion para eliminar un producto

function eliminarProducto(array){
    listaProductos(array)
    let idEliminar = parseInt(prompt(`Elija por ID el articulo que desea eliminar`))
    for (let elem of array){
        if(elem.id == idEliminar){
            let indice = array.indexOf(elem)
            array.splice(indice, 1)
            listaProductos(array)
        }
    }
}


//Lista de Productos mostrada en DOM

function listaProductos(array){
    containerProductos.innerHTML = ""
    for(let producto of array){
        
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
    let productoagregado  = carrito.find((producto) => producto.id == elemento.id)

    productoagregado == undefined ?
    (
        carrito.push(elemento),
        localStorage.setItem("carrito", JSON.stringify(carrito)),
        console.log(carrito)) :
        alert(`El producto ${elemento.nombre} ya existe en el carrito`)
}
function agregarProdCarrito(array){
    modalbodyCarrito.innerHTML = ""
    array.forEach((productoCarrito) => {
        modalbodyCarrito.innerHTML += `<div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">

        <img class="card-img-top" height="300px" src="img/${productoCarrito.imagen}" alt="">

        <div class="card-body">

               <h4 class="card-title">${productoCarrito.nombre}</h4>

               <p class="card-text">${productoCarrito.marca}</p> 
               
               <p class="card-text">${productoCarrito.categoria}</p>

               <p class="card-text">$${productoCarrito.precio}</p> 
               
                <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>

        </div>    

   </div>`
    })
    calcularTotal(array)
}



function calcularTotal(array){
    //function con spread (no necesariamente debe ser así)
    
    const totalReduce = array.reduce(
        //dos parámetros: funcion e inicio de valor del acumulador
        //atención que si su carrito maneja cantidad, debe ser precio *cantidad
        (acumulador, producto)=>
        {return acumulador + producto.precio},
        0
    )
    totalReduce > 0 ? precioTotal.innerHTML = `<strong>El total de su compra es: ${totalReduce}</strong>` : precioTotal.innerHTML = `No hay productos en el carrito` 
}

//Funcion para buscar productos a traves del nombre
function buscarProducto(array){
    let productoBuscado = prompt("Ingresa el nombre del producto que buscas")
    let busqueda = array.find(
        (elem) =>{return elem.nombre.toLowerCase() == productoBuscado.toLowerCase()}
    )
    if (busqueda == undefined){
        alert(`Lo sentimos, no contamos con stock de ${productoBuscado}`)
    }else{
        alert(busqueda)
    }
}

function buscarInfo(buscado,array){
   let coincidencias =  array.filter(
        (producto) => {return producto.nombre.toLowerCase().includes(buscado.toLowerCase()) || producto.categoria.toLowerCase().includes(buscado.toLowerCase())}
    )
    coincidencias.length > 0 ? (console.log(coincidencias), listaProductos(coincidencias)) : listaProductos(array), coincidencias
}

buscador.addEventListener("input", () => {
    console.log(buscador.value)
    buscarInfo(buscador.value,gondola)
})

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
        console.log(`No es posible comparar ese producto ya que no existe en nuestra tienda`)
    }
    else{
        listaProductos(arrayMenorMayor)
    }    
}

//Menu switch para ordenar la lista de productos
let selectOrden = document.getElementById("selectOrden")
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
botonCarrito.addEventListener("click", () => {
    agregarProdCarrito(carrito)
})

listaProductos(gondola)