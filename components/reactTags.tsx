export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  options: SelectOption[];
  value: string;
  shouldDisableUnselected?: boolean;
  onChange: (value: string) => void;
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  shouldDisableUnselected = false,
}) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((optionParam) => (
        <option
          disabled={optionParam.value !== value && shouldDisableUnselected}
          key={optionParam.value}
          value={optionParam.value}
        >
          {optionParam.label}
        </option>
      ))}
    </select>
  );
};
