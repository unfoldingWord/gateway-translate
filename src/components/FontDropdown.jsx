/* eslint-disable test-selectors/button, test-selectors/onClick */
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";
import FontMenuItem from "./FontMenuItem";

import {
  useDetectFonts,
  useAssumeGraphite,
  fontList as fontsArray,
  graphiteEnabledFontList as graphiteEnabledFontsArray
} from 'font-detect-rhl';

// import GraphiteEnabledWebFontsArray from '../embeddedWebFonts/GraphiteEnabledWebFonts.json';
// import '../embeddedWebFonts/GraphiteEnabledWebFonts.css';

export default function FontDropdown(fontDropdownProps) {
  const { selectedFont, setSelectedFont } = fontDropdownProps;

  // on click event for selecting font
  const handleChange = (event) => {
    setSelectedFont(event.target.value);
  };

  const styles = {
    menuItem: {
      width: "14rem",
      display: "flex",
      justifyContent: "space-between"
    }
  };

  // Should Graphite-enabled fonts be detected?
  const isGraphiteAssumed = useAssumeGraphite({});

  // Detecting Graphite-enabled fonts
  const detectedGEFonts = useDetectFonts({
    fonts: isGraphiteAssumed ? graphiteEnabledFontsArray : []
  });

  const detectedGEFontsComponents =
    isGraphiteAssumed &&
    detectedGEFonts.map((font, index) => (
      <MenuItem key={index} value={font.name} dense>
        <FontMenuItem font={font} />
      </MenuItem>
    ));

  const noneDetectedGEMsg = "none detected";
  
  //Detecting fonts:
  const detectedFonts = useDetectFonts({ fonts: fontsArray });

  /** Assemble dropdown menu item buttons for detected fonts */
  const detectedFontsComponents = detectedFonts.map((font, index) => (
    <MenuItem key={index} value={font.name} dense>
      <FontMenuItem font={font} />
    </MenuItem>
  ));

  //No fonts detected message for any group of fonts:
  const noneDetectedMsg = "-none detected-";

  /** Return the Dropdown */
  return (
    <Grid item xs={6} style={{ maxWidth: 300, padding: "0.25em" }}>
      <Box sx={{ minWidth: 220 }}>
        <FormControl fullWidth style={{ maxWidth: 250 }}>
          <InputLabel id="demo-simple-select-label">Font</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFont}
            label="Font"
            onChange={handleChange}
          >
            <MenuItem key={1} value="monospace">
              default
            </MenuItem>
            {isGraphiteAssumed && <hr />}
            <b>
              {isGraphiteAssumed && "Graphite-Enabled Fonts:"}
              {detectedGEFontsComponents.length === 0 &&
                isGraphiteAssumed &&
                noneDetectedGEMsg}
            </b>
            {detectedGEFontsComponents}
            <hr />
            <b>
              Detected Fonts:{" "}
              {detectedFontsComponents.length === 0 && noneDetectedMsg}
            </b>
            {detectedFontsComponents}
          </Select>
        </FormControl>
      </Box>
    </Grid>
  );
}

FontDropdown.propTypes = {
  /** Selected Font */
  selectedFont: PropTypes.string,
  /** Set Selected Font */
  setSelectedFont: PropTypes.func.isRequired,
};

FontDropdown.defaultProps = {
  selectedFont: 'monospace',
};
