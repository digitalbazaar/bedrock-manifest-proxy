# bedrock-manifest-proxy ChangeLog

## 3.0.0 - 2022-04-29

### Changed
- **BREAKING**: Update peer deps:
  - `@bedrock/core@6`
  - `@bedrock/express@8`
  - `@bedrock/https-agent@4`
  - `@bedrock/server@5`.

## 2.0.1 - 2022-04-09

### Fixed
- Require lru-cache to avoid import order bugs.

## 2.0.0 - 2022-04-01

### Changed
- **BREAKING**: Rename package to `@bedrock/manifest-proxy`.
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Remove default export.
- **BREAKING**: Require node 14.x.

## 1.2.0 - 2022-03-29

### Changed
- Update peer deps:
  - `bedrock@4.5`
  - `bedrock-express@6.4.1`
  - `bedrock-https-agent@2.3`
  - `bedrock-server@3.2.1`.
- Update internals to use esm style and use `esm.js` to
  transpile to CommonJS.

## 1.1.0 - 2022-03-08

### Changed
- Update deps.
- Update peer deps:
  - `bedrock@4.4`
  - `bedrock-express@6.2`
  - `bedrock-https-agent@2`
  - `bedrock-server@3.1`

## 1.0.0 - 2021-05-06

### Added
- Added core files.

- See git history for changes.
