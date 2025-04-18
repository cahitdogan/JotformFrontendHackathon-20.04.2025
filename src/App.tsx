import Button from "@mui/material/Button"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { VolumeDown, VolumeUp } from "@mui/icons-material"
import { Stack, Slider } from "@mui/material"
import React from "react"

function App() {
  const [value, setValue] = React.useState<number>(30);

  const handleChange = (event: Event, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Button>Tıkla</Button>
      <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
        <VolumeDown />
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
      <Slider disabled defaultValue={30} aria-label="Disabled slider" />
    </>
  )
}

export default App
