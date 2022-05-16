import { extendTheme } from "@chakra-ui/react";
import styles from "./style";
import colors from "./color";
import fonts from "./fonts";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const overrides = {
  config,
  styles,
  colors,
  fonts,
};

export default extendTheme(overrides);
