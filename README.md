# Backend Setup - Node.js + TypeScript

## 1. Inicialización del Proyecto

Antes de instalar cualquier dependencia, se debe crear el archivo `package.json` para gestionar el proyecto.

```bash
# Inicia un nuevo proyecto de Node.js con la configuración por defecto
npm init -y
```

---

## 2. Instalación de Dependencias de Producción

Este comando instala las librerías principales que el servidor necesita para funcionar en el entorno real.

```bash
npm install express mysql2 zod bcrypt jsonwebtoken dotenv cors
```

---

## 3. Instalación de Dependencias de Desarrollo

Este comando instala TypeScript, el motor de ejecución rápida (`tsx`) y todos los tipos necesarios (`@types/...`) para que TypeScript entienda correctamente las librerías utilizadas.

```bash
npm install -D typescript tsx @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors
```

---

## 4. Inicialización de TypeScript

Una vez instalado TypeScript, se debe generar el archivo `tsconfig.json` para configurar el compilador.

```bash
npx tsc --init
```

---

## 5. Script de Desarrollo

Se recomienda agregar el siguiente script en el archivo `package.json` para ejecutar el servidor en modo desarrollo con recarga automática:

```json
"scripts": {
  "dev": "tsx watch src/app.ts"
}
```

---

## Notas

* Este setup permite trabajar con un backend moderno utilizando TypeScript.
* `tsx` facilita la ejecución directa de archivos `.ts` sin necesidad de compilación manual.
* La separación entre dependencias de producción y desarrollo mejora la organización del proyecto.
* `cors` permite la comunicación con aplicaciones frontend (por ejemplo, Angular).
* Es necesario crear las carpetas `/src` y `/dist` y habilitar la configuración en tsconfig.json
* También dentro de package.json modificar el `type` de `jscommon` a `module` para utilizar ESMAScript 6

---
