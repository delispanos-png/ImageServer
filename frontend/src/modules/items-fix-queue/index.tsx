import ItemsPage from '../../components/Cms/Modules/ItemsPage';

export default function ItemsFixQueuePage() {
  return (
    <ItemsPage
      moduleTitle="Fix Queue"
      moduleDescription="Operational queue for items that are blocked by missing text, category, or image source."
      initialQualityStateFilter="needs_fix"
      lockQualityStateFilter
      showBulkRefreshPanel
    />
  );
}
