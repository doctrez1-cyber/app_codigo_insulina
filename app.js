// ============================================================
// EL CÓDIGO DE LA INSULINA - APP.JS (VERSIÓN UNIFICADA)
// Incluye: gestión usuarios, guardado de datos, WhatsApp,
// instalación PWA, PDF, actualización automática.
// ============================================================

// ========== CONFIGURACIÓN ==========
const NUMERO_DR = '584129504867';
const CACHE_VERSION = 'codigo-insulina-v1'; // Cambiar al actualizar

// ========== REFERENCIAS DOM ==========
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const goToRegister = document.getElementById('goToRegister');
const goToLogin = document.getElementById('goToLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const regNombre = document.getElementById('regNombre');
const regEdad = document.getElementById('regEdad');
const regSexo = document.getElementById('regSexo');
const regEstatura = document.getElementById('regEstatura');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

// ============================================================
// 1. GESTIÓN DE USUARIOS (localStorage)
// ============================================================

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('usuarios', JSON.stringify(users));
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('usuarioActual')) || null;
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    sessionStorage.setItem('usuarioActual', JSON.stringify(user));
}

function clearCurrentUser() {
    sessionStorage.removeItem('usuarioActual');
}

// ============================================================
// 2. REGISTRO
// ============================================================

registerBtn.addEventListener('click', function(e) {
    e.preventDefault();

    const nombre = regNombre.value.trim();
    const edad = parseInt(regEdad.value);
    const sexo = regSexo.value;
    const estatura = parseFloat(regEstatura.value);
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    if (!nombre) return mostrarError(registerError, 'Ingresa tu nombre completo');
    if (!edad || edad < 10 || edad > 120) return mostrarError(registerError, 'Edad inválida (10-120 años)');
    if (!estatura || estatura < 80 || estatura > 250) return mostrarError(registerError, 'Estatura inválida (80-250 cm)');
    if (!email || !email.includes('@')) return mostrarError(registerError, 'Correo electrónico inválido');
    if (!password || password.length < 6) return mostrarError(registerError, 'La contraseña debe tener al menos 6 caracteres');

    const users = getUsers();
    if (users.some(u => u.email === email)) {
        return mostrarError(registerError, 'Este correo ya está registrado. Inicia sesión.');
    }

    const newUser = {
        id: Date.now().toString(),
        nombre,
        edad,
        sexo,
        estatura,
        email,
        password,
        fechaRegistro: new Date().toISOString(),
        tests: { sintomas: [], entorno: [], fuerza: [] },
        comidas: [],
        checkins: []
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    window.location.href = 'dashboard.html';
});

// ============================================================
// 3. LOGIN
// ============================================================

loginBtn.addEventListener('click', function(e) {
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

// ============================================================
// 4. NAVEGACIÓN ENTRE LOGIN Y REGISTRO
// ============================================================

goToRegister.addEventListener('click', function() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginError.textContent = '';
    registerError.textContent = '';
});

goToLogin.addEventListener('click', function() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginError.textContent = '';
    registerError.textContent = '';
});

function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    setTimeout(() => { elemento.textContent = ''; }, 4000);
}

// ============================================================
// 5. GUARDADO DE DATOS
// ============================================================

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

function obtenerDatosUsuario() {
    return getCurrentUser();
}

function cerrarSesion() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// ============================================================
// 6. WHATSAPP (con fallback para navegadores móviles)
// ============================================================

function enviarWhatsApp(mensaje) {
    const texto = encodeURIComponent(mensaje);
    const url = `https://wa.me/${NUMERO_DR}?text=${texto}`;
    try {
        const win = window.open(url, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = url;
        }
    } catch {
        window.location.href = url;
    }
}

function enviarResultados(resultados) {
    const mensaje = `Hola Dr. Neptalí, mis resultados de la app "El Código de la Insulina":\n\n${resultados}`;
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

// ============================================================
// 7. INSTALACIÓN PWA (Android + iOS)
// ============================================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const androidBtn = document.getElementById('instalacionAndroid');
    if (androidBtn) androidBtn.style.display = 'block';
});

function instalarApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((resultado) => {
            if (resultado.outcome === 'accepted') {
                console.log('App instalada correctamente');
                const androidBtn = document.getElementById('instalacionAndroid');
                if (androidBtn) androidBtn.style.display = 'none';
            } else {
                console.log('Usuario rechazó la instalación');
            }
            deferredPrompt = null;
        });
    } else {
        alert('La instalación no está disponible en este momento. Intenta desde Chrome.');
    }
}

function esDispositivoIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function estaInstalada() {
    return window.matchMedia('(display-mode: standalone)').matches;
}

window.addEventListener('load', function() {
    if (estaInstalada()) {
        const androidDiv = document.getElementById('instalacionAndroid');
        const iosDiv = document.getElementById('instalacionIOS');
        if (androidDiv) androidDiv.style.display = 'none';
        if (iosDiv) iosDiv.style.display = 'none';
        return;
    }

    if (esDispositivoIOS()) {
        const androidDiv = document.getElementById('instalacionAndroid');
        const iosDiv = document.getElementById('instalacionIOS');
        if (androidDiv) androidDiv.style.display = 'none';
        if (iosDiv) iosDiv.style.display = 'block';
    }
});

window.instalarApp = instalarApp;

// ============================================================
// 8. ACTUALIZACIÓN AUTOMÁTICA (Service Worker)
// ============================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Hay una nueva versión disponible
                        if (confirm('¡Hay una nueva versión de la app disponible! ¿Quieres recargar para actualizarla?')) {
                            window.location.reload();
                        }
                    }
                });
            });
        })
        .catch(() => {
            console.log('Service Worker no disponible (modo offline no activo).');
        });
}

// ============================================================
// 9. GENERACIÓN DE PDF (con jspdf)
// ============================================================

function generarPDF(resultados, tipo, nombreUsuario) {
    if (typeof window.jspdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            generarPDFInterno(resultados, tipo, nombreUsuario);
        };
        document.head.appendChild(script);
        return;
    }
    generarPDFInterno(resultados, tipo, nombreUsuario);
}

function generarPDFInterno(resultados, tipo, nombreUsuario) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const logo = document.getElementById('logoImg') ? document.getElementById('logoImg').src : '';

    doc.setFontSize(20);
    doc.setTextColor(27, 94, 32);
    doc.text('El Código de la Insulina', 105, 20, { align: 'center' });

    if (logo) {
        try {
            doc.addImage(logo, 'PNG', 80, 28, 50, 50);
        } catch {
            // Si falla, solo texto
        }
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Resultados del Test: ${tipo}`, 105, 95, { align: 'center' });
    doc.text(`Usuario: ${nombreUsuario || 'No especificado'}`, 20, 110);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 120);

    doc.line(20, 130, 190, 130);

    doc.setFontSize(12);
    const lineas = resultados.split('\n');
    let y = 145;
    lineas.forEach(linea => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(linea.trim(), 20, y);
        y += 8;
    });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('www.doctrez1-cyber.github.io/app_codigo_insulina', 105, 280, { align: 'center' });

    doc.save(`resultados_${tipo}_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ============================================================
// 10. EXPORTAR FUNCIONES GLOBALES
// ============================================================

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
window.instalarApp = instalarApp;
window.esDispositivoIOS = esDispositivoIOS;
window.estaInstalada = estaInstalada;

console.log('✅ App "El Código de la Insulina" cargada correctamente.');
