import { Badge, Card, Col, Row, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { CMS_ROLE_DEFINITIONS } from '../../../services/permissions';
import { CMS_ROLE_ORDER, CMS_ROLE_LABELS } from '../../../constants/roles';
import type { CmsRole } from '../../../types';

const matrixRows: Array<{ capability: string; roles: Partial<Record<CmsRole, boolean>> }> = [
  {
    capability: 'Πλήρης πρόσβαση στο σύστημα',
    roles: { super_admin: true },
  },
  {
    capability: 'items.view / items.create / items.update / items.delete',
    roles: { super_admin: true, admin: true },
  },
  {
    capability: 'items.view / items.update',
    roles: { super_admin: true, admin: true, editor: true },
  },
  {
    capability: 'categories.view / categories.create / categories.update / categories.delete',
    roles: { super_admin: true, admin: true },
  },
  {
    capability: 'categories.view',
    roles: { super_admin: true, admin: true, editor: true },
  },
  {
    capability: 'clients.view / clients.create / clients.update / clients.delete',
    roles: { super_admin: true, admin: true },
  },
  {
    capability: 'notifications.publish',
    roles: { super_admin: true, admin: true, editor: true },
  },
  {
    capability: 'notifications.view',
    roles: { super_admin: true, admin: true, editor: true, client: true },
  },
  {
    capability: 'audit.view',
    roles: { super_admin: true },
  },
];

export default function RolesPage() {
  return (
    <ModulePage
      title="Ρόλοι"
      description="Ορισμοί ρόλων, πίνακες δικαιωμάτων και πολιτικές πρόσβασης ανά ενότητα."
    >
      <Row>
        <Col xl={5}>
          <Card>
            <Card.Header>
              <Card.Title>Ευθύνες ρόλων</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              {CMS_ROLE_DEFINITIONS.map((definition) => (
                <div key={definition.role}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">{definition.label}</h6>
                    <Badge bg="primary" pill>
                      {definition.role}
                    </Badge>
                  </div>
                  <ul className="mb-0 ps-3">
                    {definition.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7}>
          <Card>
            <Card.Header>
              <Card.Title>Πίνακας πρόσβασης</Card.Title>
            </Card.Header>
            <Card.Body className="table-responsive">
              <Table bordered hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Δυνατότητα</th>
                    {CMS_ROLE_ORDER.map((role) => (
                      <th key={role}>{CMS_ROLE_LABELS[role]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((row) => (
                    <tr key={row.capability}>
                      <td>{row.capability}</td>
                      {CMS_ROLE_ORDER.map((role) => (
                        <td key={role} className="text-center">
                          {row.roles[role] ? (
                            <Badge bg="success">Επιτρέπεται</Badge>
                          ) : (
                            <Badge bg="light" text="dark">
                              Όχι
                            </Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ModulePage>
  );
}
