import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid, Typography, Divider } from "@mui/material";
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
      width: "13rem",
      display: "flex",
      justifyContent: "space-between"
    },
    fontHeading: {
      marginLeft: 5,
    },
    subHeading: {
      marginLeft: 10,
      fontSize: "0.75em",
      fontStyle: 'italic',
    },
    providedFonts: {
      fontSize: "0.87em",
    }
  };

  /** Assemble dropdown menu item buttons for Web fonts over https*/
  const embeddedWebFonts = [
    { name: 'roboto', id: 'roboto' },
  ];
  const embeddedWebFontsComponents = embeddedWebFonts.map((font, index) => (
    <MenuItem key={index} value={font.name} dense>
      <FontMenuItem font={font} />
    </MenuItem>
  ));

  /** Assemble dropdown menu item buttons for embedded Graphite-Enabled TTF fonts */
  const embeddedGEFonts = [
    { name: 'Ezra-shipped', id: 'ezra-shipped' },
  ];
  const embeddedGEFontsComponents = embeddedGEFonts.map((font, index) => (
    <MenuItem key={index} value={font.name} dense>
      <FontMenuItem font={font} />
    </MenuItem>
  ));

  /** Assemble dropdown menu item buttons for embedded Google TTF fonts */
  const embeddedGoogleFonts = [
    { name: 'Noto-Sans-shipped', id: 'noto-sans-shipped' },
  ];
  const embeddedGoogleFontsComponents = embeddedGoogleFonts.map((font, index) => (
    <MenuItem key={index} value={font.name} dense>
      <FontMenuItem font={font} />
    </MenuItem>
  ));

  // Should Graphite-enabled fonts be detected?
  const isGraphiteAssumed = useAssumeGraphite({alwaysUse: true});

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
    <Grid item style={{ maxWidth: 300, paddingTop: "0.25em", paddingBottom: "0.25em" }}>
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
            <Typography style={styles.fontHeading}>
              <b>
                  Provided Fonts:{" "}
              </b>
            </Typography> 
            <MenuItem key={1} value="Ezra-shipped, Noto-Sans-shipped" dense>
              Ezra (עִבְרִית) & Noto Sans 
            </MenuItem>
            <MenuItem key={1} value="Noto-Sans-shipped" dense>
              Noto Sans
            </MenuItem>
            <MenuItem key={1} value="Ezra-shipped" dense>
              Ezra
            </MenuItem>
            <MenuItem key={1} value="roboto" dense >
              Roboto
            </MenuItem>
            {isGraphiteAssumed && <Divider />}
            <Typography style={styles.fontHeading}>
              <b>
                  {isGraphiteAssumed && "Local Graphite-Enabled Fonts: "}
              </b>
            </Typography>
            <Typography style={styles.subHeading}>
              {isGraphiteAssumed && "(use Firefox)"}
            </Typography>
              <b>
                {detectedGEFontsComponents.length === 0 &&
                  isGraphiteAssumed &&
                  noneDetectedGEMsg}
              </b>
            {detectedGEFontsComponents}
            <Divider />
            <Typography style={styles.fontHeading}>
              <b>
                Local Detected Fonts:{" "}
              </b>
            </Typography>
            {detectedFontsComponents.length === 0 && noneDetectedMsg}
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
  selectedFont: 'Ezra-shipped, Noto-Sans-shipped',
};
