export type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  className?: string;
  "data-testid"?: string;
};

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  onBlur,
  required = false,
  error,
  className,
  "data-testid": testId,
}: CheckboxFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-2">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus"
          data-testid={testId}
          checked={checked}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
        />
        <span className="text-sm text-surface-on-surface">
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-0.5 text-states-error">
              *
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p id={errorId} className="mt-1 block text-xs text-states-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
