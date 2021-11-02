/* eslint-disable import/no-named-as-default */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import backendServer from '../../Config';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';
import { store } from '../../state/store/store';

const theme = createTheme();

export default function CustomerPersonalization() {
  const [cards, setCards] = useState([]);
  const [initialLoad, setInitialLoad] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const customerId = sessionStorage.getItem('userId');
    const url = `${backendServer}/personalize/customer/${customerId}`;
    const response = await axios.get(url);
    setInitialLoad(response.data);
    setCards(response.data);
    console.log(cards);
    console.log('store is', store.getState());
  }, []);

  const handleRestaurantSearch = (searchTerm) => {
    if (searchTerm === '') {
      setCards(initialLoad);
    } else {
      const filter = cards.filter((card) => card.RestaurantName != null && card.RestaurantName.toLowerCase().includes(searchTerm.toLowerCase()));
      setCards(filter);
    }
  };

  const handleSetLocation = (locationTerm) => {
    if (locationTerm === '') {
      setCards(initialLoad);
    } else {
      const filter = cards.filter((card) => card.RestaurantName != null && card.City.toLowerCase().includes(locationTerm.toLowerCase()));
      setCards(filter);
    }
  };

  const onView = (restaurantId) => {
    sessionStorage.setItem('currentRestaurant', restaurantId);
    history.push('/customer/restaurant');
  };

  return (
    <>
      <NavigationBar type="customer" onRestaurantSearch={handleRestaurantSearch} onSetLocation={handleSetLocation} />
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
                Your Favourites!
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                All at one place.What will you pick today?
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {/* <Button variant="outlined">View Orders</Button> */}
              </Stack>

            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {console.log(cards)}
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.RestaurantId} xs={12} sm={6} md={4}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      image={card.ImageUrl}
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.RestaurantName}
                      </Typography>
                      <Typography>
                        {card.RestaurantDesc}
                      </Typography>
                      <Typography>
                        Phone :
                        {' '}
                        {card.PhoneNumber}
                      </Typography>
                      <Typography>
                        Timings :
                        {' '}
                        {card.WorkHrsFrom}
                        {' '}
                        to
                        {' '}
                        {card.WorkHrsTo}
                      </Typography>
                      <Typography>
                        Location :
                        {' '}
                        {card.City}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => onView(card.RestaurantId)} aria-label="view restaurant">
                        <VisibilityIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    </>
  );
}
