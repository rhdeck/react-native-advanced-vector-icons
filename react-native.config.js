const {
  ios: { getPlistValue, setPlistValue },
  android,
} = require("@raydeck/react-native-utilities");
const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");

const defaultFonts = ["MaterialCommunityIcons.ttf", "MaterialIcons.ttf"];
const defaultApply =
  'apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"';
module.exports = {
  advanced: {
    prelink: ({ iosOnly, androidOnly, jsOnly }) => {
      const doIos = iosOnly || (!androidOnly && !jsOnly);
      const doAndroid = androidOnly || (!iosOnly && !jsOnly);
      if (doIos) {
        //Update plist values
        const startValue = getPlistValue("UIAppFonts");
        if (!startValue) {
          setPlistValue("UIAppFonts", defaultFonts);
        }
      }
      if (doAndroid) {
        //Update app/build.gradle
        const androidAppPath = android.getAppPath();
        const gradlePath = join(androidAppPath, "build.gradle");
        const gradleText = readFileSync(gradlePath, { encoding: "utf8" });
        if (!gradleText.includes(defaultApply))
          writeFileSync(gradlePath, [gradleText, defaultApply].join("\n"));
      }
    },
  },
};
