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
    { size: '1em', verbose: '100%', id: '2' },
    { size: '1.15em', verbose: '115%', id: '3' },
    { size: '1.30em', verbose: '130%', id: '4' },
    { size: '1.5em', verbose: '150%', id: '5' },
  ];

  // on click event for selecting font size
  const handleChangeSize = (event) => {
    setSelectedFontSize(event.target.value);
  };

  // Font Size Dropdown Items
  const FontSizes =
    fontSizeArray.map((fontSize, index) => (
      <MenuItem key={index} value={fontSize.size} style={{fontSize: "0.95em"}} >{fontSize.verbose}</MenuItem>
    ));

  /** Return the Dropdown */
  return (
    <Grid item style={{ padding: "0.25em" }} >
      <Box sx={{ minWidth: 81 }} >
        <FormControl fullWidth style={{ maxWidth: 81 }} >
          <InputLabel id="demo-simple-select-label">FontSize</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFontSize}
            label="Font Size"
            onChange={handleChangeSize}
            style={{fontSize: "0.87em", minHeight: 30, maxHeight: 30 }}
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
