# My Little Kitty

Experiencia web 3D para cuidar a Kitty. Puedes girar la escena, darle comida y darle agua; cada acción actualiza sus medidores y anima la mascota.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/` en el navegador.

## Comandos

- `npm run build`: comprueba tipos y genera la versión de producción.
- `npm run lint`: ejecuta Oxlint.

El modelo original está en `public/models/kitty.fbx` y se carga con `FBXLoader`.

Para activar la música de la carta, coloca tu archivo de cumpleaños en `public/music/feliz-cumpleanos.mp3`. Al pulsar la carta se mostrará “¡Feliz cumpleaños Mayrin!” y comenzará la reproducción.
