import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio | PostLaboratory",
  description: "Términos y condiciones de uso de PostLaboratory.",
};

export default function TermsPage() {
  const updatedAt = "25 de febrero de 2026";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">Términos de Servicio</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última actualización: {updatedAt}</p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Objeto</h2>
          <p>
            Estos términos regulan el acceso y uso de PostLaboratory, plataforma para creación de
            contenidos visuales mediante inteligencia artificial.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Uso permitido</h2>
          <p>
            Te comprometes a usar el servicio conforme a la ley, sin infringir derechos de terceros
            ni realizar actividades abusivas, fraudulentas o que comprometan la seguridad.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Cuenta y acceso</h2>
          <p>
            El acceso requiere autenticación. Eres responsable de la confidencialidad de tus
            credenciales y de la actividad de tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Contenidos del usuario</h2>
          <p>
            Mantienes la titularidad de los contenidos que aportas. Nos autorizas a tratarlos en la
            medida necesaria para prestar el servicio y mejorar su funcionamiento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Disponibilidad del servicio</h2>
          <p>
            El servicio puede evolucionar, actualizarse o tener interrupciones puntuales por
            mantenimiento, incidencias o causas de fuerza mayor.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Limitación de responsabilidad</h2>
          <p>
            PostLaboratory se ofrece tal cual. En la máxima medida permitida por la ley, no
            garantizamos resultados específicos ni asumimos responsabilidad por usos indebidos por
            parte de los usuarios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Suspensión o cancelación</h2>
          <p>
            Podemos suspender o cancelar cuentas que incumplan estos términos o supongan riesgo para
            la plataforma o terceros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos. La versión vigente estará publicada en esta página y
            será aplicable desde su fecha de publicación.
          </p>
        </section>
      </div>
    </div>
  );
}
