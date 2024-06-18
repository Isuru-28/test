import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, List, ListItem, ListItemText, Divider, Button, Tabs, Tab } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import { VictoryPie } from 'victory';

const Dashboard = () => {
  const [currentStock, setCurrentStock] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [earningComparison, setEarningComparison] = useState('');
  const [expiringDrugs, setExpiringDrugs] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [chartType, setChartType] = useState('currentStock');
  const [maxTotalAmount, setMaxTotalAmount] = useState(0);
  const COLORS = ['#FFC300', '#5BC100'];

  useEffect(() => {
    fetchCurrentStock();
    fetchAppointmentsToday();
    fetchTodayEarnings();
    fetchMonthEarnings();
    fetchYesterdayEarnings();
    fetchExpiringDrugs();
    fetchPaymentRecords();
    console.log('Today\'s Earnings:', todayEarnings);
    console.log('Yesterday\'s Earnings:', yesterdayEarnings);
  }, [todayEarnings, yesterdayEarnings]);

  const fetchCurrentStock = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/drugs/currentStock');
      // Sort by quantity (lowest first) and then by exp_date (latest date first)
      const sortedData = response.data.sort((a, b) => {
        // Sort by quantity ascending
        if (a.quantity !== b.quantity) {
          return a.quantity - b.quantity;
        }
        // If quantities are equal, sort by exp_date descending
        return new Date(b.exp_date) - new Date(a.exp_date);
      });
      setCurrentStock(sortedData);
    } catch (error) {
      console.error('Error fetching current stock:', error);
    }
  };

  const fetchAppointmentsToday = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/appointments/AppointmentsToday');
      setAppointmentsToday(response.data);
    } catch (error) {
      console.error('Error fetching appointments for today:', error);
    }
  };  

  const fetchTodayEarnings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/payments/earnings/today');
      setTodayEarnings(response.data.todayEarnings || 0);
    } catch (error) {
      console.error('Error fetching today\'s earnings:', error);
    }
  };

  const fetchMonthEarnings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/payments/earnings/month');
      setMonthEarnings(response.data.monthEarnings || 0);
    } catch (error) {
      console.error('Error fetching month\'s earnings:', error);
    }
  };

  const fetchYesterdayEarnings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/payments/earnings/yesterday');
      setYesterdayEarnings(response.data.yesterdayEarnings || 0);
      const comparison = response.data.yesterdayEarnings < todayEarnings ? 'Today is a Good day' : 'Not as good as yesterday';
      setEarningComparison(comparison);
    } catch (error) {
      console.error('Error fetching yesterday\'s earnings:', error);
    }
  };  

  const fetchExpiringDrugs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/drug/NearestExpireItems');
      setExpiringDrugs(response.data);
    } catch (error) {
      console.error('Error fetching expiring drugs:', error);
    }
  }; 

  const fetchPaymentRecords = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/payments/records'
      );
      const formattedData = response.data.map(item => ({
        ...item,
        payment_date: new Date(item.payment_date).toISOString(), // Ensure payment_date is in ISO format
        total_amount: parseFloat(item.total_amount), // Convert total_amount to a number
      }));

      // Group data by month and sort by month and year
      const groupedData = groupDataByMonth(formattedData);

      // Calculate maximum total_amount for setting Y-axis domain
      const maxAmount = Math.max(...formattedData.map(item => item.total_amount));
      setMaxTotalAmount(maxAmount);

      setPaymentRecords(groupedData);
    } catch (error) {
      console.error('Error fetching payment records:', error);
    }
  };

  const groupDataByMonth = (data) => {
    // Group data by month and sort by month and year
    const groupedData = data.reduce((acc, curr) => {
      const monthYear = new Date(curr.payment_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = { monthYear, total_amount: 0 };
      }
      acc[monthYear].total_amount += curr.total_amount;
      return acc;
    }, {});

    // Convert object to array and sort by month and year
    const sortedData = Object.values(groupedData).sort((a, b) => {
      const dateA = new Date(a.monthYear);
      const dateB = new Date(b.monthYear);
      return dateA - dateB;
    });

    return sortedData;
  };

  const handleTabChange = (event, newValue) => {
    setChartType(newValue);
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // Change 'en-GB' to your preferred locale
  };  

  const isExpiringSoon = (expDate) => {
    const today = new Date();
    const expirationDate = new Date(expDate);
    const diffTime = Math.abs(expirationDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
    return diffDays <= 30;
  };  


// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { drug_name, quantity, exp_date, unit_price } = payload[0].payload;
    const barColor = quantity < 20 ? 'red' : '#8884d8';

    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p>{`Drug: ${drug_name}`}</p>
        <p>{`Quantity: ${quantity}`}</p>
        <p>{`Expiry Date: ${exp_date ? new Date(exp_date).toLocaleDateString() : 'N/A'}`}</p>
        <p>{`Price: Rs: ${unit_price !== undefined && unit_price !== null ? parseFloat(unit_price).toFixed(2) : 'N/A'}`}</p>
        <div style={{ backgroundColor: barColor, width: '100%', height: '10px', marginTop: '5px' }}></div>
      </div>
    );
  }
  return null;
};

