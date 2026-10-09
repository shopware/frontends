const ROW_CLASS =
  "self-stretch text-base leading-normal font-normal text-surface-on-surface";

export function PersonalDataSection({
  customerName,
  customerEmail,
}: {
  customerName: string;
  customerEmail: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={ROW_CLASS}>{customerName}</div>
      <div className={ROW_CLASS}>{customerEmail}</div>
    </div>
  );
}
