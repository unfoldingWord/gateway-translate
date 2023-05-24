import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";

export default function LineHeightDropdown(lineHeightDropdownProps) {
  const { selectedLineHeight, setSelectedLineHeight } = lineHeightDropdownProps;

  const lineHeightArray = [
    { size: '150%', verbose: '150%', id: '1' },
    { size: '200%', verbose: '200%', id: '2' },
    { size: '250%', verbose: '250%', id: '3' },
    { size: 'normal', verbose: 'default', id: '4' },
  ];

  // on click event for selecting line height
  const handleChangeLineHeight = (event) => {
    setSelectedLineHeight(event.target.value);
  };

  // Line Height Dropdown Items
 const LineHeights =
  lineHeightArray.map((lineHeight, index) => (
    <MenuItem key={index} value={lineHeight.size}>{lineHeight.verbose}</MenuItem>
  ));

  /** Return the Dropdown */
  return (
      <Grid item style={{ paddingTop: "0.25em", paddingBottom: "0.25em", paddingRight: "0.25em" }}>
        <Box sx={{ minWidth: 96 }}>
          <FormControl fullWidth style={{ maxWidth: 96 }}>
            <InputLabel id="demo-simple-select-label">LineHeight</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedLineHeight}
              label="LineHeight"
              onChange={handleChangeLineHeight}
            >
              {LineHeights}
            </Select>
          </FormControl>
        </Box> 
      </Grid>
  );
}

LineHeightDropdown.propTypes = {
  /** Selected Line Height */
  selectedLineHeight: PropTypes.string,
  /** Set Selected Line Height */
  setSelectedLineHeight: PropTypes.func.isRequired,
};

LineHeightDropdown.defaultProps = {
  selectedLineHeight: 'normal',
};
