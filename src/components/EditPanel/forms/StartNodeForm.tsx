import type { StartNodeData, KeyValuePair } from '../../../types/nodes';

interface Props {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export default function StartNodeForm({ data, onChange }: Props) {
  const updateMetadata = (index: number, field: keyof KeyValuePair, value: string) => {
    const updated = [...data.metadata];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ metadata: updated });
  };

  const addMetadata = () => {
    onChange({ metadata: [...data.metadata, { key: '', value: '' }] });
  };

  const removeMetadata = (index: number) => {
    onChange({ metadata: data.metadata.filter((_, i) => i !== index) });
  };

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
          placeholder="Workflow title..."
        />
      </div>

      <div className="form-group">
        <label>Metadata (Key-Value)</label>
        <div className="kv-list">
          {data.metadata.map((kv, i) => (
            <div className="kv-row" key={i}>
              <input
                className="form-input"
                type="text"
                value={kv.key}
                onChange={(e) => updateMetadata(i, 'key', e.target.value)}
                placeholder="Key"
              />
              <input
                className="form-input"
                type="text"
                value={kv.value}
                onChange={(e) => updateMetadata(i, 'value', e.target.value)}
                placeholder="Value"
              />
              <button className="kv-remove" onClick={() => removeMetadata(i)}>×</button>
            </div>
          ))}
          <button className="kv-add" onClick={addMetadata}>+ Add Metadata</button>
        </div>
      </div>
    </>
  );
}
