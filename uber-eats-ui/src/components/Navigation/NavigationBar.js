/* eslint-disable no-alert */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
  Home,
  Favorite,
  Group, AccountCircle,
} from '@material-ui/icons';
import RestaurantMenu from '@material-ui/icons/RestaurantMenu';
import RecentActors from '@material-ui/icons/RecentActors';

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge } from '@mui/material';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import logo from '../../images/Uber_Eats_2020_logo.svg';
import { store } from '../../state/store/store';
import doLogoutUser from '../../state/action-creators/loginActionCreator';
import backendServer from '../../Config';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const style = {
  background: '#bdbdbd',
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const searchDashBoard = [{
  key: 'restaurant',
  value: 'Restaurant',
}, {
  key: 'dish',
  value: 'Dishes',
}, {
  key: 'location',
  value: 'Location',
}, {
  key: 'deliverytype',
  value: 'Delivery Type',
}];

const searchRestaurant = [{
  key: 'dish',
  value: 'Dishes',
}, {
  key: 'type',
  value: 'Dish Type',
},
{
  key: 'category',
  value: 'Category',
}];

export default function NavigationBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    left: false,
  });

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [searchBy, setSearchBy] = useState('Restaurant');
  const [orderOption, setOrderOption] = useState('Delivery');
  const [deliveryModes, setDeliveryModes] = useState([]);

  useEffect(async () => {
    const currentCart = JSON.parse(sessionStorage.getItem('currentCart')) || [];
    setCart(currentCart);
    const restaurantMode = sessionStorage.getItem('mode');
    if (restaurantMode === 'Pick-up') {
      setDeliveryModes(['Pick-up']);
    } else if (restaurantMode === 'Delivery') {
      setDeliveryModes(['Delivery']);
    } else {
      setDeliveryModes(['Delivery', 'Pick-up']);
    }
    if (props.view === 'customerrestaurant') setSearchBy('Dishes');
  }, []);

  const persistCartOnSession = (cart) => {
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
  };

  const onAddToCart = (dish) => {
    if (cart.length !== 0 && dish.RestaurantId !== cart[0].RestaurantId) {
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
    if (newCart.length === 0) setOpenCart(false);
    setCart(newCart);
    persistCartOnSession(newCart);
    console.log('cart', newCart);
  };

  const getTotalPrice = () => cart.reduce((price, item) => price + item.Price * item.Quantity, 0);

  const onViewCart = () => {
    const currentCart = JSON.parse(sessionStorage.getItem('currentCart')) || [];
    if (currentCart.length) {
      setOpenCart(true);
      setCart(currentCart);
    } else {
      alert('Please add items to your cart');
    }
  };

  const onCheckOut = () => {
    persistCartOnSession(cart);
    sessionStorage.removeItem('currentCart');
    setCart([]);
    sessionStorage.setItem('mode', orderOption);
    history.push('/customer/checkout');
  };

  const cleanUpSession = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('currentCart');
    sessionStorage.removeItem('checkoutCart');
    sessionStorage.removeItem('deliveryAddress');
    sessionStorage.removeItem('currentRestaurantDetails');
    sessionStorage.removeItem('mode');
    sessionStorage.removeItem('currentRestaurant');
    sessionStorage.removeItem('city');
    sessionStorage.removeItem('country');
    sessionStorage.removeItem('dishId');
    sessionStorage.removeItem('action');
  };

  const onLogout = () => {
    cleanUpSession();
    store.dispatch(doLogoutUser());
    if (props.type === 'customer') {
      history.push('/');
    } else if (props.type === 'restaurant') {
      history.push('/restaurant/login');
    }
  };

  const getNumberOfItemsInCart = () => {
    const cart = JSON.parse(sessionStorage.getItem('currentCart')) || [];
    const noOfItems = cart.reduce((quantity, item) => quantity + item.Quantity, 0);
    return noOfItems;
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const menuItems = [
    {
      listIcon: <Home />,
      listText: 'Dashboard',
      listPath: '/restaurant/dashboard',
    },

    {
      listIcon: <AccountBoxIcon />,
      listText: 'Profile',
      listPath: '/restaurant/profile',
    },
    {
      listIcon: <FastfoodIcon />,
      listText: 'Menu',
      listPath: '/restaurant/dashboard',
    },
    {
      listIcon: <FormatListBulletedIcon />,
      listText: 'Orders',
      listPath: '/restaurant/orders',
    },
  ];

  const general = [
    {
      listIcon: <AccountCircle />,
      listText: 'Customer Login',
      listPath: '/',
    },
    {
      listIcon: <AccountCircle />,
      listText: 'Customer Sign Up',
      listPath: '/customer/register',
    },
    {
      listIcon: <Group />,
      listText: 'Restaurant Login',
      listPath: '/restaurant/login',
    },
    {
      listIcon: <Group />,
      listText: 'Restaurant Sign Up',
      listPath: '/restaurant/register',
    },
  ];

  const customer = [
    {
      listIcon: <Home />,
      listText: 'Dashboard',
      listPath: '/customer/dashboard',
    },
    {
      listIcon: <RecentActors />,
      listText: 'Profile',
      listPath: '/customer/profile',
    },
    {
      listIcon: <Favorite />,
      listText: 'Favorites',
      listPath: '/customer/favorite',
    },
    {
      listIcon: <RestaurantMenu />,
      listText: 'Orders',
      listPath: '/customer/orders',
    },
  ];
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {props.type === 'restaurant' && menuItems.map((listItem, key) => (
          <ListItem button key={key} component={Link} to={listItem.listPath}>
            <ListItemIcon className={classes.listItem}>{listItem.listIcon}</ListItemIcon>
            <ListItemText className={classes.listItem} primary={listItem.listText} />
          </ListItem>
        ))}
        {props.type === 'customer' && customer.map((listItem, key) => (
          <ListItem button key={key} component={Link} to={listItem.listPath}>
            <ListItemIcon className={classes.listItem}>{listItem.listIcon}</ListItemIcon>
            <ListItemText className={classes.listItem} primary={listItem.listText} />
          </ListItem>
        ))}
        {props.type === 'signup' && general.map((listItem, key) => (
          <ListItem button key={key} component={Link} to={listItem.listPath}>
            <ListItemIcon className={classes.listItem}>{listItem.listIcon}</ListItemIcon>
            <ListItemText className={classes.listItem} primary={listItem.listText} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const onSearchCriteriaChange = async (e) => {
    setSearchBy(e.target.value);
    if (e.target.value === 'Dishes') {
      const country = sessionStorage.getItem('country');
      const city = sessionStorage.getItem('city');
      const url = `${backendServer}/dishes`;
      const response = await axios.get(url, { params: { country, city } });
      sessionStorage.setItem('dishes', JSON.stringify(response.data));
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar style={style} position="static">
            <Toolbar style={{ display: 'flex', width: '100%' }}>
              <IconButton onClick={toggleDrawer('left', true)} edge="start" className={classes.menuButton} color="default" aria-label="menu">
                <MenuIcon />
              </IconButton>

              <Drawer anchor="left" open={state.left} onClose={toggleDrawer('left', false)}>
                {list('left')}
              </Drawer>

              <Typography variant="h6" className={classes.title}>
                <img src={logo} width="120" height="80" alt="" />
              </Typography>
              {props.type === 'customer' && props.search
                && (
                <>
                  <Box sx={{ flexGrow: 1 }} />
                  <TextField
                    required
                    fullWidth
                    name="searchCriteria"
                    label="Search By"
                    value={searchBy}
                    style={{ width: '15%' }}
                    autoComplete="Search By"
                    onChange={(e) => { onSearchCriteriaChange(e); }}
                    placeholder="Search By"
                    select
                  >
                    {props.view === 'customerdashboard' && searchDashBoard.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                    {props.view === 'customerrestaurant' && searchRestaurant.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Search style={{ width: '50%' }} onChange={(event) => props.onSearch(searchBy, event.target.value)}>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search.."
                      inputProps={{ 'aria-label': 'search' }}
                      fullWidth
                      type="text"
                      margin="normal"
                    />
                  </Search>
                </>
                )}

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {props.type === 'customer' && props.deliveryswitch && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Switch onChange={props.onDeliveryChange} />
                    <Typography>Delivery</Typography>
                  </Stack>
                )}
                {props.type === 'customer' && (
                  <IconButton aria-label="view cart" onClick={onViewCart}>
                    <Badge badgeContent={getNumberOfItemsInCart()} color="primary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                )}
                <IconButton onClick={() => { onLogout(); }} aria-label="Log out">
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <div>
        <Dialog open={openCart} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Order Summary</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here's what your cart looks like
            </DialogContentText>
            <List disablePadding>
              {cart.map((item) => (
                <ListItem key={item.DishId} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={item.DishName} />
                  <IconButton onClick={() => { onRemoveFromCart(item); }} aria-label="remove from cart">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {item.Quantity}
                    {' '}
                    nos
                  </Typography>
                  <IconButton onClick={() => { onAddToCart(item); }} aria-label="add to cart">
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    $
                    {item.Price}
                    {' '}
                    x
                    {item.Quantity}
                    {' '}
                    nos = $
                    {item.Price * item.Quantity}
                  </Typography>
                </ListItem>
              ))}
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  $
                  {getTotalPrice().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Order Option" />
                <TextField
                  required
                  fullWidth
                  name="mode"
                  value={orderOption}
                  style={{ width: '25%' }}
                  onChange={(e) => setOrderOption(e.target.value)}
                  autoComplete="delivery"
                  defaultValue="pickup"
                  select
                >
                  {deliveryModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                  ))}
                </TextField>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onCheckOut()} variant="contained" color="primary">
              Check Out
            </Button>
            <Button onClick={() => setOpenCart(false)} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
