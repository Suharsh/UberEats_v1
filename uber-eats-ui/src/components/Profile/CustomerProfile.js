/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

export default function CustomerProfile() {
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [nickname, setNickName] = useState('');
  const [dob, setDOB] = useState('00-00-0000');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [cities, setCities] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState('');
  const [dobError, setDobError] = useState(false);
  const [dobHelper, setDobHelper] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberHelper, setPhoneNumberHelper] = useState('');
  const [zipError, setZipError] = useState(false);
  const [zipHelper, setZipHelper] = useState('');
  const [cityError, setCityError] = useState(false);
  const [cityHelper, setCityHelper] = useState('');

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
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const selectedDoB = new Date(payload.dob);
    if (selectedDoB >= now) {
      setDobError(true);
      setDobHelper('Date of Birth cant be a future date');
      return false;
    }
    const cityRegex = new RegExp('[a-zA-Z]{1,64}');
    if (!cityRegex.test(payload.city)) {
      setCityError(true);
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
    let url;
    if (image) {
      const imageData = new FormData();
      imageData.append('image', image);
      const response = await axios.post(`${backendServer}/image/customer`, imageData);
      setImageUrl(response.data.imageUrl);
      url = response.data.imageUrl;
    }

    const payload = {
      customerId,
      name: data.get('name'),
      email: data.get('email'),
      country: data.get('country'),
      state: data.get('state'),
      pincode: data.get('pincode'),
      phone: data.get('phone'),
      city: data.get('city'),
      nickname: data.get('nickname'),
      dob: data.get('dob'),
      imageUrl: url || imageUrl,
    };

    if (!isValid(payload)) {
      return;
    }

    axios.post(`${backendServer}/customer/${customerId}`, payload)
      .then(() => {
        history.push('/customer/dashBoard');
      })
      .catch(() => {
        console.log('Error');
      });
  };

  const filterCities = (country) => {
    const records = locations.filter((loc) => loc.value === country);
    if (records.length) { setCities(records[0].cities); } else { setCities([]); }
  };

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const customerId = sessionStorage.getItem('userId');
    setCustomerId(customerId);
    const response = await axios.get(`${backendServer}/customer/${customerId}`);
    const customer = response.data;
    setName(customer.CustomerName);
    setPhone(customer.PhoneNumber);
    setPincode(customer.Pincode);
    setDOB(customer.DateOfBirth || '0000-00-00');
    setNickName(customer.NickName);
    setCountry(customer.Country);
    filterCities(customer.Country);
    setCity(customer.City);
    setState(customer.State);
    setImageUrl(customer.ImageUrl);
  }, []);

  const onPhotoChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const onCountryChange = (event) => {
    setCountry(event.target.value);
    const records = locations.filter((loc) => loc.value === event.target.value);
    setCities(records[0].cities || []);
  };

  const fileStyle = {
    display: 'none',
  };

  const imageStyle = {
    'margin-left': '45%',
  };

  return (
    <>
      <NavigationBar type="customer" />
      <ThemeProvider theme={theme}>
        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 1,
              pb: 1,
            }}
          >
            <Container maxWidth="xs">
              <Typography
                component="h1"
                variant="h4"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Your Profile!
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary" paragraph>
                Tell us more about yourself...
              </Typography>
            </Container>
          </Box>
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
                      label="Name"
                      name="name"
                      error={nameError}
                      helperText={nameHelper}
                      onChange={(e) => { setName(e.target.value); setNameHelper(''); setNameError(false); }}
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
                      type="text"
                      id="nickname"
                      label="Nick Name"
                      name="nickname"
                      onChange={(e) => setNickName(e.target.value)}
                      autoComplete="nick name"
                      value={nickname}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="none"
                      required
                      fullWidth
                      id="dob"
                      type="date"
                      value={dob}
                      error={dobError}
                      helperText={dobHelper}
                      label="Date of Birth"
                      name="dob"
                      onChange={(e) => { setDOB(e.target.value); setDobHelper(''); setDobError(false); }}
                      autoComplete="dob"
                    />
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
                      helperText={cityHelper}
                      value={city}
                      error={cityError}
                      defaultValue=""
                      onChange={(e) => setCity(e.target.value)}
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
                      error={phoneNumberError}
                      helperText={phoneNumberHelper}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneNumberHelper(''); setPhoneNumberError(false); }}
                      autoComplete="phone"
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                    >
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Container>
        </main>
      </ThemeProvider>
    </>
  );
}
