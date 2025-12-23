// app/anket/page.tsx
import SurveyWizard from "./_components/SurveyWizard";

export const revalidate = 60;

export default function AnketPage() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <SurveyWizard />
    </main>
  );
}
