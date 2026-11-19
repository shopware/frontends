export type FieldLabelProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
};

export function FieldLabel({
  htmlFor,
  label,
  required = false,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm text-surface-on-surface"
    >
      {label}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-states-error">
          *
        </span>
      ) : null}
    </label>
  );
}
