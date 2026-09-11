import fs from "fs";
import path from "path";
import { ClinicBrandConfig, DEFAULT_CLINIC_BRANDING } from "@/types/branding";

const CONFIG_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "clinic-branding-config.json"
);

// Global in-memory cache to ensure state is shared across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __clinicBrandingCache: ClinicBrandConfig | undefined;
}

/**
 * Loads the active clinic branding configuration.
 */
export function getClinicBrandingConfig(): ClinicBrandConfig {
  if (global.__clinicBrandingCache) {
    return global.__clinicBrandingCache;
  }

  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const fileData = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      global.__clinicBrandingCache = {
        ...DEFAULT_CLINIC_BRANDING,
        ...parsed,
        logo: {
          ...DEFAULT_CLINIC_BRANDING.logo,
          ...(parsed.logo || {}),
        },
      };
      return global.__clinicBrandingCache;
    }
  } catch (error) {
    console.warn(
      "Could not read clinic branding config file, using defaults:",
      error
    );
  }

  global.__clinicBrandingCache = DEFAULT_CLINIC_BRANDING;
  return global.__clinicBrandingCache;
}

/**
 * Updates the clinic branding configuration and persists it to disk.
 */
export function updateClinicBrandingConfig(
  newConfig: Partial<ClinicBrandConfig>
): ClinicBrandConfig {
  const current = getClinicBrandingConfig();

  const updated: ClinicBrandConfig = {
    ...current,
    ...newConfig,
    logo: {
      ...current.logo,
      ...(newConfig.logo || {}),
    },
  };

  global.__clinicBrandingCache = updated;

  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      CONFIG_FILE_PATH,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to write clinic branding config to disk:", error);
  }

  return updated;
}

/**
 * Resets clinic branding configuration to default factory baseline.
 */
export function resetClinicBrandingConfig(): ClinicBrandConfig {
  return updateClinicBrandingConfig(DEFAULT_CLINIC_BRANDING);
}
