import './globals.css';

export const metadata = {
  title: 'PAU Mates CV — Preparación Matemáticas II',
  description:
    'Temario, banco de ejercicios con resolución paso a paso, mini-simulacro y hemeroteca de examenes reales de la PAU — Matemáticas II, Comunitat Valenciana.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* MathJax: renderiza LaTeX con delimitadores \( \) y \[ \] */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['\\\\(', '\\\\)']],
                  displayMath: [['\\\\[', '\\\\]']]
                },
                svg: { fontCache: 'global' }
              };
            `,
          }}
        />
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
      </head>
      <body>
        <header className="site">
          <div className="inner">
            <a href="/" className="brand">
              <span className="live-dot"></span> PAU Mates · CV
            </a>
            <nav className="main">
              <a href="/temario">Temario</a>
              <a href="/ejercicios">Ejercicios</a>
              <a href="/simulacro">Simulacro</a>
              <a href="/hemeroteca">Hemeroteca</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site">
          Proyecto independiente de preparación para la PAU — Matemáticas II,
          Comunitat Valenciana. Contenido original; los examenes de la
          hemeroteca enlazan a sus fuentes oficiales/resueltas, no se
          rehospedan aquí.
        </footer>
      </body>
    </html>
  );
}
