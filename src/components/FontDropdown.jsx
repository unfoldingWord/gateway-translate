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
    fontHeading: {
      marginLeft: 5,
    },
    subHeading: {
      marginLeft: 10,
      fontSize: "0.75em",
      fontStyle: 'italic',
    }
  };

  // Detecting Graphite-enabled fonts
  const detectedGEFonts = useDetectFonts({ fonts: graphiteEnabledFontsArray });

  const detectedGEFontsComponents = detectedGEFonts.map((font, index) => (
      <MenuItem key={index} value={font.name} dense>
        <FontMenuItem font={font} />
      </MenuItem>
    ));

  //Detecting fonts:
  const detectedFonts = useDetectFonts({ fonts: fontsArray });

  /** Assemble dropdown menu item buttons for detected fonts */
  const detectedFontsComponents = detectedFonts.map((font, index) => (
    <MenuItem key={index} value={font.name} dense>
      <FontMenuItem font={font} />
    </MenuItem>
  ));

  /** Return the Dropdown */
  return (
    <Grid item style={{ paddingTop: "0.25em", paddingBottom: "0.25em" }}>
      <Box sx={{ minWidth: 250 }} >
        <FormControl fullWidth style={{ maxWidth: 250 }} >
          <InputLabel id="demo-simple-select-label">Font</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFont}
            label="Font"
            onChange={handleChange}
            style={{fontSize: "0.87em", minHeight: 30, maxHeight: 30 }}
          >
            <Typography style={styles.fontHeading}>
              <b>
                  Provided Fonts:{" "}
              </b>
            </Typography> 
            <MenuItem key={1} value="Ezra-shipped, Noto-Sans-shipped" dense >
              <u>Ezra (עִבְרִית) & Noto Sans</u> 
            </MenuItem>
             {/* 
              <MenuItem key={1} value="Noto-Sans-shipped" dense>
                <u>Noto Sans</u>
              </MenuItem>
              <MenuItem key={1} value="Ezra-shipped" dense>
                <u>Ezra</u>
              </MenuItem>
            */}
            <MenuItem key={1} value="roboto" dense >
              <u>Roboto</u>
            </MenuItem>
            {detectedGEFontsComponents.length != 0 && <Divider />}
            <Typography style={styles.fontHeading}>
              <b>
                  {detectedGEFontsComponents.length != 0 && "Local Graphite-Enabled Fonts:"}
              </b>
            </Typography>
            <Typography style={styles.subHeading}>
              {detectedGEFontsComponents.length != 0 && "(use Firefox)"}
            </Typography>
            {detectedGEFontsComponents}
            {detectedFontsComponents.length != 0 && <Divider />}
            <Typography style={styles.fontHeading}>
              <b>
              {detectedFontsComponents.length != 0 && "Local Detected Fonts:"}
              </b>
            </Typography>
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
