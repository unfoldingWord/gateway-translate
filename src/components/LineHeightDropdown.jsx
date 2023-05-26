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
    { size: 'normal', verbose: 'normal', id: '1' },
    { size: '150%', verbose: '150%', id: '2' },
    { size: '200%', verbose: '200%', id: '3' },
    { size: '250%', verbose: '250%', id: '4' },
  ];

  // on click event for selecting line height
  const handleChangeLineHeight = (event) => {
    setSelectedLineHeight(event.target.value);
  };

  // Line Height Dropdown Items
 const LineHeights =
  lineHeightArray.map((lineHeight, index) => (
    <MenuItem key={index} value={lineHeight.size} style={{fontSize: "0.95em"}} >{lineHeight.verbose}</MenuItem>
  ));

  /** Return the Dropdown */
  return (
      <Grid item style={{ paddingTop: "0.25em", paddingBottom: "0.25em", paddingRight: "0.25em" }}>
        <Box sx={{ minWidth: 91 }}>
          <FormControl fullWidth style={{ maxWidth: 91 }}>
            <InputLabel id="demo-simple-select-label">LineHeight</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedLineHeight}
              label="Line Height"
              onChange={handleChangeLineHeight}
              style={{fontSize: "0.87em", minHeight: 30, maxHeight: 30 }}
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
