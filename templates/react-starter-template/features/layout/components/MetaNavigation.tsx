import { LanguageSwitcher } from "./LanguageSwitcher";

export function MetaNavigation() {
  return (
    <div className="bg-shell-ink py-2 text-shell-on-ink">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-end px-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
