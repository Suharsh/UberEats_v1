/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-shadow */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import bgimage from '../../images/Login/UberEatsandWokano.png';
import backendServer from '../../Config';
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';
import { setUser } from '../../state/action-creators/loginActionCreator';

const theme = createTheme();

export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelper, setEmailHelper] = useState('');
  const [passwordhelper, setPasswordHelper] = useState('');

  const onLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const email = data.get('email');
    const password = data.get('password');
    const url = `${backendServer}/customer/login`;

    axios
      .post(url, { email, password })
      .then((response) => {
        store.dispatch(setUser(response.data));
        sessionStorage.setItem('userId', response.data.CustomerId);
        sessionStorage.setItem('country', response.data.Country);
        sessionStorage.setItem('city', response.data.City);
        history.push('/customer/dashBoard');
      })
      .catch(() => {
        setEmailError(true);
        setPasswordError(true);
        setPasswordHelper('Invald username or password');
      });
  };

  const clearErrors = () => {
    setEmailError(false);
    setEmailHelper('');
    setPasswordError(false);
    setPasswordHelper('');
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
              backgroundImage: `url(${bgimage})`,
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
                Customer Login
              </Typography>
              <Box component="form" data-testid="form" onSubmit={onLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  error={emailError}
                  helperText={emailHelper}
                  value={email}
                  onChange={(e) => { clearErrors(); setEmail(e.target.value); }}
                  required
                  fullWidth
                  data-testid="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  error={passwordError}
                  helperText={passwordhelper}
                  value={password}
                  onChange={(e) => { clearErrors(); setPassword(e.target.value); }}
                  data-testid="password"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  data-testid="login"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/restaurant/register" variant="body2">
                      Do you own a Restaurant? Sign Up
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/customer/register" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
