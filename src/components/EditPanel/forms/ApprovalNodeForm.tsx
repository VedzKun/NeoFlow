import type { ApprovalNodeData, ApproverRole } from '../../../types/nodes';

interface Props {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

const ROLES: ApproverRole[] = ['Manager', 'HRBP', 'Director'];

export default function ApprovalNodeForm({ data, onChange }: Props) {
  return (
    <>
      <div className="form-group">
        <label>
          Title <span className="required-star">*</span>
        </label>
        <input
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Approval step title..."
        />
      </div>

      <div className="form-group">
        <label>
          Approver Role <span className="required-star">*</span>
        </label>
        <select
          className="form-input form-select"
          value={data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value as ApproverRole })}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Auto-Approve Threshold (days)</label>
        <input
          className="form-input"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: parseInt(e.target.value) || 0 })}
          placeholder="0 = manual approval"
        />
        <span style={{ fontSize: 10, color: '#64748b' }}>
          Set to 0 for manual approval. If &gt; 0, auto-approves after N days.
        </span>
      </div>
    </>
  );
}
