/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-multi-spaces */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Input, MenuItem } from '@mui/material';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import NavigationBar from '../Navigation/NavigationBar';
import dishlogo from '../../images/dishlogo.png';
import backendServer from '../../Config';

const theme = createTheme();

const locations = [
  {
    value: 'United States',
    key: 'USA',
    cities: [{
      key: 'SJC',
      value: 'San Jose',
    },
    {
      key: 'MPS',
      value: 'Milpitas',
    },
    {
      key: 'SVA',
      value: 'Sunny Vale',
    },
    {
      key: 'SFO',
      value: 'San Francisco',
    },
    {
      key: 'SCA',
      value: 'Santa Clara',
    }],
  },
  {
    value: 'India',
    key: 'IN',
    cities: [{
      key: 'DEL',
      value: 'Delhi',
    }, {
      key: 'BLR',
      value: 'Bangalore',
    }],
  },
];

const deliveryModes = [{
  key: 'pickup',
  value: 'Pick-Up',
}, {
  key: 'delivery',
  value: 'Delivery',
},
{
  key: 'both',
  value: 'Pick-Up/Delivery',
}];

export default function RestaurantProfile() {
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [fromHrs, setFrmHrs] = useState('');
  const [toHrs, setToHrs] = useState('');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [pincode, setPincode] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [cities, setCities] = useState([]);
  const [mode, setMode] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberHelper, setPhoneNumberHelper] = useState('');
  const [zipError, setZipError] = useState(false);
  const [zipHelper, setZipHelper] = useState('');
  const [cityError, setCityError] = useState(false);
  const [cityHelper, setCityHelper] = useState('');
  const [fromHrsError, setFromHrsError] = useState(false);
  const [toHrsError, setToHrsError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [fromHrsHelper, setFrmHrsHelper] = useState('');
  const [toHrsHelper, setToHrsHelper] = useState('');

  const history = useHistory();

  const isValid = (payload) => {
    const nameRegex = new RegExp('[a-zA-Z]{1,256}');
    if (!nameRegex.test(payload.name)) {
      setNameError(true);
      setNameHelper('Name should contain only characters');
      return false;
    }
    const phoneRegex = new RegExp('[0-9]{10}');
    if (!phoneRegex.test(payload.phone)) {
      setPhoneNumberError(true);
      setPhoneNumberHelper('Phone number should only contain 10 digits');
      return false;
    }
    const zipRegex = new RegExp('[0-9]{5}');
    if (!zipRegex.test(payload.pincode)) {
      setZipError(true);
      setZipHelper('Pincode must only contain 5 digits');
      return false;
    }

    if (payload.fromHrs >= payload.toHrs) {
      setFromHrsError(true);
      setToHrsError(true);
      setToHrsHelper('From and To Hrs must be corrected');
      return false;
    }
    const cityRegex = new RegExp('[a-zA-Z]{1,64}');
    if (!cityRegex.test(payload.city)) {
      setCityHelper(true);
      setCityHelper('Please enter a valid city');
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    let url = null;
    if (image) {
      const imageData = new FormData();
      imageData.append('image', image);
      const response = await axios.post(`${backendServer}/image/restaurant`, imageData);
      url = response.data.imageUrl;
      setImageUrl(response.data.imageUrl);
    }

    const payload = {
      restaurantId,
      name: data.get('name'),
      desc: data.get('desc'),
      country: data.get('country'),
      state: data.get('state'),
      pincode: data.get('pincode'),
      city: data.get('city'),
      fromHrs: data.get('fromHrs'),
      toHrs: data.get('toHrs'),
      phone: data.get('phone'),
      mode: data.get('mode'),
      imageUrl: url || imageUrl,
    };
    if (!isValid(payload)) {
      return;
    }
    axios.post(`${backendServer}/restaurant/${restaurantId}`, payload)
      .then(() => {
        history.push('/restaurant/dashBoard');
      })
      .catch(() => {
        console.log('Error');
      });
  };

  const filterCities = (country) => {
    const records = locations.filter((loc) => loc.value === country);
    setCities(records[0].cities || []);
  };

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const restaurantId = sessionStorage.getItem('userId');
    const response = await axios.get(`${backendServer}/restaurant/${restaurantId}`);
    const restaurant = response.data;
    setName(restaurant.RestaurantName);
    setPhone(restaurant.PhoneNumber);
    setPincode(restaurant.Pincode);
    setFrmHrs(restaurant.WorkHrsFrom);
    setToHrs(restaurant.WorkHrsTo);
    setDesc(restaurant.RestaurantDesc);
    setCountry(restaurant.Country);
    filterCities(restaurant.Country);
    setCity(restaurant.City);
    setState(restaurant.State);
    setRestaurantId(restaurant.RestaurantId);
    setImageUrl(restaurant.ImageUrl);
    setMode(restaurant.Mode);
  }, []);

  const onCountryChange = (event) => {
    setCountry(event.target.value);
    const records = locations.filter((loc) => loc.value === event.target.value);
    setCities(records[0].cities || []);
  };

  const onPhotoChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const fileStyle = {
    display: 'none',
  };

  const imageStyle = {
    'margin-left': '45%',
  };

  return (
    <>
      <NavigationBar type="restaurant" />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <CssBaseline />
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid style={imageStyle} item xs={12} sm={6} alignItems="center">
                  <Avatar
                    src={imageUrl}
                    sx={{ width: 50, height: 50 }}
                  />
                  <label htmlFor="image">
                    <Input accept="image/*" style={fileStyle} id="image" name="image" type="file" onChange={onPhotoChange} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="text"
                    id="name"
                    label="Name of the Restaurant"
                    name="name"
                    error={nameError}
                    helperText={nameHelper}
                    onChange={(e) => { setName(e.target.value); setNameError(false); setNameHelper(''); }}
                    autoComplete="name"
                    value={name}
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    id="desc"
                    type="text"
                    value={desc}
                    label="Description your restaurant"
                    name="desc"
                    onChange={(e) => setDesc(e.target.value)}
                    autoComplete="desc"
                    autoFocus
                    multiline
                    minRows="2"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="time"
                    id="from"
                    label="Work Hrs from"
                    name="fromHrs"
                    defaultValue="07:30"
                    autoComplete="type"
                    error={fromHrsError}
                    helperText={fromHrsHelper}
                    onChange={(e) => { setFrmHrs(e.target.value); setToHrsHelper(''); setToHrsError(false); }}
                    autoFocus
                    value={fromHrs}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="time"
                    id="to"
                    label="Work Hrs to"
                    name="toHrs"
                    value={toHrs}
                    autoComplete="to"
                    error={toHrsError}
                    helperText={toHrsHelper}
                    onChange={(e) => { setToHrs(e.target.value); setToHrsError(false); setToHrsHelper(''); }}
                    defaultValue="07:30 PM"
                    autoFocus
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    select
                    name="mode"
                    label="Mode"
                    type="text"
                    id="mode"
                    value={mode}
                    onChange={(event) => { setMode(event.target.value); }}
                    autoComplete="mode"
                  >
                    {deliveryModes.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    select
                    name="country"
                    label="Country"
                    type="text"
                    id="country"
                    value={country}
                    onChange={(event) => { onCountryChange(event); }}
                    autoComplete="country"
                  >
                    {locations.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="text"
                    id="state"
                    label="State"
                    value={state}
                    name="state"
                    onChange={(e) => setState(e.target.value)}
                    autoComplete="state"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    select
                    name="city"
                    label="City"
                    type="text"
                    id="city"
                    value={city}
                    defaultValue=""
                    error={cityError}
                    helperText={cityHelper}
                    onChange={(e) => { setCity(e.target.value); setCityHelper(''); setCityError(false); }}
                    autoComplete="city"
                  >
                    {cities.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="text"
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    value={phone}
                    error={phoneNumberError}
                    helperText={phoneNumberHelper}
                    onChange={(e) => { setPhone(e.target.value); setPhoneNumberHelper(''); setPhoneNumberError(false); }}
                    autoComplete="phone"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    type="text"
                    id="pin"
                    label="Pin Code"
                    name="pincode"
                    error={zipError}
                    helperText={zipHelper}
                    value={pincode}
                    onChange={(e) => { setPincode(e.target.value); setZipError(false); setZipHelper(''); }}
                    autoComplete="pincode"
                    autoFocus
                  />
                </Grid>
              </Grid>
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
