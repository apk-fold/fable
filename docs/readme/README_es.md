<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · **Español** · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Icono de Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Tus horas, tu sueldo bruto, sin calculadora.</b><br>Registro de horas para contratos franceses de trabajo temporal (intérim), de duración determinada (CDD) e indefinidos (CDI): horas extra por tramos, noche, domingo, festivos, dietas de comida, IFM y vacaciones pagadas.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Descargar el APK</b></a> · Android 7 o superior · gratis, sin conexión, sin cuenta</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Inicio y fichaje">
  <img src="../../docs/historique.png" width="200" alt="Historial">
  <img src="../../docs/resume.png" width="200" alt="Resumen del mes">
  <img src="../../docs/mission.png" width="200" alt="Ajustes de una misión">
</p>

## Instalar

1. En el móvil, abre el enlace **Descargar el APK** de arriba (o la última [release](https://github.com/apk-fold/fable/releases/latest)).
2. Permite la instalación desde tu navegador si Android lo pide y luego instala.
3. Las nuevas versiones se instalan encima de la anterior: misma firma, datos conservados.

Cada cambio de código subido a `main` recompila el APK automáticamente (GitHub Actions) y publica una nueva release.

### Firma

La clave de firma no está en el repositorio. GitHub Actions la lee del secret **`FABLE_KEYSTORE_B64`** (el archivo `.jks` codificado en base64, contraseña `FABLE_KEYSTORE_PASSWORD` opcional). Sin este secret, el APK se firma con una clave temporal: se instala, pero la siguiente versión pedirá desinstalar la anterior.

## Qué hace la app

**Registro**
- Fichaje: *Empezar*, *Pausa*, *Terminar* — la jornada se crea sola (redondeo al cuarto de hora opcional).
- Registro manual: fecha, inicio → fin (se admiten turnos que pasan la medianoche), pausa, botones **+ Horas extra** (+15 min, +30 min, +1 h).
- Vista previa en directo del cálculo mientras escribes, aviso si dos jornadas se solapan.
- Repetir una jornada en otros días de la semana, duplicar una jornada, forzar o quitar la dieta de comida caso por caso.

**Misiones** (una por empleador o agencia), cada una con sus reglas:
- Tipo de contrato: Temporal (intérim), Duración determinada (CDD), Indefinido (CDI), Otro — tarifa horaria bruta, color.
- **Horas extra** por semana o por día, con 2 tramos (p. ej. +25 % desde 35 h, +50 % desde 43 h).
- **Horas nocturnas** en una franja ajustable (21 h → 6 h por defecto) con su recargo.
- **Domingos** y **festivos**: calendario de **Francia metropolitana (París)** por defecto, o **Alsacia-Mosela** (+ Viernes Santo y 26 de diciembre), configurable para todas las misiones.
- Acumulación de recargos: sumados o solo el más alto; la noche del sábado al domingo se cuenta según el día de inicio u hora por hora.
- **Dieta de comida** cada día trabajado o a partir de un número de horas, **ayuda de transporte** por día.
- **IFM** (indemnización de fin de misión, trabajo temporal) o **prima de precariedad** (CDD) e **ICCP** (indemnización por vacaciones), 10 % + 10 % por defecto.
- **Periodo de nómina** del mes completo o desplazado (p. ej. del 21 al 20), horario y pausa por defecto.

**Seguimiento**
- Inicio: fichaje, semana en curso con el indicador del umbral de horas extra, totales del mes.
- Historial por mes, en lista agrupada por semana o en calendario, filtro por misión.
- Resumen de semana / mes / año: horas, horas extra por tramo, noche, domingo, festivos, días trabajados, gráfico, desglose del bruto hasta el **neto estimado** (porcentaje de cotizaciones ajustable).
- **Exportación a PDF** (registro de horas listo para enviar), **Excel .xlsx** y **CSV** — sin suscripción.

**El resto**
- Recordatorio por notificación los días y a la hora que elijas.
- **Todo se personaliza** en Ajustes: tema oscuro, negro (AMOLED), claro o automático; color principal y colores de los recargos (paleta o color libre); fuentes; tamaño del texto; esquinas; densidad; animaciones; formato de las duraciones (7 h 30, 7h30 o 7,5 h); modo discreto que oculta los importes; pantalla de inicio; vista del historial. Color libre también para cada misión.
- Copia de seguridad / restauración en archivo `.json`, copia de respaldo automática en los archivos privados de la app.
- Ningún dato sale del móvil: sin cuenta, sin servidor, sin publicidad.

## Cómo se calcula

Cada jornada se divide minuto a minuto. Para cada minuto trabajado, Fable sabe si cae de noche, en domingo o en festivo y en qué tramo de horas extra (acumulado de la semana de lunes a domingo, en orden cronológico). La pausa se descuenta de forma proporcional. Una semana a caballo entre dos meses se calcula entera y luego solo se cuentan los días del periodo.

- Sueldo bruto = horas × tarifa + recargos
- IFM / prima de precariedad = bruto × 10 %
- ICCP = (bruto + IFM) × 10 %
- Neto estimado = total bruto − cotizaciones (22 % por defecto) + dietas y transporte

Son **estimaciones**: lo que vale es tu convenio colectivo y tu nómina.

## Desarrollo

```bash
npm install
npm run dev        # interfaz en el navegador
npm test           # pruebas del motor de cálculo
npm run sync       # build web + proyecto Android (después de «npx cap add android» la primera vez)
npm run open       # abre el proyecto en Android Studio
```

Estructura: `src/core` (cálculos, festivos, almacenamiento, exportaciones PDF/Excel), `src/views` (pantallas), `src/ui` (componentes), `scripts/patch-android.mjs` (nombre, iconos, tema y firma del proyecto Android), `tests/` (pruebas del motor y recorridos de la interfaz).

Tecnologías: HTML/CSS/JS sin framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Fuentes Manrope y Unbounded (SIL Open Font License).
