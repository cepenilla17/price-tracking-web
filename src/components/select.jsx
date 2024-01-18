import React from 'react'
import { FormControl, InputLabel, MenuItem, Select as MUISelect } from '@mui/material';

export default function Select({ value, onChange }) {
  return (
    <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
      <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
      <MUISelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Supplier"
          size="small"
          onChange={onChange}
      >
      <MenuItem value="all">All</MenuItem>
        {
            suppliers.map((item, idx) => {
            const id = item.supplier_id;
            return (<MenuItem key={idx} value={id}>{item.name}</MenuItem>)
            })
        }
      </MUISelect>
    </FormControl>
  )
}
