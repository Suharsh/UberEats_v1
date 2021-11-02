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
import { useState } from 'react';
import bgImage from '../../images/Login/Uber-Eats-Register.jpeg';
import backendServer from '../../Config';
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setUser } from '../../state/action-creators/loginActionCreator';

const theme = createTheme();

export default function CustomerRegistration() {
  const history = useHistory();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelper, setEmailHelper] = useState('');
  const [passwordhelper, setPasswordHelper] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState('');

  const isValid = (email, password, customerName) => {
    if (email && password) {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isEmail = regex.test(String(email).toLowerCase());
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
    if (customerName.length > 320) {
      setNameError(true);
      setNameHelper('Restaurant cant have more than 256 characters');
      return false;
    }
    return true;
  };

  const onRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    if (!isValid(data.get('email'), data.get('password'), data.get('name'))) {
      return;
    }

    const payload = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    };

    const url = `${backendServer}/customer/register`;

    axios
      .post(url, payload)
      .then((response) => {
        store.dispatch(setUser(response.data));
        sessionStorage.setItem('userId', response.data.CustomerId);
        history.push('/customer/dashBoard');
      })
      .catch(() => {
        setEmailError(true);
        setEmailHelper('User with the email id already exists');
      });
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
                Customer Sign Up
              </Typography>
              <Box component="form" onSubmit={onRegister} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  data-testid="name"
                  error={nameError}
                  onChange={() => { setNameHelper(''); setNameError(false); }}
                  helperText={nameHelper}
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error={emailError}
                  helperText={emailHelper}
                  onChange={() => { setEmailHelper(''); setEmailError(false); }}
                  id="email"
                  label="Email Address"
                  name="email"
                  data-testid="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  onChange={() => { setPasswordHelper(''); setPasswordError(false); }}
                  error={passwordError}
                  helperText={passwordhelper}
                  data-testid="password"
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

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