const CustomTooltipForLineChart = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { monthYear, total_amount } = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p>{`Month: ${monthYear}`}</p>
        <p>{`Amount: ${total_amount.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};


  return (
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{paddingTop:'10px'}}>
        {/* Chart Section */}
        <Grid item xs={12} lg={8}>
            <Paper elevation={3} style={{ height: '340px' , padding:'20px' }}>
              <Tabs
                value={chartType}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Current Stock" value="currentStock" />
                <Tab label="Income Distribution" value="incomeDistribution" />
              </Tabs>
              <div style={{ height: '100%' }}>
                <ResponsiveContainer width="100%" height="85%">
                  {chartType === 'currentStock' ? (
                      <BarChart data={currentStock} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="drug_name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          {/* <Legend /> */}
                          <Bar dataKey="quantity" barSize={40} barCategoryGap={3}>
                            {currentStock.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.quantity < 20 ? 'red' : '#8884d8'} />
                            ))}
                          </Bar>
                    </BarChart>
                  ) : (
                    paymentRecords.length > 0 && ( // Check if paymentRecords has data
                      <LineChart
                      data={paymentRecords}
                      margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="monthYear" />
                      <YAxis domain={[0, maxTotalAmount + 200]} /> {/* Adjust Y-axis domain */}
                      <Tooltip content={<CustomTooltipForLineChart />} />
                      {/* <Legend /> */}
                      <Line type="monotone" dataKey="total_amount" stroke="#8884d8" />
                    </LineChart>
                    )
                  )}
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>

        {/* Earnings Section */}
        <Grid item xs={12} lg={4}>
    <Paper elevation={3} style={{ height: '340px', padding: '30px' }}>
        <Typography variant="h5" gutterBottom>
            Earnings
        </Typography>
        <Typography variant="body1">{`Monthly earnings: Rs ${parseFloat(monthEarnings).toFixed(2)}`}</Typography>
        <Typography variant="body1">{`Today's earnings: Rs ${parseFloat(todayEarnings).toFixed(2)}`}</Typography>
        <Typography variant="body1">{`Yesterday's earnings: Rs ${parseFloat(yesterdayEarnings).toFixed(2)}`}</Typography>
        <Typography variant="body1">{` ${earningComparison}`}</Typography>
        
        <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-20px' }}>
            {todayEarnings > 0 || yesterdayEarnings > 0 ? (
                <VictoryPie
                    data={[
                        { x: 'Yesterday', y: yesterdayEarnings },
                        { x: 'Today', y: todayEarnings }
                    ]}
                    colorScale={COLORS}
                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
                    innerRadius={70}
                    padAngle={2}
                    labelRadius={75}
                    style={{
                        labels: {
                            fontSize: 24,
                            fill: "black"
                        },
                        data: {
                            fillOpacity: 0.8
                        }
                    }}
                />
            ) : (
                <Typography variant="body2">No earnings to display.</Typography>
            )}
        </div>
    </Paper>
</Grid>

        
        
        {/* Appointments Section */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={3} style={{ height: '300px' , padding:'20px', overflow: 'auto', scrollbarWidth: 'none', '-ms-overflow-style': 'none'}}>
            <Typography  variant="h6" gutterBottom>
              Appointments Booked Today
            </Typography>
            <List>
              {appointmentsToday.length > 0 ? (
                appointmentsToday.map((appointment, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Pet: ${appointment.pet_name}`}
                        secondary={`Time: ${
                          formatTime(appointment.timeslot)
                        }`}
                      />
                      <ListItemText
                        primary={`Date: ${
                          formatDate(appointment.appdate)
                        }`}
                      />
                    </ListItem>
                    {index < appointmentsToday.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2">No appointments for today.</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Expiring Items Section */}
        <Grid item xs={12} lg={5}>
            <Paper elevation={3} style={{ height: '300px', padding: '30px', overflow: 'auto', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
              <Typography variant="h6" gutterBottom>
                Expiring Drugs
              </Typography>
              <List>
                {expiringDrugs.length > 0 ? (
                  expiringDrugs.map((drug, index) => (
                    <React.Fragment key={drug.drug_id}>
                      <ListItem>
                        <ListItemText
                          primary={`Drug: ${drug.drug_name}`}
                          secondary={`Expiry Date: ${formatDate(drug.exp_date)}`}
                          style={{ color: isExpiringSoon(drug.exp_date) ? 'red' : 'black' }}
                        />
                        <ListItemText
                          primary={`Available Quantity: ${drug.quantity}`}
                        />
                      </ListItem>
                      {index < expiringDrugs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2">No drugs expiring soon.</Typography>
                )}
              </List>
            </Paper>
          </Grid>


      </Grid>
      </Container>
      </React.Fragment>
  );
};

export default Dashboard;
