/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Input, MenuItem } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// eslint-disable-next-line import/no-named-as-default-member
import NavigationBar from '../Navigation/NavigationBar';
import dishlogo from '../../images/dishlogo.png';
import backendServer from '../../Config';

const theme = createTheme();

const dishTypes = [{
  key: 'starter',
  value: 'Starter',
}, {
  key: 'main-course',
  value: 'Main Course',
}, {
  key: 'dessert',
  value: 'Dessert',
}];

const dishcategory = [{
  key: 'veg',
  value: 'Veg',
}, {
  key: 'nonveg',
  value: 'Non-Veg',
}, {
  key: 'vegan',
  value: 'Vegan',
}];

export default function AddDish() {
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState(`${dishlogo}`);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [disabled, setDisbled] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameHelper, setNameHelper] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [priceHelper, setPriceHelper] = useState('');

  const isValid = (payload) => {
    const nameRegex = new RegExp('[a-zA-Z]{1,256}');
    if (!nameRegex.test(payload.name)) {
      setNameError(true);
      setNameHelper('Name should contain only characters');
      return false;
    }
    if (payload.price < 0) {
      setPriceError(true);
      setPriceHelper('Enter a valid price');
      return false;
    }
    return true;
  };

  const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    let url;
    if (image) {
      const imageData = new FormData();
      imageData.append('image', image);
      const response = await axios.post(`${backendServer}/image/dish`, imageData);
      url = response.data.imageUrl;
      setImageUrl(url);
    }

    const restaurantId = sessionStorage.getItem('userId');
    const dishId = sessionStorage.getItem('dishId');
    const payload = {
      dishId,
      restaurantId,
      dishdesc: data.get('desc'),
      category: data.get('category'),
      price: data.get('price'),
      name: data.get('name'),
      type: data.get('type'),
      imageUrl: url || imageUrl,
    };
    if (!isValid(payload)) {
      return;
    }
    axios.post(`${backendServer}/restaurant/dishes`, payload)
      .then(() => {
        history.push('/restaurant/dashBoard');
      })
      .catch(() => {
        console.log('Error');
      });
  };

  useEffect(async () => {
    if (!sessionStorage.getItem('userId')) { history.push('/'); }
    const dishId = sessionStorage.getItem('dishId');
    const action = sessionStorage.getItem('action');
    if (action === 'view') {
      setDisbled(true);
    } else {
      setDisbled(false);
    }

    if (dishId) {
      const response = await axios.get(`${backendServer}/dishes/${dishId}`);
      const dish = response.data;
      const url = dish.ImageUrl != null && dish.ImageUrl.length > 0 ? dish.ImageUrl : dishlogo;
      setName(dish.DishName);
      setDesc(dish.DishDesc);
      setCategory(dish.Category);
      setType(dish.DishType);
      setPrice(dish.Price);
      setImageUrl(url);
    }
  }, []);

  const onPhotoChange = (event) => {
    if (event.target.files.length === 0) { return; }
    const file = event.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const fileStyle = {
    display: 'none',
  };

  const imageStyle = {
    'margin-left': '45%',
  };

  return (
    <>
      <NavigationBar type="restaurant" />

      <ThemeProvider theme={theme}>
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
                    id="name"
                    label="Name of the Dish"
                    name="name"
                    autoComplete="name"
                    error={nameError}
                    helperText={nameHelper}
                    value={name}
                    disabled={disabled}
                    onChange={(e) => { setName(e.target.value); setNameHelper(''); setNameError(false); }}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    id="desc"
                    label="Description of the Dish"
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    autoComplete="desc"
                    disabled={disabled}
                    autoFocus
                    multiline
                    minRows="2"
                  />

                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    id="type"
                    label="Type of the Dish"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    name="type"
                    disabled={disabled}
                    autoComplete="type"
                    select
                    autoFocus
                  >
                    {dishTypes.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>

                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    type="text"
                    id="category"
                    label="Category"
                    name="category"
                    disabled={disabled}
                    autoComplete="category"
                    autoFocus
                    select
                  >
                    {dishcategory.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="none"
                    required
                    fullWidth
                    value={price}
                    error={priceError}
                    helperText={priceHelper}
                    onChange={(e) => { setPrice(e.target.value); setPriceError(false); setPriceHelper(''); }}
                    type="number"
                    step="0.01"
                    id="price"
                    label="Price"
                    name="price"
                    disabled={disabled}
                    autoComplete="price"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={disabled}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Save
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}
