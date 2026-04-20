import type { TaskNodeData, KeyValuePair } from '../../../types/nodes';

interface Props {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export default function TaskNodeForm({ data, onChange }: Props) {
  const updateCustomField = (index: number, field: keyof KeyValuePair, value: string) => {
    const updated = [...data.customFields];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ customFields: updated });
  };

  const addCustomField = () => {
    onChange({ customFields: [...data.customFields, { key: '', value: '' }] });
  };

  const removeCustomField = (index: number) => {
    onChange({ customFields: data.customFields.filter((_, i) => i !== index) });
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
          placeholder="Task title..."
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-input form-textarea"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the task..."
        />
      </div>

      <div className="form-group">
        <label>Assignee</label>
        <input
          className="form-input"
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g., HR Admin"
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          className="form-input"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Custom Fields</label>
        <div className="kv-list">
          {data.customFields.map((cf, i) => (
            <div className="kv-row" key={i}>
              <input
                className="form-input"
                type="text"
                value={cf.key}
                onChange={(e) => updateCustomField(i, 'key', e.target.value)}
                placeholder="Field name"
              />
              <input
                className="form-input"
                type="text"
                value={cf.value}
                onChange={(e) => updateCustomField(i, 'value', e.target.value)}
                placeholder="Value"
              />
              <button className="kv-remove" onClick={() => removeCustomField(i)}>×</button>
            </div>
          ))}
          <button className="kv-add" onClick={addCustomField}>+ Add Custom Field</button>
        </div>
      </div>
    </>
  );
}
