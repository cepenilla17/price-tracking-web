import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { Typography, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

Chart.register(zoomPlugin);

const customTooltip = (tooltipItems) => {
  return tooltipItems.map((item) => `Supplier: ${item.raw.supplier_name} (${item.raw.supplier_code})`);
}

const chartConfig = {
  type: "line",
  data: {
    // labels: [],
    datasets: [
      {
        label: "Unit Price",
        data: [],
        spanGaps: false,
        borderWidth: 2,
        borderColor: "#334897",
        tension: 0.2,
        fill: true,
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            minute: "MM-DD"
          }
        },
        ticks: { source: "auto" },
        offset: false,
        font: {
          size: 8
        }
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true
          },
          mode: "x",
          speed: 100
        },
        pan: {
          enabled: true,
          mode: "x",
          speed: 0.5
        }
      },
      tooltip: {
        callbacks: {
          footer: customTooltip,
        }
      }
    }
  }
};

const chartLabels = {
  "unit_price": "Unit Price",
  "quantity": "Quantity",
}

const HistoryChart = ({chartData = [], supplier = "all"}) => {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [property, setProperty] = useState("unit_price");

  useEffect(() => {
    let newChartInstance;
    if (chartContainer && chartContainer.current) {
      newChartInstance = new Chart(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [chartContainer]);

  useEffect(() => {
    if (chartInstance && chartData) {
      updateDataset(0, chartData);
    }
  }, [chartData, property, supplier])

  const updateDataset = (datasetIndex, newData) => {
    let filteredData = []
    if (supplier && supplier !== "all") {
      filteredData = newData.filter((item) => item.supplier_id == supplier)
    } else {
      filteredData = newData;
    }
    chartInstance.data.datasets[datasetIndex].label = chartLabels[property]
    chartInstance.data.datasets[datasetIndex].data = filteredData?.map((item) => {
      return { 
        x: item.order_date,
        y: item[property],
        supplier_name: item.supplier_name, 
        supplier_code: item.supplier_code 
      }
    });
    chartInstance.update();
  };

  const handleChangeProperty = (event, newValue ) => {
    if (newValue !== null) {
      setProperty(newValue);
    }
  };

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h6" color="primary.dark" gutterBottom>Transaction History</Typography>
        <ToggleButtonGroup
          color="primary"
          size="small"
          value={property}
          exclusive
          onChange={handleChangeProperty}
          aria-label="Property"
        >
          <ToggleButton value="unit_price">Unit Price</ToggleButton>
          <ToggleButton value="quantity">Quantity</ToggleButton>
        </ToggleButtonGroup>
        </Stack>
      <canvas ref={chartContainer} />
    </div>
  );
};

export default HistoryChart;
