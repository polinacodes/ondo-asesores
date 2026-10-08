"use strict";

/* =========================================================
   ONDO ASESORES
   Vanilla JS
   - Menú responsive
   - Validación del formulario
   El script se carga con defer, así que el DOM ya está listo.
   ========================================================= */


/* =========================================================
   MENÚ RESPONSIVE
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#main-menu");

if (menuToggle && navMenu) {

  // Mismo punto de corte que el CSS (menú móvil hasta 1024 px)
  const mobileQuery = window.matchMedia("(max-width: 1024px)");

  const setMenu = (open) => {
    navMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";

    setMenu(open);

    if (open) {
      navMenu.querySelector("a").focus();
    }
  });

  // Al elegir un enlace, el menú se cierra
  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {

    if (!navMenu.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      setMenu(false);
      menuToggle.focus();
      return;
    }

    // El foco se queda dentro del menú mientras está abierto
    if (event.key === "Tab") {
      const focusable = [menuToggle, ...navMenu.querySelectorAll("a")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Clic fuera del menú
  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenu(false);
    }
  });

  // Al pasar a escritorio, el menú se reinicia
  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      setMenu(false);
    }
  });
}


/* =========================================================
   VALIDACIÓN DEL FORMULARIO
   ========================================================= */

const form = document.querySelector("#contact-form");

if (form) {

  const successMessage = document.querySelector("#form-success");

  const countDigits = (text) => text.replace(/\D/g, "").length;

  /*
   * Una regla por campo. Recibe el campo y devuelve el mensaje
   * de error, o "" si el valor es correcto.
   * El mensaje se escribe en #<nombre>-error.
   */
  const rules = {

    nombre: (field) => {
      const value = field.value.trim();

      if (!value) return "Introduce tu nombre.";
      if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
      return "";
    },

    telefono: (field) => {
      const value = field.value.trim();

      if (!value) return "Introduce tu número de teléfono.";

      const digits = countDigits(value);
      const validChars = /^[+0-9\s().-]+$/.test(value);

      if (!validChars || digits < 9 || digits > 15) {
        return "Introduce un teléfono válido, con al menos 9 cifras.";
      }
      return "";
    },

    correo: (field) => {
      const value = field.value.trim();

      if (!value) return "Introduce tu correo electrónico.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Introduce un correo electrónico válido.";
      }
      return "";
    },

    negocio: (field) =>
      field.value ? "" : "Selecciona el tipo de negocio.",

    privacidad: (field) =>
      field.checked ? "" : "Debes aceptar la política de privacidad."
  };

  const fieldNames = Object.keys(rules);

  const validate = (name) => {
    const field = form.elements[name];
    const error = document.getElementById(`${name}-error`);
    const message = rules[name](field);

    error.textContent = message;

    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }

    return !message;
  };

  // Validación al salir del campo (o al cambiar, en select y casilla)
  fieldNames.forEach((name) => {
    const field = form.elements[name];
    const eventName = field.matches("select, [type='checkbox']") ? "change" : "blur";

    field.addEventListener(eventName, () => validate(name));
  });

  form.addEventListener("submit", (event) => {

    event.preventDefault();
    successMessage.classList.remove("is-visible");

    // Se valida todo (sin cortar en el primer error) para mostrar todos los mensajes
    const results = fieldNames.map(validate);

    if (results.includes(false)) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    /*
     * Demo frontend: no se envían datos a ningún servidor.
     * En una implementación real, aquí se conectaría una API
     * o un servicio de formularios.
     */

    successMessage.classList.add("is-visible");
    successMessage.focus();
    form.reset();
  });
}