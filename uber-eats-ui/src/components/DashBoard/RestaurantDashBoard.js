/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import Button from '@mui/material/Button';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { store } from '../../state/store/store';
import backendServer from '../../Config';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';

const theme = createTheme();

export default function RestaurantDashBoard() {
  const [cards, setCards] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const restaurantId = sessionStorage.getItem('userId');
    const url = `${backendServer}/restaurant/${restaurantId}/dishes`;
    const response = await axios.get(url);
    // getGroups(response.data);
    setCards(response.data);
    // setselectGroups(array);
    console.log(cards);
    console.log('store is', store.getState());
  }, []);

  const onAddDishes = () => {
    sessionStorage.removeItem('dishId');
    sessionStorage.setItem('action', 'edit');
    history.push('/restaurant/dishes');
  };

  const onViewDishes = (dishId) => {
    sessionStorage.setItem('dishId', dishId);
    sessionStorage.setItem('action', 'view');
    history.push('/restaurant/dishes');
  };

  const onEditDishes = (dishId) => {
    sessionStorage.setItem('dishId', dishId);
    sessionStorage.setItem('action', 'edit');
    history.push('/restaurant/dishes');
  };

  const onViewOrders = () => {
    history.push('/restaurant/orders');
  };

  return (
    <>
      <NavigationBar type="restaurant" />
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
                Welcome Uber-Eats
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Sell your dishes and maximise profits
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained" onClick={() => onAddDishes()}>Add Dishes</Button>
                <Button variant="outlined" onClick={() => onViewOrders()}>View Orders</Button>
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            {console.log(cards)}
            <Grid container spacing={4}>
              {cards.map((card) => (
                <Grid item key={card.DishId} xs={12} sm={6} md={4}>
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
                        {card.DishName}
                      </Typography>
                      <Typography>
                        {card.DishDesc}
                      </Typography>
                      <Typography>
                        Dish Type :
                        {' '}
                        {card.DishType}
                      </Typography>
                      <Typography>
                        Category :
                        {' '}
                        {card.Category}
                      </Typography>
                      <Typography>
                        Price : $
                        {card.Price}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => onEditDishes(card.DishId)}>Edit</Button>
                      <Button size="small" onClick={() => onViewDishes(card.DishId)}>View</Button>
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
