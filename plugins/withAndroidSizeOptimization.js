const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * CreditGo Android Size Optimization Plugin
 * Enables R8 full mode for maximum code shrinking
 */

const withAndroidSizeOptimization = (config) => {
  config = withAppBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === 'groovy') {
      let contents = modConfig.modResults.contents;
      
      // Only add if not already present
      if (!contents.includes('shrinkResources true')) {
        // Add shrinking to release build type
        contents = contents.replace(
          /release\s*\{/g,
          `release {
            shrinkResources true
            minifyEnabled true`
        );
        modConfig.modResults.contents = contents;
      }
    }
    return modConfig;
  });

  return config;
};

module.exports = withAndroidSizeOptimization;
