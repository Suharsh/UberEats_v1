/* eslint-disable no-alert */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';
import backendServer from '../../Config';
import Review from './Review';
import AddressForm from './AddressForm';

const steps = ['Review your order', 'Delivery address', 'Place Order'];

const theme = createTheme();

export default function CustomerCheckOut() {
  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressName, setAddressName] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const history = useHistory();

  const isPlaceOrder = () => activeStep + 1 === steps.length;

  const isAddressfilled = () => ((activeStep + 1 === 2) && (selectedAddress === 'None' || selectedAddress === '' || selectedAddress === undefined));

  const cleanUpTransaction = () => {
    setCart([]);
    sessionStorage.removeItem('currentCart');
    sessionStorage.removeItem('checkoutCart');
    sessionStorage.removeItem('deliveryAddress');
    sessionStorage.removeItem('mode');
  };

  const postOrder = (customerId, addressId) => {
    const mode = sessionStorage.getItem('mode');
    const restaurantId = sessionStorage.getItem('currentRestaurant');
    axios.post(`${backendServer}/orders/customer/${customerId}`, {
      addressId, cart, deliverytype: mode, restaurantId,
    })
      .then(() => {
        cleanUpTransaction();
      })
      .catch(() => {
        cleanUpTransaction();
        alert('An error occured while posting the order. Please try again.');
      });
  };

  const handleNext = async () => {
    setActiveStep(activeStep + 1);
    if (isAddressfilled()) {
      const address = {
        AddressLine1: addr1,
        AddressLine2: addr2,
        City: city,
        State: state,
        Country: country,
        PinCode: pincode,
        AddressName: addressName,
        Save: checked,
        SavaAsName: selectedAddress,
      };
      sessionStorage.setItem('deliveryAddress', JSON.stringify(address));
    }
    if (isPlaceOrder()) {
      const customerId = sessionStorage.getItem('userId');
      const payload = {
        addressLine1: addr1,
        addressLine2: addr2,
        city,
        state,
        country,
        pincode,
        addressName,
        save: checked,
      };
      const address = JSON.parse(sessionStorage.getItem('deliveryAddress'));
      let addressId;
      if (('AddressId' in address) === false) {
        console.log('came');
        const response = await axios.post(`${backendServer}/deliveryAddress/customer/${customerId}`, payload);
        addressId = response.data.AddressId;
      } else {
        addressId = addressId.AddressId;
      }
      postOrder(customerId, addressId);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (!sessionStorage.getItem('userId')) {
      history.push('/');
    }
    const currentCart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
    setCart(currentCart);
  }, []);

  const onAddressChange = (event) => {
    switch (event.target.id) {
      case 'address1':
        setAddr1(event.target.value);
        break;
      case 'address2':
        setAddr2(event.target.value);
        break;
      case 'country':
        setCountry(event.target.value);
        break;
      case 'city':
        setCity(event.target.value);
        break;
      case 'state':
        setState(event.target.value);
        break;
      case 'zip':
        setPincode(event.target.value);
        break;
      case 'saveAddress':
        setChecked(event.target.checked);
        break;
      case 'addressName':
        setAddressName(event.target.value);
        break;
      default:
        break;
    }
    if (event.target.name === 'addressSelect') {
      setSelectedAddress(event.target.checked);
    }
  };

  const onViewStatus = () => {
    history.push('/customer/orders');
  };

  const onAddressSelect = (addr) => {
    setAddr1(addr.AddressLine1);
    setAddr2(addr.AddressLine2);
    setCountry(addr.Country);
    setCity(addr.City);
    setPincode(addr.PinCode);
    setState(addr.State);
    setAddressName(addr.SavaAsName);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Review deliveryAddress={false} />;
      case 1:
        return <AddressForm onAddressChange={onAddressChange} onAddressSelect={onAddressSelect} />;
      case 2:
        return <Review deliveryAddress />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavigationBar type="customer" />
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <>
              {activeStep === steps.length ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order is placed. You can check the status of your order in your orders page.
                  </Typography>
                  <Button onClick={onViewStatus} variant="outlined">Check Status</Button>
                </>
              ) : (
                <>
                  {getStepContent(activeStep)}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                    </Button>
                  </Box>
                </>
              )}
            </>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
