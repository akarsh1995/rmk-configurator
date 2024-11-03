export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
};

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
