// =================== INICIALIZAR CARRITO ===================
let carrito = [];
try {
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
} catch {
  carrito = [];
}

let total = 0;

// =================== ELEMENTOS DOM ===================
const carritoContenido = document.getElementById('carrito-contenido');
const carritoLateral = document.getElementById('carrito-lateral');
const btnCerrar = document.getElementById('cerrar-carrito');
const btnPagar = document.getElementById('btn-pagar');
const carritoBtn = document.getElementById('carrito');
const btnVaciar = document.getElementById('vaciar-carrito');

// Contador visual en ícono carrito
const contadorProductos = document.createElement('span');
contadorProductos.id = 'contador-productos';
contadorProductos.style.marginLeft = '5px';
if (carritoBtn) carritoBtn.appendChild(contadorProductos);

// =================== EVENTOS DE INTERFAZ ===================
if (carritoBtn && carritoLateral) {
  carritoBtn.addEventListener('click', () => carritoLateral.style.right = '0');
}
if (btnCerrar) {
  btnCerrar.addEventListener('click', () => carritoLateral.style.right = '-300px');
}

// =================== BOTONES AGREGAR ===================
const btnsAgregar = document.querySelectorAll('.btn-agregar-carrito');
btnsAgregar.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.card');
    const nombre = card.querySelector('.card-title')?.textContent.trim();
    let precioTexto = card.querySelector('.card-price')?.value.trim().replace(/[^0-9.,]/g, '').replace(',', '.');
    const precio = parseFloat(precioTexto);
    const imgElement = card.querySelector('img');
    const imagen = imgElement ? imgElement.src : 'https://via.placeholder.com/50?text=No+Img';

    if (!isNaN(precio) && nombre) {
      agregarAlCarrito({ nombre, precio, imagen });
    } else {
      alert('Error: Producto inválido');
    }
  });
});

// =================== FUNCIONES ===================

// Formatear precio como COP sin decimales
function formatearCOP(valor) {
  return `$${valor.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar producto
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.nombre === producto.nombre);
  if (existente) {
    existente.cantidad = Number(existente.cantidad) + 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  guardarCarrito();
  actualizarCarrito();
  actualizarCarritoVista();
}

// Eliminar producto individual
function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito();
  actualizarCarrito();
  actualizarCarritoVista();
}

// Vaciar carrito completo
if (btnVaciar) {
  btnVaciar.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito ya está vacío.');
    } else if (confirm('¿Estás seguro de vaciar el carrito?')) {
      carrito = [];
      guardarCarrito();
      actualizarCarrito();
      actualizarCarritoVista();
    }
  });
}

// Mostrar productos en carrito lateral
function actualizarCarrito() {
  if (!carritoContenido) return;
  carritoContenido.innerHTML = '';
  total = 0;
  let cantidadTotal = 0;

  carrito.forEach(producto => {
    const cantidad = Number(producto.cantidad) || 0;
    const subtotal = producto.precio * cantidad;
    total += subtotal;
    cantidadTotal += cantidad;

    const item = document.createElement('div');
    item.classList.add('item-carrito');
    item.innerHTML = `
      <img src="${producto.imagen}" width="50">
      <span style="margin-left: 10px;">x${cantidad}</span>
      <span style="margin-left: auto; font-weight: bold;">
        ${formatearCOP(subtotal)}
      </span>
    `;
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.style.marginLeft = '10px';
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(producto.nombre));
    item.appendChild(btnEliminar);
    carritoContenido.appendChild(item);
  });

  const totalDiv = document.createElement('div');
  totalDiv.style.marginTop = '15px';
  totalDiv.style.fontWeight = 'bold';
  totalDiv.textContent = `Total: ${formatearCOP(total)}`;
  carritoContenido.appendChild(totalDiv);

  if (contadorProductos) contadorProductos.textContent = cantidadTotal;
}

// Mostrar productos y total en página de pago
function actualizarCarritoVista() {
  const productosContainer = document.getElementById('carrito-productos');
  const totalCarritoSpan = document.querySelector('.container p:last-child .price b');
  if (!productosContainer || !totalCarritoSpan) return;

  productosContainer.innerHTML = '';
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    cantidadTotal += producto.cantidad;

    const p = document.createElement('p');
    p.innerHTML = `${producto.nombre} x${producto.cantidad} <span class="price">${formatearCOP(subtotal)}</span>`;
    productosContainer.appendChild(p);
  });

  totalCarritoSpan.textContent = formatearCOP(total);
}

// Mostrar en `pago.html`
function mostrarProductosPago() {
  const productosContainer = document.getElementById('productos');
  const totalDivPago = document.getElementById('total');

  if (!productosContainer || !totalDivPago) return;

  productosContainer.innerHTML = '';
  if (carrito.length === 0) {
    productosContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalDivPago.textContent = 'Total a pagar: $0';
    return;
  }

  let totalPago = 0;
  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    totalPago += subtotal;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="card-body">
        <h3 class="card-title">${producto.nombre}</h3>
        <p>Cantidad: ${producto.cantidad}</p>
        <p>Precio unitario: ${formatearCOP(producto.precio)}</p>
        <p><strong>Subtotal:</strong> ${formatearCOP(subtotal)}</p>
      </div>
    `;
    productosContainer.appendChild(card);
  });

  totalDivPago.textContent = `Total a pagar: ${formatearCOP(totalPago)}`;
}

// Método de pago (solo si lo necesitas)
function escucharMetodoPago() {
  const radios = document.getElementsByName('metodo-pago');
  radios.forEach(radio => {
    radio.addEventListener('change', e => {
      console.log('Método de pago:', e.target.value);
    });
  });
}

// Redirección al pago
if (btnPagar) {
  btnPagar.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
    } else {
      window.location.href = 'pago.html';
    }
  });
}

// =================== INICIAR ===================
document.addEventListener('DOMContentLoaded', () => {
  actualizarCarrito();
  actualizarCarritoVista();

  if (document.getElementById('productos') && document.getElementById('total')) {
    mostrarProductosPago();
    escucharMetodoPago();
  }
});

document.getElementById('carrito').addEventListener('click', function() {
  document.getElementById('carrito-lateral').classList.toggle('activo');
});
