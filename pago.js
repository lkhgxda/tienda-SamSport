document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario se envíe

    // Validación básica
    const campos = [
      { id: "fname", nombre: "Nombre completo" },
      { id: "email", nombre: "Correo electrónico" },
      { id: "adr", nombre: "Dirección" },
      { id: "city", nombre: "Departamento" },
      { id: "state", nombre: "Ciudad" },
      { id: "zip", nombre: "Código Postal" },
      { id: "cname", nombre: "Nombre en la tarjeta" },
      { id: "ccnum", nombre: "Número de tarjeta" },
      { id: "expmonth", nombre: "Mes de expiración" },
      { id: "expyear", nombre: "Año de expiración" },
      { id: "cvv", nombre: "CVV" }
    ];

    let errores = [];

    campos.forEach(campo => {
      const input = document.getElementById(campo.id);
      if (!input.value.trim()) {
        errores.push(`- ${campo.nombre} es obligatorio.`);
      }
    });

    // Validación de número de tarjeta
    const tarjeta = document.getElementById("ccnum").value.trim();
    const tarjetaRegex = /^[0-9]{4}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
    if (tarjeta && !tarjetaRegex.test(tarjeta)) {
      errores.push("- El número de tarjeta no es válido.");
    }

    // Validación de correo electrónico
    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      errores.push("- El correo electrónico no es válido.");
    }

    if (errores.length > 0) {
      alert("Por favor corrige los siguientes errores:\n\n" + errores.join("\n"));
      return;
    }

    // Simula el proceso de pago
    alert("✅ Pago procesado correctamente. ¡Gracias por tu compra!");

    // Opcional: Redireccionar después del pago
    // window.location.href = "gracias.html";
  });
});
