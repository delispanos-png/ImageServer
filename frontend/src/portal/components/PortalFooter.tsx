import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

export default function PortalFooter() {
  const { t } = usePortalLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12 col-sm-12 text-center">
            <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2">
              <span className="text-muted fw-semibold">{t('portal.poweredBy')}</span>
              <img src={cloudonLogo} alt="CloudOn ContentSync Platform" style={{ height: '34px', width: 'auto', verticalAlign: 'middle' }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
