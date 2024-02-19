{ pkgs, lib, ... }:

{
  # Packages
  packages = [
    pkgs.nodePackages.pnpm
  ];

  # Languages
  languages.javascript.enable = lib.mkDefault true;
  languages.javascript.package = lib.mkDefault pkgs.nodejs_18;

  # Environment
  env.NODE_TLS_REJECT_UNAUTHORIZED = lib.mkDefault "0";
  env.NUXT_TELEMETRY_DISABLED = lib.mkDefault "1";
}
