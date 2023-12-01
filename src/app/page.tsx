import { AppBar, Toolbar, Typography } from "@mui/material";
import ThemeRegistry from "./components/ThemeRegistry/ThemeRegistry";
import FileTable from "./components/FileTable/FileTable";
import { getFileList } from "./api/azure";
import UploadFile from "./components/UploadFile/UploadFIle";

export default async function Home() {
  const files = await getFileList();
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-8">
      <ThemeRegistry>
        <AppBar position="fixed" sx={{ zIndex: 2000 }}>
          <Toolbar sx={{ backgroundColor: "background.paper" }}>
            <Typography variant="h6" color="text.primary">
              File Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <UploadFile />
        <FileTable data={files} />
      </ThemeRegistry>
    </main>
  );
}
