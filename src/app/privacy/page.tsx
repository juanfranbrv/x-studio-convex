import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Adstudio",
  description: "Política de privacidad de Adstudio.",
};

export default function PrivacyPage() {
  const updatedAt = "25 de febrero de 2026";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">Política de Privacidad</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última actualización: {updatedAt}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Responsable</h2>
          <p>
            Adstudio es una plataforma para generar contenidos visuales con IA. Si necesitas
            información sobre privacidad, puedes escribir a nuestro canal de contacto oficial.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Datos que tratamos</h2>
          <p>
            Tratamos datos de cuenta (como email e identificadores técnicos), datos de uso del
            producto y los contenidos necesarios para prestar el servicio (prompts, configuraciones
            y resultados generados).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Finalidades</h2>
          <p>
            Utilizamos los datos para autenticar usuarios, permitir el funcionamiento de la
            plataforma, mejorar estabilidad y seguridad, y ofrecer soporte técnico.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Base legal</h2>
          <p>
            La base legal principal es la ejecución del servicio solicitado por el usuario y, en su
            caso, el cumplimiento de obligaciones legales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Conservación</h2>
          <p>
            Conservamos los datos durante el tiempo necesario para prestar el servicio y cumplir
            obligaciones legales, o hasta que solicites su supresión cuando sea aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Encargados y terceros</h2>
          <p>
            Podemos apoyarnos en proveedores tecnológicos para infraestructura, autenticación,
            almacenamiento y procesamiento, bajo acuerdos de tratamiento de datos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Derechos del usuario</h2>
          <p>
            Puedes ejercer derechos de acceso, rectificación, supresión y demás derechos
            reconocidos por la normativa aplicable, contactándonos por los canales habilitados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger la información
            frente a accesos no autorizados, pérdida o alteración.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Cambios</h2>
          <p>
            Esta política puede actualizarse para reflejar cambios legales, técnicos o de producto.
            Publicaremos siempre la versión vigente en esta página.
          </p>
        </section>
      </div>
    </div>
  );
}
