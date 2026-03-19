import ItemsPage from '../../components/Cms/Modules/ItemsPage';

export default function ItemsReviewQueuePage() {
  return (
    <ItemsPage
      moduleTitle="Review Queue"
      moduleDescription="Temporary review list for corrected inactive items that are ready for final approval and go live."
      initialQualityStateFilter="ready_for_review"
      lockQualityStateFilter
    />
  );
}
