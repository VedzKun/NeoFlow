import type { EndNodeData } from '../../../types/nodes';

interface Props {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export default function EndNodeForm({ data, onChange }: Props) {
  return (
    <>
      <div className="form-group">
        <label>End Message</label>
        <input
          className="form-input"
          type="text"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="Completion message..."
        />
      </div>

      <div className="form-group">
        <label>Summary Report</label>
        <div
          className="form-toggle"
          onClick={() => onChange({ summaryFlag: !data.summaryFlag })}
        >
          <span className="toggle-label">
            Generate summary on completion
          </span>
          <div className={`toggle-switch ${data.summaryFlag ? 'active' : ''}`} />
        </div>
      </div>
    </>
  );
}
