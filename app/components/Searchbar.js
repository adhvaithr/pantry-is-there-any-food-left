import { TextField, Stack } from "@mui/material";

export default function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
  return (
    <Stack width="800px" height="50px" spacing={2} direction={"row"}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
      />
    </Stack>
  );
}
