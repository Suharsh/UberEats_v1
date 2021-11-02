/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import axios from 'axios';
import backendServer from '../../Config';

export default function AddressForm(props) {
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressName, setAddressName] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('None');
  const [address, setAddress] = useState([{
    AddressId: '',
    AddressLine1: '',
    AddressLine2: '',
    City: '',
    State: '',
    PinCode: '',
    Country: '',
    CustomerId: '',
    Save: false,
    SavaAsName: 'None',
    SelectedAddress: '',
  }]);
  const [disableAddress, disableAddressSelection] = useState(false);

  const onAddressSelect = (event) => {
    const addr = address.filter((addr) => addr.SavaAsName === event.target.value)[0];
    setAddr1(addr.AddressLine1);
    setAddr2(addr.AddressLine2);
    setCity(addr.City);
    setCountry(addr.Country);
    setState(addr.State);
    setPincode(addr.PinCode);
    setSelectedAddress(event.target.value);
    sessionStorage.setItem('deliveryAddress', JSON.stringify({ ...addr, ...{ selectedAddress: event.target.value } }));
    props.onAddressSelect(addr);
    if (event.target.value === 'None') {
      disableAddressSelection(false);
      setAddressName('');
    } else {
      setSelectedAddress(addr.SavaAsName);
      setAddressName(addr.SavaAsName);
      disableAddressSelection(true);
    }
    props.onAddressChange(event);
  };
  useEffect(async () => {
    const customerId = sessionStorage.getItem('userId');
    const savedAddress = await axios.get(`${backendServer}/deliveryAddress/customer/${customerId}`);
    if (savedAddress.data.length !== 0) {
      const addresess = [...address, ...savedAddress.data];
      setAddress(addresess);
    }
    const addr = JSON.parse(sessionStorage.getItem('deliveryAddress'));
    if (addr) {
      setAddr1(addr.AddressLine1);
      setAddr2(addr.AddressLine2);
      setCity(addr.City);
      setCountry(addr.Country);
      setState(addr.State);
      setPincode(addr.PinCode);
      setAddressName(addr.SavaAsName);
      setChecked(addr.Save);
      setSelectedAddress(addr.SavaAsName);
      if (('Save' in addr) === false) {
        disableAddressSelection(true);
      }
      if (addr.SavaAsName === 'None') {
        disableAddressSelection(false);
        setAddressName('');
      }
    }
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Delivery address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            select
            id="addressSelect"
            value={selectedAddress}
            name="addressSelect"
            label="Select from existing address"
            onChange={onAddressSelect}
            fullWidth
            defaultValue=""
            autoComplete="delivery-address"
            variant="standard"
          >
            {address.map((addr) => (
              <MenuItem key={addr.AddressId} value={addr.SavaAsName}>
                {addr.SavaAsName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            disabled={disableAddress}
            fullWidth
            value={addr1}
            onChange={(e) => { props.onAddressChange(e); setAddr1(e.target.value); }}
            autoComplete="delivery address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            value={addr2}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setAddr2(e.target.value); }}
            autoComplete="delivery address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            value={city}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setCity(e.target.value); }}
            autoComplete="delivery address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            required
            value={state}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setState(e.target.value); }}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            value={pincode}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setPincode(e.target.value); }}
            autoComplete="delivery postal-code"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            value={country}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setCountry(e.target.value); }}
            autoComplete="delivery country"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="addressName"
            name="addressName"
            label="Save Address as"
            fullWidth
            value={addressName}
            disabled={disableAddress}
            onChange={(e) => { props.onAddressChange(e); setAddressName(e.target.value); }}
            autoComplete="Save address as"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={(
              <Checkbox
                color="secondary"
                onChange={(e) => { props.onAddressChange(e); setChecked(e.target.checked); }}
                id="saveAddress"
                disabled={disableAddress}
                name="saveAddress"
                checked={checked}
              />
)}
            label="Save this address"
          />
        </Grid>
      </Grid>
    </>
  );
}
