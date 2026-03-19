import ItemsPage from '../../components/Cms/Modules/ItemsPage';
import { useAdminLanguage } from '../../app/i18n/AdminLanguageProvider';

export default function ItemsReviewQueuePage() {
  const { language } = useAdminLanguage();
  const isGreek = language === 'el';
  return (
    <ItemsPage
      moduleTitle={isGreek ? 'Ουρά Ελέγχου' : 'Review Queue'}
      moduleDescription={
        isGreek
          ? 'Προσωρινή λίστα ελέγχου για διορθωμένα ανενεργά είδη που είναι έτοιμα για τελικό approval και δημοσίευση.'
          : 'Temporary review list for corrected inactive items that are ready for final approval and go live.'
      }
      initialQualityStateFilter="ready_for_review"
      lockQualityStateFilter
    />
  );
}
