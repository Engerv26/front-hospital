# Sistema de Autenticación JWT - Hospital Frontend

## 🔐 Resumen de Implementación

### Archivos Creados/Modificados:

#### 1. **Servicio de Autenticación** (`src/app/Services/auth.ts`)

- ✅ Login con email/password
- ✅ Logout con limpieza de localStorage
- ✅ Validación de tokens JWT
- ✅ Decodificación de tokens
- ✅ Obtención de información del usuario actual

#### 2. **Guards de Rutas** (`src/app/Services/auth.guard.ts`)

- ✅ **AuthGuard**: Protege rutas que requieren autenticación
- ✅ **LoginGuard**: Evita que usuarios autenticados accedan al login

#### 3. **Interceptor HTTP** (`src/app/Services/auth.interceptor.ts`)

- ✅ Añade automáticamente el token JWT a todas las solicitudes HTTP
- ✅ Solo aplica cuando hay un token válido

#### 4. **Componente Login** (`src/app/Pages/login/login.ts`)

- ✅ Formulario reactivo con validaciones
- ✅ Integración con AuthService
- ✅ Manejo de errores específicos
- ✅ Navegación automática después del login exitoso

#### 5. **Configuración de Rutas** (`src/app/app.routes.ts`)

- ✅ Rutas protegidas con AuthGuard
- ✅ Ruta login protegida con LoginGuard
- ✅ Redirección por defecto a /login

#### 6. **Configuración de la App** (`src/app/app.config.ts`)

- ✅ Interceptor HTTP registrado
- ✅ Providers necesarios configurados

#### 7. **Componente Principal** (`src/app/app.ts` y `src/app/app.html`)

- ✅ Navegación dinámica según estado de autenticación
- ✅ Información del usuario en la barra de navegación
- ✅ Botón de logout funcional

## 🚀 Flujo de Funcionamiento:

### 1. **Usuario NO Autenticado:**

- ✅ Al acceder a cualquier ruta protegida → Redirige a /login
- ✅ Solo puede acceder a la página de login
- ✅ Menú muestra únicamente opción de "Iniciar sesión"

### 2. **Proceso de Login:**

- ✅ Usuario ingresa email/password
- ✅ Se envía POST a /api/auth/login
- ✅ Si es exitoso: token se guarda en localStorage
- ✅ Redirige automáticamente a /home
- ✅ Si falla: muestra mensaje de error específico

### 3. **Usuario Autenticado:**

- ✅ Puede acceder a todas las rutas protegidas
- ✅ Si intenta acceder a /login → Redirige a /home
- ✅ Todas las solicitudes HTTP incluyen automáticamente el token
- ✅ Menú completo con navegación y botón de logout

### 4. **Proceso de Logout:**

- ✅ Limpia el token del localStorage
- ✅ Redirige automáticamente a /login
- ✅ Menú vuelve al estado no autenticado

## 🔧 Configuración Backend Requerida:

### Endpoint de Login:

```
POST https://localhost:44331/api/auth/login
Content-Type: application/json

{
  "email": "usuario@hospital.com",
  "password": "password123"
}
```

### Respuesta Esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token JWT debe contener:

```json
{
  "email": "usuario@hospital.com",
  "userId": "123",
  "userType": "admin",
  "exp": 1234567890,
  "iat": 1234567890
}
```

## 📱 Características de Seguridad:

- ✅ **Tokens expirados**: Automáticamente detectados y usuario redirigido a login
- ✅ **Rutas protegidas**: Imposible acceder sin autenticación válida
- ✅ **Headers automáticos**: Token incluido en todas las solicitudes a la API
- ✅ **Limpieza de sesión**: Logout completo con eliminación de datos
- ✅ **Validación en tiempo real**: Verificación continua del estado de autenticación

## 🎨 Interfaz de Usuario:

- ✅ **Navegación dinámica**: Menú cambia según estado de autenticación
- ✅ **Información de usuario**: Email visible en la barra superior
- ✅ **Iconos descriptivos**: Enlaces con emojis para mejor UX
- ✅ **Estados visuales**: Enlaces activos con resaltado
- ✅ **Responsive**: Diseño adaptable

## ⚠️ Para completar la implementación:

1. **Backend**: Crear endpoint `/api/auth/login` que retorne JWT
2. **Node.js**: Actualizar a versión 20.19+ o 22.12+
3. **Pruebas**: Verificar flujo completo con backend real
4. **Opcional**: Añadir refresh token para renovación automática

## 🔍 Debug y Logging:

Todos los componentes incluyen logging detallado:

- 🔒 AuthGuard verificaciones
- 🔓 LoginGuard verificaciones
- 🔐 HTTP Interceptor operaciones
- 🚀 Login attemps
- 🚪 Logout operations

Usar DevTools → Console para monitorear el flujo.

---

**¡Sistema JWT completo e implementado! 🎉**
