# 🌟 NeonThreads - E-commerce de Ropa Urbana

![NeonThreads Banner](https://via.placeholder.com/1200x300/000000/22c55e?text=NeonThreads+-+Moda+Urbana+Neón)

E-commerce moderno de ropa urbana con diseño oscuro y efectos neón verde fluorescente. Construido con React + Vite y conectado a un backend FastAPI.

## ✨ Características

### 🎨 Diseño
- **Tema oscuro ultra-moderno** con efectos neón verde fluorescente
- **Animaciones suaves** y transiciones fluidas
- **Diseño responsive** optimizado para mobile, tablet y desktop
- **Cards de productos grandes** estilo 47 Street
- **Efectos de glow** y sombras neón personalizadas

### 🛒 Funcionalidades
- ✅ **Carrito de compras completo** con persistencia en localStorage
- ✅ **Sistema de notificaciones toast** (success, error, info)
- ✅ **Gestión de productos** con stock en tiempo real
- ✅ **Categorías de productos** interactivas
- ✅ **Sistema de autenticación** (preparado para implementar)
- ✅ **Integración con API REST** del backend FastAPI

### 🔧 Tecnologías
- **React 18** - Librería de UI
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos modernos
- **Axios** - Cliente HTTP
- **React Context API** - Estado global

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend FastAPI corriendo en `http://localhost:8000`

### Instalación

```bash
# 1. Clonar el repositorio
git clone <tu-repo-url>
cd neonthreads-ecommerce

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env con tu configuración
# VITE_API_BASE_URL=http://localhost:8000

# 5. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Servicios API
│   ├── axios.config.js     # Configuración de Axios
│   ├── productApi.js       # API de productos
│   ├── categoryApi.js      # API de categorías
│   ├── clientApi.js        # API de clientes
│   ├── orderApi.js         # API de órdenes
│   └── billApi.js          # API de facturas
│
├── components/             # Componentes React
│   ├── common/             # Componentes comunes
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── cart/               # Carrito de compras
│   │   ├── CartDrawer.jsx
│   │   └── CartItem.jsx
│   ├── products/           # Productos
│   │   ├── ProductCard.jsx
│   │   └── ProductGrid.jsx
│   ├── categories/         # Categorías
│   │   └── CategorySection.jsx
│   ├── hero/               # Hero section
│   │   └── Hero.jsx
│   └── notifications/      # Notificaciones
│       ├── Toast.jsx
│       └── ToastContainer.jsx
│
├── context/                # Context API
│   ├── AuthContext.jsx     # Estado de autenticación
│   ├── CartContext.jsx     # Estado del carrito
│   └── ToastContext.jsx    # Estado de notificaciones
│
├── hooks/                  # Custom hooks
│   ├── useAuth.js
│   ├── useCart.js
│   └── useToast.js
│
├── pages/                  # Páginas
│   └── Home.jsx
│
├── styles/                 # Estilos globales
│   └── index.css
│
├── App.jsx                 # Componente raíz
└── main.jsx               # Punto de entrada
```

---

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 🔌 Integración con Backend

### Configuración

El frontend se conecta al backend FastAPI mediante Axios. Configurar la URL base en `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Endpoints Utilizados

```javascript
// Productos
GET    /products              # Listar productos
GET    /products/{id}         # Obtener producto
POST   /products              # Crear producto
PUT    /products/{id}         # Actualizar producto
DELETE /products/{id}         # Eliminar producto

// Categorías
GET    /categories            # Listar categorías
GET    /categories/{id}       # Obtener categoría

// Clientes
POST   /clients               # Registrar cliente
GET    /clients/{id}          # Obtener cliente

// Órdenes
POST   /orders                # Crear orden
GET    /orders                # Listar órdenes
GET    /orders/{id}           # Obtener orden

// Facturas
POST   /bills                 # Crear factura
GET    /bills/{id}            # Obtener factura
```

### Ejemplo de Uso

```javascript
import { getProducts, createOrder } from './api'

// Obtener productos
const products = await getProducts(0, 10)

// Crear orden
const order = await createOrder({
  date: new Date().toISOString(),
  total: 150.50,
  delivery_method: 3, // HOME_DELIVERY
  status: 1,          // PENDING
  client_id: 1,
  bill_id: 1
})
```

---

## 🎨 Personalización

### Colores

Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  neon: {
    green: '#22c55e',
    emerald: '#10b981',
    lime: '#84cc16',
  },
}
```

### Sombras Neón

```javascript
boxShadow: {
  'neon-sm': '0 0 10px rgba(34, 197, 94, 0.3)',
  'neon': '0 0 20px rgba(34, 197, 94, 0.5)',
  'neon-lg': '0 0 30px rgba(34, 197, 94, 0.7)',
}
```

---

## 🛠️ Próximas Funcionalidades

- [ ] Sistema de autenticación completo (Login/Register)
- [ ] Página de detalle de producto
- [ ] Proceso de checkout paso a paso
- [ ] Perfil de usuario
- [ ] Historial de órdenes
- [ ] Sistema de reseñas de productos
- [ ] Búsqueda y filtros avanzados
- [ ] Lista de favoritos/wishlist
- [ ] Panel de administración
- [ ] Sistema de cupones de descuento

---

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6"
}
```

---

## 🐛 Solución de Problemas

### El servidor de desarrollo no inicia
```bash
# Limpiar caché y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error de conexión con la API
1. Verificar que el backend esté corriendo en `http://localhost:8000`
2. Verificar la variable `VITE_API_BASE_URL` en `.env`
3. Revisar CORS en el backend FastAPI

### Estilos de Tailwind no se aplican
```bash
# Reconstruir los estilos
npm run build
```

---

## 📝 Convenciones de Código

- **Componentes**: PascalCase (ej: `ProductCard.jsx`)
- **Archivos utils**: camelCase (ej: `useCart.js`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `ORDER_STATUS`)
- **Variables**: camelCase (ej: `cartItems`)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Autor

**NeonThreads Team**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: contact@neonthreads.com

---

## 🙏 Agradecimientos

- [Lucide Icons](https://lucide.dev/) por los iconos
- [Tailwind CSS](https://tailwindcss.com/) por el framework CSS
- [Vite](https://vitejs.dev/) por la herramienta de build
- Inspiración de diseño: 47 Street, Tiendas urbanas modernas

---

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x600/000000/22c55e?text=Home+Page)

### Productos
![Products](https://via.placeholder.com/800x600/000000/22c55e?text=Products)

### Carrito
![Cart](https://via.placeholder.com/800x600/000000/22c55e?text=Shopping+Cart)

---

**¡Disfruta construyendo con NeonThreads! 🌟💚**