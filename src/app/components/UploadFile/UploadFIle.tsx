"use client";
import * as React from "react";
import { Button } from "@mui/material";

export default function UploadFile() {
  return (
    <Button component="label" variant="contained">
      Upload file
      <input
        directory="directory"
        multiple
        webkitdirectory="webkitdirectory"
        id="files"
        type="file"
        style={{
          display: "none",
        }}
        onChange={(e) => {
          // post request
          const files = e.target.files;
          fetch("/api/upload", {
            method: "POST",
            body: files,
          });
        }}
      />
    </Button>
  );
}
