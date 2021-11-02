/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

export default function Review(props) {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    AddressId: '',
    AddressLine1: '',
    AddressLine2: '',
    City: '',
    State: '',
    PinCode: '',
    Country: '',
    Save: '',
    SelectedAddress: '',
  });
  const [mode, setMode] = useState('');

  useEffect(() => {
    const currentCart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
    setCart(currentCart);
    const addr = JSON.parse(sessionStorage.getItem('deliveryAddress')) || { ...address };
    const mode = sessionStorage.getItem('mode');
    setMode(mode);
    console.log('addr', addr);
    setAddress(addr);
  }, []);

  const getTotalPrice = () => cart.reduce((price, item) => price + item.Price * item.Quantity, 0);

  const getFinalPrice = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = (subtotal * 0.01).toFixed(2);
    const serviceFee = (subtotal * 0.02).toFixed(2);
    const tax = (subtotal * 0.09).toFixed(2);
    return (parseFloat(subtotal) + parseFloat(deliveryFee) + parseFloat(serviceFee) + parseFloat(tax));
  };

  const getAddressVisibility = () => {
    const visibility = (mode === 'Delivery' && props.deliveryAddress) ? 'visible' : 'hidden';
    return visibility;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cart.map((item) => (
          <ListItem key={item.DishId} sx={{ py: 1, px: 0 }}>
            <Grid container>
              <ListItemText primary={item.DishName} secondary={item.DishDesc} />
              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Quantity :
                      {item.Quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Price :
                      {item.Quantity}
                      nos x $
                      {item.Price}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Sub Total" />
          <Typography variant="subtitle1">
            $
            {getTotalPrice().toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid visibility={getAddressVisibility()} item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment Due: $
            {getFinalPrice().toFixed(2)}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Delivery Address
          </Typography>
          <Typography gutterBottom>{address.AddressLine1}</Typography>
          <Typography gutterBottom>{address.AddressLine2}</Typography>
          <Typography gutterBottom>
            {address.City}
            ,
            {address.State}
            ,
            {address.PinCode}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Price Details
          </Typography>
          <Grid container>
            <>
              <Grid item xs={6}>
                <Typography gutterBottom>Sub Total</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  $
                  {getTotalPrice().toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>Delivery fee</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  $
                  {(getTotalPrice() * 0.01).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>Service fee</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  $
                  {(getTotalPrice() * 0.02).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>Tax</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  $
                  {(getTotalPrice() * 0.09).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>Total</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  $
                  {getFinalPrice().toFixed(2)}
                </Typography>
              </Grid>
            </>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
