import { useEffect, useState } from 'react';
import type { AutomatedStepNodeData } from '../../../types/nodes';
import type { AutomationAction } from '../../../types/workflow';
import { getAutomations } from '../../../api/mockApi';

interface Props {
  data: AutomatedStepNodeData;
  onChange: (data: Partial<AutomatedStepNodeData>) => void;
}

export default function AutomatedStepNodeForm({ data, onChange }: Props) {
  const [actions, setActions] = useState<AutomationAction[]>([]);

  useEffect(() => {
    getAutomations().then(setActions);
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    const params: Record<string, string> = {};
    if (action) {
      action.params.forEach((p) => {
        params[p] = data.parameters[p] || '';
      });
    }
    onChange({ actionId, parameters: params });
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({ parameters: { ...data.parameters, [param]: value } });
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
          placeholder="Step title..."
        />
      </div>

      <div className="form-group">
        <label>
          Action <span className="required-star">*</span>
        </label>
        <select
          className="form-input form-select"
          value={data.actionId}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="">Select an action...</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="param-fields">
          <div className="param-title">Parameters</div>
          {selectedAction.params.map((param) => (
            <div className="form-group" key={param}>
              <label style={{ textTransform: 'capitalize' }}>{param.replace(/([A-Z])/g, ' $1')}</label>
              <input
                className="form-input"
                type="text"
                value={data.parameters[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
