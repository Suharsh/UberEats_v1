/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ReceiptIcon from '@mui/icons-material/Receipt';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Receipt from './Reciept';
// eslint-disable-next-line import/no-named-as-default
import NavigationBar from '../Navigation/NavigationBar';
import backendServer from '../../Config';

const theme = createTheme();

const statuses = [
  {
    key: 'all',
    value: 'All Orders',
  },
  {
    key: 'recieved',
    value: 'Order Recieved',
  },
  {
    key: 'preparing',
    value: 'Preparing',
  }, {
    key: 'pickup-ready',
    value: 'Pick Up Ready',
  },
  {
    key: 'picked',
    value: 'Picked Up',
  },
  {
    key: 'ontheway',
    value: 'On The Way',
  },
  {
    key: 'delivery',
    value: 'Delivered',
  }];

const CustomerOrder = () => {
  const [initialLoad, setInitialLoad] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState([]);
  const [openOrder, setOpenOrder] = useState(false);
  const [status, setStatus] = useState('All Orders');
  const history = useHistory();

  const onStatusChange = (event) => {
    setStatus(event.target.value);
    if (event.target.value === 'All Orders') {
      setCards(initialLoad);
    } else if (event.target.value !== '') {
      const sfilter = initialLoad.filter((item) => item.OrderStatus != null && item.OrderStatus === event.target.value);
      setCards(sfilter);
    }
  };

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const customerId = sessionStorage.getItem('userId');
    const response = await axios.get(`${backendServer}/orders/customer/${customerId}`);
    setCards(response.data);
    setInitialLoad(response.data);
  }, []);

  const onView = (card) => {
    setCurrentCard(card);
    setOpenOrder(true);
  };

  return (
    <>
      <NavigationBar type="customer" search={false} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Your Orders!
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Here's what you have ordered...
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {/* <Button variant="outlined">View Orders</Button> */}
              </Stack>

              <TextField
                margin="normal"
                required
                fullWidth
                select
                value={status}
                onChange={onStatusChange}
                name="status"
                label="Order Status"
                type="text"
                id="status"
                autoComplete="status"
              >
                {statuses.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>

            </Container>
          </Box>
          <Container sx={{ py: 4 }} maxWidth="md">
            <Grid container spacing={1}>
              {cards.map((card) => (
                <Grid item key={card.OrderId} xs={12}>
                  <Card>
                    <CardContent>
                      <Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.RestaurantName}
                          </Typography>
                          <Typography>
                            Ordered on :
                            {card.CreatedAt}
                          </Typography>
                          <Typography>
                            Order Status :
                            {card.OrderStatus}
                          </Typography>
                          <Typography>
                            Order Type :
                            {card.DeliveryType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <IconButton label="View Reciept" onClick={() => onView(card)} aria-label="view restaurant">
                            <ReceiptIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          <div>
            <Dialog open={openOrder} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Order Reciept</DialogTitle>
              <DialogContent>
                <Receipt order={currentCard} />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={() => setOpenOrder(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
};

export default CustomerOrder;
