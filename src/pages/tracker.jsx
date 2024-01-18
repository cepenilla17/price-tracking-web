import React, {useEffect, useState} from 'react';
import HistoryChart from '../components/history-chart';
import axios from "../axios";
import { Autocomplete, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomDatePicker from "../components/date-picker";
import dayjs from "dayjs";

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount);
}

export default function PriceTracker() {
  const [history, setHistory] = useState([])
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState('all');
  const [suppliers, setSuppliers] = useState([]);
  const [overallStats, setOverallStats] = useState({})
  const [stats, setStats] =  useState({});
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "year"));
  const [endDate, setEndDate] = useState(dayjs());

  const handleChangeProduct = (event, newValue) => {
    if (newValue) {
      setProduct(newValue.id);
    } else {
      setProduct('');
    }
  };

  const fetchHistory = async() => {
    if (product) {
      const filters = {};
      if (startDate) {
        filters["startDate"] = dayjs(startDate).format('YYYY-MM-DD');;
      }
      if (endDate) {
        filters["endDate"] = dayjs(endDate).format('YYYY-MM-DD');;
      }

      const result = await axios.get(
        `/history/${product}`,
        {
          params: filters
        }
      )
      setHistory(result.data.tx_history)
      setSuppliers(result.data.suppliers)
      setOverallStats(result.data.stats)
      setStats(result.data.stats)
    }
  }

  const fetchProducts = async() => {
    const result = await axios.get('/product')
    setProducts(result.data.products)
  }

  const handleChangeSupplier = (event) => {
    const newValue = event.target.value;
    setSupplier(newValue);
  };

  const handleChangeStartDate = (value) => {
    if (value) {
      const formattedDate = dayjs(value).format('YYYY-MM-DD');
      if (formattedDate !== "Invalid Date") {
        setStartDate(value);
      }
    } else {
      setStartDate(null);
    }
  }

  const handleChangeEndDate = (value) => {
    if (value) {
      const formattedDate = dayjs(value).format('YYYY-MM-DD');
      if (formattedDate !== "Invalid Date") {
        setEndDate(value);
      }
    } else {
      setEndDate(null);
    }
  }

  const resetFilters = () => {
    const lastYear = dayjs().subtract(1, "year");
    const today = dayjs();

    setSupplier("all")
    setStartDate(lastYear)
    setEndDate(today)
  }

  useEffect(() => {
    const lastYear = dayjs().subtract(1, "year");
    const today = dayjs();

    setStartDate(lastYear)
    setEndDate(today)
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [product, startDate, endDate])

  useEffect(() => {
    if (supplier == "all") {
      setStats(overallStats);
    } else {
      setStats(suppliers.filter((item) => item.supplier_id == supplier)[0])
    }
  }, [supplier])

  const tableColumns = [
    {
      field: 'name',
      headerName: 'Supplier',
      minWidth: 200,
      valueGetter: (params) =>
        `${params.row.name || ''} (${params.row.code || ''})`,
      },
    {
      field: 'min_price',
      headerName: 'Lowest Price',
      headerAlign: 'right',
      align: 'right',
      minWidth: 150,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
    {
      field: 'max_price',
      headerName: 'Highest Price',
      headerAlign: 'right',
      align: 'right',
      minWidth: 150,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
    {
      field: 'average_price',
      headerName: 'Average Price',
      headerAlign: 'right',
      align: 'right',
      minWidth: 150,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
    {
      field: 'total_quantity',
      headerName: 'Quantity Bought',
      headerAlign: 'right',
      align: 'right',
      minWidth: 160,
      renderCell: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'total_amount',
      headerName: 'Total Spend',
      headerAlign: 'right',
      align: 'right',
      minWidth: 160,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
    {
      field: 'overall_average_price',
      headerName: 'Overall Average Price',
      headerAlign: 'right',
      align: 'right',
      minWidth: 200,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
    {
      field: 'current_price',
      headerName: 'Current Price',
      headerAlign: 'right',
      align: 'right',
      minWidth: 150,
      renderCell: (params) => {
        return formatAmount(params.value);
      },
    },
  ];

  return (
    <div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{my: 4}}
      >
        <Typography variant="h4" color="primary.dark" gutterBottom>Price Tracking</Typography>
        <Stack direction={{ xs: "column", md: "row" }} width={{xs: "100%", md: "auto"}} spacing={1} alignItems="center">
          <Typography variant="text">Select Product/Service:</Typography>
          <Autocomplete
            disablePortal
            blurOnSelect
            id="product-autocomplete"
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            options={products}
            size="small"
            sx={{ minWidth: 300 }}
            onChange={handleChangeProduct}
            isOptionEqualToValue={(option) => option.id == product}
            renderInput={(params) => <TextField {...params} autoFocus label="Product/Service" />}
          />
        </Stack>
      </Stack>
      {
        (product && stats && history) ? (
          <>
            <Typography variant="h6" color="primary.dark" align="left">Filters</Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              sx={{my: 2}}
            >
              <FormControl sx={{ m: 1, minWidth: { xs: "100%", md: "160px" } }} size="small">
                <InputLabel id="supplier">Supplier</InputLabel>
                <Select
                  labelId="supplier-label"
                  id="supplier-select"
                  value={supplier}
                  label="Supplier"
                  size="small"
                  onChange={handleChangeSupplier}
                >
                  <MenuItem value="all">All</MenuItem>
                  {
                    suppliers.map((item, idx) => {
                      const id = item.supplier_id;
                      return (<MenuItem key={idx} value={id}>{item.name}</MenuItem>)
                    })
                  }
                </Select>
              </FormControl>
              <Stack direction={{ xs: "column", sm: "row" }} width={{ xs: "100%", md: "auto" }} spacing={1} alignItems="center">
                <CustomDatePicker 
                  size="small" 
                  label="Start Date" 
                  value={startDate} 
                  maxDate={endDate} 
                  onChange={handleChangeStartDate} 
                  sx={{width: {xs: "100%", md: "auto"}}}
                />
                <CustomDatePicker 
                  size="small" 
                  label="End Date" 
                  minDate={startDate} 
                  value={endDate} 
                  onChange={handleChangeEndDate} 
                  sx={{ width: {xs: "100%", md: "auto"}}}
                  disableFuture 
                />
              </Stack>
              <Button onClick={resetFilters} variant="contained" color="secondary" sx={{ width: {xs: "100%", md: "auto"}}}>Reset Filters</Button>
            </Stack>
            {/* <Typography variant="h6" color="primary.dark" align='left' sx={{mt: 4}}>Transaction Summary</Typography> */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
              sx={{my: 4}}
            >
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                    Lowest Price
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatAmount(stats?.min_price)}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Per Unit/Order
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                  Highest Price
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatAmount(stats?.max_price)}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Per Unit/Order
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                    Average Price
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatAmount(stats?.average_price)}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Per Unit/Order
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{my: 4}}
            >
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                    Quantity Bought
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatNumber(stats?.total_quantity)}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                  Total Spend
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatAmount(stats?.total_amount)}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{width: '100%'}}>
                <CardContent>
                  <Typography color="primary.light" gutterBottom>
                    Overall Average Price
                  </Typography>
                  <Typography variant="h3" component="div">
                    {formatAmount(stats?.overall_average_price)}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
            <HistoryChart chartData={history} supplier={supplier} />
            <Typography variant="h6" color="primary.dark" align='left' gutterBottom sx={{ mt: 4 }}>Suppliers of the Product/Service</Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={suppliers}
                columns={tableColumns}
                getRowId={(item) => item.supplier_id}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                  columns: {
                    columnVisibilityModel: {
                      current_price: false,
                    },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </div>
          </>
        ) : (
          <>No Product/Service Selected</>
        )
      }
    </div>
  )
}
