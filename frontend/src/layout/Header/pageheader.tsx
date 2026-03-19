import { Fragment, type ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  titles?: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  titles,
  subtitle,
  eyebrow = 'Workspace',
  actions,
}: PageHeaderProps) {
  const resolvedTitle = title || titles || '';
  return (
    <Fragment>
      <div className="page-header cloudon-page-hero">
        <div className="cloudon-page-hero__content">
          <span className="cloudon-page-hero__eyebrow">{eyebrow}</span>
          <h1 className="page-title cloudon-page-hero__title mb-0">{resolvedTitle}</h1>
          {subtitle ? <p className="cloudon-page-hero__subtitle mb-0">{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-rightheader cloudon-page-hero__actions">{actions}</div> : null}
      </div>
    </Fragment>
  );
}


