        const btnPagar = document.getElementById('btnPagar');
        const btnAbrir = document.getElementById('btnAbrir');
        const btnCerrar = document.getElementById('btnCerrar');
        const carritoLateral = document.getElementById('carritoLateral');
        const listaCarrito = document.getElementById('listaCarrito');
        const cantidadObjetos = document.getElementById('cantidadObjetos');
        const totalCarrito = document.getElementById('totalCarrito');

        // 👉 CAMBIO 1: Cargar el carrito desde la memoria al abrir la página
        // Si no hay nada guardado, empieza como un arreglo vacío []
        let carrito = JSON.parse(localStorage.getItem('carritoCompartido')) || [];


        // Abrir y cerrar carrito (Se añade validación por si estos elementos no existen en alguna página)
        if (btnAbrir && carritoLateral) {
            btnAbrir.addEventListener('click', () => carritoLateral.classList.add('abierto'));
        }
        if (btnCerrar && carritoLateral) {
            btnCerrar.addEventListener('click', () => carritoLateral.classList.remove('abierto'));
        }

        // Abrir y cerrar carrito
        btnAbrir.addEventListener('click', () => carritoLateral.classList.add('abierto'));
        btnCerrar.addEventListener('click', () => carritoLateral.classList.remove('abierto'));

        // Agregar producto desde el HTML
        document.querySelectorAll('.btn-agregar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const tarjeta = e.target.closest('.perfume-info');
                const id = tarjeta.dataset.id;
                const nombre = tarjeta.dataset.nombre;
                const precio = parseFloat(tarjeta.dataset.precio);

                const productoExistente = carrito.find(item => item.id === id);
                if (productoExistente) {
                    productoExistente.cantidad++;
                } else {
                    carrito.push({ id, nombre, precio, cantidad: 1 });
                }
                actualizarCarrito();
            });
        });

        // Cambiar cantidad o eliminar
        function cambiarCantidad(id, cambio) {
            const producto = carrito.find(item => item.id === id);
            if (!producto) return;

            producto.cantidad += cambio;
            if (producto.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== id);
            }
            actualizarCarrito();
        }

        function eliminarProducto(id) {
            carrito = carrito.filter(item => item.id !== id);
            actualizarCarrito();
        }

        // Renderizar el carrito en pantalla
        function actualizarCarrito() {
            // 👉 CAMBIO 2: Guardar el estado actual del carrito en la memoria cada vez que se actualiza
            localStorage.setItem('carritoCompartido', JSON.stringify(carrito));

            // Validamos que 'listaCarrito' exista en el HTML de la página actual antes de intentar dibujar
            if (listaCarrito) {
            listaCarrito.innerHTML = '';
            }
            listaCarrito.innerHTML = '';
            let total = 0;
            let cantidadTotal = 0;

            carrito.forEach(item => {
                total += item.precio * item.cantidad;
                cantidadTotal += item.cantidad;

                const div = document.createElement('div');
                div.classList.add('item-carrito');
                div.innerHTML = `
                    <span>${item.nombre} ($${item.precio}) x ${item.cantidad}</span>
                    <div>
                        <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
                        <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
                        <button onclick="eliminarProducto('${item.id}')">🗑️‍</button>
                    </div>
                `;
                listaCarrito.appendChild(div);
            });

            contadorCarrito.textContent = cantidadTotal;
            totalCarrito.textContent = total;
        }

       
        const modalFormulario = document.getElementById('modalFormulario');
        const cerrarModal = document.getElementById('cerrarModal');
        // 👉 CAMBIO 3: Ejecutar la función inmediatamente al cargar la página 
        // para que pinte los productos guardados previamente
        actualizarCarrito();

// Abrir el formulario al hacer clic en el botón
    btnPagar.addEventListener('click', () => {
     modalFormulario.style.display = 'flex';
});

// Cerrar el formulario al hacer clic en la "X"
    cerrarModal.addEventListener('click', () => {
        modalFormulario.style.display = 'none';
});

// Cerrar el formulario si el usuario hace clic fuera de la caja blanca
    window.addEventListener('click', (e) => {
     if (e.target === modalFormulario) {
          modalFormulario.style.display = 'none';
    }
});

// (Opcional) Capturar el envío del formulario
    document.getElementById('formCheckout').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Compra procesada con éxito!');
        modalFormulario.style.display = 'none';
    // Aquí puedes agregar tu lógica para enviar los datos con fetch() o limpiar el carrito
});

// Aquí puedes agregar tu lógica para enviar los datos con fetch() o limpiar el carrito

const imagenes = document.querySelectorAll(".abrir-modal");

imagenes.forEach(function(imagen) {
  imagen.addEventListener("click", function() {
    // Busca el modal dentro de la misma tarjeta
    const tarjeta = imagen.closest(".perfume-card");
    const modal = tarjeta.querySelector(".modal");

    modal.style.display = "flex";
  });
});

const botonesCerrar = document.querySelectorAll(".cerrar-modal");

botonesCerrar.forEach(function(boton) {
  boton.addEventListener("click", function() {
    const tarjeta = boton.closest(".perfume-card");
    const modal = tarjeta.querySelector(".modal");

    modal.style.display = "none";
  });
});

const modales = document.querySelectorAll(".modal");

modales.forEach(function(modal) {
  modal.addEventListener("click", function(evento) {
    if (evento.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Correo electronico

// Inicializa EmailJS con tu clave pública
    emailjs.init({
        publicKey: "nx3OglevwyewtJx5p"
    });

    const contactForm = document.getElementById("contactForm");
    const submitButton = document.getElementById("submitButton");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Como el formulario tiene novalidate, validamos manualmente
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        formMessage.textContent = "";

        emailjs.sendForm(
            "service_bgt0hph",
            "template_dbwokrl",
            contactForm
        )
        .then(function() {
            formMessage.textContent = "Mensaje enviado correctamente.";
            formMessage.style.color = "green";

            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = "Enviar Mensaje";
        })
        .catch(function(error) {
            console.error("Error:", error);

            formMessage.textContent =
                "No se pudo enviar el mensaje. Inténtalo de nuevo.";
            formMessage.style.color = "red";

            submitButton.disabled = false;
            submitButton.textContent = "Enviar Mensaje";
        });
    });

 
    



