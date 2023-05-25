import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Popover, Typography } from "@mui/material";

export default function FontMenuItem({ font }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewFont, setPreviewFont] = useState({ name: "Ezra-shipped, Noto-Sans-shipped" });

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const styles = {
    menuItem: {
      width: "13rem",
      display: "flex",
      justifyContent: "space-between"
    },
    previewltr: {
      fontFamily: previewFont.name,
      fontSize: "1em",
      maxWidth: "35vw",
      direction: "LTR"
    },
    previewrtl: {
      fontFamily: previewFont.name,
      fontSize: "1em",
      maxWidth: "35vw",
      direction: "RTL"
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div style={(styles.menuItem, { borderBottom: "1px outset" })}>
      <div
        style={styles.menuItem}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={(e) => {
          handlePopoverOpen(e);
          setPreviewFont(font);
        }}
        onMouseLeave={handlePopoverClose}
      >
        <Typography variant="body2" component="div">
          {font.name}&nbsp;
        </Typography>
        <Typography
          noWrap
          variant="body2"
          component="div"
          style={{ fontFamily: font.name }}
        >
          {font.name}
        </Typography>
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }} style={styles.previewltr}>
          He was with God<br />in the beginning.
        </Typography>
        <Typography sx={{ p: 1 }} style={styles.previewrtl}>
          هَذَا كَانَ فِي ٱلْبَدْءِ عِنْدَ ٱللهِ.
        </Typography>
      </Popover>
    </div>
  );
}

FontMenuItem.propTypes = {
  font: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  })
};
