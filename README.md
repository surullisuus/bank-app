# Bank App - Prueba Técnica

Aplicación web desarrollada con **Angular 17** para la gestión de productos financieros. Permite listar, crear, editar y eliminar productos con validaciones, paginación y pruebas unitarias con cobertura superior al 70%.

---

## Tecnologías utilizadas

- Angular 17
- TypeScript
- Reactive Forms
- Jasmine / Karma (pruebas unitarias)
- Angular CLI 17.1.2

---

## Requisitos previos

- Node.js 18+
- npm 9+
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli
```

---

## Instalación

```bash
git clone https://github.com/surullisuus/bank-app.git
cd bank-app
npm install
```

---

## Ejecución del proyecto

```bash
ng serve
```

Abre el navegador en `http://localhost:4200`

La aplicación recargará automáticamente al detectar cambios en el código fuente.

---

## Build de producción

```bash
ng build
```

Los artefactos se generan en el directorio `dist/`.

---

## Pruebas unitarias

### Ejecutar las pruebas

```bash
ng test
```

### Ejecutar con reporte de cobertura

```bash
ng test --code-coverage --watch=false
```

El reporte HTML se genera en:

```
coverage/bank-app/index.html
```

Ábrelo en el navegador para ver el detalle línea por línea.

### Cobertura actual

| Métrica    | Resultado | Mínimo requerido |
|------------|-----------|------------------|
| Statements | 85.62%    | 70%              |
| Branches   | 90%       | 70%              |
| Functions  | 70.49%    | 70%              |
| Lines      | 84.76%    | 70%              |

### Archivos con pruebas unitarias

| Archivo | Descripción |
|---|---|
| `product-form.component.spec.ts` | Formulario de creación y edición |
| `product-list.component.spec.ts` | Listado, búsqueda y paginación |
| `product.service.spec.ts` | Servicios HTTP de productos |
| `api.service.spec.ts` | Servicio base HTTP |
| `product-id.validator.spec.ts` | Validador asíncrono de ID |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   └── api-response.model.ts
│   │   └── services/
│   │       ├── api.service.ts
│   │       └── product.service.ts
│   ├── features/
│   │   └── products/
│   │       ├── components/
│   │       │   └── product-form/
│   │       └── pages/
│   │           ├── product-list/
│   │           ├── product-create/
│   │           └── product-edit/
│   └── shared/
│       └── validators/
│           └── product-id.validator.ts
└── environments/
```

---

## Funcionalidades implementadas

- Listado de productos con paginación y búsqueda en tiempo real
- Creación de productos con validaciones síncronas y asíncronas
- Edición de productos existentes
- Eliminación con modal de confirmación
- Validación de ID único mediante API
- Cálculo automático de fecha de revisión

---

## Generación de componentes

```bash
ng generate component component-name
ng generate service service-name
ng generate directive|pipe|guard|interface|enum|module
```

---

## Further help

Para más información sobre Angular CLI:

```bash
ng help
```

O visita la [documentación oficial de Angular CLI](https://angular.io/cli).
