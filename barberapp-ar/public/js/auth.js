// Utilidades de autenticación

// Obtener sesión actual
function getSession() {
  const session = localStorage.getItem("session")
  return session ? JSON.parse(session) : null
}

// Obtener usuario actual
function getUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Obtener perfil actual
function getPerfil() {
  const perfil = localStorage.getItem("perfil")
  return perfil ? JSON.parse(perfil) : null
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
  return getSession() !== null
}

// Verificar si el usuario es propietario
function isPropietario() {
  const perfil = getPerfil()
  return perfil && perfil.es_propietario === true
}

// Obtener token de acceso
function getAccessToken() {
  const session = getSession()
  return session ? session.access_token : null
}

// Cerrar sesión
async function logout() {
  try {
    const token = getAccessToken()

    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Logout error:", error)
  } finally {
    localStorage.removeItem("session")
    localStorage.removeItem("user")
    localStorage.removeItem("perfil")
    window.location.href = "/login.html"
  }
}

// Proteger páginas que requieren autenticación
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "/login.html"
  }
}

// Proteger páginas que requieren ser propietario
function requirePropietario() {
  if (!isAuthenticated()) {
    window.location.href = "/login.html"
    return
  }

  if (!isPropietario()) {
    alert("Acceso denegado. Esta página es solo para propietarios.")
    window.location.href = "/index.html"
  }
}

// Hacer peticiones autenticadas
async function authenticatedFetch(url, options = {}) {
  const token = getAccessToken()

  if (!token) {
    throw new Error("No authenticated")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Si el token expiró, redirigir al login
  if (response.status === 401) {
    localStorage.removeItem("session")
    localStorage.removeItem("user")
    localStorage.removeItem("perfil")
    window.location.href = "/login.html"
    throw new Error("Session expired")
  }

  return response
}
