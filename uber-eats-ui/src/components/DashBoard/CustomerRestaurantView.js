/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField, MenuItem } from '@mui/material';
import backendServer from '../../Config';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';

const theme = createTheme();

const dishTypes = [{
  key: 'all',
  value: 'All',
}, {
  key: 'starter',
  value: 'Starter',
}, {
  key: 'main-course',
  value: 'Main Course',
}, {
  key: 'dessert',
  value: 'Dessert',
}];

const dishcategory = [
  {
    key: 'all',
    value: 'All',
  },
  {
    key: 'veg',
    value: 'Veg',
  }, {
    key: 'nonveg',
    value: 'Non-Veg',
  }, {
    key: 'vegan',
    value: 'Vegan',
  }];

export default function CustomerRestaurantView() {
  const [cards, setCards] = useState([]);
  const [initialLoad, setInitialLoad] = useState([]);
  const [cart, setCart] = useState([]);
  const [tempCart, setTempCart] = useState([]);
  const history = useHistory();
  const [multipleOrderDialog, setMultipleOrderDialog] = useState(false);
  const [currentRestaurantDetails, setCurrentRestaurantDetails] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) history.push('/');
    const restaurantId = sessionStorage.getItem('currentRestaurant');
    const url = `${backendServer}/restaurant/${restaurantId}/dishes`;
    const response = await axios.get(url);
    // getGroups(response.data);
    setCards(response.data);
    setInitialLoad(response.data);
    // setselectGroups(array);
    const currentCart = JSON.parse(sessionStorage.getItem('currentCart')) || [];
    setCart(currentCart);
    const restaurantDetails = JSON.parse(sessionStorage.getItem('currentRestaurantDetails'));
    setCurrentRestaurantDetails(restaurantDetails);
  }, []);

  const persistCartOnSession = (cart) => {
    sessionStorage.setItem('currentCart', JSON.stringify(cart));
  };

  const onNewOrder = () => {
    setCart(tempCart);
    persistCartOnSession(tempCart);
    setMultipleOrderDialog(false);
  };

  const onAddToCart = (dish) => {
    if (cart.length !== 0 && dish.RestaurantId !== cart[0].RestaurantId) {
      setTempCart([{ ...dish, Quantity: 1 }]);
      setMultipleOrderDialog(true);
      return;
    }
    let newCart = [...cart, dish];
    const index = cart.findIndex((item) => item.DishId === dish.DishId);
    if (index === -1) {
      newCart = [...cart, { ...dish, Quantity: 1 }];
    } else {
      newCart = [...cart];
      newCart[index].Quantity++;
    }
    setCart(newCart);
    persistCartOnSession(newCart);
    console.log('cart', newCart);
  };

  const onRemoveFromCart = (dish) => {
    const newCart = [...cart];
    const index = newCart.findIndex((item) => item.DishId === dish.DishId);
    if (index === -1) return;
    newCart[index].Quantity > 1 ? newCart[index].Quantity-- : newCart.splice(index, 1);
    setCart(newCart);
    persistCartOnSession(newCart);
    console.log('cart', newCart);
  };

  const onSearch = (type, searchTerm) => {
    if (searchTerm === '') {
      setCards(initialLoad);
    } else {
      switch (type) {
        case 'Dishes':
          const dfilter = initialLoad.filter((card) => card.DishName != null && card.DishName.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(dfilter);
          break;
        case 'Dish Type':
          const tfilter = initialLoad.filter((card) => card.DishType != null && card.DishType.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(tfilter);
          break;
        case 'Category':
          const cfilter = initialLoad.filter((card) => card.Category != null && card.Category.toLowerCase().includes(searchTerm.toLowerCase()));
          setCards(cfilter);
          break;
        default:
          break;
      }
    }
  };

  const onSearchDishType = (searchTerm) => {
    setFilterType(searchTerm);
    if (searchTerm === 'All' && filterCategory === 'All') {
      setCards(initialLoad);
      return;
    }
    const tfilter = searchTerm === 'All' ? initialLoad : initialLoad.filter((card) => card.DishType != null
      && card.DishType === searchTerm);
    const cfilter = filterCategory === 'All' ? tfilter : tfilter.filter((card) => filterCategory != null && card.Category === filterCategory);
    setCards(cfilter);
  };

  const onSearchCategory = (searchTerm) => {
    setFilterCategory(searchTerm);
    if (searchTerm === 'All' && filterType === 'All') {
      setCards(initialLoad);
      return;
    }
    const tfilter = filterType === 'All' ? initialLoad : initialLoad.filter((card) => card.DishType != null
      && card.DishType === filterType);
    const cfilter = searchTerm === 'All' ? tfilter : tfilter.filter((card) => filterCategory != null && card.Category === searchTerm);
    setCards(cfilter);
  };

  return (
    <>
      <NavigationBar type="customer" view="customerrestaurant" search onSearch={onSearch} />
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
                {currentRestaurantDetails.RestaurantName}
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary">
                {currentRestaurantDetails.RestaurantDesc}
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary">
                Phone :
                {' '}
                {currentRestaurantDetails.PhoneNumber}
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary">
                Timings :
                {' '}
                {currentRestaurantDetails.WorkHrsFrom}
                {' '}
                hrs to
                {' '}
                {currentRestaurantDetails.WorkHrsTo}
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary">
                Location :
                {' '}
                {currentRestaurantDetails.City}
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary">
                Mode :
                {' '}
                {currentRestaurantDetails.Mode}
              </Typography>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="type"
                  label="Dish Type"
                  type="text"
                  id="type"
                  value={filterType}
                  onChange={(event) => { setFilterType(event.target.value); onSearchDishType(event.target.value); }}
                  autoComplete="Dish Type"
                >
                  {dishTypes.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  name="category"
                  label="Dish Category"
                  type="text"
                  id="category"
                  value={filterCategory}
                  onChange={(event) => { setFilterCategory(event.target.value); onSearchCategory(event.target.value); }}
                  autoComplete="Dish Category"
                >
                  {dishcategory.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
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
                        $
                        {card.Price}
                      </Typography>
                      <Typography>
                        Category:
                        {' '}
                        {card.Category}
                      </Typography>
                      <Typography>
                        Type:
                        {' '}
                        {card.DishType}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => { onAddToCart(card); }} aria-label="add to cart">
                        <AddShoppingCartIcon />
                      </IconButton>
                      <IconButton onClick={() => { onRemoveFromCart(card); }} aria-label="remove from cart">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <div>
          <Dialog open={multipleOrderDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new order?</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                Your cart contains already contains items.
                Create a new order to add items from the selected restaurant?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => onNewOrder()} variant="contained" color="primary">
                New Order
              </Button>
              <Button onClick={() => setMultipleOrderDialog(false)} variant="contained" color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ThemeProvider>
    </>
  );
}
