import { LanguageSwitcher } from "./LanguageSwitcher";

export function MetaNavigation() {
  return (
    <div className="bg-surface-surface-primary py-2.5 text-surface-on-surface-primary">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center px-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
