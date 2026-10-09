"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";

import { CheckmarkIcon, ChevronDownIcon, CloseIcon } from "@/components/icons";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import { FieldLabel } from "./FieldLabel";

const t = {
  "form.clearCountry": "Clear country selection",
  "form.toggleCountryList": "Toggle country list",
  "form.noCountryResults": "No countries found",
  "form.countrySearchError": "Countries could not be loaded",
};

const FLAG_CDN = "https://flagcdn.com";
const ISO_PATTERN = /^[A-Z]{2}$/;

export type CountrySelectProps = {
  id?: string;
  label: string;
  placeholder: string;
  countries: CountryOption[];
  value: string;
  onChange: (countryId: string, country: CountryOption | null) => void;
  onBlur?: () => void;
  error?: string;
  loadError?: boolean;
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  className?: string;
};

export function filterCountries(
  countries: CountryOption[],
  term: string,
): CountryOption[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return countries;
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(needle) ||
      country.iso.toLowerCase() === needle,
  );
}

function preventFocusSteal(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
}

function Flag({ iso }: { iso: string }) {
  const [failed, setFailed] = useState(false);
  const code = ISO_PATTERN.test(iso) ? iso : "";
  if (!code) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-6 flex-none items-center justify-center overflow-hidden rounded-xs ring-1 ring-outline-outline-variant"
    >
      {failed ? (
        <span
          translate="no"
          className="w-full text-center text-[10px] leading-4 text-surface-on-surface-variant"
        >
          {code}
        </span>
      ) : (
        <img
          src={`${FLAG_CDN}/${code.toLowerCase()}.svg`}
          width={24}
          height={18}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function CountrySelect({
  id = "country",
  label,
  placeholder,
  countries,
  value,
  onChange,
  onBlur,
  error,
  loadError = false,
  required = false,
  disabled = false,
  testId = "country-select",
  className,
}: CountrySelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const singleCountry = countries.length === 1 ? countries[0] : undefined;
  const selected = countries.find((country) => country.id === value) ?? null;
  const filtered = filterCountries(countries, searchTerm);
  const showList = isOpen && !singleCountry && !disabled && !loadError;
  const fieldError = loadError ? t["form.countrySearchError"] : error;
  const listboxId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const activeDescendant =
    showList && highlightedIndex >= 0
      ? `${id}-option-${highlightedIndex}`
      : undefined;

  useEffect(() => {
    if (!singleCountry || value === singleCountry.id) return;
    onChange(singleCountry.id, singleCountry);
  }, [singleCountry, value, onChange]);

  useEffect(() => {
    if (!showList) return;
    const handleMouseDown = (event: globalThis.MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
      setHighlightedIndex(-1);
      setSearchTerm("");
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showList]);

  useEffect(() => {
    if (!showList || highlightedIndex < 0) return;
    const option = listRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"]',
    );
    if (option && typeof option.scrollIntoView === "function") {
      option.scrollIntoView({ block: "nearest" });
    }
  }, [showList, highlightedIndex]);

  function initialHighlight(list: CountryOption[]) {
    const selectedIndex = list.findIndex((country) => country.id === value);
    if (selectedIndex >= 0) return selectedIndex;
    return list.length ? 0 : -1;
  }

  function openList() {
    if (disabled || loadError || singleCountry || isOpen) return;
    setIsOpen(true);
    setHighlightedIndex(initialHighlight(filtered));
  }

  function closeList() {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setSearchTerm("");
  }

  function selectCountry(country: CountryOption | null) {
    closeList();
    onChange(country?.id ?? "", country);
  }

  function handleOptionClick(country: CountryOption) {
    selectCountry(country.id === value ? null : country);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    setHighlightedIndex(filterCountries(countries, term).length ? 0 : -1);
  }

  function moveHighlight(direction: 1 | -1) {
    if (!filtered.length) return;
    if (!showList) {
      openList();
      return;
    }
    const lastIndex = filtered.length - 1;
    const nextIndex = highlightedIndex + direction;
    if (nextIndex < 0) {
      setHighlightedIndex(lastIndex);
    } else if (nextIndex > lastIndex) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(nextIndex);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Enter": {
        event.preventDefault();
        if (!showList) {
          openList();
          break;
        }
        const country = filtered[highlightedIndex];
        if (country) selectCountry(country);
        break;
      }
      case "Escape":
        event.preventDefault();
        closeList();
        break;
      default:
        break;
    }
  }

  function toggleList() {
    if (showList) {
      closeList();
      return;
    }
    inputRef.current?.focus();
    openList();
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>) {
    if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
    if (isOpen) closeList();
  }

  const labelElement = (
    <FieldLabel
      htmlFor={id}
      label={label}
      required={required && !singleCountry}
    />
  );
  const errorElement = fieldError ? (
    <p
      id={errorId}
      role={loadError ? "alert" : undefined}
      className="mt-1 block text-xs text-states-error"
    >
      {fieldError}
    </p>
  ) : null;

  if (singleCountry) {
    return (
      <div ref={rootRef} className={cx("relative", className)}>
        <link rel="preconnect" href={FLAG_CDN} />
        {labelElement}
        <div className="flex items-center gap-2 rounded-md border border-outline-outline-variant bg-surface-surface-disabled px-3 py-2">
          <Flag key={singleCountry.id} iso={singleCountry.iso} />
          <input
            id={id}
            className="w-full min-w-0 bg-transparent text-sm text-surface-on-surface-disabled outline-hidden"
            value={singleCountry.name}
            autoComplete="country-name"
            data-testid={testId}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? errorId : undefined}
            disabled
            readOnly
          />
        </div>
        {errorElement}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cx("relative", className)}
      onBlur={handleRootBlur}
    >
      <link rel="preconnect" href={FLAG_CDN} />
      {labelElement}
      <div
        className={cx(
          "flex items-center gap-2 rounded-md border px-3 py-2 text-sm focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20",
          fieldError ? "border-states-error" : "border-outline-outline-variant",
          disabled ? "bg-surface-surface-disabled" : "bg-surface-surface",
        )}
      >
        {selected && !isOpen ? (
          <Flag key={selected.id} iso={selected.iso} />
        ) : null}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          type="text"
          className="w-full min-w-0 truncate bg-transparent text-sm text-surface-on-surface outline-hidden placeholder:text-surface-on-surface-variant disabled:text-surface-on-surface-disabled"
          value={isOpen ? searchTerm : (selected?.name ?? "")}
          placeholder={placeholder}
          autoComplete="country-name"
          data-testid={testId}
          disabled={disabled}
          required={required}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={showList ? listboxId : undefined}
          aria-activedescendant={activeDescendant}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? errorId : undefined}
          onFocus={openList}
          onClick={openList}
          onChange={handleInput}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        {value && !disabled ? (
          <button
            type="button"
            className="-my-0.5 flex size-6 flex-none items-center justify-center rounded-sm text-surface-on-surface-variant outline-hidden transition-colors hover:bg-surface-surface-container hover:text-surface-on-surface focus-visible:ring-2 focus-visible:ring-outline-outline-focus"
            aria-label={t["form.clearCountry"]}
            data-testid={`${testId}-clear`}
            onMouseDown={preventFocusSteal}
            onClick={() => selectCountry(null)}
          >
            <CloseIcon className="size-3" />
          </button>
        ) : (
          <button
            type="button"
            tabIndex={-1}
            className="-my-0.5 flex size-6 flex-none items-center justify-center text-surface-on-surface-variant"
            aria-label={t["form.toggleCountryList"]}
            aria-expanded={showList}
            aria-controls={showList ? listboxId : undefined}
            data-testid={`${testId}-toggle`}
            disabled={disabled}
            onMouseDown={preventFocusSteal}
            onClick={toggleList}
          >
            <ChevronDownIcon
              className={cx(
                "size-3 transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                showList && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {showList ? (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-outline-outline-variant bg-surface-surface p-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-surface-on-surface-variant">
              {t["form.noCountryResults"]}
            </div>
          ) : (
            filtered.map((country, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = country.id === value;
              return (
                <button
                  key={country.id}
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={isHighlighted}
                  className={cx(
                    "flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-surface-on-surface transition-colors hover:bg-surface-surface-container",
                    isHighlighted &&
                      "bg-surface-surface-container outline-2 -outline-offset-2 outline-outline-outline-focus outline-solid forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
                    isSelected && "font-medium",
                  )}
                  onMouseDown={preventFocusSteal}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleOptionClick(country)}
                >
                  <Flag iso={country.iso} />
                  <span className="min-w-0 flex-1 truncate">
                    {country.name}
                  </span>
                  {isSelected ? (
                    <CheckmarkIcon className="size-3 flex-none text-brand-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}

      {errorElement}
    </div>
  );
}
