// ============================================
// EL CÓDIGO DE LA INSULINA - APP.JS
// Lógica completa: registro, login, tests, PDF, WhatsApp
// ============================================

// ===== REFERENCIAS DOM =====
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const goToRegister = document.getElementById('goToRegister');
const goToLogin = document.getElementById('goToLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// Campos Login
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

// Campos Registro
const regNombre = document.getElementById('regNombre');
const regEdad = document.getElementById('regEdad');
const regSexo = document.getElementById('regSexo');
const regEstatura = document.getElementById('regEstatura');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

// ============================================
// 1. GESTIÓN DE USUARIOS (localStorage)
// ============================================

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('usuarios', JSON.stringify(users));
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('usuarioActual')) || null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    sessionStorage.setItem('usuarioActual', JSON.stringify(user));
}

function clearCurrentUser() {
    sessionStorage.removeItem('usuarioActual');
}

// ============================================
// 2. REGISTRO DE USUARIO
// ============================================

registerBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const nombre = regNombre.value.trim();
    const edad = parseInt(regEdad.value);
    const sexo = regSexo.value;
    const estatura = parseFloat(regEstatura.value);
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    // Validaciones
    if (!nombre) return mostrarError(registerError, 'Ingresa tu nombre completo');
    if (!edad || edad < 10 || edad > 120) return mostrarError(registerError, 'Edad inválida (10-120 años)');
    if (!estatura || estatura < 80 || estatura > 250) return mostrarError(registerError, 'Estatura inválida (80-250 cm)');
    if (!email || !email.includes('@')) return mostrarError(registerError, 'Correo electrónico inválido');
    if (!password || password.length < 6) return mostrarError(registerError, 'La contraseña debe tener al menos 6 caracteres');

    const users = getUsers();

    // Verificar si el correo ya está registrado
    if (users.some(u => u.email === email)) {
        return mostrarError(registerError, 'Este correo ya está registrado. Inicia sesión.');
    }

    // Crear usuario
    const newUser = {
        id: Date.now().toString(),
        nombre,
        edad,
        sexo,
        estatura,
        email,
        password,
        fechaRegistro: new Date().toISOString(),
        // Datos de tests (se llenarán después)
        tests: {
            sintomas: [],
            entorno: [],
            fuerza: []
        },
        comidas: [],
        checkins: []
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
});

// ============================================
// 3. INICIO DE SESIÓN
// ============================================

loginBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        return mostrarError(loginError, 'Ingresa tu correo y contraseña');
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return mostrarError(loginError, 'Correo o contraseña incorrectos');
    }

    setCurrentUser(user);
    window.location.href = 'dashboard.html';
});

// ============================================
// 4. NAVEGACIÓN ENTRE LOGIN Y REGISTRO
// ============================================

goToRegister.addEventListener('click', function () {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginError.textContent = '';
    registerError.textContent = '';
});

goToLogin.addEventListener('click', function () {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginError.textContent = '';
    registerError.textContent = '';
});

// ============================================
// 5. UTILIDADES
// ============================================

function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    setTimeout(() => { elemento.textContent = ''; }, 4000);
}

// ============================================
// 6. FUNCIONES GLOBALES PARA OTRAS PÁGINAS
// ============================================

// Guardar datos de tests en el usuario actual
function guardarTestSintomas(resultados) {
    const user = getCurrentUser();
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return false;
    users[index].tests.sintomas.push({
        fecha: new Date().toISOString(),
        ...resultados
    });
    saveUsers(users);
    setCurrentUser(users[index]);
    return true;
}

function guardarTestEntorno(resultados) {
    const user = getCurrentUser();
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return false;
    users[index].tests.entorno.push({
        fecha: new Date().toISOString(),
        ...resultados
    });
    saveUsers(users);
    setCurrentUser(users[index]);
    return true;
}

function guardarTestFuerza(resultados) {
    const user = getCurrentUser();
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return false;
    users[index].tests.fuerza.push({
        fecha: new Date().toISOString(),
        ...resultados
    });
    saveUsers(users);
    setCurrentUser(users[index]);
    return true;
}

function guardarComida(comida) {
    const user = getCurrentUser();
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return false;
    users[index].comidas.push({
        fecha: new Date().toISOString(),
        ...comida
    });
    saveUsers(users);
    setCurrentUser(users[index]);
    return true;
}

function guardarCheckin(checkin) {
    const user = getCurrentUser();
    if (!user) return false;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return false;
    users[index].checkins.push({
        fecha: new Date().toISOString(),
        ...checkin
    });
    saveUsers(users);
    setCurrentUser(users[index]);
    return true;
}

// Obtener datos del usuario actual
function obtenerDatosUsuario() {
    return getCurrentUser();
}

// Cerrar sesión
function cerrarSesion() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// ============================================
// 7. FUNCIONES PARA GENERAR PDF (usando jspdf)
// ============================================

function generarPDF(resultados, tipo) {
    // Esta función se implementará cuando añadamos la librería jspdf
    // en las páginas de tests
    console.log('Generando PDF para:', tipo, resultados);
    alert('Función de PDF en desarrollo. Pronto estará lista.');
}

// ============================================
// 8. FUNCIONES PARA WHATSAPP
// ============================================

const NUMERO_DR = '584129504867';

function enviarWhatsApp(mensaje) {
    const texto = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${NUMERO_DR}?text=${texto}`, '_blank');
}

function enviarResultados(resultados) {
    const mensaje = `Hola Dr. Neptalí, le adjunto mis resultados de la app "El Código de la Insulina":\n\n${resultados}`;
    enviarWhatsApp(mensaje);
}

function solicitarLibro() {
    enviarWhatsApp('Hola Dr. Neptalí, quiero adquirir el libro "El Código de la Insulina".');
}

function solicitarCitaOnline() {
    enviarWhatsApp('Hola Dr. Neptalí, quiero agendar una cita online.');
}

function solicitarVisita() {
    enviarWhatsApp('Hola Dr. Neptalí, quiero solicitar una visita domiciliaria.');
}

// Exportar funciones globales
window.guardarTestSintomas = guardarTestSintomas;
window.guardarTestEntorno = guardarTestEntorno;
window.guardarTestFuerza = guardarTestFuerza;
window.guardarComida = guardarComida;
window.guardarCheckin = guardarCheckin;
window.obtenerDatosUsuario = obtenerDatosUsuario;
window.cerrarSesion = cerrarSesion;
window.enviarWhatsApp = enviarWhatsApp;
window.enviarResultados = enviarResultados;
window.solicitarLibro = solicitarLibro;
window.solicitarCitaOnline = solicitarCitaOnline;
window.solicitarVisita = solicitarVisita;
window.generarPDF = generarPDF;