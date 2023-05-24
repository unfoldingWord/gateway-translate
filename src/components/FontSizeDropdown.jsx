import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";

export default function FontSizeDropdown(fontSizeDropdownProps) {
  const { selectedFontSize, setSelectedFontSize } = fontSizeDropdownProps;

  const fontSizeArray = [
    { size: '0.75em', verbose: '75%', id: '1' },
    { size: '1.25em', verbose: '125%', id: '2' },
    { size: '1.5em', verbose: '150%', id: '3' },
    { size: '1em', verbose: 'default', id: '4' },
  ];

  // on click event for selecting font size
  const handleChangeSize = (event) => {
    setSelectedFontSize(event.target.value);
  };

  // Font Size Dropdown Items
  const FontSizes =
    fontSizeArray.map((fontSize, index) => (
      <MenuItem key={index} value={fontSize.size}>{fontSize.verbose}</MenuItem>
    ));

  /** Return the Dropdown */
  return (
    <Grid item style={{ padding: "0.25em" }}>
      <Box sx={{ minWidth: 96 }}>
        <FormControl fullWidth style={{ maxWidth: 96 }}>
          <InputLabel id="demo-simple-select-label">FontSize</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFontSize}
            label="FontSize"
            onChange={handleChangeSize}
          >
            {FontSizes}
          </Select>
        </FormControl>
      </Box>
    </Grid>
  );
}

FontSizeDropdown.propTypes = {
  /** Selected Font Size */
  selectedFontSize: PropTypes.string,
  /** Set Selected Font Size */
  setSelectedFontSize: PropTypes.func.isRequired,
};

FontSizeDropdown.defaultProps = {
  selectedFontSize: '1em',
};
