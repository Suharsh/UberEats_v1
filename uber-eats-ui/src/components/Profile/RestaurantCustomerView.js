import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NavigationBar from '../Navigation/NavigationBar';
import dishlogo from '../../images/dishlogo.png';
import backendServer from '../../Config';

const theme = createTheme();

export default function RestaurantCustomerView() {
  const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [nickname, setNickName] = useState('');
  const [dob, setDOB] = useState('00-00-0000');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const history = useHistory();

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const customerId = sessionStorage.getItem('customerId');
    const response = await axios.get(`${backendServer}/customer/${customerId}`);
    const customer = response.data;
    setName(customer.CustomerName);
    setPhone(customer.PhoneNumber);
    setPincode(customer.Pincode);
    setDOB(customer.DateOfBirth || '0000-00-00');
    setNickName(customer.NickName);
    setCountry(customer.Country);
    setCity(customer.City);
    setState(customer.State);
    setImageUrl(customer.ImageUrl);
  }, []);

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
                Customer Profile
              </Typography>
            </Container>
          </Box>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <CssBaseline />
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid style={imageStyle} item xs={12} sm={6} alignItems="center">
                    <Avatar
                      src={imageUrl}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="none"
                      fullWidth
                      type="text"
                      id="name"
                      label="Name"
                      name="name"
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="name"
                      value={name}
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="none"
                      fullWidth
                      type="text"
                      id="nickname"
                      label="Nick Name"
                      name="nickname"
                      InputProps={{
                        readOnly: true,
                      }}
                      onChange={(e) => setNickName(e.target.value)}
                      autoComplete="nick name"
                      value={nickname}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="none"
                      fullWidth
                      id="dob"
                      type="date"
                      value={dob}
                      label="Date of Birth"
                      name="dob"
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="dob"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="none"
                      fullWidth
                      name="country"
                      label="Country"
                      type="text"
                      id="country"
                      value={country}
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="country"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="none"
                      fullWidth
                      type="text"
                      id="state"
                      label="State"
                      value={state}
                      name="state"
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="state"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="none"
                      fullWidth
                      name="city"
                      label="City"
                      type="text"
                      id="city"
                      value={city}
                      defaultValue=""
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="city"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="none"
                      fullWidth
                      type="text"
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={phone}
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="phone"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="none"
                      fullWidth
                      type="text"
                      id="pin"
                      label="Pin Code"
                      name="pincode"
                      value={pincode}
                      InputProps={{
                        readOnly: true,
                      }}
                      autoComplete="pincode"
                    />
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
