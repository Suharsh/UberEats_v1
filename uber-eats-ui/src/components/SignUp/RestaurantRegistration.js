import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import bgImage from '../../images/Login/Uber-Eats-Register.jpeg';
import backendServer from '../../Config';
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setUser } from '../../state/action-creators/loginActionCreator';

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

export default function RestaurantRegistration() {
  const history = useHistory();
  const [country, setCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelper, setEmailHelper] = useState('');
  const [passwordhelper, setPasswordHelper] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState('');

  const isValid = (email, password, restaurantName) => {
    if (email && password) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isEmail = re.test(String(email).toLowerCase());
      if (!isEmail) {
        setEmailError(true);
        setEmailHelper('Please provide a valid email');
        return false;
      }
      if (password.length < 8) {
        setPasswordError(true);
        setPasswordHelper('Password must be atleast 8 characters');
        return false;
      }
    }
    if (restaurantName.length > 320) {
      setNameError(true);
      setNameHelper('Restaurant cant have more than 320 characters');
      return false;
    }
    return true;
  };

  const onRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const url = `${backendServer}/restaurant/register`;
    if (!isValid(data.get('email'), data.get('password'), data.get('name'))) {
      return;
    }
    axios
      .post(url, {
        email: data.get('email'),
        password: data.get('password'),
        name: data.get('name'),
        country: data.get('country'),
        city: data.get('city'),
      })
      .then((response) => {
        store.dispatch(setUser(response.data));
        sessionStorage.setItem('userId', response.data.RestaurantId);
        history.push('/restaurant/dashBoard');
      })
      .catch(() => {
        setEmailError(true);
        setPasswordHelper('Restaurant with the email id already exists');
      });
  };

  const onCountryChange = (event) => {
    setCountry(event.target.value);
    const records = locations.filter((loc) => loc.value === event.target.value);
    setCities(records[0].cities || []);
  };

  return (
    <>
      <NavigationBar type="signup" />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Restaurant Sign Up
              </Typography>
              <Box component="form" onSubmit={onRegister} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Restaurant Name"
                  name="name"
                  error={nameError}
                  helperText={nameHelper}
                  onChange={() => { setNameHelper(''); setNameError(false); }}
                  autoComplete="restaurant-name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  error={emailError}
                  helperText={emailHelper}
                  onChange={() => { setEmailError(false); setEmailHelper(''); }}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error={passwordError}
                  helperText={passwordhelper}
                  onChange={() => { setPasswordError(false); setPasswordHelper(''); }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <TextField
                  margin="normal"
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

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="city"
                  label="City"
                  type="text"
                  id="city"
                  defaultValue=""
                  autoComplete="city"
                >
                  {cities.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
