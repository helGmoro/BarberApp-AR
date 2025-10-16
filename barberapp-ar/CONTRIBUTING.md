# Guía de Contribución

Gracias por tu interés en contribuir a BarberApp AR. Esta guía te ayudará a empezar.

## Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:
- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si es aplicable
- Información del entorno (navegador, OS, etc.)

### Sugerir Mejoras

Para sugerir nuevas funcionalidades:
- Verifica que no exista un issue similar
- Describe claramente la funcionalidad
- Explica por qué sería útil
- Proporciona ejemplos de uso

### Pull Requests

1. Fork el repositorio
2. Crea una rama desde `main`:
   \`\`\`bash
   git checkout -b feature/mi-nueva-funcionalidad
   \`\`\`

3. Realiza tus cambios siguiendo las guías de estilo

4. Asegúrate de que el código funcione:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Commit con mensajes descriptivos:
   \`\`\`bash
   git commit -m "feat: agregar sistema de notificaciones"
   \`\`\`

6. Push a tu fork:
   \`\`\`bash
   git push origin feature/mi-nueva-funcionalidad
   \`\`\`

7. Abre un Pull Request

## Guías de Estilo

### JavaScript

- Usa ES6+ features
- Nombres de variables en camelCase
- Nombres de constantes en UPPER_CASE
- Funciones descriptivas
- Comentarios para lógica compleja

### HTML/CSS

- Indentación de 2 espacios
- Nombres de clases en kebab-case
- Semántica HTML5
- CSS modular y reutilizable

### Commits

Usa conventional commits:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formato, sin cambios de código
- `refactor:` refactorización de código
- `test:` agregar o modificar tests
- `chore:` tareas de mantenimiento

## Proceso de Revisión

1. Un mantenedor revisará tu PR
2. Puede solicitar cambios
3. Una vez aprobado, se hará merge
4. Tu contribución será reconocida

## Preguntas

Si tienes dudas, abre un issue con la etiqueta `question`.

Gracias por contribuir a BarberApp AR!
