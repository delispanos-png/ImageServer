import { Fragment, ReactNode } from 'react';
import PageHeader from '../../layout/Header/pageheader';
import { useAdminLanguage } from '../../app/i18n/AdminLanguageProvider';

type ModulePageMetricTone = 'primary' | 'info' | 'success' | 'warning' | 'danger';

export interface ModulePageMetric {
  label: string;
  value: ReactNode;
  helper?: string;
  tone?: ModulePageMetricTone;
}

interface ModulePageProps {
  title: string;
  description: string;
  children?: ReactNode;
  metrics?: ModulePageMetric[];
  actions?: ReactNode;
}

export default function ModulePage({ title, description, children, metrics = [], actions }: ModulePageProps) {
  const { language } = useAdminLanguage();
  const eyebrow = language === 'el' ? 'ΕΝΟΤΗΤΑ CMS' : 'CMS Module';
  const summary = metrics.length || actions ? (
    <div className="cloudon-page-hero__summary">
      {metrics.length ? (
        <div className="cloudon-page-hero__metrics">
          {metrics.map((metric) => (
            <div
              key={`${metric.label}-${String(metric.value)}`}
              className={`cloudon-page-hero__metric cloudon-page-hero__metric--${metric.tone || 'primary'}`}
            >
              <span className="cloudon-page-hero__metric-label">{metric.label}</span>
              <strong className="cloudon-page-hero__metric-value">{metric.value}</strong>
              {metric.helper ? <span className="cloudon-page-hero__metric-helper">{metric.helper}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
      {actions ? <div className="cloudon-page-hero__toolbar">{actions}</div> : null}
    </div>
  ) : null;

  return (
    <Fragment>
      <PageHeader title={title} subtitle={description} eyebrow={eyebrow} actions={summary} />
      <div className="cloudon-module-stack">{children}</div>
    </Fragment>
  );
}
